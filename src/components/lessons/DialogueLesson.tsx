import React, { useState, useRef, useEffect } from 'react';
import { FaComments, FaVolumeUp, FaCheckCircle, FaPlay, FaPause, FaMicrophone, FaStop, FaUserCircle } from 'react-icons/fa';
import './DialogueLesson.css';

interface DialogueItem {
  speaker: string;
  text: string;
}

interface DialogueLessonProps {
  title: string;
  description?: string;
  dialogue: DialogueItem[];
  onComplete?: () => void;
}

const DialogueLesson: React.FC<DialogueLessonProps> = ({
  title,
  description,
  dialogue,
  onComplete,
}) => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [completedDialogues, setCompletedDialogues] = useState<Set<number>>(new Set());
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [currentAutoIndex, setCurrentAutoIndex] = useState(0);
  
  // Role-playing mode states
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [userTranscripts, setUserTranscripts] = useState<{[key: number]: string}>({});
  const [accuracyScores, setAccuracyScores] = useState<{[key: number]: number}>({});
  const [isRolePlayMode, setIsRolePlayMode] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  // Setup Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Calculate text similarity (Levenshtein distance)
  const calculateSimilarity = (str1: string, str2: string): number => {
    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();
    
    const matrix: number[][] = [];
    
    for (let i = 0; i <= s2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= s1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= s2.length; i++) {
      for (let j = 1; j <= s1.length; j++) {
        if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    const maxLen = Math.max(s1.length, s2.length);
    const distance = matrix[s2.length][s1.length];
    return maxLen === 0 ? 100 : ((maxLen - distance) / maxLen) * 100;
  };

  // Highlight differences between original and user text
  const highlightDifferences = (original: string, userText: string) => {
    const originalWords = original.toLowerCase().split(/\s+/);
    const userWords = userText.toLowerCase().split(/\s+/);
    const displayWords = original.split(/\s+/);
    
    return displayWords.map((word, index) => {
      const isCorrect = userWords[index] && userWords[index] === originalWords[index];
      return (
        <span
          key={index}
          style={{
            color: isCorrect ? '#10b981' : '#ef4444',
            fontWeight: isCorrect ? 'normal' : 'bold',
            backgroundColor: isCorrect ? 'transparent' : '#fee2e2',
            padding: '2px 4px',
            borderRadius: '4px',
          }}
        >
          {word}{' '}
        </span>
      );
    });
  };

  // Start role-play mode
  const startRolePlay = (role: string) => {
    setSelectedRole(role);
    setIsRolePlayMode(true);
    setCurrentTurnIndex(0);
    setUserTranscripts({});
    setAccuracyScores({});
    
    // Find first turn for this role
    const firstTurnIndex = dialogue.findIndex(item => item.speaker === role);
    if (firstTurnIndex !== -1) {
      setCurrentTurnIndex(firstTurnIndex);
    }
  };

  // Play bot's turn automatically
  const playBotTurns = (startIndex: number) => {
    let currentIndex = startIndex;
    
    // Find all consecutive bot turns
    const botTurns: number[] = [];
    while (currentIndex < dialogue.length && dialogue[currentIndex].speaker !== selectedRole) {
      botTurns.push(currentIndex);
      currentIndex++;
    }
    
    // Check if there are any more user turns
    let hasMoreUserTurns = false;
    for (let i = currentIndex; i < dialogue.length; i++) {
      if (dialogue[i].speaker === selectedRole) {
        hasMoreUserTurns = true;
        break;
      }
    }
    
    if (botTurns.length === 0 && !hasMoreUserTurns) {
      // No more turns at all - completed!
      setTimeout(() => {
        exitRolePlay();
        if (onComplete) onComplete();
      }, 500);
      return;
    }
    
    if (botTurns.length === 0) {
      // No bot turns, but there are user turns
      if (currentIndex < dialogue.length && hasMoreUserTurns) {
        setCurrentTurnIndex(currentIndex);
      }
      return;
    }
    
    // Play bot turns sequentially
    const playNextBotTurn = (index: number) => {
      if (index >= botTurns.length) {
        // All bot turns played
        if (hasMoreUserTurns && currentIndex < dialogue.length) {
          setCurrentTurnIndex(currentIndex);
        } else {
          // Completed all dialogues
          setTimeout(() => {
            alert('🎉 Chúc mừng! Bạn đã hoàn thành bài hội thoại!');
            exitRolePlay();
            if (onComplete) onComplete();
          }, 500);
        }
        return;
      }
      
      const turnIndex = botTurns[index];
      const text = dialogue[turnIndex].text;
      
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        
        utterance.onstart = () => {
          setPlayingIndex(turnIndex);
        };
        
        utterance.onend = () => {
          setPlayingIndex(null);
          
          // Mark as completed
          setCompletedDialogues(prev => new Set([...prev, turnIndex]));
          
          // Play next bot turn after a delay
          setTimeout(() => {
            playNextBotTurn(index + 1);
          }, 800);
        };
        
        window.speechSynthesis.speak(utterance);
      } else {
        // If speech synthesis not available, just move to next user turn
        if (hasMoreUserTurns && currentIndex < dialogue.length) {
          setCurrentTurnIndex(currentIndex);
        } else {
          setTimeout(() => {
            alert('🎉 Chúc mừng! Bạn đã hoàn thành bài hội thoại!');
            exitRolePlay();
            if (onComplete) onComplete();
          }, 500);
        }
      }
    };
    
    playNextBotTurn(0);
  };

  // Start recording
  const startRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    setIsRecording(true);
    
    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const originalText = dialogue[currentTurnIndex].text;
      const accuracy = calculateSimilarity(originalText, transcript);
      
      setUserTranscripts(prev => ({
        ...prev,
        [currentTurnIndex]: transcript
      }));
      
      setAccuracyScores(prev => ({
        ...prev,
        [currentTurnIndex]: accuracy
      }));
      
      setIsRecording(false);
      
      // After user speaks, automatically play bot's turns and move to next user turn
      setTimeout(() => {
        playBotTurns(currentTurnIndex + 1);
      }, 1000);
    };
    
    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };
    
    recognitionRef.current.start();
  };

  // Stop recording
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  // Exit role-play mode
  const exitRolePlay = () => {
    setIsRolePlayMode(false);
    setSelectedRole(null);
    setCurrentTurnIndex(0);
    stopRecording();
  };

  const handleSpeak = (text: string, index: number) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      if (playingIndex === index) {
        setPlayingIndex(null);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      
      utterance.onstart = () => {
        setPlayingIndex(index);
      };
      
      utterance.onend = () => {
        setPlayingIndex(null);
        
        // Mark as completed when played
        const newCompleted = new Set(completedDialogues);
        newCompleted.add(index);
        setCompletedDialogues(newCompleted);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAutoPlay = () => {
    if (isAutoPlaying) {
      window.speechSynthesis.cancel();
      setIsAutoPlaying(false);
      setPlayingIndex(null);
      return;
    }

    setIsAutoPlaying(true);
    playDialogueSequence(0);
  };

  const playDialogueSequence = (index: number) => {
    if (index >= dialogue.length) {
      setIsAutoPlaying(false);
      setPlayingIndex(null);
      setCurrentAutoIndex(0);
      
      // Mark all as completed
      const allCompleted = new Set(dialogue.map((_, i) => i));
      setCompletedDialogues(allCompleted);
      
      if (onComplete) {
        onComplete();
      }
      return;
    }

    setCurrentAutoIndex(index);
    const text = dialogue[index].text;
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      
      utterance.onstart = () => {
        setPlayingIndex(index);
      };
      
      utterance.onend = () => {
        setPlayingIndex(null);
        
        // Mark as completed
        setCompletedDialogues(prev => new Set([...prev, index]));
        
        // Play next after a short delay
        setTimeout(() => {
          playDialogueSequence(index + 1);
        }, 800);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const getSpeakerColor = (speaker: string) => {
    const colors: { [key: string]: string } = {
      'A': '#3b82f6',
      'B': '#10b981',
      'C': '#f59e0b',
      'D': '#8b5cf6',
    };
    return colors[speaker] || '#64748b';
  };

  // Get unique speakers
  const uniqueSpeakers = Array.from(new Set(dialogue.map(item => item.speaker)));

  // Check if current turn is valid
  const isValidTurn = currentTurnIndex < dialogue.length && 
                      dialogue[currentTurnIndex]?.speaker === selectedRole;

  return (
    <div className="dialogue-lesson-container-dialogue-lesson">
      {/* Header */}
      <div className="dialogue-header-dialogue-lesson">
        <div className="header-content-dialogue-lesson">
          <FaComments className="header-icon-dialogue-lesson" />
          <div className="header-text-dialogue-lesson">
            <h2 className="dialogue-title-dialogue-lesson">{title}</h2>
            {description && (
              <p className="dialogue-description-dialogue-lesson">{description}</p>
            )}
          </div>
        </div>
        
        {/* Auto Play Button */}
        {!isRolePlayMode && (
          <button
            className={`auto-play-button-dialogue-lesson ${isAutoPlaying ? 'playing-dialogue-lesson' : ''}`}
            onClick={handleAutoPlay}
          >
            {isAutoPlaying ? (
              <>
                <FaPause />
                <span>Dừng tự động phát</span>
              </>
            ) : (
              <>
                <FaPlay />
                <span>Phát tự động</span>
              </>
            )}
          </button>
        )}
      </div>
      {/* Role-Play Mode */}
      {isRolePlayMode && (
        <div className="roleplay-mode-dialogue-lesson">
          <div className="roleplay-header-dialogue-lesson">
            <div className="roleplay-info-dialogue-lesson">
              <div 
                className="current-role-badge-dialogue-lesson"
                style={{ backgroundColor: getSpeakerColor(selectedRole || '') }}
              >
                {selectedRole}
              </div>
              <span>Lượt của bạn ({currentTurnIndex + 1}/{dialogue.length})</span>
            </div>
            <button className="exit-roleplay-button-dialogue-lesson" onClick={exitRolePlay}>
              Thoát luyện tập
            </button>
          </div>

          {/* Current dialogue */}
          {isValidTurn && (
          <div className="current-dialogue-dialogue-lesson">
            <div className="original-text-dialogue-lesson">
              <h4>Câu gốc:</h4>
              <p>{dialogue[currentTurnIndex]?.text}</p>
            </div>

            {/* Recording Controls */}
            <div className="recording-controls-dialogue-lesson">
              {playingIndex !== null ? (
                <div className="bot-speaking-dialogue-lesson">
                  <div className="bot-speaking-icon-dialogue-lesson">
                    <FaVolumeUp />
                  </div>
                  <span>{dialogue[currentTurnIndex]?.speaker} đang nói...</span>
                </div>
              ) : !isRecording ? (
                <button 
                  className="record-button-dialogue-lesson"
                  onClick={startRecording}
                  disabled={!!userTranscripts[currentTurnIndex]}
                >
                  <FaMicrophone />
                  <span>Bắt đầu nói</span>
                </button>
              ) : (
                <button 
                  className="stop-button-dialogue-lesson"
                  onClick={stopRecording}
                >
                  <FaStop />
                  <span>Dừng ghi âm</span>
                </button>
              )}
            </div>

            {/* User transcript and comparison */}
            {userTranscripts[currentTurnIndex] && !playingIndex && (
              <div className="comparison-result-dialogue-lesson">
                <div className="user-transcript-dialogue-lesson">
                  <h4>Bạn đã nói:</h4>
                  <p>{userTranscripts[currentTurnIndex]}</p>
                </div>

                <div className="accuracy-score-dialogue-lesson">
                  <div className="score-circle-dialogue-lesson">
                    <span className="score-value-dialogue-lesson">
                      {accuracyScores[currentTurnIndex]?.toFixed(0)}%
                    </span>
                  </div>
                  <span className="score-label-dialogue-lesson">Độ chính xác</span>
                </div>

                <div className="highlighted-text-dialogue-lesson">
                  <h4>So sánh:</h4>
                  <p className="comparison-text-dialogue-lesson">
                    {highlightDifferences(
                      dialogue[currentTurnIndex].text,
                      userTranscripts[currentTurnIndex]
                    )}
                  </p>
                  <div className="legend-dialogue-lesson">
                    <span className="legend-item-dialogue-lesson">
                      <span className="legend-correct-dialogue-lesson"></span>
                      Đúng
                    </span>
                    <span className="legend-item-dialogue-lesson">
                      <span className="legend-incorrect-dialogue-lesson"></span>
                      Sai
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          )}

          {/* Show all dialogues for context */}
          <div className="context-dialogues-dialogue-lesson">
            <h4>Toàn bộ hội thoại:</h4>
            {dialogue.map((item, index) => (
              <div
                key={index}
                className={`context-item-dialogue-lesson ${
                  index === currentTurnIndex ? 'current-dialogue-lesson' : ''
                } ${item.speaker === selectedRole ? 'user-role-dialogue-lesson' : ''}`}
              >
                <div 
                  className="context-speaker-badge-dialogue-lesson"
                  style={{ backgroundColor: getSpeakerColor(item.speaker) }}
                >
                  {item.speaker}
                </div>
                <p>{item.text}</p>
                {userTranscripts[index] && (
                  <div className="context-score-dialogue-lesson">
                    {accuracyScores[index]?.toFixed(0)}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Role Selection */}
      {!isRolePlayMode && (
        <div className="role-selection-dialogue-lesson">
          <h3 className="role-selection-title-dialogue-lesson">
            <FaUserCircle /> Chọn vai diễn để luyện tập
          </h3>
          <div className="role-buttons-dialogue-lesson">
            {uniqueSpeakers.map(speaker => (
              <button
                key={speaker}
                className="role-button-dialogue-lesson"
                style={{ borderColor: getSpeakerColor(speaker) }}
                onClick={() => startRolePlay(speaker)}
              >
                <div 
                  className="role-badge-dialogue-lesson"
                  style={{ backgroundColor: getSpeakerColor(speaker) }}
                >
                  {speaker}
                </div>
                <span>Vai {speaker}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dialogue Content */}
      {!isRolePlayMode && (
      <div className="dialogue-content-dialogue-lesson">
        <div className="dialogue-list-dialogue-lesson">
          {dialogue.map((item, index) => (
            <div
              key={index}
              className={`dialogue-item-dialogue-lesson ${
                playingIndex === index ? 'playing-dialogue-lesson' : ''
              } ${completedDialogues.has(index) ? 'completed-dialogue-lesson' : ''} ${
                isAutoPlaying && currentAutoIndex === index ? 'auto-playing-dialogue-lesson' : ''
              }`}
            >
              <div className="dialogue-speaker-badge-dialogue-lesson" style={{ 
                backgroundColor: getSpeakerColor(item.speaker),
                borderColor: getSpeakerColor(item.speaker)
              }}>
                <span className="speaker-label-dialogue-lesson">{item.speaker}</span>
              </div>
              
              <div className="dialogue-bubble-dialogue-lesson">
                <p className="dialogue-text-dialogue-lesson">{item.text}</p>
                
                <button
                  className="speak-button-dialogue-lesson"
                  onClick={() => handleSpeak(item.text, index)}
                  disabled={isAutoPlaying}
                >
                  <FaVolumeUp />
                </button>
                
                {completedDialogues.has(index) && (
                  <FaCheckCircle className="completed-icon-dialogue-lesson" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      )}
    </div>
  );
};

export default DialogueLesson;
