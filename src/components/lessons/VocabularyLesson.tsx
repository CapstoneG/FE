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
    <div className="vocabulary-lesson-container-vocabulary-lesson">
      <div className="vocabulary-header-vocabulary-lesson">
        <div className="header-content-vocabulary-lesson">
          <FaBook className="header-icon-vocabulary-lesson" />
          <div>
            <h1 className="lesson-title-vocabulary-lesson">{title}</h1>
            {description && <p className="lesson-description-vocabulary-lesson">{description}</p>}
          </div>
        </div>
        
        <div className="view-mode-toggle-vocabulary-lesson">
          <button
            className={`toggle-btn-vocabulary-lesson ${viewMode === 'flashcard' ? 'active-vocabulary-lesson' : ''}`}
            onClick={() => setViewMode('flashcard')}
          >
            Flashcard
          </button>
          <button
            className={`toggle-btn-vocabulary-lesson ${viewMode === 'list' ? 'active-vocabulary-lesson' : ''}`}
            onClick={() => setViewMode('list')}
          >
            Danh sách
          </button>
        </div>
      </div>

      {viewMode === 'flashcard' ? (
        <div className="flashcard-mode-vocabulary-lesson">
          <div className="flashcard-container-vocabulary-lesson">
            <div className="flashcard-counter-vocabulary-lesson">
              {currentIndex + 1} / {vocabulary.length}
            </div>
            
            <div 
              className={`flashcard-vocabulary-lesson ${showMeaning ? 'flipped-vocabulary-lesson' : ''}`}
              onClick={handleFlipCard}
            >
              <div className="flashcard-front-vocabulary-lesson">
                {currentWord.imageUrl && (
                  <div className="word-image-container-vocabulary-lesson">
                    <img 
                      src={currentWord.imageUrl} 
                      alt={currentWord.word}
                      className="word-image-vocabulary-lesson"
                    />
                  </div>
                )}
                <div className="word-header-vocabulary-lesson">
                  <h2 className="word-vocabulary-lesson">{currentWord.word}</h2>
                  <button
                    className="speak-btn-vocabulary-lesson"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak(currentWord.word);
                    }}
                  >
                    <FaVolumeUp size={24} />
                  </button>
                </div>
                {currentWord.pronunciation && (
                  <p className="pronunciation-vocabulary-lesson">/{currentWord.pronunciation}/</p>
                )}
                <p className="flip-hint-vocabulary-lesson">Click để xem nghĩa</p>
              </div>
              
              <div className="flashcard-back-vocabulary-lesson">
                {currentWord.imageUrl && (
                  <div className="word-image-container-vocabulary-lesson small-vocabulary-lesson">
                    <img 
                      src={currentWord.imageUrl} 
                      alt={currentWord.word}
                      className="word-image-vocabulary-lesson"
                    />
                  </div>
                )}
                <div className="meaning-section-vocabulary-lesson">
                  <h3>Nghĩa:</h3>
                  <p className="meaning-vocabulary-lesson">{currentWord.meaning}</p>
                </div>
                <div className="example-section-vocabulary-lesson">
                  <h3>Ví dụ:</h3>
                  <p className="example-vocabulary-lesson">{currentWord.example}</p>
                  <button
                    className="speak-btn-small-vocabulary-lesson"
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

            <div className="flashcard-actions-vocabulary-lesson">
              <button
                className="nav-btn-vocabulary-lesson"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                <FaArrowLeft /> Trước
              </button>
              
              <button
                className="nav-btn-vocabulary-lesson"
                onClick={handleNext}
                disabled={currentIndex === vocabulary.length - 1}
              >
                Sau <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="list-mode-vocabulary-lesson">
          <div className="vocabulary-list-vocabulary-lesson">
            {vocabulary.map((item, index) => (
              <div 
                key={index} 
                className={`vocabulary-card-vocabulary-lesson ${learnedWords.has(index) ? 'learned-vocabulary-lesson' : ''}`}
              >
                {item.imageUrl && (
                  <div className="card-image-container-vocabulary-lesson">
                    <img 
                      src={item.imageUrl} 
                      alt={item.word}
                      className="card-image-vocabulary-lesson"
                    />
                  </div>
                )}
                <div className="card-header-vocabulary-lesson">
                  <div className="word-section-vocabulary-lesson">
                    <h3 className="word-vocabulary-lesson">{item.word}</h3>
                    <button
                      className="speak-btn-inline-vocabulary-lesson"
                      onClick={() => handleSpeak(item.word)}
                    >
                      <FaVolumeUp size={18} />
                    </button>
                  </div>
                  {learnedWords.has(index) && (
                    <FaCheckCircle className="learned-icon-vocabulary-lesson" size={20} />
                  )}
                </div>
                
                {item.pronunciation && (
                  <p className="pronunciation-vocabulary-lesson">/{item.pronunciation}/</p>
                )}
                
                <p className="meaning-vocabulary-lesson">{item.meaning}</p>
                
                <div className="example-box-vocabulary-lesson">
                  <p className="example-label-vocabulary-lesson">Ví dụ:</p>
                  <p className="example-vocabulary-lesson">{item.example}</p>
                  <button
                    className="speak-btn-inline-vocabulary-lesson"
                    onClick={() => handleSpeak(item.example)}
                  >
                    <FaVolumeUp size={14} />
                  </button>
                </div>
              
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VocabularyLesson;
