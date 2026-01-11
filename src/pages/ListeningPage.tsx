import { useState, useRef, useEffect } from 'react';
import './ListeningPage.css';
import { FaHeadphones, FaPlay, FaPause, FaVolumeUp } from 'react-icons/fa';
import { skillsService } from '../services/skills';
import { Pagination } from '../components';
import { useStudyEvents } from '../hooks';

// ==================== TYPE DEFINITIONS ====================
interface Question {
  id: number;
  type: 'mcq' | 'fill-blank';
  question: string;
  options?: string[]; // For MCQ
  correctAnswer: number | string; // API trả về index cho MCQ, string cho fill-blank
  explanation: string;
}

interface VocabularyItem {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaning: string;
  example: string;
}

interface ListeningMetadata {
  duration: string;
  description: string;
  transcript: string[];
  questions: Question[];
  vocabulary?: VocabularyItem[];
}

interface ListeningExercise {
  id: number;
  title: string;
  topic: string;
  level: string;
  thumbnail: string;
  mediaUrl: string;
  metadata: ListeningMetadata;
}

// ==================== MAIN COMPONENT ====================
const ListeningPage = () => {
  // ==================== STATE MANAGEMENT ====================
  const [exercises, setExercises] = useState<ListeningExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState<ListeningExercise | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Map<number, string>>(new Map());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Track study session when exercise is selected
  useStudyEvents({
    lessonId: selectedExercise?.id,
    activityType: 'SKILL',
    skill: 'LISTENING',
    autoStart: !!selectedExercise,
    autoEnd: true,
    onSessionStart: (sessionId) => {
      console.log('[Listening] Study session started:', sessionId);
    },
    onSessionEnd: () => {
      console.log('[Listening] Study session ended');
    },
    onStatsUpdate: (event) => {
      console.log('[Listening] Stats updated:', event);
    },
  });
  
  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // ==================== PAGINATION ====================
  const itemsPerPage = 6;
  const totalPages = Math.ceil(totalElements / itemsPerPage);

  // ==================== FETCH DATA ====================
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const response = await skillsService.getListeningExercises(currentPage);
        setExercises(response.content as unknown as ListeningExercise[]);
        setTotalElements(response.totalElements);
      } catch (error) {
        console.error('Failed to fetch listening exercises:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [currentPage]);

  // ==================== AUDIO CONTROLS ====================
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [selectedExercise]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    audio.currentTime = percent * duration;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ==================== ANSWER HANDLING ====================
  const handleAnswerChange = (questionId: number, answer: string) => {
    setUserAnswers(prev => new Map(prev).set(questionId, answer));
  };

  const allQuestionsAnswered = () => {
    if (!selectedExercise) return false;
    return selectedExercise.metadata.questions.every(q => userAnswers.has(q.id));
  };

  const handleSubmit = () => {
    if (!selectedExercise) return;

    setIsLoading(true);

    // Simulate AI evaluation delay
    setTimeout(() => {
      let correctCount = 0;
      selectedExercise.metadata.questions.forEach(q => {
        const userAnswer = userAnswers.get(q.id);
        
        // Nếu correctAnswer là number (index cho MCQ)
        if (typeof q.correctAnswer === 'number' && q.options) {
          const correctAnswerText = q.options[q.correctAnswer];
          if (userAnswer?.toLowerCase().trim() === correctAnswerText.toLowerCase().trim()) {
            correctCount++;
          }
        } else {
          // Nếu correctAnswer là string (cho fill-blank)
          if (userAnswer?.toLowerCase().trim() === String(q.correctAnswer).toLowerCase().trim()) {
            correctCount++;
          }
        }
      });

      setScore(Math.round((correctCount / selectedExercise.metadata.questions.length) * 100));
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleRetry = () => {
    setUserAnswers(new Map());
    setIsSubmitted(false);
    setScore(0);
    setShowTranscript(false);
    setCurrentQuestionIndex(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleBackToList = () => {
    setSelectedExercise(null);
    setUserAnswers(new Map());
    setIsSubmitted(false);
    setScore(0);
    setShowTranscript(false);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setCurrentQuestionIndex(0);
    setCurrentPage(0);
  };

  // ==================== EXERCISE SELECTION VIEW ====================
  if (!selectedExercise) {
    return (
      <div className="listening-page">
        <div className="listening-header">
          <h1>Listening Practice</h1>
          <p className="header-subtitle">Improve your English listening skills with guided exercises</p>
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
        <div className="exercises-grid">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="exercise-card"
              onClick={() => setSelectedExercise(exercise)}
            >
              <div className="exercise-thumbnail">
                <img src={exercise.thumbnail} alt={exercise.title} />
                <div className="exercise-level">{exercise.level}</div>
              </div>
              <div className="exercise-content">
                <h3 className="exercise-title">{exercise.title}</h3>
                <div className="exercise-meta">
                  <span className="exercise-topic">{exercise.topic}</span>
                  <span className="exercise-duration"><FaHeadphones /> {exercise.metadata.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={setCurrentPage}
          itemLabel="exercises"
        />
      </div>
    );
  }

  // ==================== EXERCISE PRACTICE VIEW ====================
  return (
    <div className="listening-page">
      <button className="back-button" onClick={handleBackToList}>
        ← Back
      </button>

      {/* Page Header */}
      <div className="listening-header">
        <div className="header-content-listening">
          <h1>{selectedExercise.title}</h1>
        </div>
        <div className="exercise-info">
            <span className="info-badge level-badge">{selectedExercise.level}</span>
            <span className="info-badge topic-badge">{selectedExercise.topic}</span>
        </div>
      </div>
      <div className="listening-container">
        {/* Left Column - Audio & Content */}
        <div className="listening-content">
          {/* Audio Player Section */}
          <div className="audio-player-section">
            <div className="audio-thumbnail">
              <img src={selectedExercise.thumbnail} alt={selectedExercise.title} />
            </div>

            <div className="audio-controls">
              <audio ref={audioRef} src={selectedExercise.mediaUrl} />
              
              <button className={`play-button ${isPlaying ? 'playing' : ''}`} onClick={togglePlayPause}>
                <span className="play-icon">{isPlaying ? <FaPause /> : <FaPlay />}</span>
              </button>

              <div className="audio-info">
                <span className="time-display-left">{formatTime(currentTime)}</span>
                <div className="progress-bar-container-listening" onClick={handleProgressClick}>
                  <div 
                    className="progress-bar-fill-listening" 
                    style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                  />
                </div>
                <span className="time-display-right">{formatTime(duration)}</span>
              </div>

              <div className="volume-control">
                <FaVolumeUp className="volume-icon" />
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
              </div>
            </div>
          </div>

          {/* Listening Task Description */}
          <div className="task-description">
            <h3>Listening Task</h3>
            <p>{selectedExercise.metadata.description}</p>
          </div>

          {/* Transcript Section */}
          <div className="transcript-section">
            <button 
              className="transcript-toggle"
              onClick={() => setShowTranscript(!showTranscript)}
            >
              {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
            </button>
            
            {showTranscript && (
              <div className="transcript-content">
                <h4>Transcript</h4>
                {selectedExercise.metadata.transcript.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            )}
          </div> 
        </div>

        {/* Right Column - Questions & Results */}
        <div className="questions-section-listening">
          {!isSubmitted && !isLoading && (
            <>
              <h3>Questions</h3>
              <p className="questions-instruction-listening">Answer all questions based on what you heard</p>

              <div className="questions-list-listening">
                {selectedExercise.metadata.questions.map((question, idx) => (
                  <div 
                    key={question.id} 
                    className={`question-card-listening ${currentQuestionIndex === idx ? 'active' : ''}`}
                    style={{ display: currentQuestionIndex === idx ? 'block' : 'none' }}
                  >
                    <div className="question-number-listening">Question {idx + 1} of {selectedExercise.metadata.questions.length}</div>
                    <p className="question-text-listening">{question.question}</p>

                    {question.type === 'mcq' && question.options && (
                      <div className="options-list-listening">
                        {question.options.map((option, optIdx) => (
                          <label key={optIdx} className="option-item-listening">
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={option}
                              checked={userAnswers.get(question.id) === option}
                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            />
                            <span className="option-text-listening">{option}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {question.type === 'fill-blank' && (
                      <input
                        type="text"
                        className="fill-blank-input-listening"
                        placeholder="Type your answer..."
                        value={userAnswers.get(question.id) || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      />
                    )}

                    {/* Navigation Buttons */}
                    <div className="question-nav-buttons-listening">
                      <button 
                        className="nav-btn-listening prev-btn-listening"
                        onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                        disabled={currentQuestionIndex === 0}
                      >
                        ← Previous
                      </button>
                      <button 
                        className="nav-btn-listening next-btn-listening"
                        onClick={() => setCurrentQuestionIndex(Math.min(selectedExercise.metadata.questions.length - 1, currentQuestionIndex + 1))}
                        disabled={currentQuestionIndex === selectedExercise.metadata.questions.length - 1}
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Question Navigation */}
              <div className="question-nav-listening">
                {selectedExercise.metadata.questions.map((_, idx) => (
                  <button
                    key={idx}
                    className={`question-nav-btn-listening ${currentQuestionIndex === idx ? 'active' : ''} ${userAnswers.has(selectedExercise.metadata.questions[idx].id) ? 'answered' : ''}`}
                    onClick={() => setCurrentQuestionIndex(idx)}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button 
                className="submit-button-listening"
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered()}
              >
                Submit Answers
              </button>
            </>
          )}

          {isLoading && (
            <div className="loading-state-listening">
              <div className="loading-spinner-listening"></div>
              <p>Evaluating your answers...</p>
            </div>
          )}

          {isSubmitted && !isLoading && (
            <div className="results-section-listening">
              <div className="score-display-listening">
                <div className="score-circle-listening">
                  <span className="score-number-listening">{score}%</span>
                </div>
                <p className="score-text-listening">
                  {score >= 80 ? 'Excellent work!' : score >= 60 ? 'Good job!' : 'Keep practicing!'}
                </p>
              </div>

              <h3>Answer Review</h3>
              <div className="answer-review-list-listening">
                {selectedExercise.metadata.questions.map((question, idx) => {
                  const userAnswer = userAnswers.get(question.id);
                  
                  let correctAnswerText = '';
                  let isCorrect = false;
                  
                  if (typeof question.correctAnswer === 'number' && question.options) {
                    correctAnswerText = question.options[question.correctAnswer];
                    isCorrect = userAnswer?.toLowerCase().trim() === correctAnswerText.toLowerCase().trim();
                  } else {
                    correctAnswerText = String(question.correctAnswer);
                    isCorrect = userAnswer?.toLowerCase().trim() === correctAnswerText.toLowerCase().trim();
                  }

                  return (
                    <div key={question.id} className={`review-card-listening ${isCorrect ? 'correct' : 'incorrect'}`}>
                      <div className="review-header-listening">
                        <span className="review-number-listening">Question {idx + 1}</span>
                        <span className={`review-badge-listening ${isCorrect ? 'badge-correct-listening' : 'badge-incorrect-listening'}`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      <p className="review-question-listening">{question.question}</p>
                      
                      <div className="review-answers-listening">
                        <div className="answer-row-listening">
                          <span className="answer-label-listening">Your answer:</span>
                          <span className={`answer-value-listening ${isCorrect ? 'correct-answer-listening' : 'wrong-answer-listening'}`}>
                            {userAnswer || '(Not answered)'}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div className="answer-row-listening">
                            <span className="answer-label-listening">Correct answer:</span>
                            <span className="answer-value-listening correct-answer-listening">{correctAnswerText}</span>
                          </div>
                        )}
                      </div>

                      <div className="explanation-box-listening">
                        <strong>Explanation:</strong> {question.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="action-buttons-listening">
                <button className="btn-retry-listening" onClick={handleRetry}>
                  Try Again
                </button>
                <button className="btn-complete-listening">
                  ✓ Mark as Completed
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListeningPage;
