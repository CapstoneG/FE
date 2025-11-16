import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaLightbulb, FaRedo } from 'react-icons/fa';
import './ExerciseLesson.css';

interface Question {
  id: string | number;
  question: string;
  type: 'fill-in-blank' | 'multiple-choice' | 'true-false' | 'matching';
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  hint?: string;
}

interface ExerciseLessonProps {
  title: string;
  description?: string;
  instructions: string;
  questions: Question[];
  passingScore?: number; // percentage (0-100)
  onComplete?: (score: number, passed: boolean) => void;
  showHints?: boolean;
  allowRetry?: boolean;
}

const ExerciseLesson: React.FC<ExerciseLessonProps> = ({
  title,
  description,
  instructions,
  questions,
  passingScore = 70,
  onComplete,
  showHints = true,
  allowRetry = true,
}) => {
  const [answers, setAnswers] = useState<Record<string | number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [showHintsState, setShowHintsState] = useState<Record<string | number, boolean>>({});
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    // Initialize answers state
    const initialAnswers: Record<string | number, string> = {};
    questions.forEach((q) => {
      initialAnswers[q.id] = '';
    });
    setAnswers(initialAnswers);
  }, [questions]);

  const handleAnswerChange = (questionId: string | number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const toggleHint = (questionId: string | number) => {
    setShowHintsState((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const checkAnswer = (question: Question): boolean => {
    const userAnswer = answers[question.id]?.trim().toLowerCase();
    
    if (Array.isArray(question.correctAnswer)) {
      return question.correctAnswer.some(
        (ans) => ans.toLowerCase() === userAnswer
      );
    }
    
    return question.correctAnswer.toLowerCase() === userAnswer;
  };

  const handleSubmit = () => {
    let correctCount = 0;
    
    questions.forEach((question) => {
      if (checkAnswer(question)) {
        correctCount++;
      }
    });

    const percentage = (correctCount / questions.length) * 100;
    const isPassed = percentage >= passingScore;
    
    setScore(Math.round(percentage));
    setPassed(isPassed);
    setShowResults(true);

    if (onComplete) {
      onComplete(Math.round(percentage), isPassed);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setShowResults(false);
    setShowHintsState({});
    setScore(0);
    setPassed(false);
    
    // Re-initialize answers
    const initialAnswers: Record<string | number, string> = {};
    questions.forEach((q) => {
      initialAnswers[q.id] = '';
    });
    setAnswers(initialAnswers);
  };

  const renderQuestion = (question: Question, index: number) => {
    const isCorrect = showResults && checkAnswer(question);
    const userAnswer = answers[question.id];

    switch (question.type) {
      case 'fill-in-blank':
        return (
          <div key={question.id} className={`exercise-question ${showResults ? (isCorrect ? 'correct' : 'incorrect') : ''}`}>
            <div className="question-header">
              <span className="question-number">{index + 1}.</span>
              <p className="question-text">{question.question}</p>
              {showResults && (
                <span className="result-icon">
                  {isCorrect ? <FaCheckCircle /> : <FaTimesCircle />}
                </span>
              )}
            </div>
            
            <input
              type="text"
              className="answer-input"
              placeholder="Nhập câu trả lời..."
              value={userAnswer || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              disabled={showResults}
            />

            {showHints && question.hint && (
              <div className="hint-section">
                <button
                  className="hint-button"
                  onClick={() => toggleHint(question.id)}
                  disabled={showResults}
                >
                  <FaLightbulb /> {showHintsState[question.id] ? 'Ẩn gợi ý' : 'Xem gợi ý'}
                </button>
                {showHintsState[question.id] && (
                  <div className="hint-content">
                    <strong>Gợi ý:</strong> {question.hint}
                  </div>
                )}
              </div>
            )}

            {showResults && (
              <div className={`explanation ${isCorrect ? 'correct-exp' : 'incorrect-exp'}`}>
                <strong>{isCorrect ? '✓ Chính xác!' : '✗ Chưa đúng.'}</strong>
                {!isCorrect && (
                  <div className="correct-answer">
                    Đáp án đúng: <strong>{Array.isArray(question.correctAnswer) ? question.correctAnswer.join(' / ') : question.correctAnswer}</strong>
                  </div>
                )}
                {question.explanation && (
                  <div className="explanation-text">{question.explanation}</div>
                )}
              </div>
            )}
          </div>
        );

      case 'multiple-choice':
        return (
          <div key={question.id} className={`exercise-question ${showResults ? (isCorrect ? 'correct' : 'incorrect') : ''}`}>
            <div className="question-header">
              <span className="question-number">{index + 1}.</span>
              <p className="question-text">{question.question}</p>
              {showResults && (
                <span className="result-icon">
                  {isCorrect ? <FaCheckCircle /> : <FaTimesCircle />}
                </span>
              )}
            </div>

            <div className="options-grid">
              {question.options?.map((option, idx) => {
                const isSelected = userAnswer === option;
                const isCorrectOption = showResults && option.toLowerCase() === (Array.isArray(question.correctAnswer) ? question.correctAnswer[0] : question.correctAnswer).toLowerCase();
                
                return (
                  <button
                    key={idx}
                    className={`option-button ${isSelected ? 'selected' : ''} ${showResults && isCorrectOption ? 'correct-option' : ''} ${showResults && isSelected && !isCorrect ? 'wrong-option' : ''}`}
                    onClick={() => handleAnswerChange(question.id, option)}
                    disabled={showResults}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {showHints && question.hint && (
              <div className="hint-section">
                <button
                  className="hint-button"
                  onClick={() => toggleHint(question.id)}
                  disabled={showResults}
                >
                  <FaLightbulb /> {showHintsState[question.id] ? 'Ẩn gợi ý' : 'Xem gợi ý'}
                </button>
                {showHintsState[question.id] && (
                  <div className="hint-content">
                    <strong>Gợi ý:</strong> {question.hint}
                  </div>
                )}
              </div>
            )}

            {showResults && (
              <div className={`explanation ${isCorrect ? 'correct-exp' : 'incorrect-exp'}`}>
                <strong>{isCorrect ? '✓ Chính xác!' : '✗ Chưa đúng.'}</strong>
                {question.explanation && (
                  <div className="explanation-text">{question.explanation}</div>
                )}
              </div>
            )}
          </div>
        );

      case 'true-false':
        return (
          <div key={question.id} className={`exercise-question ${showResults ? (isCorrect ? 'correct' : 'incorrect') : ''}`}>
            <div className="question-header">
              <span className="question-number">{index + 1}.</span>
              <p className="question-text">{question.question}</p>
              {showResults && (
                <span className="result-icon">
                  {isCorrect ? <FaCheckCircle /> : <FaTimesCircle />}
                </span>
              )}
            </div>

            <div className="true-false-buttons">
              <button
                className={`tf-button ${userAnswer === 'true' ? 'selected' : ''} ${showResults && question.correctAnswer === 'true' ? 'correct-option' : ''} ${showResults && userAnswer === 'true' && !isCorrect ? 'wrong-option' : ''}`}
                onClick={() => handleAnswerChange(question.id, 'true')}
                disabled={showResults}
              >
                Đúng (True)
              </button>
              <button
                className={`tf-button ${userAnswer === 'false' ? 'selected' : ''} ${showResults && question.correctAnswer === 'false' ? 'correct-option' : ''} ${showResults && userAnswer === 'false' && !isCorrect ? 'wrong-option' : ''}`}
                onClick={() => handleAnswerChange(question.id, 'false')}
                disabled={showResults}
              >
                Sai (False)
              </button>
            </div>

            {showHints && question.hint && (
              <div className="hint-section">
                <button
                  className="hint-button"
                  onClick={() => toggleHint(question.id)}
                  disabled={showResults}
                >
                  <FaLightbulb /> {showHintsState[question.id] ? 'Ẩn gợi ý' : 'Xem gợi ý'}
                </button>
                {showHintsState[question.id] && (
                  <div className="hint-content">
                    <strong>Gợi ý:</strong> {question.hint}
                  </div>
                )}
              </div>
            )}

            {showResults && (
              <div className={`explanation ${isCorrect ? 'correct-exp' : 'incorrect-exp'}`}>
                <strong>{isCorrect ? '✓ Chính xác!' : '✗ Chưa đúng.'}</strong>
                {question.explanation && (
                  <div className="explanation-text">{question.explanation}</div>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const allQuestionsAnswered = questions.every((q) => answers[q.id]?.trim() !== '');

  return (
    <div className="exercise-lesson">
      <div className="exercise-header">
        <h2 className="exercise-title">{title}</h2>
        {description && <p className="exercise-description">{description}</p>}
      </div>

      <div className="exercise-instructions">
        <div className="instructions-icon">📝</div>
        <div className="instructions-content">
          <strong>Hướng dẫn:</strong>
          <p>{instructions}</p>
        </div>
      </div>

      <div className="exercise-stats">
        <div className="stat-item">
          <span className="stat-label">Tổng số câu:</span>
          <span className="stat-value">{questions.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Điểm qua:</span>
          <span className="stat-value">{passingScore}%</span>
        </div>
        {showResults && (
          <div className="stat-item score-display">
            <span className="stat-label">Điểm của bạn:</span>
            <span className={`stat-value ${passed ? 'passed' : 'failed'}`}>
              {score}%
            </span>
          </div>
        )}
      </div>

      <div className="questions-container">
        {questions.map((question, index) => renderQuestion(question, index))}
      </div>

      <div className="exercise-actions">
        {!showResults ? (
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered}
          >
            Nộp bài
          </button>
        ) : (
          <div className="results-actions">
            <div className={`final-result ${passed ? 'passed' : 'failed'}`}>
              {passed ? (
                <>
                  <FaCheckCircle className="result-icon-large" />
                  <div>
                    <h3>Chúc mừng! Bạn đã vượt qua bài tập!</h3>
                    <p>Điểm số: {score}% (Yêu cầu: {passingScore}%)</p>
                  </div>
                </>
              ) : (
                <>
                  <FaTimesCircle className="result-icon-large" />
                  <div>
                    <h3>Chưa đạt yêu cầu. Hãy cố gắng thêm!</h3>
                    <p>Điểm số: {score}% (Yêu cầu: {passingScore}%)</p>
                  </div>
                </>
              )}
            </div>
            
            {allowRetry && (
              <button className="retry-button" onClick={handleRetry}>
                <FaRedo /> Làm lại bài tập
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseLesson;
