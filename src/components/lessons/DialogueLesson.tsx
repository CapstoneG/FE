import React, { useState } from 'react';
import { FaComments, FaPlay, FaPause, FaVolumeUp, FaUser, FaCheckCircle, FaRedo } from 'react-icons/fa';
import './DialogueLesson.css';

interface DialogueLine {
  speaker: string;
  text: string;
}

interface DialogueLessonProps {
  title: string;
  description?: string;
  dialogue: DialogueLine[];
  onComplete?: () => void;
}

const DialogueLesson: React.FC<DialogueLessonProps> = ({
  title,
  description,
  dialogue,
  onComplete,
}) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playedLines, setPlayedLines] = useState<Set<number>>(new Set());
  const [showTranslation, setShowTranslation] = useState(false);
  const [viewMode, setViewMode] = useState<'conversation' | 'roleplay'>('conversation');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const progress = (playedLines.size / dialogue.length) * 100;
  const speakers = Array.from(new Set(dialogue.map(line => line.speaker)));

  const handleSpeak = (text: string, lineIndex?: number) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      
      if (lineIndex !== undefined) {
        const newPlayed = new Set(playedLines);
        newPlayed.add(lineIndex);
        setPlayedLines(newPlayed);
        
        if (newPlayed.size === dialogue.length && onComplete) {
          setTimeout(() => {
            onComplete();
          }, 500);
        }
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const playFullDialogue = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    let index = 0;

    const playNext = () => {
      if (index < dialogue.length) {
        setCurrentLine(index);
        const utterance = new SpeechSynthesisUtterance(dialogue[index].text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        
        const newPlayed = new Set(playedLines);
        newPlayed.add(index);
        setPlayedLines(newPlayed);

        utterance.onend = () => {
          index++;
          if (index < dialogue.length) {
            setTimeout(playNext, 500);
          } else {
            setIsPlaying(false);
            if (onComplete) {
              onComplete();
            }
          }
        };

        window.speechSynthesis.speak(utterance);
      }
    };

    playNext();
  };

  const resetProgress = () => {
    setPlayedLines(new Set());
    setCurrentLine(0);
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const getSpeakerColor = (speaker: string): string => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    const index = speakers.indexOf(speaker);
    return colors[index % colors.length];
  };

  const getSpeakerAvatar = (speaker: string): string => {
    return speaker.charAt(0).toUpperCase();
  };

  return (
    <div className="dialogue-lesson">
      <div className="dialogue-header">
        <div className="header-content">
          <FaComments className="header-icon" size={32} />
          <div>
            <h1 className="lesson-title">{title}</h1>
            {description && <p className="lesson-description">{description}</p>}
          </div>
        </div>

        <div className="view-mode-toggle">
          <button
            className={`toggle-btn ${viewMode === 'conversation' ? 'active' : ''}`}
            onClick={() => setViewMode('conversation')}
          >
            Hội thoại
          </button>
          <button
            className={`toggle-btn ${viewMode === 'roleplay' ? 'active' : ''}`}
            onClick={() => setViewMode('roleplay')}
          >
            Luyện tập vai
          </button>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-info">
          <span className="progress-text">
            Đã nghe: {playedLines.size}/{dialogue.length} câu
          </span>
          <span className="progress-percent">{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {viewMode === 'conversation' ? (
        <div className="conversation-mode">
          <div className="dialogue-controls">
            <button 
              className={`play-all-btn ${isPlaying ? 'playing' : ''}`}
              onClick={playFullDialogue}
            >
              {isPlaying ? (
                <>
                  <FaPause /> Dừng lại
                </>
              ) : (
                <>
                  <FaPlay /> Phát toàn bộ
                </>
              )}
            </button>
            <button 
              className="reset-btn"
              onClick={resetProgress}
            >
              <FaRedo /> Làm lại
            </button>
            <label className="translation-toggle">
              <input
                type="checkbox"
                checked={showTranslation}
                onChange={(e) => setShowTranslation(e.target.checked)}
              />
              Hiện dịch
            </label>
          </div>

          <div className="dialogue-conversation">
            {dialogue.map((line, index) => {
              const isActive = isPlaying && currentLine === index;
              const isPlayed = playedLines.has(index);
              
              return (
                <div 
                  key={index}
                  className={`dialogue-bubble ${isActive ? 'active' : ''} ${isPlayed ? 'played' : ''}`}
                >
                  <div className="bubble-header">
                    <div 
                      className="speaker-avatar"
                      style={{ background: getSpeakerColor(line.speaker) }}
                    >
                      {getSpeakerAvatar(line.speaker)}
                    </div>
                    <div className="speaker-info">
                      <h4 className="speaker-name">{line.speaker}</h4>
                      {isPlayed && (
                        <FaCheckCircle className="played-icon" size={14} />
                      )}
                    </div>
                    <button
                      className="speak-btn-inline"
                      onClick={() => handleSpeak(line.text, index)}
                    >
                      <FaVolumeUp />
                    </button>
                  </div>
                  <div className="bubble-content">
                    <p className="dialogue-text">{line.text}</p>
                    {showTranslation && (
                      <p className="dialogue-translation">
                        {/* Translation would come from API if available */}
                        <em>(Dịch sẽ được hiển thị ở đây)</em>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="roleplay-mode">
          <div className="role-selection">
            <h3>Chọn vai diễn của bạn:</h3>
            <div className="role-buttons">
              {speakers.map((speaker) => (
                <button
                  key={speaker}
                  className={`role-btn ${selectedRole === speaker ? 'selected' : ''}`}
                  onClick={() => setSelectedRole(speaker)}
                  style={{
                    borderColor: selectedRole === speaker ? getSpeakerColor(speaker) : '#e5e7eb',
                    background: selectedRole === speaker ? `${getSpeakerColor(speaker)}15` : 'white'
                  }}
                >
                  <div 
                    className="role-avatar"
                    style={{ background: getSpeakerColor(speaker) }}
                  >
                    {getSpeakerAvatar(speaker)}
                  </div>
                  <span>{speaker}</span>
                </button>
              ))}
            </div>
          </div>

          {selectedRole && (
            <div className="roleplay-content">
              <div className="roleplay-instructions">
                <FaUser />
                <p>Đọc to các câu của <strong>{selectedRole}</strong>. Máy sẽ đọc các vai khác.</p>
              </div>

              <div className="roleplay-dialogue">
                {dialogue.map((line, index) => {
                  const isUserRole = line.speaker === selectedRole;
                  
                  return (
                    <div 
                      key={index}
                      className={`roleplay-line ${isUserRole ? 'user-role' : 'other-role'}`}
                    >
                      <div 
                        className="roleplay-avatar"
                        style={{ background: getSpeakerColor(line.speaker) }}
                      >
                        {getSpeakerAvatar(line.speaker)}
                      </div>
                      <div className="roleplay-bubble">
                        <div className="roleplay-header">
                          <span className="roleplay-speaker">{line.speaker}</span>
                          {isUserRole && (
                            <span className="your-turn-badge">Lượt bạn</span>
                          )}
                        </div>
                        <p className="roleplay-text">{line.text}</p>
                        {!isUserRole && (
                          <button
                            className="play-other-btn"
                            onClick={() => handleSpeak(line.text, index)}
                          >
                            <FaVolumeUp /> Nghe
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="dialogue-tips">
        <div className="tip-card">
          <h4>💡 Mẹo luyện tập</h4>
          <ul>
            <li><strong>Nghe nhiều lần:</strong> Lặp lại hội thoại để quen với phát âm và ngữ điệu</li>
            <li><strong>Bắt chước:</strong> Cố gắng phát âm giống như bản gốc nhất có thể</li>
            <li><strong>Luyện vai:</strong> Thử đóng vai từng nhân vật để thực hành giao tiếp</li>
            <li><strong>Ghi chú:</strong> Chú ý những cụm từ hoặc mẫu câu hữu ích</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DialogueLesson;
