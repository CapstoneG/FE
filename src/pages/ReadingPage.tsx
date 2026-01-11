import { useState, useEffect } from 'react';
import { Pagination } from '../components';
import { Toast } from '../components/common/Toast';
import { skillsService } from '../services/skills';
import { chatbotService } from '../services/aiService';
import { flashcardService } from '../services/flashcards';
import { useStudyEvents } from '../hooks';
import './ReadingPage.css';

interface Vocabulary {
  word: string;
  partOfSpeech: string;
  meaning: string;
  example: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface ReadingExerciseMetadata {
  estimatedTime: string;
  content: string[];
  vocabulary: Vocabulary[];
  questions: Question[];
}

interface ReadingExercise {
  id: number;
  title: string;
  level: string;
  mediaUrl: string | null;
  topic: string;
  thumbnail: string;
  skillType: string;
  metadata: ReadingExerciseMetadata;
}

const ReadingPage = () => {
  const [exercises, setExercises] = useState<ReadingExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState<ReadingExercise | null>(null);
  const [selectedWord, setSelectedWord] = useState<Vocabulary | null>(null);
  const [userAnswers, setUserAnswers] = useState<Map<number, number>>(new Map());
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [highlightedText, setHighlightedText] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(0);
  const [translatedText, setTranslatedText] = useState<string>('');
  const [showTranslation, setShowTranslation] = useState(false);
  const [translationPosition, setTranslationPosition] = useState({ top: 0, left: 0 });
  const [isTranslating, setIsTranslating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const itemsPerPage = 6;
  
  // Track study session when exercise is selected
  useStudyEvents({
    lessonId: selectedExercise?.id,
    activityType: 'SKILL',
    skill: 'READING',
    autoStart: !!selectedExercise,
    autoEnd: true,
    onSessionStart: (sessionId) => {
      console.log('[Reading] Study session started:', sessionId);
    },
    onSessionEnd: () => {
      console.log('[Reading] Study session ended');
    },
    onStatsUpdate: (event) => {
      console.log('[Reading] Stats updated:', event);
    },
  });
  
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const response = await skillsService.getReadingExercises(currentPage);
        setExercises(response.content as unknown as ReadingExercise[]);
        setTotalElements(response.totalElements);
      } catch (error) {
        console.error('Failed to fetch reading exercises:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [currentPage]);
  
  const totalPages = Math.ceil(totalElements / itemsPerPage);
  const currentExercises = exercises;

  const handleWordClick = (word: string) => {
    const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
    const vocab = selectedExercise?.metadata.vocabulary.find(v => 
      v.word.toLowerCase() === cleanWord
    );
    
    if (vocab) {
      setSelectedWord(vocab);
      setHighlightedText(cleanWord);
    }
  };

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setUserAnswers(new Map(userAnswers.set(questionId, optionIndex)));
  };

  const handleCheckAnswers = () => {
    if (!selectedExercise) return;
    
    let correct = 0;
    selectedExercise.metadata.questions.forEach(q => {
      if (userAnswers.get(q.id) === q.correctAnswer) {
        correct++;
      }
    });
    
    alert(`You got ${correct} out of ${selectedExercise.metadata.questions.length} correct!`);
  };

  const handleBackToList = () => {
    setSelectedExercise(null);
    setSelectedWord(null);
    setUserAnswers(new Map());
    setShowVocabulary(false);
    setHighlightedText('');
    setShowTranslation(false);
    setTranslatedText('');
  };

  const handleTextSelection = async () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    
    if (selectedText && selectedText.length > 0) {
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      
      if (rect) {
        // Position the translation icon above the selected text
        setTranslationPosition({
          top: rect.top + window.scrollY - 40,
          left: rect.left + window.scrollX + (rect.width / 2) - 15
        });
        setHighlightedText(selectedText);
        setShowTranslation(true);
        setTranslatedText('');
      }
    } else {
      setShowTranslation(false);
    }
  };

  const handleTranslate = async () => {
    if (!highlightedText) return;
    
    setIsTranslating(true);
    try {
      const result = await chatbotService.translateWord({ word: highlightedText });
      setTranslatedText(result.translated_word);
    } catch (error) {
      console.error('Error translating text:', error);
      setTranslatedText('Không thể dịch văn bản này');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCloseTranslation = () => {
    setShowTranslation(false);
    setTranslatedText('');
    window.getSelection()?.removeAllRanges();
  };

  const handleQuickAddFlashcard = async () => {
    if (!highlightedText) return;
    
    const trimmedWord = highlightedText.trim().split(/\s+/)[0].toLowerCase().replace(/[.,!?;:]/g, '');
    if (!trimmedWord) return;

    try {
      await flashcardService.addFlashcards({ words: [trimmedWord] });
      console.log('[Reading] Quick added flashcard:', trimmedWord);
      setToast({ message: `Added "${trimmedWord}" to flashcards!`, type: 'success' });
    } catch (error) {
      console.error('[Reading] Failed to add flashcard:', error);
      setToast({ message: 'Failed to add flashcard. Please try again.', type: 'error' });
    }
  };

  if (selectedExercise) {
    return (
      <div className="reading-page-reading">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        <button className="back-button-reading" onClick={handleBackToList}>
          ← Back
        </button>

        <div className="reading-header-reading">
          <div className="header-content-reading">
            <h1>{selectedExercise.title}</h1>
          </div>
          <div className="exercise-info-reading">
            <span className="info-badge-reading level-badge-reading">{selectedExercise.level}</span>
            <span className="info-badge-reading topic-badge-reading">{selectedExercise.topic}</span>
            <span className="info-badge-reading time-badge-reading"> {selectedExercise.metadata.estimatedTime}</span>
          </div>
        </div>

        <div className="reading-container-reading">
          <div className="reading-content-reading">
            <div className="passage-section-reading">
              <div className="passage-header-reading">
                <h3>Reading Passage</h3>
                <button 
                  className="vocab-toggle-btn-reading"
                  onClick={() => setShowVocabulary(!showVocabulary)}
                >
                {showVocabulary ? 'Hide' : 'Show'} Vocabulary
                </button>
              </div>
              
              <div 
                className="passage-card-reading"
                onMouseUp={handleTextSelection}
              >
                {selectedExercise.metadata.content.map((paragraph, index) => (
                  <p key={index} className="passage-paragraph-reading">
                    {paragraph.split(' ').map((word, wordIndex) => (
                      <span
                        key={wordIndex}
                        className={`passage-word-reading ${
                          highlightedText && word.toLowerCase().replace(/[.,!?;:]/g, '') === highlightedText
                            ? 'highlighted-reading'
                            : ''
                        }`}
                        onClick={() => handleWordClick(word)}
                      >
                        {word}{' '}
                      </span>
                    ))}
                  </p>
                ))}
              </div>

              {/* Translation Icon & Popup */}
              {showTranslation && (
                <>
                  <div 
                    className="translation-icon"
                    style={{
                      position: 'absolute',
                      top: `${translationPosition.top}px`,
                      left: `${translationPosition.left}px`,
                      zIndex: 1000
                    }}
                    onClick={handleTranslate}
                  >
                    📖
                  </div>
                  
                  <div 
                    className="translation-icon"
                    style={{
                      position: 'absolute',
                      top: `${translationPosition.top}px`,
                      left: `${translationPosition.left + 35}px`,
                      zIndex: 1000
                    }}
                    onClick={handleQuickAddFlashcard}
                    title="Add to flashcards now"
                  >
                    ➕
                  </div>
                  
                  {translatedText && (
                    <div 
                      className="translation-popup"
                      style={{
                        position: 'absolute',
                        top: `${translationPosition.top + 35}px`,
                        left: `${translationPosition.left - 50}px`,
                        zIndex: 1001
                      }}
                    >
                      <div className="translation-popup-header">
                        <span className="translation-label">Bản dịch:</span>
                        <button 
                          className="close-translation"
                          onClick={handleCloseTranslation}
                        >
                          ×
                        </button>
                      </div>
                      <p className="translation-text">{translatedText}</p>
                    </div>
                  )}
                </>
              )}

              {selectedWord && (
                <div className="vocabulary-popup-reading">
                  <div className="vocab-popup-header-reading">
                    <h4>{selectedWord.word}</h4>
                    <button 
                      className="close-popup-reading"
                      onClick={() => setSelectedWord(null)}
                    >
                      ×
                    </button>
                  </div>
                  <p className="vocab-pos-reading">{selectedWord.partOfSpeech}</p>
                  <p className="vocab-meaning-reading"><strong>Meaning:</strong> {selectedWord.meaning}</p>
                  <p className="vocab-example-reading"><strong>Example:</strong> {selectedWord.example}</p>
                  <button className="save-vocab-btn-reading">💾 Save to Vocabulary</button>
                </div>
              )}
            </div>

            {showVocabulary && (
              <div className="vocabulary-panel-reading">
                <h3>Vocabulary List</h3>
                <div className="vocab-list-reading">
                  {selectedExercise.metadata.vocabulary.map((vocab, index) => (
                    <div key={index} className="vocab-item-reading">
                      <div className="vocab-word-header-reading">
                        <span className="vocab-word-text-reading">{vocab.word}</span>
                        <span className="vocab-pos-badge-reading">{vocab.partOfSpeech}</span>
                      </div>
                      <p className="vocab-meaning-text-reading">{vocab.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="questions-section-reading">
            <h3>Comprehension Questions</h3>
            
            <div className="questions-grid-reading">
            {selectedExercise.metadata.questions.map((question, qIndex) => (
              <div key={question.id} className="question-card-reading">
                <p className="question-text-reading">
                  <span className="question-number-reading">{qIndex + 1}.</span>
                  {question.question}
                </p>

                <div className="options-list-reading">
                  {question.options.map((option, optIndex) => (
                    <label
                      key={optIndex}
                      className={`option-item-reading ${
                        userAnswers.get(question.id) === optIndex ? 'selected-reading' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        checked={userAnswers.get(question.id) === optIndex}
                        onChange={() => handleAnswerSelect(question.id, optIndex)}
                      />
                      <span className="option-label-reading">{String.fromCharCode(65 + optIndex)}.</span>
                      <span className="option-text-reading">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>

        <div className="action-bar">
          <button 
            className="btn-check-reading"
            onClick={handleCheckAnswers}
            disabled={userAnswers.size !== selectedExercise.metadata.questions.length}
          >
            ✓ Check Answers
          </button>
          <button className="btn-complete">
            ★ Mark as Completed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reading-page-reading">
      <div className="reading-header-reading">
        <h1>Reading Practice</h1>
        <p className="header-subtitle-reading">Improve your reading comprehension skills</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ 
            display: 'inline-block',
            width: '50px',
            height: '50px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #6366f1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginTop: '20px', color: '#6b7280', fontSize: '16px' }}>Loading exercises...</p>
        </div>
      ) : (
        <>
      <div className="exercises-grid-reading">
        {currentExercises.map((exercise) => (
          <div
            key={exercise.id}
            className="exercise-card-reading"
            onClick={() => setSelectedExercise(exercise)}
          >
            <div className="exercise-thumbnail-reading">
              <img src={exercise.thumbnail} alt={exercise.title} />
              <div className="exercise-level-reading">{exercise.level}</div>
            </div>
            <div className="exercise-content-reading">
              <h3 className="exercise-title-reading">{exercise.title}</h3>
              <div className="exercise-meta-reading">
                <span className="exercise-topic-reading">{exercise.topic}</span>
                <span className="exercise-time-reading"> {exercise.metadata.estimatedTime}</span>
              </div>
              <div className="exercise-footer-reading">
                <span className="word-count-reading">{exercise.metadata.questions.length} questions</span>
              </div>
            </div>
          </div>
        ))}
      </div>

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
  );
};

export default ReadingPage;
