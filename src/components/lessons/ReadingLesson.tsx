import React, { useState, useEffect } from 'react';
import { 
  FaBookOpen, 
  FaVolumeUp, 
  FaCheckCircle, 
  FaClock, 
  FaLightbulb,
  FaQuestionCircle,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import './ReadingLesson.css';

interface Vocabulary {
  word: string;
  meaning: string;
  pronunciation?: string;
  example?: string;
}

interface Paragraph {
  id: string | number;
  content: string;
  translation?: string;
}

interface ComprehensionQuestion {
  id: string | number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

interface KeyPoint {
  id: string | number;
  title: string;
  content: string;
  icon?: string;
}

interface ReadingLessonProps {
  title: string;
  subtitle?: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  readingTime?: number; // in minutes
  imageUrl?: string;
  
  // Pre-reading section
  introduction?: string;
  vocabulary?: Vocabulary[];
  
  // Main reading content
  paragraphs: Paragraph[];
  showTranslation?: boolean;
  
  // Key points / Summary
  keyPoints?: KeyPoint[];
  
  // Comprehension questions
  comprehensionQuestions?: ComprehensionQuestion[];
  
  // Additional content
  culturalNote?: string;
  tips?: string[];
  
  // Callbacks
  onComplete?: () => void;
  onAudioPlay?: (text: string) => void;
}

const ReadingLesson: React.FC<ReadingLessonProps> = ({
  title,
  subtitle,
  category = 'Reading',
  level = 'beginner',
  readingTime = 5,
  imageUrl,
  introduction,
  vocabulary = [],
  paragraphs,
  showTranslation = true,
  keyPoints = [],
  comprehensionQuestions = [],
  culturalNote,
  tips = [],
  onComplete,
  onAudioPlay,
}) => {
  const [expandedVocab, setExpandedVocab] = useState<Set<string>>(new Set());
  const [showTranslations, setShowTranslations] = useState(false);
  const [expandedParagraphs, setExpandedParagraphs] = useState<Set<string | number>>(new Set());
  const [comprehensionAnswers, setComprehensionAnswers] = useState<Record<string | number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Track reading progress based on scroll
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(Math.min(scrollPercent, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleVocab = (word: string) => {
    setExpandedVocab((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(word)) {
        newSet.delete(word);
      } else {
        newSet.add(word);
      }
      return newSet;
    });
  };

  const toggleParagraphTranslation = (id: string | number) => {
    setExpandedParagraphs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const speak = (text: string) => {
    if (onAudioPlay) {
      onAudioPlay(text);
    }
    
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Speech synthesis error:', error);
    }
  };

  const handleComprehensionAnswer = (questionId: string | number, answer: string) => {
    setComprehensionAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const checkComprehension = () => {
    setShowResults(true);
    const allAnswered = comprehensionQuestions.every(
      (q) => comprehensionAnswers[q.id]
    );
    if (allAnswered) {
      const correctCount = comprehensionQuestions.filter(
        (q) => comprehensionAnswers[q.id] === q.correctAnswer
      ).length;
      const score = (correctCount / comprehensionQuestions.length) * 100;
      
      if (score >= 70 && !isCompleted) {
        setIsCompleted(true);
        if (onComplete) {
          onComplete();
        }
      }
    }
  };

  const getLevelColor = () => {
    switch (level) {
      case 'beginner':
        return '#10b981';
      case 'intermediate':
        return '#f59e0b';
      case 'advanced':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getLevelLabel = () => {
    switch (level) {
      case 'beginner':
        return 'Beginner';
      case 'intermediate':
        return 'Intermediate';
      case 'advanced':
        return 'Advanced';
      default:
        return 'All Levels';
    }
  };

  return (
    <div className="reading-lesson">
      {/* Progress Bar */}
      <div className="reading-progress-bar">
        <div 
          className="reading-progress-fill" 
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Header */}
      <div className="reading-header">
        <div className="reading-header-content">
          <div className="reading-meta">
            <span className="reading-category">{category}</span>
            <span className="reading-level" style={{ backgroundColor: getLevelColor() }}>
              {getLevelLabel()}
            </span>
            <span className="reading-time">
              <FaClock /> {readingTime} phút đọc
            </span>
          </div>
          <h1 className="reading-title">{title}</h1>
          {subtitle && <p className="reading-subtitle">{subtitle}</p>}
        </div>
        {imageUrl && (
          <div className="reading-header-image">
            <img src={imageUrl} alt={title} />
          </div>
        )}
      </div>

      {/* Introduction */}
      {introduction && (
        <div className="reading-introduction">
          <div className="intro-icon">
            <FaBookOpen />
          </div>
          <div className="intro-content">
            <h3>Giới thiệu</h3>
            <p>{introduction}</p>
          </div>
        </div>
      )}

      {/* Vocabulary Section */}
      {vocabulary.length > 0 && (
        <div className="reading-vocabulary">
          <h2 className="section-title">
            <FaLightbulb /> Từ vựng cần biết
          </h2>
          <div className="vocab-grid">
            {vocabulary.map((vocab, idx) => (
              <div 
                key={idx} 
                className={`vocab-card ${expandedVocab.has(vocab.word) ? 'expanded' : ''}`}
                onClick={() => toggleVocab(vocab.word)}
              >
                <div className="vocab-card-header">
                  <div className="vocab-word-section">
                    <strong className="vocab-word">{vocab.word}</strong>
                    {vocab.pronunciation && (
                      <span className="vocab-pronunciation">/{vocab.pronunciation}/</span>
                    )}
                  </div>
                  <button 
                    className="vocab-audio-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      speak(vocab.word);
                    }}
                  >
                    <FaVolumeUp />
                  </button>
                </div>
                <p className="vocab-meaning">{vocab.meaning}</p>
                {expandedVocab.has(vocab.word) && vocab.example && (
                  <div className="vocab-example">
                    <strong>Ví dụ:</strong>
                    <p>"{vocab.example}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Reading Content */}
      <div className="reading-content">
        <div className="content-header">
          <h2 className="section-title">
            <FaBookOpen /> Nội dung bài đọc
          </h2>
          {showTranslation && (
            <button 
              className="translation-toggle"
              onClick={() => setShowTranslations(!showTranslations)}
            >
              {showTranslations ? 'Ẩn bản dịch' : 'Hiện bản dịch'}
            </button>
          )}
        </div>

        <div className="reading-text">
          {paragraphs.map((para) => (
            <div key={para.id} className="paragraph-block">
              <div className="paragraph-content">
                <button 
                  className="audio-btn-inline"
                  onClick={() => speak(para.content)}
                  title="Nghe đoạn văn"
                >
                  <FaVolumeUp />
                </button>
                <p className="paragraph-text">{para.content}</p>
              </div>
              
              {para.translation && showTranslation && (
                <div className="paragraph-translation-section">
                  <button
                    className="translation-toggle-btn"
                    onClick={() => toggleParagraphTranslation(para.id)}
                  >
                    {expandedParagraphs.has(para.id) ? (
                      <>
                        <FaChevronUp /> Ẩn bản dịch
                      </>
                    ) : (
                      <>
                        <FaChevronDown /> Xem bản dịch
                      </>
                    )}
                  </button>
                  {(expandedParagraphs.has(para.id) || showTranslations) && (
                    <p className="paragraph-translation">{para.translation}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Key Points / Summary */}
      {keyPoints.length > 0 && (
        <div className="reading-key-points">
          <h2 className="section-title">
            <FaCheckCircle /> Điểm chính cần nhớ
          </h2>
          <div className="key-points-grid">
            {keyPoints.map((point) => (
              <div key={point.id} className="key-point-card">
                {point.icon && <div className="key-point-icon">{point.icon}</div>}
                <h3>{point.title}</h3>
                <p>{point.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comprehension Questions */}
      {comprehensionQuestions.length > 0 && (
        <div className="reading-comprehension">
          <h2 className="section-title">
            <FaQuestionCircle /> Câu hỏi hiểu bài
          </h2>
          <div className="comprehension-questions">
            {comprehensionQuestions.map((question, idx) => {
              const userAnswer = comprehensionAnswers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <div key={question.id} className="comprehension-question">
                  <p className="question-text">
                    <strong>{idx + 1}.</strong> {question.question}
                  </p>
                  <div className="question-options">
                    {question.options.map((option, optIdx) => {
                      const isSelected = userAnswer === option;
                      const isCorrectOption = showResults && option === question.correctAnswer;
                      const isWrongSelection = showResults && isSelected && !isCorrect;
                      
                      return (
                        <button
                          key={optIdx}
                          className={`option-btn ${isSelected ? 'selected' : ''} ${isCorrectOption ? 'correct' : ''} ${isWrongSelection ? 'wrong' : ''}`}
                          onClick={() => handleComprehensionAnswer(question.id, option)}
                          disabled={showResults}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                  {showResults && question.explanation && (
                    <div className={`explanation ${isCorrect ? 'correct-exp' : 'wrong-exp'}`}>
                      <strong>{isCorrect ? '✓ Chính xác!' : '✗ Chưa đúng.'}</strong>
                      <p>{question.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {!showResults && (
            <button 
              className="check-answers-btn"
              onClick={checkComprehension}
              disabled={Object.keys(comprehensionAnswers).length !== comprehensionQuestions.length}
            >
              Kiểm tra đáp án
            </button>
          )}
        </div>
      )}

      {/* Cultural Note */}
      {culturalNote && (
        <div className="reading-cultural-note">
          <h2 className="section-title">🌍 Ghi chú văn hóa</h2>
          <p>{culturalNote}</p>
        </div>
      )}

      {/* Tips Section */}
      {tips.length > 0 && (
        <div className="reading-tips">
          <h2 className="section-title">
            <FaLightbulb /> Mẹo học tập
          </h2>
          <ul className="tips-list">
            {tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Completion Badge */}
      {isCompleted && (
        <div className="completion-badge">
          <FaCheckCircle />
          <span>Hoàn thành bài đọc!</span>
        </div>
      )}
    </div>
  );
};

export default ReadingLesson;
