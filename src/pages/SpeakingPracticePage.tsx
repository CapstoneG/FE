import React, { useState, useRef, useEffect } from 'react';
import './SpeakingPracticePage.css';
import { FaMicrophone, FaStop, FaPaperPlane, FaArrowLeft, FaRobot, FaVolumeUp } from 'react-icons/fa';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import chatbotService from '../services/aiService';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  isVoice?: boolean;
  audioUrl?: string;
  translation?: string;
  grammarFeedback?: {
    has_error: boolean;
    original: string;
    corrected: string | null;
    explanation: string | null;
    error_type: string | null;
    severity: string | null;
  };
  alternatives?: string[];
}

interface AIResponse {
  response: string;
  analysis: {
    has_error: boolean;
    topic: string | null;
    corrected: string | null;
    explanation: string | null;
  };
  alternatives: string[];
  translation: string;
}

const SpeakingPracticePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>((location.state as any)?.sessionId || '');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const variantId = searchParams.get('variant') || 'v_us';
  const scenarioId = searchParams.get('scenario') || 'sc_restaurant';
  const contextId = searchParams.get('context') || 'ctx_order_steak';

  const getScenarioTitle = () => {
    return contextId.replace('ctx_', '').replace(/_/g, ' ');
  };

  const speakText = (text: string) => {
    if (!synthRef.current) return;
    
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = variantId === 'v_uk' ? 'en-GB' : 'en-US';
    utterance.rate = 0.9; 
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = (event) => {
      setIsSpeaking(false);
    };
    
    synthRef.current.speak(utterance);
  };

  const handleAIResponse = async (userText: string) => {
    if (!sessionId) {
      console.error('No session ID available');
      return;
    }

    setIsAiTyping(true);

    try {
      const data: AIResponse = await chatbotService.sendConversationMessage({
        session_id: sessionId,
        message: userText
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.response,
        timestamp: new Date(),
        isVoice: false,
        translation: data.translation,
        grammarFeedback: data.analysis.has_error ? {
          has_error: data.analysis.has_error,
          original: userText,
          corrected: data.analysis.corrected,
          explanation: data.analysis.explanation,
          error_type: data.analysis.topic,
          severity: 'medium'
        } : undefined,
        alternatives: data.alternatives
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsAiTyping(false);
      speakText(data.response);
    } catch (error) {
      setIsAiTyping(false);
      
      // Fallback to mock response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isVoice: false
      };
      setMessages(prev => [...prev, aiMessage]);
      speakText(aiMessage.text);
    }
  };

  const playAudioFromUrl = (audioUrl: string) => {
    const audio = new Audio(`https://uncriticized-vernon-idioplasmic.ngrok-free.dev${audioUrl}`);
    
    audio.onplay = () => {
      setIsSpeaking(true);
    };
    
    audio.onended = () => {
      setIsSpeaking(false);
    };
    
    audio.onerror = (error) => {
      console.error('Error playing audio:', error);
      setIsSpeaking(false);
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.sender === 'ai') {
        speakText(lastMessage.text);
      }
    };
    
    audio.play().catch(error => {
      setIsSpeaking(false);
    });
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = variantId === 'v_uk' ? 'en-GB' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const userMessage: Message = {
          id: Date.now().toString(),
          sender: 'user',
          text: transcript,
          timestamp: new Date(),
          isVoice: true
        };
        setMessages(prev => [...prev, userMessage]);
        setIsRecording(false);
        
        handleAIResponse(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          alert('Vui lòng cho phép truy cập microphone để sử dụng tính năng ghi âm.');
        }
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    synthRef.current = window.speechSynthesis;

    const greeting: Message = {
      id: Date.now().toString(),
      sender: 'ai',
      text: `Hello "${getScenarioTitle()}"! I'm your AI assistant. Let's practice speaking together. You can type or use the microphone to send your messages.`,
      timestamp: new Date(),
      isVoice: false
    };
    setMessages([greeting]);
    
    setTimeout(() => {
      speakText(greeting.text);
    }, 500);

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: new Date(),
      isVoice: false
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputText;
    setInputText('');
    
    handleAIResponse(messageText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Trình duyệt của bạn không hỗ trợ nhận diện giọng nói. Vui lòng sử dụng Chrome hoặc Edge.');
      return;
    }

    if (isRecording) {
      // Stop recording
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      // Start recording
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
        alert('Không thể bắt đầu ghi âm. Vui lòng thử lại.');
      }
    }
  };

  const handleBack = () => {
    navigate('/speaking-training');
  };

  return (
    <div className="speaking-practice-page">
      {/* Header */}
      <div className="practice-header">
        <button className="back-btn" onClick={handleBack}>
          <FaArrowLeft size={20} />
        </button>
        <div className="practice-info">
          <h2>{getScenarioTitle()}</h2>
          <span className="language-badge">{variantId === 'v_uk' ? '🇬🇧 British' : '🇺🇸 American'}</span>
          {isSpeaking && (
            <span className="speaking-indicator">
              🔊 AI đang nói...
            </span>
          )}
        </div>
        <div className="practice-stats">
          <span className="message-count">{messages.length - 1} tin nhắn</span>
        </div>
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
          >
            {message.sender === 'ai' && (
              <div className="message-avatar ai-avatar">
                <FaRobot size={20} />
              </div>
            )}
            <div className="message-bubble">
              <div className="message-content">
                <p className="message-text">{message.text}</p>
                {message.sender === 'ai' && message.audioUrl && (
                  <button
                    className="speak-btn"
                    onClick={() => playAudioFromUrl(message.audioUrl!)}
                    title="Nghe lại"
                  >
                    <FaVolumeUp size={14} />
                  </button>
                )}
                {message.sender === 'ai' && !message.audioUrl && (
                  <button
                    className="speak-btn"
                    onClick={() => speakText(message.text)}
                    title="Nghe lại"
                  >
                    <FaVolumeUp size={14} />
                  </button>
                )}
              </div>
              
              {/* Grammar Feedback */}
              {message.grammarFeedback && message.grammarFeedback.has_error && (
                <div className="grammar-feedback error">
                  <div className="feedback-header">
                    ⚠️ <strong>Grammar Error</strong> ({message.grammarFeedback.severity})
                  </div>
                  <div className="feedback-content">
                    <p><strong>Original:</strong> {message.grammarFeedback.original}</p>
                    <p><strong>Corrected:</strong> {message.grammarFeedback.corrected}</p>
                    <p><strong>Explanation:</strong> {message.grammarFeedback.explanation}</p>
                  </div>
                </div>
              )}
              
              {/* Translation */}
              {message.translation && (
                <div className="translation">
                  <strong>🇻🇳 Dịch:</strong> {message.translation}
                </div>
              )}
              
              {/* Alternatives */}
              {message.alternatives && message.alternatives.length > 0 && (
                <div className="alternatives">
                  <strong>💡 Cách nói khác:</strong>
                  {message.alternatives.map((alt, idx) => (
                    <div key={idx} className="alternative-item">• {alt}</div>
                  ))}
                </div>
              )}
              
              <span className="message-time">
                {message.timestamp.toLocaleTimeString('vi-VN', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
            {message.sender === 'user' && (
              <div className="message-avatar user-avatar">
                👤
              </div>
            )}
          </div>
        ))}
        
        {isAiTyping && (
          <div className="message ai-message">
            <div className="message-avatar ai-avatar">
              <FaRobot size={20} />
            </div>
            <div className="message-bubble typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-area">
        <div className="input-container">
          <button
            className={`voice-btn ${isRecording ? 'recording' : ''}`}
            onClick={toggleRecording}
          >
            {isRecording ? <FaStop size={20} /> : <FaMicrophone size={20} />}
          </button>
          
          <input
            type="text"
            className="text-input"
            placeholder={isRecording ? 'Đang ghi âm...' : 'Nhập tin nhắn hoặc nhấn mic để nói...'}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isRecording}
          />
          
          <button
            className="send-btn"
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isRecording}
          >
            <FaPaperPlane size={18} />
          </button>
        </div>
        
        {isRecording && (
          <div className="recording-indicator">
            <span className="pulse"></span>
            Đang ghi âm...
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeakingPracticePage;
