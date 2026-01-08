import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaChevronRight, FaChevronLeft, FaTrophy, FaRedo, FaLightbulb } from 'react-icons/fa';
import './ExerciseLesson.css';

// Exercise Types
interface TranslateExercise {
  question: string;
  type: 'TRANSLATE';
  metadata: {
    answer: string;
  };
}

interface MultipleChoiceExercise {
  question: string;
  type: 'MULTIPLE_CHOICE';
  metadata: {
    options: string[];
    correct: string;
  };
}

interface FillBlankExercise {
  question: string;
  type: 'FILL_BLANK';
  metadata: {
    answer: string;
  };
}

interface MatchPairsExercise {
  question: string;
  type: 'MATCH_PAIRS';
  metadata: {
    pairs: Array<{
      left: string;
      right: string;
    }>;
  };
}

interface SelectImageExercise {
  question: string;
  type: 'SELECT_IMAGE';
  metadata: {
    options: Array<{
      imageUrl: string;
      value: string;
    }>;
    correct: string;
  };
}

type Exercise = TranslateExercise | MultipleChoiceExercise | FillBlankExercise | MatchPairsExercise | SelectImageExercise;

interface ExerciseLessonProps {
  title: string;
  description?: string;
  instructions?: string;
  exercises: Exercise[];
  passingScore?: number;
  onComplete?: (score: number, passed: boolean) => void;
}

interface QuestionResult {
  correct: boolean;
  userAnswer: string | null;
}

