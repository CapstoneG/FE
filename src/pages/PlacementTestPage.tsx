import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCheckCircle,
  FaClock,
  FaGraduationCap,
  FaLightbulb,
  FaArrowRight,
  FaArrowLeft,
  FaTrophy
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import './PlacementTestPage.css';

interface Question {
  id: number;
  type: 'grammar' | 'vocabulary' | 'reading' | 'listening';
  question: string;
  options: string[];
  correctAnswer: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  points: number;
}

interface TestResult {
  level: string; // Display level (e.g., "Intermediate (B1)")
  apiLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PROFICIENCY'; // Backend enum level
  score: number;
  totalPoints: number;
  percentage: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

const PlacementTestPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile } = useAuth();
  const [currentSection, setCurrentSection] = useState<'intro' | 'test' | 'result'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  // Comprehensive placement test questions
  const questions: Question[] = [
    // GRAMMAR SECTION - Beginner
    {
      id: 1,
      type: 'grammar',
      question: '_____ name is John.',
      options: ['My', 'I', 'Me', 'Mine'],
      correctAnswer: 'My',
      level: 'beginner',
      points: 1
    },
    {
      id: 2,
      type: 'grammar',
      question: 'She _____ to school every day.',
      options: ['go', 'goes', 'going', 'gone'],
      correctAnswer: 'goes',
      level: 'beginner',
      points: 1
    },
    {
      id: 3,
      type: 'grammar',
      question: 'There _____ three books on the table.',
      options: ['is', 'are', 'am', 'be'],
      correctAnswer: 'are',
      level: 'beginner',
      points: 1
    },
    {
      id: 4,
      type: 'grammar',
      question: 'I _____ breakfast at 7 AM yesterday.',
      options: ['have', 'had', 'has', 'having'],
      correctAnswer: 'had',
      level: 'beginner',
      points: 1
    },

    // GRAMMAR SECTION - Intermediate
    {
      id: 5,
      type: 'grammar',
      question: 'If I _____ rich, I would travel the world.',
      options: ['am', 'was', 'were', 'be'],
      correctAnswer: 'were',
      level: 'intermediate',
      points: 2
    },
    {
      id: 6,
      type: 'grammar',
      question: 'She has been studying English _____ three years.',
      options: ['since', 'for', 'during', 'from'],
      correctAnswer: 'for',
      level: 'intermediate',
      points: 2
    },
    {
      id: 7,
      type: 'grammar',
      question: 'The project _____ by the team next month.',
      options: ['will complete', 'will be completed', 'completes', 'completing'],
      correctAnswer: 'will be completed',
      level: 'intermediate',
      points: 2
    },
    {
      id: 8,
      type: 'grammar',
      question: 'I wish I _____ harder for the exam.',
      options: ['study', 'studied', 'had studied', 'have studied'],
      correctAnswer: 'had studied',
      level: 'intermediate',
      points: 2
    },

    // GRAMMAR SECTION - Advanced
    {
      id: 9,
      type: 'grammar',
      question: 'Scarcely _____ arrived when the meeting started.',
      options: ['I had', 'had I', 'I have', 'have I'],
      correctAnswer: 'had I',
      level: 'advanced',
      points: 3
    },
    {
      id: 10,
      type: 'grammar',
      question: 'The committee insisted that the proposal _____ immediately.',
      options: ['is reviewed', 'be reviewed', 'was reviewed', 'reviews'],
      correctAnswer: 'be reviewed',
      level: 'advanced',
      points: 3
    },

    // VOCABULARY SECTION - Beginner
    {
      id: 11,
      type: 'vocabulary',
      question: 'A place where you can buy books is called a _____.',
      options: ['bookstore', 'bakery', 'pharmacy', 'garage'],
      correctAnswer: 'bookstore',
      level: 'beginner',
      points: 1
    },
    {
      id: 12,
      type: 'vocabulary',
      question: 'The opposite of "hot" is _____.',
      options: ['cold', 'warm', 'cool', 'frozen'],
      correctAnswer: 'cold',
      level: 'beginner',
      points: 1
    },
    {
      id: 13,
      type: 'vocabulary',
      question: 'What do you use to write on a blackboard?',
      options: ['pen', 'pencil', 'chalk', 'marker'],
      correctAnswer: 'chalk',
      level: 'beginner',
      points: 1
    },

    // VOCABULARY SECTION - Intermediate
    {
      id: 14,
      type: 'vocabulary',
      question: 'To "procrastinate" means to _____.',
      options: ['hurry', 'delay', 'complete', 'organize'],
      correctAnswer: 'delay',
      level: 'intermediate',
      points: 2
    },
    {
      id: 15,
      type: 'vocabulary',
      question: 'An "ambiguous" statement is one that is _____.',
      options: ['clear', 'unclear', 'long', 'short'],
      correctAnswer: 'unclear',
      level: 'intermediate',
      points: 2
    },
    {
      id: 16,
      type: 'vocabulary',
      question: 'A "meticulous" person pays attention to _____.',
      options: ['nothing', 'details', 'colors', 'sounds'],
      correctAnswer: 'details',
      level: 'intermediate',
      points: 2
    },

    // VOCABULARY SECTION - Advanced
    {
      id: 17,
      type: 'vocabulary',
      question: 'To "ameliorate" a situation means to _____.',
      options: ['worsen it', 'improve it', 'ignore it', 'describe it'],
      correctAnswer: 'improve it',
      level: 'advanced',
      points: 3
    },
    {
      id: 18,
      type: 'vocabulary',
      question: 'A "sanguine" attitude is one that is _____.',
      options: ['pessimistic', 'optimistic', 'neutral', 'aggressive'],
      correctAnswer: 'optimistic',
      level: 'advanced',
      points: 3
    },

    // READING COMPREHENSION - Beginner
    {
      id: 19,
      type: 'reading',
      question: 'Reading: "Tom likes pizza. He eats pizza every Friday." - When does Tom eat pizza?',
      options: ['Every Monday', 'Every Friday', 'Every day', 'Every Sunday'],
      correctAnswer: 'Every Friday',
      level: 'beginner',
      points: 1
    },
    {
      id: 20,
      type: 'reading',
      question: 'Reading: "The cat is on the mat. The dog is under the table." - Where is the dog?',
      options: ['On the mat', 'Under the table', 'On the chair', 'Under the mat'],
      correctAnswer: 'Under the table',
      level: 'beginner',
      points: 1
    },

    // READING COMPREHENSION - Intermediate
    {
      id: 21,
      type: 'reading',
      question: 'Reading: "Despite the challenges, the team managed to complete the project ahead of schedule." - What does this sentence suggest?',
      options: ['The project was easy', 'The team failed', 'The team succeeded despite difficulties', 'The project was late'],
      correctAnswer: 'The team succeeded despite difficulties',
      level: 'intermediate',
      points: 2
    },
    {
      id: 22,
      type: 'reading',
      question: 'Reading: "The research indicates a correlation between exercise and mental health." - What does "correlation" mean here?',
      options: ['No relationship', 'A connection', 'A contradiction', 'A conflict'],
      correctAnswer: 'A connection',
      level: 'intermediate',
      points: 2
    },

    // READING COMPREHENSION - Advanced
    {
      id: 23,
      type: 'reading',
      question: 'Reading: "The author\'s nuanced perspective challenges conventional wisdom." - What does this suggest about the author?',
      options: ['They agree with common beliefs', 'They present a simple view', 'They offer a complex, subtle viewpoint', 'They have no opinion'],
      correctAnswer: 'They offer a complex, subtle viewpoint',
      level: 'advanced',
      points: 3
    },
    {
      id: 24,
      type: 'reading',
      question: 'Reading: "The implications of this discovery are far-reaching and multifaceted." - What does this mean?',
      options: ['The discovery has limited impact', 'The discovery affects many areas in various ways', 'The discovery is simple', 'The discovery is unimportant'],
      correctAnswer: 'The discovery affects many areas in various ways',
      level: 'advanced',
      points: 3
    },

    // PRACTICAL USAGE - Intermediate
    {
      id: 25,
      type: 'grammar',
      question: 'Which sentence is correct?',
      options: [
        'He don\'t like coffee.',
        'He doesn\'t likes coffee.',
        'He doesn\'t like coffee.',
        'He not like coffee.'
      ],
      correctAnswer: 'He doesn\'t like coffee.',
      level: 'intermediate',
      points: 2
    },
    {
      id: 26,
      type: 'vocabulary',
      question: 'In a business email, which is the most appropriate closing?',
      options: ['See ya!', 'Best regards,', 'Bye!', 'Later,'],
      correctAnswer: 'Best regards,',
      level: 'intermediate',
      points: 2
    },

    // IDIOMS AND EXPRESSIONS - Advanced
    {
      id: 27,
      type: 'vocabulary',
      question: '"Break the ice" means to _____.',
      options: ['Stop talking', 'Make people feel comfortable', 'Leave a party', 'Argue with someone'],
      correctAnswer: 'Make people feel comfortable',
      level: 'intermediate',
      points: 2
    },
    {
      id: 28,
      type: 'vocabulary',
      question: 'If something "costs an arm and a leg," it is _____.',
      options: ['free', 'cheap', 'very expensive', 'dangerous'],
      correctAnswer: 'very expensive',
      level: 'intermediate',
      points: 2
    },

    // COMPLEX GRAMMAR - Advanced
    {
      id: 29,
      type: 'grammar',
      question: 'Choose the correct sentence with proper subjunctive mood:',
      options: [
        'It is essential that he arrives on time.',
        'It is essential that he arrive on time.',
        'It is essential that he arriving on time.',
        'It is essential that he will arrive on time.'
      ],
      correctAnswer: 'It is essential that he arrive on time.',
      level: 'advanced',
      points: 3
    },
    {
      id: 30,
      type: 'grammar',
      question: 'Which sentence uses correct parallel structure?',
      options: [
        'She likes reading, to write, and painting.',
        'She likes reading, writing, and to paint.',
        'She likes reading, writing, and painting.',
        'She likes to read, writing, and painting.'
      ],
      correctAnswer: 'She likes reading, writing, and painting.',
      level: 'advanced',
      points: 3
    }
  ];

  // Timer countdown
  useEffect(() => {
    if (currentSection === 'test' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentSection, timeLeft]);

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate test results
  const calculateResults = (): TestResult => {
    let score = 0;
    let totalPoints = 0;
    const categoryScores: Record<string, { score: number; total: number }> = {
      grammar: { score: 0, total: 0 },
      vocabulary: { score: 0, total: 0 },
      reading: { score: 0, total: 0 }
    };

    questions.forEach((question) => {
      totalPoints += question.points;
      categoryScores[question.type].total += question.points;

      if (answers[question.id] === question.correctAnswer) {
        score += question.points;
        categoryScores[question.type].score += question.points;
      }
    });

    const percentage = (score / totalPoints) * 100;

    // Determine display level and API level (backend enum)
    let level = 'Beginner (A1-A2)';
    let apiLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PROFICIENCY' = 'BEGINNER';
    
    if (percentage >= 65) {
      level = 'Advanced (B2-C1)';
      apiLevel = 'ADVANCED';
    } else if (percentage >= 45) {
      level = 'Intermediate (B1)';
      apiLevel = 'INTERMEDIATE';
    } else {
      level = 'Beginner (A1-A2)';
      apiLevel = 'BEGINNER';
    }

    // Identify strengths and weaknesses
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    Object.entries(categoryScores).forEach(([category, scores]) => {
      const categoryPercentage = (scores.score / scores.total) * 100;
      if (categoryPercentage >= 70) {
        strengths.push(category.charAt(0).toUpperCase() + category.slice(1));
      } else if (categoryPercentage < 50) {
        weaknesses.push(category.charAt(0).toUpperCase() + category.slice(1));
      }
    });

    // Generate recommendations
    const recommendations: string[] = [];
    if (percentage < 45) {
      recommendations.push('Start with beginner courses to build a strong foundation');
      recommendations.push('Focus on basic grammar rules and common vocabulary');
      recommendations.push('Practice simple conversations and reading exercises');
    } else if (percentage < 65) {
      recommendations.push('Continue with intermediate level courses');
      recommendations.push('Expand vocabulary and practice complex grammar structures');
      recommendations.push('Read intermediate-level articles and books');
    } else {
      recommendations.push('Challenge yourself with advanced materials');
      recommendations.push('Focus on idiomatic expressions and nuanced language');
      recommendations.push('Practice writing essays and giving presentations');
    }

    return {
      level,
      apiLevel,
      score,
      totalPoints,
      percentage,
      strengths: strengths.length > 0 ? strengths : ['Building skills in all areas'],
      weaknesses: weaknesses.length > 0 ? weaknesses : ['Keep practicing all areas'],
      recommendations
    };
  };

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestionIndex].id]: answer
    }));
  };

  // Navigate questions
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Start test
  const handleStartTest = () => {
    setCurrentSection('test');
  };

  // Submit test
  const handleSubmitTest = async () => {
    const result = calculateResults();
    setTestResult(result);
    setCurrentSection('result');
    setShowConfirmSubmit(false);

    // Save result to localStorage (display level for UI)
    localStorage.setItem('placementTestCompleted', 'true');
    localStorage.setItem('userLevel', result.level); // Display level
    localStorage.setItem('placementTestScore', result.percentage.toString());

    // If user is authenticated, save level to backend
    if (isAuthenticated && user) {
      try {
        // Call API to update user level in database with backend enum format
        await authService.updateUserLevel(result.apiLevel);
        console.log('User level updated successfully:', result.apiLevel);
        
        // Update local user state with backend enum level
        await updateProfile({ level: result.apiLevel });
        
        console.log('User profile updated with new level');
      } catch (error) {
        console.error('Failed to update user level:', error);
      }
    }
  };

  // Calculate progress
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  const currentQuestion = questions[currentQuestionIndex];

  // Intro Section
  if (currentSection === 'intro') {
    return (
      <div className="placement-test-page">
        <div className="placement-intro">
          <div className="intro-header">
            <FaGraduationCap className="intro-icon" />
            <h1>English Placement Test</h1>
            <p className="intro-subtitle">Discover Your English Proficiency Level</p>
          </div>

          <div className="intro-content">
            <div className="intro-card main-overview">
              <div className="overview-header">
                <h2>📋 Test Overview</h2>
                <p className="overview-description">
                  Take this comprehensive test to determine your English proficiency level and get personalized course recommendations.
                </p>
              </div>
              
              <div className="overview-grid">
                <div className="overview-item">
                  <FaClock className="overview-icon" />
                  <div className="overview-details">
                    <h3>Duration</h3>
                    <p>30 minutes</p>
                  </div>
                </div>
                
                <div className="overview-item">
                  <FaCheckCircle className="overview-icon" />
                  <div className="overview-details">
                    <h3>Questions</h3>
                    <p>{questions.length} questions</p>
                  </div>
                </div>
                
                <div className="overview-item">
                  <FaGraduationCap className="overview-icon" />
                  <div className="overview-details">
                    <h3>Topics</h3>
                    <p>Grammar, Vocabulary, Reading</p>
                  </div>
                </div>
                
                <div className="overview-item">
                  <FaTrophy className="overview-icon" />
                  <div className="overview-details">
                    <h3>Levels</h3>
                    <p>Beginner to Proficiency</p>
                  </div>
                </div>
              </div>

              <div className="overview-footer">
                <FaLightbulb className="tip-icon" />
                <p>
                  <strong>Pro Tip:</strong> Read each question carefully and take your time. 
                  You can navigate back to review your answers before submitting.
                </p>
              </div>
            </div>
          </div>

          <button className="start-test-btn" onClick={handleStartTest}>
            Start Test <FaArrowRight />
          </button>
        </div>
      </div>
    );
  }

  // Test Section
  if (currentSection === 'test') {
    return (
      <div className="placement-test-page">
        <div className="test-container">
          {/* Header */}
          <div className="test-header">
            <div className="test-progress-info">
              <span className="question-counter">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            <div className="test-timer">
              <FaClock />
              <span className={timeLeft < 300 ? 'timer-warning' : ''}>{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Question */}
          <div className="question-container">
            <div className="question-header">
              <span className={`question-type ${currentQuestion.type}`}>
                {currentQuestion.type.toUpperCase()}
              </span>
            </div>

            <h2 className="question-text">{currentQuestion.question}</h2>

            <div className="options-grid">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className={`option-btn ${
                    answers[currentQuestion.id] === option ? 'selected' : ''
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{option}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="test-navigation">
            <button
              className="nav-btn"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <FaArrowLeft /> Previous
            </button>

            <div className="answered-indicator">
              {answeredCount} / {questions.length} answered
            </div>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                className="submit-btn"
                onClick={() => setShowConfirmSubmit(true)}
              >
                Submit Test <FaCheckCircle />
              </button>
            ) : (
              <button className="nav-btn primary" onClick={handleNext}>
                Next <FaArrowRight />
              </button>
            )}
          </div>

          {/* Question Map */}
          <div className="question-map">
            <h3>Question Navigator</h3>
            <div className="question-dots">
              {questions.map((q, index) => (
                <button
                  key={q.id}
                  className={`question-dot ${
                    index === currentQuestionIndex ? 'current' : ''
                  } ${answers[q.id] ? 'answered' : ''}`}
                  onClick={() => setCurrentQuestionIndex(index)}
                  title={`Question ${index + 1}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Confirm Submit Modal */}
        {showConfirmSubmit && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Submit Test?</h2>
              <p>
                You have answered <strong>{answeredCount}</strong> out of{' '}
                <strong>{questions.length}</strong> questions.
              </p>
              {answeredCount < questions.length && (
                <p className="warning-text">
                  ⚠️ You have {questions.length - answeredCount} unanswered question(s).
                  Unanswered questions will be marked as incorrect.
                </p>
              )}
              <p>Are you sure you want to submit your test?</p>
              <div className="modal-actions">
                <button
                  className="modal-btn cancel"
                  onClick={() => setShowConfirmSubmit(false)}
                >
                  Review Answers
                </button>
                <button className="modal-btn confirm" onClick={handleSubmitTest}>
                  Yes, Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Result Section
  if (currentSection === 'result' && testResult) {
    return (
      <div className="placement-test-page">
        <div className="result-container">
          <div className="result-header">
            <FaTrophy className="trophy-icon" />
            <h1>Test Complete!</h1>
            <p className="result-subtitle">Here are your results</p>
          </div>

          <div className="result-score-card">
            <div className="score-circle">
              <svg viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="20"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="20"
                  strokeDasharray={`${testResult.percentage * 5.65} 565`}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                />
              </svg>
              <div className="score-text">
                <span className="score-number">{Math.round(testResult.percentage)}%</span>
                <span className="score-label">Score</span>
              </div>
            </div>
          </div>

          <div className="result-details">
            <div className="result-card">
              <h3>
                <FaCheckCircle className="card-icon success" />
                Your Strengths
              </h3>
              <ul>
                {testResult.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>

            <div className="result-card">
              <h3>
                <FaLightbulb className="card-icon warning" />
                Areas to Improve
              </h3>
              <ul>
                {testResult.weaknesses.map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                ))}
              </ul>
            </div>

            <div className="result-card full-width">
              <h3>
                <FaGraduationCap className="card-icon primary" />
                Recommended Next Steps
              </h3>
              <ul>
                {testResult.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="result-actions">
            <button
              className="result-btn secondary"
              onClick={() => navigate('/profile')}
            >
              View My Profile
            </button>
            <button
              className="result-btn primary"
              onClick={() => navigate('/')}
            >
              Start Learning <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PlacementTestPage;
