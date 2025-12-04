import React, { useState } from 'react';
import { FaBook, FaVolumeUp, FaCheckCircle, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import './VocabularyLesson.css';

interface VocabularyItem {
  word: string;
  meaning: string;
  example: string;
  pronunciation?: string;
  imageUrl?: string;
}

interface VocabularyLessonProps {
  title: string;
  description?: string;
  vocabulary: VocabularyItem[];
  onComplete?: () => void;
}

const VocabularyLesson: React.FC<VocabularyLessonProps> = ({
  title,
  description,
  vocabulary,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [learnedWords, setLearnedWords] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<'flashcard' | 'list'>('flashcard');

  const currentWord = vocabulary[currentIndex];

  const handleNext = () => {
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowMeaning(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowMeaning(false);
    }
  };

  const handleMarkAsLearned = () => {
    const newLearned = new Set(learnedWords);
    newLearned.add(currentIndex);
    setLearnedWords(newLearned);
    
    if (newLearned.size === vocabulary.length && onComplete) {
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleFlipCard = () => {
    setShowMeaning(!showMeaning);
  };

  return (
    <div className="vocabulary-lesson">
      <div className="vocabulary-header">
        <div className="header-content">
          <FaBook className="header-icon" size={32} />
          <div>
            <h1 className="lesson-title">{title}</h1>
            {description && <p className="lesson-description">{description}</p>}
          </div>
        </div>
        
        <div className="view-mode-toggle">
          <button
            className={`toggle-btn ${viewMode === 'flashcard' ? 'active' : ''}`}
            onClick={() => setViewMode('flashcard')}
          >
            Flashcard
          </button>
          <button
            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            Danh sách
          </button>
        </div>
      </div>



      {viewMode === 'flashcard' ? (
        <div className="flashcard-mode">
          <div className="flashcard-container">
            <div className="flashcard-counter">
              {currentIndex + 1} / {vocabulary.length}
            </div>
            
            <div 
              className={`flashcard ${showMeaning ? 'flipped' : ''}`}
              onClick={handleFlipCard}
            >
              <div className="flashcard-front">
                {currentWord.imageUrl && (
                  <div className="word-image-container">
                    <img 
                      src={currentWord.imageUrl} 
                      alt={currentWord.word}
                      className="word-image"
                    />
                  </div>
                )}
                <div className="word-header">
                  <h2 className="word">{currentWord.word}</h2>
                  <button
                    className="speak-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak(currentWord.word);
                    }}
                  >
                    <FaVolumeUp size={24} />
                  </button>
                </div>
                {currentWord.pronunciation && (
                  <p className="pronunciation">/{currentWord.pronunciation}/</p>
                )}
                <p className="flip-hint">Click để xem nghĩa</p>
              </div>
              
              <div className="flashcard-back">
                {currentWord.imageUrl && (
                  <div className="word-image-container small">
                    <img 
                      src={currentWord.imageUrl} 
                      alt={currentWord.word}
                      className="word-image"
                    />
                  </div>
                )}
                <div className="meaning-section">
                  <h3>Nghĩa:</h3>
                  <p className="meaning">{currentWord.meaning}</p>
                </div>
                <div className="example-section">
                  <h3>Ví dụ:</h3>
                  <p className="example">{currentWord.example}</p>
                  <button
                    className="speak-btn-small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak(currentWord.example);
                    }}
                  >
                    <FaVolumeUp size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flashcard-actions">
              <button
                className="nav-btn"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                <FaArrowLeft /> Trước
              </button>
              
              {!learnedWords.has(currentIndex) && showMeaning && (
                <button
                  className="learned-btn"
                  onClick={handleMarkAsLearned}
                >
                  <FaCheckCircle /> Đã nhớ
                </button>
              )}
              
              {learnedWords.has(currentIndex) && (
                <span className="learned-badge">
                  <FaCheckCircle /> Đã học
                </span>
              )}
              
              <button
                className="nav-btn"
                onClick={handleNext}
                disabled={currentIndex === vocabulary.length - 1}
              >
                Sau <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="list-mode">
          <div className="vocabulary-list">
            {vocabulary.map((item, index) => (
              <div 
                key={index} 
                className={`vocabulary-card ${learnedWords.has(index) ? 'learned' : ''}`}
              >
                {item.imageUrl && (
                  <div className="card-image-container">
                    <img 
                      src={item.imageUrl} 
                      alt={item.word}
                      className="card-image"
                    />
                  </div>
                )}
                <div className="card-header">
                  <div className="word-section">
                    <h3 className="word">{item.word}</h3>
                    <button
                      className="speak-btn-inline"
                      onClick={() => handleSpeak(item.word)}
                    >
                      <FaVolumeUp size={18} />
                    </button>
                  </div>
                  {learnedWords.has(index) && (
                    <FaCheckCircle className="learned-icon" size={20} />
                  )}
                </div>
                
                {item.pronunciation && (
                  <p className="pronunciation">/{item.pronunciation}/</p>
                )}
                
                <p className="meaning">{item.meaning}</p>
                
                <div className="example-box">
                  <p className="example-label">Ví dụ:</p>
                  <p className="example">{item.example}</p>
                  <button
                    className="speak-btn-inline"
                    onClick={() => handleSpeak(item.example)}
                  >
                    <FaVolumeUp size={14} />
                  </button>
                </div>
                
                {!learnedWords.has(index) && (
                  <button
                    className="mark-learned-btn"
                    onClick={() => {
                      const newLearned = new Set(learnedWords);
                      newLearned.add(index);
                      setLearnedWords(newLearned);
                      
                      if (newLearned.size === vocabulary.length && onComplete) {
                        setTimeout(() => {
                          onComplete();
                        }, 500);
                      }
                    }}
                  >
                    <FaCheckCircle /> Đánh dấu đã học
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VocabularyLesson;
