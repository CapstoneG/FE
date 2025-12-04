import React, { useState } from 'react';
import { FaGraduationCap, FaCheckCircle, FaLightbulb, FaBook, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './GrammarLesson.css';

interface GrammarContent {
  topic?: string;
  explanation?: string;
  examples?: string[];
}

interface GrammarLessonProps {
  title: string;
  description?: string;
  grammar: GrammarContent;
  onComplete?: () => void;
}

const GrammarLesson: React.FC<GrammarLessonProps> = ({
  title,
  description,
  grammar,
  onComplete,
}) => {
  const [expandedExamples, setExpandedExamples] = useState<Set<number>>(new Set([0]));
  const [understood, setUnderstood] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');

  const toggleExample = (index: number) => {
    const newExpanded = new Set(expandedExamples);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedExamples(newExpanded);
  };

  const handleMarkAsUnderstood = () => {
    setUnderstood(true);
    if (onComplete) {
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  };

  const expandAll = () => {
    if (grammar.examples) {
      setExpandedExamples(new Set(grammar.examples.map((_, idx) => idx)));
    }
  };

  const collapseAll = () => {
    setExpandedExamples(new Set());
  };

  return (
    <div className="grammar-lesson">
      <div className="grammar-header">
        <div className="header-content">
          <FaGraduationCap className="header-icon" size={32} />
          <div>
            <h1 className="lesson-title">{title}</h1>
            {description && <p className="lesson-description">{description}</p>}
          </div>
        </div>
        
        {understood && (
          <div className="understood-badge">
            <FaCheckCircle size={20} />
            <span>Đã hiểu</span>
          </div>
        )}
      </div>

      <div className="grammar-content-wrapper">
        {/* Topic Section */}
        {grammar.topic && (
          <div className="grammar-topic-section">
            <div className="topic-header">
              <FaBook className="topic-icon" />
              <h2>Chủ đề ngữ pháp</h2>
            </div>
            <h3 className="topic-title">{grammar.topic}</h3>
          </div>
        )}

        {/* Explanation Section */}
        {grammar.explanation && (
          <div className="grammar-explanation-section">
            <div className="explanation-header">
              <FaLightbulb className="explanation-icon" />
              <h2>Giải thích</h2>
            </div>
            <div className="explanation-content">
              <p>{grammar.explanation}</p>
            </div>
          </div>
        )}

        {/* Examples Section */}
        {grammar.examples && grammar.examples.length > 0 && (
          <div className="grammar-examples-section">
            <div className="examples-header">
              <h2>Ví dụ minh họa ({grammar.examples.length})</h2>
              <div className="examples-controls">
                <button 
                  className="control-btn"
                  onClick={expandAll}
                >
                  Mở tất cả
                </button>
                <button 
                  className="control-btn"
                  onClick={collapseAll}
                >
                  Thu gọn
                </button>
              </div>
            </div>
            
            <div className="examples-list">
              {grammar.examples.map((example, index) => {
                const isExpanded = expandedExamples.has(index);
                
                // Split example into English and Vietnamese if contains " - "
                const parts = example.split(' - ');
                const englishPart = parts[0];
                const vietnamesePart = parts[1] || '';
                
                return (
                  <div 
                    key={index} 
                    className={`example-card ${isExpanded ? 'expanded' : ''}`}
                  >
                    <div 
                      className="example-header"
                      onClick={() => toggleExample(index)}
                    >
                      <div className="example-number">
                        <span>{index + 1}</span>
                      </div>
                      <div className="example-preview">
                        <p className="example-text">{englishPart}</p>
                      </div>
                      <button className="expand-btn">
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </div>
                    
                    {isExpanded && vietnamesePart && (
                      <div className="example-translation">
                        <div className="translation-label">Nghĩa:</div>
                        <p>{vietnamesePart}</p>
                      </div>
                    )}
                    
                    {isExpanded && (
                      <div className="example-actions">
                        <button
                          className="speak-example-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            if ('speechSynthesis' in window) {
                              const utterance = new SpeechSynthesisUtterance(englishPart);
                              utterance.lang = 'en-US';
                              utterance.rate = 0.8;
                              window.speechSynthesis.speak(utterance);
                            }
                          }}
                        >
                          🔊 Phát âm
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Notes Section */}
        <div className="grammar-notes-section">
          <button 
            className="notes-toggle"
            onClick={() => setShowNotes(!showNotes)}
          >
            <FaBook />
            {showNotes ? 'Ẩn ghi chú' : 'Thêm ghi chú cá nhân'}
          </button>
          
          {showNotes && (
            <div className="notes-content">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Viết ghi chú của bạn về ngữ pháp này..."
                rows={5}
              />
              <div className="notes-hint">
                💡 Ghi chú sẽ được lưu tự động trong trình duyệt
              </div>
            </div>
          )}
        </div>

        {/* Action Section */}
        {!understood && (
          <div className="grammar-action-section">
            <button 
              className="understand-btn"
              onClick={handleMarkAsUnderstood}
            >
              <FaCheckCircle />
              Tôi đã hiểu ngữ pháp này
            </button>
          </div>
        )}

        {understood && (
          <div className="completion-message">
            <FaCheckCircle size={48} />
            <h3>Tuyệt vời!</h3>
            <p>Bạn đã hoàn thành phần ngữ pháp này. Hãy thực hành nhiều hơn để ghi nhớ tốt hơn!</p>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="grammar-tips">
        <div className="tip-card">
          <div className="tip-content">
            <h4>Mẹo học tập</h4>
            <ul>
              <li>Đọc kỹ phần giải thích và hiểu logic ngữ pháp</li>
              <li>Nghiên cứu từng ví dụ để thấy cách áp dụng</li>
              <li>Tự tạo câu ví dụ riêng để thực hành</li>
              <li>Ghi chú những điểm quan trọng để ôn tập</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrammarLesson;
