import { useState, useEffect, useRef } from 'react';
import chatbotService from '../../services/aiService';
import './ChatBot.css';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'operator';
  timestamp: Date;
}


const formatMessageText = (text: string): string => {
  let formatted = text;
  
  formatted = formatted.replace(/\\"/g, '"');

  formatted = formatted.replace(/\\n/g, '<br/>');
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/<br\/>\s*\*\s+/g, '<br/>• ');

  formatted = formatted.replace(/^\*\s+/g, '• ');
  
  return formatted;
};

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hello! I am the Enghub AI assistant, ready to support you on your English learning journey.',
      sender: 'operator',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    const userInput = inputValue;
    setInputValue('');

    // Show typing indicator
    setIsTyping(true);

    try {
      // Call real API
      const response = await chatbotService.sendMessage(userInput, 'hybrid');
      
      setIsTyping(false);
      
      const operatorMessage: Message = {
        id: messages.length + 2,
        text: response.response,
        sender: 'operator',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, operatorMessage]);
    } catch (error) {
      setIsTyping(false);
      
      // Show error message
      const errorMessage: Message = {
        id: messages.length + 2,
        text: 'Sorry, I encountered an error. Please try again later.',
        sender: 'operator',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      console.error('Chatbot error:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-container-chatbot">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          className="chatbot-toggle-button-chatbot"
          onClick={handleToggle}
          aria-label="Open chat"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
              fill="currentColor"
            />
            <circle cx="7" cy="9" r="1.5" fill="white" />
            <circle cx="12" cy="9" r="1.5" fill="white" />
            <circle cx="17" cy="9" r="1.5" fill="white" />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window-chatbot">
          {/* Header */}
          <div className="chatbot-header-chatbot">
            <div className="chatbot-header-content-chatbot">
              <div className="chatbot-avatar-chatbot">
                <img src="https://res.cloudinary.com/dc5glptng/image/upload/v1763995098/logo_b8sutf.png" alt="" />
              </div>
              <div className="chatbot-header-text-chatbot">
                <h3>Enghub</h3>
                <p>Learn English smarter with AI tutor</p>
              </div>
            </div>
            <button
              className="chatbot-close-button-chatbot"
              onClick={handleToggle}
              aria-label="Close chat"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="chatbot-messages-chatbot">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chatbot-message-chatbot ${
                  message.sender === 'user'
                    ? 'chatbot-message-user-chatbot'
                    : 'chatbot-message-operator-chatbot'
                }`}
              >
                <div 
                  className="chatbot-message-bubble-chatbot"
                  dangerouslySetInnerHTML={{ 
                    __html: message.sender === 'operator' 
                      ? formatMessageText(message.text) 
                      : message.text 
                  }}
                />
                <div className="chatbot-message-sender-chatbot">
                  {message.sender === 'user' ?  'You': 'Enghub Support'}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chatbot-message-chatbot chatbot-message-operator-chatbot">
                <div className="chatbot-typing-indicator-chatbot">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="chatbot-message-sender-chatbot">typing...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chatbot-input-area-chatbot">
            <input
              type="text"
              className="chatbot-input-chatbot"
              placeholder="Write a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="chatbot-send-button-chatbot"
              onClick={handleSendMessage}
              aria-label="Send message"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