const ExerciseLesson: React.FC<ExerciseLessonProps> = ({
  title,
  description,
  instructions,
  exercises,
  passingScore = 70,
  onComplete,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [results, setResults] = useState<{ [key: number]: QuestionResult }>({});
  const [showResult, setShowResult] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  
  // For match pairs
  const [matchPairsState, setMatchPairsState] = useState<{ [key: number]: { [key: string]: string } }>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  const currentExercise = exercises[currentQuestionIndex];
  const totalQuestions = exercises.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  useEffect(() => {
    // Initialize match pairs state for MATCH_PAIRS questions
    exercises.forEach((exercise, index) => {
      if (exercise.type === 'MATCH_PAIRS' && !matchPairsState[index]) {
        setMatchPairsState(prev => ({
          ...prev,
          [index]: {}
        }));
      }
    });
  }, [exercises]);

  const handleAnswerChange = (answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
  };

  const handleMatchPair = (leftItem: string, rightItem: string) => {
    setMatchPairsState(prev => ({
      ...prev,
      [currentQuestionIndex]: {
        ...prev[currentQuestionIndex],
        [leftItem]: rightItem
      }
    }));
    setSelectedLeft(null);
  };

  const checkAnswer = (exercise: Exercise, userAnswer: string | undefined): boolean => {
    if (!userAnswer) return false;

    switch (exercise.type) {
      case 'TRANSLATE':
      case 'FILL_BLANK':
        return userAnswer.toLowerCase().trim() === exercise.metadata.answer.toLowerCase().trim();
      
      case 'MULTIPLE_CHOICE':
      case 'SELECT_IMAGE':
        return userAnswer === exercise.metadata.correct;
      
      case 'MATCH_PAIRS':
        const pairs = matchPairsState[currentQuestionIndex] || {};
        const correctPairs = exercise.metadata.pairs;
        return correctPairs.every(pair => pairs[pair.left] === pair.right);
      
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Calculate results
    const newResults: { [key: number]: QuestionResult } = {};
    let correctCount = 0;

    exercises.forEach((exercise, index) => {
      let userAnswer = userAnswers[index];
      
      // For match pairs, convert to string representation
      if (exercise.type === 'MATCH_PAIRS') {
        const pairs = matchPairsState[index] || {};
        userAnswer = JSON.stringify(pairs);
      }

      const isCorrect = checkAnswer(exercise, userAnswer);
      if (isCorrect) correctCount++;

      newResults[index] = {
        correct: isCorrect,
        userAnswer: userAnswer || null
      };
    });

    const finalScore = Math.round((correctCount / totalQuestions) * 100);
    const passed = finalScore >= passingScore;

    setResults(newResults);
    setScore(finalScore);
    setSubmitted(true);
    setShowResult(true);
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setResults({});
    setMatchPairsState({});
    setShowResult(false);
    setSubmitted(false);
    setScore(0);
  };

  const renderQuestion = () => {
    const exercise = currentExercise;
    const currentAnswer = userAnswers[currentQuestionIndex];

    switch (exercise.type) {
      case 'TRANSLATE':
        return (
          <div className="question-content-exercise-lesson">
            <h3 className="question-text-exercise-lesson">{exercise.question}</h3>
            <input
              type="text"
              className="text-input-exercise-lesson"
              placeholder="Nhập câu trả lời của bạn..."
              value={currentAnswer || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              disabled={submitted}
            />
          </div>
        );

      case 'FILL_BLANK':
        return (
          <div className="question-content-exercise-lesson">
            <h3 className="question-text-exercise-lesson">{exercise.question}</h3>
            <input
              type="text"
              className="text-input-exercise-lesson"
              placeholder="Điền vào chỗ trống..."
              value={currentAnswer || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              disabled={submitted}
            />
          </div>
        );

      case 'MULTIPLE_CHOICE':
        return (
          <div className="question-content-exercise-lesson">
            <h3 className="question-text-exercise-lesson">{exercise.question}</h3>
            <div className="options-grid-exercise-lesson">
              {exercise.metadata.options.map((option, index) => (
                <button
                  key={index}
                  className={`option-button-exercise-lesson ${
                    currentAnswer === option ? 'selected-exercise-lesson' : ''
                  } ${
                    submitted && results[currentQuestionIndex]
                      ? option === exercise.metadata.correct
                        ? 'correct-exercise-lesson'
                        : option === currentAnswer
                        ? 'incorrect-exercise-lesson'
                        : ''
                      : ''
                  }`}
                  onClick={() => !submitted && handleAnswerChange(option)}
                  disabled={submitted}
                >
                  <span className="option-letter-exercise-lesson">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text-exercise-lesson">{option}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'SELECT_IMAGE':
        return (
          <div className="question-content-exercise-lesson">
            <h3 className="question-text-exercise-lesson">{exercise.question}</h3>
            <div className="image-options-grid-exercise-lesson">
              {exercise.metadata.options.map((option, index) => (
                <div
                  key={index}
                  className={`image-option-exercise-lesson ${
                    currentAnswer === option.value ? 'selected-exercise-lesson' : ''
                  } ${
                    submitted && results[currentQuestionIndex]
                      ? option.value === exercise.metadata.correct
                        ? 'correct-exercise-lesson'
                        : option.value === currentAnswer
                        ? 'incorrect-exercise-lesson'
                        : ''
                      : ''
                  }`}
                  onClick={() => !submitted && handleAnswerChange(option.value)}
                >
                  <img src={option.imageUrl} alt={option.value} className="option-image-exercise-lesson" />
                  {currentAnswer === option.value && (
                    <div className="image-selected-badge-exercise-lesson">
                      <FaCheckCircle />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'MATCH_PAIRS':
        const currentPairs = matchPairsState[currentQuestionIndex] || {};
        const leftItems = exercise.metadata.pairs.map(p => p.left);
        const rightItems = [...exercise.metadata.pairs.map(p => p.right)].sort(() => Math.random() - 0.5);
        
        return (
          <div className="question-content-exercise-lesson">
            <h3 className="question-text-exercise-lesson">{exercise.question}</h3>
            <div className="match-pairs-container-exercise-lesson">
              <div className="match-column-exercise-lesson">
                {leftItems.map((item, index) => (
                  <button
                    key={index}
                    className={`match-item-exercise-lesson left-exercise-lesson ${
                      selectedLeft === item ? 'selected-exercise-lesson' : ''
                    } ${currentPairs[item] ? 'matched-exercise-lesson' : ''}`}
                    onClick={() => !submitted && setSelectedLeft(item)}
                    disabled={submitted || !!currentPairs[item]}
                  >
                    {item}
                    {currentPairs[item] && (
                      <span className="match-arrow-exercise-lesson">→ {currentPairs[item]}</span>
                    )}
                  </button>
                ))}
              </div>
              <div className="match-column-exercise-lesson">
                {rightItems.map((item, index) => (
                  <button
                    key={index}
                    className={`match-item-exercise-lesson right-exercise-lesson ${
                      Object.values(currentPairs).includes(item) ? 'matched-exercise-lesson' : ''
                    }`}
                    onClick={() => !submitted && selectedLeft && handleMatchPair(selectedLeft, item)}
                    disabled={submitted || !selectedLeft || Object.values(currentPairs).includes(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (showResult) {
    const passed = score >= passingScore;
    const correctCount = Object.values(results).filter(r => r.correct).length;

    return (
      <div className="exercise-lesson-container-exercise-lesson">
        <div className="result-container-exercise-lesson">
          <div className={`result-card-exercise-lesson ${passed ? 'passed-exercise-lesson' : 'failed-exercise-lesson'}`}>
            <div className="result-icon-exercise-lesson">
              {passed ? (
                <FaTrophy className="trophy-icon-exercise-lesson" />
              ) : (
                <FaRedo className="retry-icon-exercise-lesson" />
              )}
            </div>
            <h2 className="result-title-exercise-lesson">
              {passed ? 'Xuất sắc!' : 'Cố gắng thêm nhé!'}
            </h2>
            <p className="result-message-exercise-lesson">
              {passed
                ? 'Bạn đã hoàn thành bài tập xuất sắc!'
                : 'Đừng lo lắng! Hãy xem lại và thử lại nhé.'}
            </p>
            
            <div className="score-display-exercise-lesson">
              <div className="score-circle-exercise-lesson">
                <span className="score-number-exercise-lesson">{score}%</span>
              </div>
              <p className="score-details-exercise-lesson">
                {correctCount}/{totalQuestions} câu đúng
              </p>
            </div>

            <div className="result-actions-exercise-lesson">
              <button className="retry-button-exercise-lesson" onClick={handleRetry}>
                <FaRedo /> Làm lại
              </button>
              {passed && (
                <button className="continue-button-exercise-lesson" onClick={() => onComplete && onComplete(score, passed)}>
                  Tiếp tục <FaChevronRight />
                </button>
              )}
            </div>

            {/* Review answers */}
            <div className="review-section-exercise-lesson">
              <h3>Xem lại câu trả lời</h3>
              <div className="review-list-exercise-lesson">
                {exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className={`review-item-exercise-lesson ${
                      results[index]?.correct ? 'correct-exercise-lesson' : 'incorrect-exercise-lesson'
                    }`}
                  >
                    <div className="review-header-exercise-lesson">
                      <span className="review-number-exercise-lesson">Câu {index + 1}</span>
                      {results[index]?.correct ? (
                        <FaCheckCircle className="review-icon-correct-exercise-lesson" />
                      ) : (
                        <FaTimesCircle className="review-icon-incorrect-exercise-lesson" />
                      )}
                    </div>
                    <p className="review-question-exercise-lesson">{exercise.question}</p>
                    {!results[index]?.correct && (
                      <div className="review-answer-exercise-lesson">
                        <p className="wrong-answer-exercise-lesson">
                          Câu trả lời của bạn: {userAnswers[index] || '(Chưa trả lời)'}
                        </p>
                        <p className="correct-answer-exercise-lesson">
                          Đáp án đúng: {
                            exercise.type === 'TRANSLATE' || exercise.type === 'FILL_BLANK'
                              ? exercise.metadata.answer
                              : exercise.type === 'MULTIPLE_CHOICE' || exercise.type === 'SELECT_IMAGE'
                              ? exercise.metadata.correct
                              : 'Xem bảng ghép đúng'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="exercise-lesson-container-exercise-lesson">
      <div className="exercise-header-exercise-lesson">
        <div className="header-content-exercise-lesson">
          <h1 className="exercise-title-exercise-lesson">{title}</h1>
          {description && <p className="exercise-description-exercise-lesson">{description}</p>}
          {instructions && <p className="exercise-instructions-exercise-lesson">
            <FaLightbulb className="instruction-icon-exercise-lesson" />
            {instructions}
          </p>}
        </div>

        <div className="progress-section-exercise-lesson">
          <div className="progress-info-exercise-lesson">
            <span className="progress-text-exercise-lesson">
              Câu {currentQuestionIndex + 1} / {totalQuestions}
            </span>
          </div>
          <div className="progress-bar-container-exercise-lesson">
            <div 
              className="progress-bar-fill-exercise-lesson"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="exercise-content-exercise-lesson">
        <div className="question-card-exercise-lesson">
          <div className="question-number-badge-exercise-lesson">
            Câu hỏi {currentQuestionIndex + 1}
          </div>
          
          {renderQuestion()}

          {submitted && results[currentQuestionIndex] && (
            <div className={`feedback-box-exercise-lesson ${
              results[currentQuestionIndex].correct ? 'correct-feedback-exercise-lesson' : 'incorrect-feedback-exercise-lesson'
            }`}>
              <div className="feedback-icon-exercise-lesson">
                {results[currentQuestionIndex].correct ? (
                  <FaCheckCircle />
                ) : (
                  <FaTimesCircle />
                )}
              </div>
              <div className="feedback-content-exercise-lesson">
                <h4>
                  {results[currentQuestionIndex].correct ? 'Chính xác!' : 'Chưa đúng'}
                </h4>
                {!results[currentQuestionIndex].correct && (
                  <p>
                    Đáp án đúng: {
                      currentExercise.type === 'TRANSLATE' || currentExercise.type === 'FILL_BLANK'
                        ? currentExercise.metadata.answer
                        : currentExercise.type === 'MULTIPLE_CHOICE' || currentExercise.type === 'SELECT_IMAGE'
                        ? currentExercise.metadata.correct
                        : 'Xem bảng ghép đúng'
                    }
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="exercise-navigation-exercise-lesson">
        <button
          className="nav-button-exercise-lesson"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <FaChevronLeft /> Câu trước
        </button>

        {!submitted && (
          <>
            {currentQuestionIndex < totalQuestions - 1 ? (
              <button
                className="nav-button-exercise-lesson primary-exercise-lesson"
                onClick={handleNext}
              >
                Câu tiếp <FaChevronRight />
              </button>
            ) : (
              <button
                className="submit-button-exercise-lesson"
                onClick={handleSubmit}
              >
                Nộp bài
              </button>
            )}
          </>
        )}

        {submitted && currentQuestionIndex < totalQuestions - 1 && (
          <button
            className="nav-button-exercise-lesson primary-exercise-lesson"
            onClick={handleNext}
          >
            Câu tiếp <FaChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default ExerciseLesson;
