import { useState, useEffect, useRef } from 'react';
import './WritingPage.css';
import { writingWebSocketService, type WordSuggestionResponse } from '../services/writingWebSocketService';
import { skillsService, type WritingExercise } from '../services/skills';
import { chatbotService } from '../services/aiService';
import { Pagination } from '../components';
import { useStudyEvents } from '../hooks';

interface Suggestion {
  synonyms: string[];
  explanation: string;
}

interface EvaluationResult {
  grammarScore: number;
  grammarFeedback: string;
  vocabularyScore: number;
  vocabularyFeedback: string;
  coherenceScore: number;
  coherenceFeedback: string;
  contentScore: number;
  contentFeedback: string;
  overallScore: number;
  improvements: string[];
}

type PageMode = 'practice' | 'freewriting' | 'exercise';

const WritingPage = () => {
  const [pageMode, setPageMode] = useState<PageMode>('practice');
  const [selectedExercise, setSelectedExercise] = useState<WritingExercise | null>(null);
  const [exercises, setExercises] = useState<WritingExercise[]>([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Exercise mode states
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [exerciseEvaluation, setExerciseEvaluation] = useState<EvaluationResult | null>(null);
  
  // Free writing mode states
  const [freeTitle, setFreeTitle] = useState('');
  const [freeDescription, setFreeDescription] = useState('');
  const [freeContent, setFreeContent] = useState('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // WebSocket connection states
  const [wsConnected, setWsConnected] = useState(false);
  const [wsError, setWsError] = useState<string | null>(null);

  // Inline suggestions popup states
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [showSuggestionPopup, setShowSuggestionPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [currentWord, setCurrentWord] = useState('');
  const [currentWordStart, setCurrentWordStart] = useState(0);
  const [currentWordEnd, setCurrentWordEnd] = useState(0);
  
  // Use refs to maintain latest values for callback
  const popupPositionRef = useRef({ top: 0, left: 0 });
  const currentWordRef = useRef('');
  const currentWordStartRef = useRef(0);
  const currentWordEndRef = useRef(0);
  const justSelectedSynonymRef = useRef(false);

  // Track study session for exercise mode
  useStudyEvents({
    lessonId: selectedExercise?.id,
    activityType: 'SKILL',
    skill: 'WRITING',
    autoStart: pageMode === 'exercise' && !!selectedExercise,
    autoEnd: true,
    onSessionStart: (sessionId) => {
      console.log('[Writing Exercise] Study session started:', sessionId);
    },
    onSessionEnd: () => {
      console.log('[Writing Exercise] Study session ended');
    },
    onStatsUpdate: (event) => {
      console.log('[Writing Exercise] Stats updated:', event);
    },
  });

  // Track study session for freewriting mode
  useStudyEvents({
    activityType: 'SKILL',
    skill: 'WRITING',
    autoStart: pageMode === 'freewriting',
    autoEnd: true,
    onSessionStart: (sessionId) => {
      console.log('[Writing Freewriting] Study session started:', sessionId);
    },
    onSessionEnd: () => {
      console.log('[Writing Freewriting] Study session ended');
    },
    onStatsUpdate: (event) => {
      console.log('[Writing Freewriting] Stats updated:', event);
    },
  });

  // Load writing exercises
  useEffect(() => {
    const loadExercises = async () => {
      try {
        setIsLoadingExercises(true);
        const response = await skillsService.getWritingExercises(currentPage);
        setExercises(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } catch (error) {
        console.error('Failed to load writing exercises:', error);
      } finally {
        setIsLoadingExercises(false);
      }
    };

    if (pageMode === 'practice') {
      loadExercises();
    }
  }, [pageMode, currentPage]);

  // Kết nối WebSocket khi component mount
  useEffect(() => {
    const connectWebSocket = async () => {
      try {
        console.log('Connecting to WebSocket...');
        await writingWebSocketService.connect();
        setWsConnected(true);
        setWsError(null);
        console.log('WebSocket connected successfully');

        // Đăng ký callback để nhận gợi ý từ vựng
        writingWebSocketService.onSuggestionReceived((response: WordSuggestionResponse) => {
          console.log('Received suggestions:', response);
          
          setIsLoading(false);
          
          // Chỉ xử lý nếu có synonyms
          if (response.synonyms && response.synonyms.length > 0) {
            const newSuggestion: Suggestion = {
              synonyms: response.synonyms,
              explanation: response.explanation
            };

            setSuggestions([newSuggestion]);
            setShowSuggestionPopup(true);
          } else {
            // Không có data thì đóng popup và xóa suggestions
            setSuggestions([]);
            setShowSuggestionPopup(false);
          }
        });

      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
        setWsError('Không thể kết nối đến server. Vui lòng thử lại sau.');
        setWsConnected(false);
      }
    };

    connectWebSocket();

    // Cleanup: ngắt kết nối khi component unmount
    return () => {
      console.log('Disconnecting WebSocket...');
      writingWebSocketService.disconnect();
    };
  }, []);

  // Auto-send word suggestion after 1 second of typing (debounce)
  useEffect(() => {
    // Chỉ chạy khi đang ở exercise mode và có text
    if (pageMode !== 'exercise' || !text.trim() || !wsConnected) {
      setShowSuggestionPopup(false);
      return;
    }

    // Skip nếu vừa chọn từ từ popup
    if (justSelectedSynonymRef.current) {
      justSelectedSynonymRef.current = false;
      return;
    }

    // Tạo debounce timer: chờ 1 giây sau khi user ngừng gõ
    const timer = setTimeout(() => {
      if (!textareaRef.current) return;
      
      const cursorPos = textareaRef.current.selectionStart;
      
      // Tìm từ hiện tại dựa trên vị trí con trỏ
      const textBeforeCursor = text.substring(0, cursorPos);
      const textAfterCursor = text.substring(cursorPos);
      
      // Tìm ranh giới của từ (word boundaries)
      const wordStart = textBeforeCursor.search(/\S+$/);
      const wordEndMatch = textAfterCursor.match(/^\S+/);
      const wordEnd = cursorPos + (wordEndMatch ? wordEndMatch[0].length : 0);
      
      if (wordStart !== -1) {
        const word = text.substring(wordStart, wordEnd);
        
        // Chỉ gửi nếu từ có ít nhất 2 ký tự
        if (word && word.length >= 2) {
          console.log('🔄 Auto-sending suggestion request for:', word);
          setCurrentWord(word);
          setCurrentWordStart(wordStart);
          setCurrentWordEnd(wordEnd);
          
          // Update refs for callback
          currentWordRef.current = word;
          currentWordStartRef.current = wordStart;
          currentWordEndRef.current = wordEnd;
          
          setIsLoading(true);
          
          // Tính toán vị trí popup dựa trên vị trí cursor
          const coords = getCaretCoordinates(textareaRef.current, wordStart);
          // Hiển thị popup phía trên cursor, nhưng đảm bảo không âm
          const popupHeight = 120; // Chiều cao ước tính của popup
          const top = Math.max(10, coords.top - popupHeight);
          const left = Math.max(10, Math.min(coords.left, textareaRef.current.clientWidth - 220));
          
          const position = { top, left };
          setPopupPosition(position);
          popupPositionRef.current = position;
        
          
          writingWebSocketService.sendWordSuggestionRequest(word);
        }
      }
    }, 1000); // 1 giây
    return () => {
      clearTimeout(timer);
    };
  }, [text, wsConnected, pageMode]);

  // Đóng popup khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowSuggestionPopup(false);
      }
    };

    if (showSuggestionPopup) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showSuggestionPopup]);

  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const freeWordCount = freeContent.trim() === '' ? 0 : freeContent.trim().split(/\s+/).length;

  const handleSelectExercise = (exercise: WritingExercise) => {
    setSelectedExercise(exercise);
    setPageMode('exercise');
    setText('');
    setSuggestions([]);
  };

  const handleBackToPractice = () => {
    setPageMode('practice');
    setSelectedExercise(null);
    setText('');
    setSuggestions([]);
    setShowSuggestionPopup(false);
    setExerciseEvaluation(null);
  };

  const getCaretCoordinates = (element: HTMLTextAreaElement, position: number) => {
    const div = document.createElement('div');
    const style = getComputedStyle(element);
    
    ['fontFamily', 'fontSize', 'fontWeight', 'letterSpacing', 'lineHeight',
     'padding', 'border', 'boxSizing', 'whiteSpace', 'wordWrap'].forEach(prop => {
      div.style[prop as any] = style[prop as any];
    });
    
    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    div.style.whiteSpace = 'pre-wrap';
    div.style.width = element.clientWidth + 'px';
    
    const textContent = element.value.substring(0, position);
    div.textContent = textContent;
    
    const span = document.createElement('span');
    span.textContent = element.value.substring(position) || '.';
    div.appendChild(span);
    
    document.body.appendChild(div);
    
    const coordinates = {
      top: div.offsetHeight + 110, 
      left: span.offsetLeft
    };
    
    document.body.removeChild(div);
    return coordinates;
  };

  const handleSelectSynonym = (synonym: string) => {
    const wordStart = currentWordStartRef.current;
    const wordEnd = currentWordEndRef.current;
    const newText = text.substring(0, wordStart) + synonym + text.substring(wordEnd);
    
    // Set flag để không trigger auto-send
    justSelectedSynonymRef.current = true;
    
    setText(newText);
    setShowSuggestionPopup(false);
    setSuggestions([]);
    
    // Đặt focus về textarea và đặt cursor sau từ vừa thay thế
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = wordStart + synonym.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const handleGetSuggestions = async () => {
    if (!text.trim() || !selectedExercise) return;
    
    setIsLoading(true);
    
    try {
      const result = await chatbotService.scoreWriting({
        title: selectedExercise.title,
        description: selectedExercise.metadata.prompt,
        content: text
      });
      
      setExerciseEvaluation(result);
    } catch (error) {
      console.error('Error evaluating writing:', error);
      alert('Có lỗi xảy ra khi chấm điểm. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearText = () => {
    setText('');
    setSuggestions([]);
    setExerciseEvaluation(null);
  };

  const handleEvaluate = async () => {
    if (!freeContent.trim() || !freeTitle.trim()) return;
    
    setIsEvaluating(true);
    
    try {
      const result = await chatbotService.scoreWriting({
        title: freeTitle,
        description: freeDescription,
        content: freeContent
      });
      
      setEvaluation(result);
    } catch (error) {
      console.error('Error evaluating writing:', error);
      alert('Có lỗi xảy ra khi chấm điểm. Vui lòng thử lại.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleResetFreeWriting = () => {
    setFreeTitle('');
    setFreeDescription('');
    setFreeContent('');
    setEvaluation(null);
  };

  // ==================== RENDER: Practice Writing Exercise Detail ====================
  if (pageMode === 'exercise' && selectedExercise) {
    return (
      <div className="writing-page">
        <button className="back-button" onClick={handleBackToPractice}>
          ← Back
        </button>
        
        <div className="writing-header">
          <div className="header-content-writting">
            <h1>{selectedExercise?.title}</h1>
          </div>
          <div className="exercise-info">
            <span className="info-badge level-badge">{selectedExercise?.level}</span>
            <span className="info-badge topic-badge">{selectedExercise?.topic}</span>
            <span className="info-badge target-badge">
              {selectedExercise?.metadata.wordCountMin}-{selectedExercise?.metadata.wordCountMax} words
            </span>
          </div>
          
          <div className="prompt-box">
            <div className="prompt-label">ĐỀ BÀI</div>
            <p className="prompt-text">{selectedExercise?.metadata.prompt}</p>
          </div>
          
          {/* WebSocket Error Message */}
          {wsError && (
            <div className="ws-error-message">
              ⚠️ {wsError}
            </div>
          )}
        </div>

        <div className="writing-container">
          <div className="writing-content">
            <div className="writing-area">
              <div className="area-header">
                <label className="area-label">Your Writing</label>
                <span className="word-count">{wordCount} words</span>
              </div>
              <div style={{ position: 'relative' }}>
                <textarea
                  ref={textareaRef}
                  className="writing-textarea"
                  placeholder="Write your paragraph here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                
                {/* Inline Suggestion Popup */}
                {showSuggestionPopup && suggestions.length > 0 && suggestions[0].synonyms.length > 0 && (
                  <div
                    ref={popupRef}
                    className="inline-suggestion-popup"
                    style={{
                      position: 'absolute',
                      top: `${popupPosition.top}px`,
                      left: `${popupPosition.left}px`,
                      zIndex: 9999
                    }}
                  >
                    <div className="popup-synonyms">
                      {suggestions[0].synonyms.slice(0, 3).map((synonym, index) => (
                        <button
                          key={index}
                          className="synonym-button"
                          onClick={() => handleSelectSynonym(synonym)}
                        >
                          {synonym}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {selectedExercise && selectedExercise.metadata.tips.length > 0 && (
                <div className="tips-section">
                  <h4>Tips:</h4>
                  <ul>
                    {selectedExercise.metadata.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="suggestions-area">
              <label className="area-label">Writing Support</label>
              
              {/* 1. Gợi ý ý tưởng */}
              {selectedExercise && selectedExercise.metadata.ideaHints.length > 0 && (
                <div className="support-section">
                  <div className="section-header">
                    <h3>Idea Hints</h3>
                  </div>
                  <div className="section-content">
                    <div className="subsection">
                      <ul className="idea-list">
                        {selectedExercise.metadata.ideaHints.map((hint, index) => (
                          <li key={index}>{hint}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Từ vựng gợi ý theo chủ đề */}
              {selectedExercise && selectedExercise.metadata.keywords.length > 0 && (
                <div className="support-section">
                  <div className="section-header">
                    <h3>Topic Vocabulary</h3>
                  </div>
                  <div className="section-content">
                    <div className="subsection">
                      <h4>Keywords</h4>
                      <table className="vocabulary-table">
                        <thead>
                          <tr>
                            <th>Word</th>
                            <th>Meaning</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedExercise.metadata.keywords.map((keyword, index) => (
                            <tr key={index}>
                              <td className="vocab-word">{keyword.word}</td>
                              <td>{keyword.meaning}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Writing Actions - Hidden after evaluation */}
          {!exerciseEvaluation && (
            <div className="writing-actions">
              <button 
                className="btn-primary"
                onClick={handleGetSuggestions}
                disabled={!text.trim() || isLoading}
              >
                {isLoading ? 'Evaluating...' : 'Submit'}
              </button>
              <button 
                className="btn-secondary"
                onClick={handleClearText}
                disabled={!text.trim()}
              >
                Clear Text
              </button>
            </div>
          )}

          {/* AI Evaluation Result Section */}
          {exerciseEvaluation && (
            <div className="evaluation-section">
              <div className="evaluation-header">
                <h3>AI Evaluation Result</h3>
                <div className="overall-score">
                  <span className="score-label">Overall Score</span>
                  <span className="score-value">{exerciseEvaluation.overallScore}/10</span>
                </div>
              </div>

              <div className="evaluation-grid">
                {/* Grammar Category */}
                <div className="evaluation-category">
                  <div className="category-header">
                    <h4 className="category-title">Grammar</h4>
                    <span className="category-score">{exerciseEvaluation.grammarScore}/10</span>
                  </div>
                  <p className="category-feedback">{exerciseEvaluation.grammarFeedback}</p>
                </div>

                {/* Vocabulary Category */}
                <div className="evaluation-category">
                  <div className="category-header">
                    <h4 className="category-title">Vocabulary</h4>
                    <span className="category-score">{exerciseEvaluation.vocabularyScore}/10</span>
                  </div>
                  <p className="category-feedback">{exerciseEvaluation.vocabularyFeedback}</p>
                </div>

                {/* Coherence Category */}
                <div className="evaluation-category">
                  <div className="category-header">
                    <h4 className="category-title">Coherence</h4>
                    <span className="category-score">{exerciseEvaluation.coherenceScore}/10</span>
                  </div>
                  <p className="category-feedback">{exerciseEvaluation.coherenceFeedback}</p>
                </div>

                {/* Content Category */}
                <div className="evaluation-category">
                  <div className="category-header">
                    <h4 className="category-title">Content Relevance</h4>
                    <span className="category-score">{exerciseEvaluation.contentScore}/10</span>
                  </div>
                  <p className="category-feedback">{exerciseEvaluation.contentFeedback}</p>
                </div>
              </div>

              {/* Improvement Suggestions */}
              <div className="improvements-section">
                <h4 className="improvements-title">Suggestions for Improvement</h4>
                <ul className="improvements-list">
                  {exerciseEvaluation.improvements.map((improvement, index) => (
                    <li key={index} className="improvement-item">{improvement}</li>
                  ))}
                </ul>
              </div>

              {/* Confirm Button */}
              <div className="evaluation-actions">
                <button 
                  className="btn-confirm"
                  onClick={handleBackToPractice}
                >
                  Hoàn thành
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="writing-page">
      {/* Page Header */}
      <div className="writing-header">
        <h1>Writing Practice</h1>
        <p className="header-subtitle">Improve your English writing skills</p>
      </div>

      {/* Tab Selector */}
      <div className="tab-selector">
        <button 
          className={`tab-button ${pageMode === 'practice' ? 'active' : ''}`}
          onClick={() => setPageMode('practice')}
        >
          Practice Writing
        </button>
        <button 
          className={`tab-button ${pageMode === 'freewriting' ? 'active' : ''}`}
          onClick={() => {
            setPageMode('freewriting');
            setEvaluation(null);
          }}
        >
          Free Writing
        </button>
      </div>

      {/* ==================== TAB CONTENT: Practice Writing ==================== */}
      {pageMode === 'practice' && (
        <div className="tab-content">          
          {isLoadingExercises ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              Loading exercises...
            </div>
          ) : (
            <>
              <div className="exercises-grid">
                {exercises.map((exercise) => (
                  <div 
                    key={exercise.id} 
                    className="exercise-card"
                    onClick={() => handleSelectExercise(exercise)}
                  >
                    <div className="exercise-thumbnail">
                      <img src={exercise.thumbnail} alt={exercise.title} />
                      <div className="exercise-level">{exercise.level}</div>
                    </div>
                    <div className="exercise-content">
                      <h3 className="exercise-title">{exercise.title}</h3>
                      <div className="exercise-meta">
                        <span className="exercise-topic">{exercise.topic}</span>
                      </div>
                      <p className="exercise-description">{exercise.metadata.description}</p>
                      <div className="exercise-footer">
                        <span className="word-range">
                          {exercise.metadata.wordCountMin}-{exercise.metadata.wordCountMax} words
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalElements={totalElements}
                onPageChange={setCurrentPage}
                itemLabel="exercises"
              />
            </>
          )}
        </div>
      )}

      {/* ==================== TAB CONTENT: Free Writing ==================== */}
      {pageMode === 'freewriting' && (
        <div className="tab-content">
          <div className="section-header">
            <h2>Free Writing Workspace</h2>
          </div>

          <div className="free-writing-workspace">
            {/* Writing Input Section */}
            <div className="writing-input-section">
              <div className="form-group">
                <label className="form-label">
                  Writing Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your writing title..."
                  value={freeTitle}
                  onChange={(e) => setFreeTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Description <span className="required">*</span>
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="Describe what you want to write about (purpose, main ideas...)"
                  value={freeDescription}
                  onChange={(e) => setFreeDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <div className="area-header">
                  <label className="form-label">
                    Content <span className="required">*</span>
                  </label>
                  <span className="word-count">{freeWordCount} words</span>
                </div>
                <textarea
                  className="form-textarea large"
                  placeholder="Start writing your content here..."
                  value={freeContent}
                  onChange={(e) => setFreeContent(e.target.value)}
                  rows={15}
                />
              </div>

              <div className="free-writing-actions">
                <button 
                  className="btn-evaluate"
                  onClick={handleEvaluate}
                  disabled={!freeTitle.trim() || !freeContent.trim() || isEvaluating}
                >
                  {isEvaluating ? 'Evaluating...' : 'Evaluate with AI'}
                </button>
                <button 
                  className="btn-reset"
                  onClick={handleResetFreeWriting}
                  disabled={isEvaluating}
                >
                  Reset
                </button>
              </div>
            </div>

            {/* AI Evaluation Result Section */}
            {evaluation && (
              <div className="evaluation-section">
                <div className="evaluation-header">
                  <h3>AI Evaluation Result</h3>
                  <div className="overall-score">
                    <span className="score-label">Overall Score</span>
                    <span className="score-value">{evaluation.overallScore}/10</span>
                  </div>
                </div>

                <div className="evaluation-grid">
                  {/* Grammar Category */}
                  <div className="evaluation-category">
                    <div className="category-header">
                      <h4 className="category-title">Grammar</h4>
                      <span className="category-score">{evaluation.grammarScore}/10</span>
                    </div>
                    <p className="category-feedback">{evaluation.grammarFeedback}</p>
                  </div>

                  {/* Vocabulary Category */}
                  <div className="evaluation-category">
                    <div className="category-header">
                      <h4 className="category-title">Vocabulary</h4>
                      <span className="category-score">{evaluation.vocabularyScore}/10</span>
                    </div>
                    <p className="category-feedback">{evaluation.vocabularyFeedback}</p>
                  </div>

                  {/* Coherence Category */}
                  <div className="evaluation-category">
                    <div className="category-header">
                      <h4 className="category-title">Coherence</h4>
                      <span className="category-score">{evaluation.coherenceScore}/10</span>
                    </div>
                    <p className="category-feedback">{evaluation.coherenceFeedback}</p>
                  </div>

                  {/* Content Category */}
                  <div className="evaluation-category">
                    <div className="category-header">
                      <h4 className="category-title">Content Relevance</h4>
                      <span className="category-score">{evaluation.contentScore}/10</span>
                    </div>
                    <p className="category-feedback">{evaluation.contentFeedback}</p>
                  </div>
                </div>

                {/* Improvement Suggestions */}
                <div className="improvements-section">
                  <h4 className="improvements-title">Suggestions for Improvement</h4>
                  <ul className="improvements-list">
                    {evaluation.improvements.map((improvement, index) => (
                      <li key={index} className="improvement-item">{improvement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WritingPage;
