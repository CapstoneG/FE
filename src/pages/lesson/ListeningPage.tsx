import React, { useState, useRef, useEffect } from 'react';
import '@/styles/lesson/ListeningPage.css';
import { FaHeadphones, FaPlay, FaPause, FaRedo, FaCheckCircle, FaClock, FaVolumeUp, FaStar, FaMicrophone, FaComments, FaSpellCheck } from 'react-icons/fa';
import { MdSpeed, MdOutlineQuiz } from 'react-icons/md';
import { BiTrophy, BiListOl } from 'react-icons/bi';
import { BsFileText } from 'react-icons/bs';
import { useStudyEvents } from '@/hooks';

type ListeningType = 'pronunciation' | 'word' | 'sentence' | 'conversation' | 'dictation' | 'quiz';
type AccentType = 'American' | 'British' | 'Australian' | 'Canadian';
type QuestionType = 'mcq' | 'fill-blank' | 'order' | 'dictation';

interface BaseQuestion {
  id: number;
  type: QuestionType;
  text: string;
}

interface MCQQuestion extends BaseQuestion {
  type: 'mcq';
  options: string[];
  correctAnswer: number;
}

interface FillBlankQuestion extends BaseQuestion {
  type: 'fill-blank';
  sentence: string; // sentence with ___ for blanks
  correctAnswers: string[]; // array of correct answers for each blank
}

interface OrderQuestion extends BaseQuestion {
  type: 'order';
  sentences: string[]; // shuffled sentences
  correctOrder: number[]; // indices of correct order
}

interface DictationQuestion extends BaseQuestion {
  type: 'dictation';
  correctText: string; // the correct text to type
}

type Question = MCQQuestion | FillBlankQuestion | OrderQuestion | DictationQuestion;

interface ListeningExercise {
  id: number;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  audioUrl: string;
  transcript: string;
  questions: Question[];
  topic: string;
  thumbnail: string;
  listeningType: ListeningType;
  accent: AccentType;
}

const ListeningPage: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<ListeningExercise | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: any }>({});
  const [showResults, setShowResults] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Track study session for listening exercise (only when exercise is selected)
  const { startSession, endSession } = useStudyEvents({
    lessonId: selectedExercise?.id || 0,
    activityType: 'SKILL',
    skill: 'LISTENING', 
    autoStart: false,  // Manual start when exercise is selected
    autoEnd: false,    // Manual end when user goes back
    onStatsUpdate: (event) => {
      console.log('[Listening] Stats updated:', event);
    },
  });

  // Start session when exercise is selected
  useEffect(() => {
    if (selectedExercise) {
      startSession();
    }
    
    // Cleanup: end session when component unmounts or exercise changes
    return () => {
      if (selectedExercise) {
        endSession();
      }
    };
  }, [selectedExercise?.id]);

  const exercises: ListeningExercise[] = [
    {
      id: 1,
      title: "Giới thiệu bản thân",
      level: 'Beginner',
      duration: '2:30',
      audioUrl: '/audio/introduction.mp3',
      topic: 'Daily Life',
      thumbnail: "https://i.pinimg.com/1200x/67/2a/04/672a04cf6ce8229352b269bf1774cd0d.jpg",
      listeningType: 'conversation',
      accent: 'American',
      transcript: `Hello, my name is Sarah. I'm 25 years old and I live in New York. I work as a teacher at a local school. In my free time, I like reading books and playing tennis. I have a small dog named Max. He's very friendly and loves to play in the park.`,
      questions: [
        {
          id: 1,
          type: 'mcq',
          text: "What is Sarah's job?",
          options: ['Doctor', 'Teacher', 'Engineer', 'Chef'],
          correctAnswer: 1
        },
        {
          id: 2,
          type: 'fill-blank',
          text: "Fill in the blanks from the audio",
          sentence: "Hello, my name is Sarah. I'm ___ years old and I work as a ___ at a local school.",
          correctAnswers: ['25', 'teacher']
        },
        {
          id: 3,
          type: 'mcq',
          text: "Where does Sarah live?",
          options: ['London', 'Paris', 'New York', 'Tokyo'],
          correctAnswer: 2
        }
      ]
    },
    {
      id: 2,
      title: "Phát âm từ vựng cơ bản",
      level: 'Beginner',
      duration: '2:00',
      audioUrl: '/audio/pronunciation.mp3',
      topic: 'Pronunciation',
      thumbnail: "https://i.pinimg.com/1200x/67/2a/04/672a04cf6ce8229352b269bf1774cd0d.jpg",
      listeningType: 'pronunciation',
      accent: 'British',
      transcript: `Listen and repeat: Apple, Banana, Orange, Grape, Watermelon. Pay attention to the vowel sounds and stress patterns.`,
      questions: [
        {
          id: 1,
          type: 'mcq',
          text: "Which word has the stress on the second syllable?",
          options: ['Apple', 'Banana', 'Orange', 'Grape'],
          correctAnswer: 1
        },
        {
          id: 2,
          type: 'dictation',
          text: "Listen and type what you hear",
          correctText: "apple banana orange"
        }
      ]
    },
    {
      id: 3,
      title: "Luyện nghe từ đơn",
      level: 'Beginner',
      duration: '3:00',
      audioUrl: '/audio/words.mp3',
      topic: 'Vocabulary',
      thumbnail: "https://i.pinimg.com/1200x/67/2a/04/672a04cf6ce8229352b269bf1774cd0d.jpg",
      listeningType: 'word',
      accent: 'American',
      transcript: `Listen carefully to these words: Beautiful, Comfortable, Interesting, Difficult, Important`,
      questions: [
        {
          id: 1,
          type: 'mcq',
          text: "Which word did you hear first?",
          options: ['Beautiful', 'Comfortable', 'Interesting', 'Difficult'],
          correctAnswer: 0
        },
        {
          id: 2,
          type: 'fill-blank',
          text: "Complete the word you heard",
          sentence: "The lesson is very ___ and ___.",
          correctAnswers: ['interesting', 'important']
        }
      ]
    },
    {
      id: 4,
      title: "Sắp xếp câu theo thứ tự",
      level: 'Intermediate',
      duration: '3:30',
      audioUrl: '/audio/sentence-order.mp3',
      topic: 'Grammar',
      thumbnail: "https://i.pinimg.com/1200x/67/2a/04/672a04cf6ce8229352b269bf1774cd0d.jpg",
      listeningType: 'sentence',
      accent: 'British',
      transcript: `First, I wake up at 7 AM. Then, I have breakfast with my family. After that, I go to work by bus. Finally, I arrive at the office at 9 AM.`,
      questions: [
        {
          id: 1,
          type: 'order',
          text: "Arrange the sentences in the correct order you heard",
          sentences: [
            'I arrive at the office at 9 AM',
            'I wake up at 7 AM',
            'I have breakfast with my family',
            'I go to work by bus'
          ],
          correctOrder: [1, 2, 3, 0]
        },
        {
          id: 2,
          type: 'mcq',
          text: "What time does the person wake up?",
          options: ['6 AM', '7 AM', '8 AM', '9 AM'],
          correctAnswer: 1
        }
      ]
    },
    {
      id: 5,
      title: "Bài chính tả nâng cao",
      level: 'Advanced',
      duration: '4:00',
      audioUrl: '/audio/dictation.mp3',
      topic: 'Dictation',
      thumbnail: "https://i.pinimg.com/1200x/67/2a/04/672a04cf6ce8229352b269bf1774cd0d.jpg",
      listeningType: 'dictation',
      accent: 'American',
      transcript: `The rapid advancement of technology has transformed the way we communicate and interact with each other in modern society.`,
      questions: [
        {
          id: 1,
          type: 'dictation',
          text: "Listen and type exactly what you hear",
          correctText: "The rapid advancement of technology has transformed the way we communicate"
        },
        {
          id: 2,
          type: 'fill-blank',
          text: "Complete the sentence",
          sentence: "The rapid ___ of technology has ___ the way we communicate.",
          correctAnswers: ['advancement', 'transformed']
        }
      ]
    },
    {
      id: 6,
      title: "Quiz nghe hiểu tổng hợp",
      level: 'Advanced',
      duration: '5:00',
      audioUrl: '/audio/quiz.mp3',
      topic: 'Mixed Skills',
      thumbnail: "https://i.pinimg.com/1200x/67/2a/04/672a04cf6ce8229352b269bf1774cd0d.jpg",
      listeningType: 'quiz',
      accent: 'Australian',
      transcript: `In recent years, artificial intelligence has made remarkable progress, transforming various industries from healthcare to finance. Machine learning algorithms can now analyze vast amounts of data to identify patterns that humans might miss.`,
      questions: [
        {
          id: 1,
          type: 'mcq',
          text: "What has made remarkable progress?",
          options: ['Biology', 'Artificial Intelligence', 'Chemistry', 'Physics'],
          correctAnswer: 1
        },
        {
          id: 2,
          type: 'fill-blank',
          text: "Fill in the missing words",
          sentence: "Machine learning algorithms can analyze ___ amounts of data to identify ___.",
          correctAnswers: ['vast', 'patterns']
        },
        {
          id: 3,
          type: 'order',
          text: "Order these industries mentioned",
          sentences: ['Finance', 'Healthcare', 'Education', 'Technology'],
          correctOrder: [1, 0, 2, 3]
        },
        {
          id: 4,
          type: 'dictation',
          text: "Type what you hear about AI",
          correctText: "artificial intelligence has made remarkable progress"
        }
      ]
    }
  ];

  const filteredExercises = exercises.filter(ex => {
    const levelMatch = selectedLevel === 'All' || ex.level === selectedLevel;
    const typeMatch = selectedType === 'All' || ex.listeningType === selectedType;
    return levelMatch && typeMatch;
  });

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleSpeedChange = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const handleReplay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    if (!showResults) {
      setUserAnswers({ ...userAnswers, [questionId]: answerIndex });
    }
  };

  const handleFillBlankAnswer = (questionId: number, blankIndex: number, value: string) => {
    if (!showResults) {
      const currentAnswers = userAnswers[questionId] || [];
      const newAnswers = [...currentAnswers];
      newAnswers[blankIndex] = value;
      setUserAnswers({ ...userAnswers, [questionId]: newAnswers });
    }
  };

  const handleDictationAnswer = (questionId: number, value: string) => {
    if (!showResults) {
      setUserAnswers({ ...userAnswers, [questionId]: value });
    }
  };

  const handleOrderAnswer = (questionId: number, order: number[]) => {
    if (!showResults) {
      setUserAnswers({ ...userAnswers, [questionId]: order });
    }
  };

  const handleSubmit = async () => {
    setShowResults(true);
    await endSession();
  };

  const calculateScore = () => {
    if (!selectedExercise) return 0;
    let correct = 0;
    selectedExercise.questions.forEach(q => {
      if (q.type === 'mcq') {
        if (userAnswers[q.id] === q.correctAnswer) {
          correct++;
        }
      } else if (q.type === 'fill-blank') {
        const userAns = userAnswers[q.id] || [];
        const allCorrect = q.correctAnswers.every((ans, idx) => 
          userAns[idx]?.toLowerCase().trim() === ans.toLowerCase().trim()
        );
        if (allCorrect) correct++;
      } else if (q.type === 'order') {
        const userOrder = userAnswers[q.id] || [];
        const isCorrect = JSON.stringify(userOrder) === JSON.stringify(q.correctOrder);
        if (isCorrect) correct++;
      } else if (q.type === 'dictation') {
        const userText = (userAnswers[q.id] || '').toLowerCase().trim();
        const correctText = q.correctText.toLowerCase().trim();
        // Allow some flexibility in dictation - check if 80% similar
        const similarity = calculateSimilarity(userText, correctText);
        if (similarity >= 0.8) correct++;
      }
    });
    return (correct / selectedExercise.questions.length) * 100;
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    const words1 = str1.split(/\s+/);
    const words2 = str2.split(/\s+/);
    const maxLen = Math.max(words1.length, words2.length);
    if (maxLen === 0) return 1;
    
    let matches = 0;
    words1.forEach(word => {
      if (words2.includes(word)) matches++;
    });
    
    return matches / maxLen;
  };

  const getListeningTypeIcon = (type: ListeningType) => {
    switch (type) {
      case 'pronunciation': return <FaMicrophone />;
      case 'word': return <FaSpellCheck />;
      case 'sentence': return <BsFileText />;
      case 'conversation': return <FaComments />;
      case 'dictation': return <BiListOl />;
      case 'quiz': return <MdOutlineQuiz />;
      default: return <FaHeadphones />;
    }
  };

  const getListeningTypeName = (type: ListeningType) => {
    const names = {
      'pronunciation': 'Phát âm',
      'word': 'Từ vựng',
      'sentence': 'Câu',
      'conversation': 'Hội thoại',
      'dictation': 'Chính tả',
      'quiz': 'Quiz tổng hợp'
    };
    return names[type];
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const resetExercise = async (shouldStartNewSession: boolean = true) => {
    setUserAnswers({});
    setShowResults(false);
    setCurrentTime(0);
    setShowTranscript(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
    setIsPlaying(false);
    
    if (shouldStartNewSession && selectedExercise) {
      await startSession();
    }
  };

  return (
    <div className="listening-page">
      <div className="listening-hero">
        <div className="hero-content">
          <FaHeadphones className="hero-icon" />
          <h1>Luyện Nghe Tiếng Anh</h1>
          <p>Cải thiện kỹ năng nghe của bạn với các bài tập đa dạng và thú vị</p>
        </div>
      </div>

      <div className="listening-container">
        {!selectedExercise ? (
          <>
            <div className="filter-section">
              <h2>Chọn mức độ</h2>
              <div className="level-filters">
                <button 
                  className={`filter-btn ${selectedLevel === 'All' ? 'active' : ''}`}
                  onClick={() => setSelectedLevel('All')}
                >
                  Tất cả
                </button>
                <button 
                  className={`filter-btn ${selectedLevel === 'Beginner' ? 'active' : ''}`}
                  onClick={() => setSelectedLevel('Beginner')}
                >
                  Beginner
                </button>
                <button 
                  className={`filter-btn ${selectedLevel === 'Intermediate' ? 'active' : ''}`}
                  onClick={() => setSelectedLevel('Intermediate')}
                >
                  Intermediate
                </button>
                <button 
                  className={`filter-btn ${selectedLevel === 'Advanced' ? 'active' : ''}`}
                  onClick={() => setSelectedLevel('Advanced')}
                >
                  Advanced
                </button>
              </div>

              <h2 style={{ marginTop: '2rem' }}>Chọn loại bài nghe</h2>
              <div className="level-filters">
                <button 
                  className={`filter-btn ${selectedType === 'All' ? 'active' : ''}`}
                  onClick={() => setSelectedType('All')}
                >
                  Tất cả
                </button>
                <button 
                  className={`filter-btn ${selectedType === 'pronunciation' ? 'active' : ''}`}
                  onClick={() => setSelectedType('pronunciation')}
                >
                  <FaMicrophone /> Phát âm
                </button>
                <button 
                  className={`filter-btn ${selectedType === 'word' ? 'active' : ''}`}
                  onClick={() => setSelectedType('word')}
                >
                  <FaSpellCheck /> Từ vựng
                </button>
                <button 
                  className={`filter-btn ${selectedType === 'sentence' ? 'active' : ''}`}
                  onClick={() => setSelectedType('sentence')}
                >
                  <BsFileText /> Câu
                </button>
                <button 
                  className={`filter-btn ${selectedType === 'conversation' ? 'active' : ''}`}
                  onClick={() => setSelectedType('conversation')}
                >
                  <FaComments /> Hội thoại
                </button>
                <button 
                  className={`filter-btn ${selectedType === 'dictation' ? 'active' : ''}`}
                  onClick={() => setSelectedType('dictation')}
                >
                  <BiListOl /> Chính tả
                </button>
                <button 
                  className={`filter-btn ${selectedType === 'quiz' ? 'active' : ''}`}
                  onClick={() => setSelectedType('quiz')}
                >
                  <MdOutlineQuiz /> Quiz
                </button>
              </div>
            </div>

            <div className="exercises-grid">
              {filteredExercises.map(exercise => (
                <div 
                  key={exercise.id} 
                  className="exercise-card"
                  onClick={() => {
                    setSelectedExercise(exercise);
                    resetExercise(false); // Don't start session here, useEffect will handle it
                  }}
                >
                  <div className="exercise-thumbnail">
                    {exercise.thumbnail.startsWith('http') ? 
                      <img className="thumbnail-image" src={exercise.thumbnail} alt={exercise.title} /> : 
                      <span className="thumbnail-emoji">{exercise.thumbnail}</span>
                    }
                    <span className={`level-badge ${exercise.level.toLowerCase()}`}>
                      {exercise.level}
                    </span>
                  </div>
                  <div className="exercise-info">
                    <h3>{exercise.title}</h3>
                    <div className="exercise-meta">
                      <span className="topic-tag">
                        {getListeningTypeIcon(exercise.listeningType)} {getListeningTypeName(exercise.listeningType)}
                      </span>
                      <span className="accent-tag">🗣️ {exercise.accent}</span>
                    </div>
                    <div className="exercise-meta">
                      <span className="duration">
                        <FaClock /> {exercise.duration}
                      </span>
                      <span className="topic-tag">{exercise.topic}</span>
                    </div>
                    <button className="start-btn">
                      <FaPlay /> Bắt đầu
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="exercise-player">
            <button 
              className="back-btn"
              onClick={async () => {
                await endSession(); // End study session before going back
                setSelectedExercise(null);
                resetExercise(false); // Just reset UI, no need to start session
              }}
            >
              ← Quay lại
            </button>

            <div className="player-header">
              <h2>{selectedExercise.title}</h2>
              <div className="header-badges">
                <span className={`level-badge ${selectedExercise.level.toLowerCase()}`}>
                  {selectedExercise.level}
                </span>
                <span className="type-badge">
                  {getListeningTypeIcon(selectedExercise.listeningType)} {getListeningTypeName(selectedExercise.listeningType)}
                </span>
                <span className="accent-badge">
                  🗣️ {selectedExercise.accent}
                </span>
              </div>
            </div>

            <div className="audio-player">
              <audio
                ref={audioRef}
                src={selectedExercise.audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
              />

              <div className="player-controls">
                <button className="control-btn replay" onClick={handleReplay}>
                  <FaRedo />
                </button>
                <button className="control-btn play-pause" onClick={handlePlayPause}>
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <button className="control-btn speed" onClick={handleSpeedChange}>
                  <MdSpeed /> {playbackSpeed}x
                </button>
              </div>

              <div className="progress-section">
                <span className="time">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  className="progress-bar"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                />
                <span className="time">{formatTime(duration)}</span>
              </div>
            </div>

            <div className="transcript-section">
              <button 
                className="transcript-toggle"
                onClick={() => setShowTranscript(!showTranscript)}
              >
                <FaVolumeUp /> {showTranscript ? 'Ẩn' : 'Hiện'} Transcript
              </button>
              {showTranscript && (
                <div className="transcript-content">
                  <p>{selectedExercise.transcript}</p>
                </div>
              )}
            </div>

            <div className="questions-section">
              <h3>Câu hỏi</h3>
              {selectedExercise.questions.map((question, qIndex) => (
                <div key={question.id} className="question-card">
                  <p className="question-text">
                    <strong>Câu {qIndex + 1}:</strong> {question.text}
                  </p>
                  
                  {question.type === 'mcq' && (
                    <div className="options-list">
                      {question.options.map((option, oIndex) => (
                        <label
                          key={oIndex}
                          className={`option-label ${
                            userAnswers[question.id] === oIndex ? 'selected' : ''
                          } ${
                            showResults && oIndex === question.correctAnswer
                              ? 'correct'
                              : showResults && userAnswers[question.id] === oIndex
                              ? 'incorrect'
                              : ''
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            checked={userAnswers[question.id] === oIndex}
                            onChange={() => handleAnswerSelect(question.id, oIndex)}
                            disabled={showResults}
                          />
                          <span className="option-text">{option}</span>
                          {showResults && oIndex === question.correctAnswer && (
                            <FaCheckCircle className="correct-icon" />
                          )}
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === 'fill-blank' && (
                    <div className="fill-blank-container">
                      <div className="sentence-display">
                        {question.sentence.split('___').map((part, idx, arr) => (
                          <React.Fragment key={idx}>
                            <span>{part}</span>
                            {idx < arr.length - 1 && (
                              <input
                                type="text"
                                className={`blank-input ${
                                  showResults 
                                    ? (userAnswers[question.id]?.[idx]?.toLowerCase().trim() === question.correctAnswers[idx].toLowerCase().trim() 
                                        ? 'correct' 
                                        : 'incorrect')
                                    : ''
                                }`}
                                value={userAnswers[question.id]?.[idx] || ''}
                                onChange={(e) => handleFillBlankAnswer(question.id, idx, e.target.value)}
                                disabled={showResults}
                                placeholder={`Blank ${idx + 1}`}
                              />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      {showResults && (
                        <div className="correct-answers">
                          <strong>Đáp án đúng:</strong> {question.correctAnswers.join(', ')}
                        </div>
                      )}
                    </div>
                  )}

                  {question.type === 'order' && (
                    <div className="order-container">
                      <div className="sentences-to-order">
                        {(userAnswers[question.id] || question.sentences.map((_, i) => i)).map((sentenceIdx: number, position: number) => (
                          <div 
                            key={position} 
                            className={`order-item ${
                              showResults 
                                ? (question.correctOrder[position] === sentenceIdx ? 'correct' : 'incorrect')
                                : ''
                            }`}
                          >
                            <span className="order-number">{position + 1}.</span>
                            <span className="order-text">{question.sentences[sentenceIdx]}</span>
                            {!showResults && (
                              <div className="order-controls">
                                {position > 0 && (
                                  <button 
                                    onClick={() => {
                                      const newOrder = [...(userAnswers[question.id] || question.sentences.map((_, i) => i))];
                                      [newOrder[position], newOrder[position - 1]] = [newOrder[position - 1], newOrder[position]];
                                      handleOrderAnswer(question.id, newOrder);
                                    }}
                                  >
                                    ↑
                                  </button>
                                )}
                                {position < question.sentences.length - 1 && (
                                  <button 
                                    onClick={() => {
                                      const newOrder = [...(userAnswers[question.id] || question.sentences.map((_, i) => i))];
                                      [newOrder[position], newOrder[position + 1]] = [newOrder[position + 1], newOrder[position]];
                                      handleOrderAnswer(question.id, newOrder);
                                    }}
                                  >
                                    ↓
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      {showResults && (
                        <div className="correct-order">
                          <strong>Thứ tự đúng:</strong>
                          {question.correctOrder.map((idx, pos) => (
                            <div key={pos}>{pos + 1}. {question.sentences[idx]}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {question.type === 'dictation' && (
                    <div className="dictation-container">
                      <textarea
                        className={`dictation-input ${
                          showResults 
                            ? (calculateSimilarity(
                                (userAnswers[question.id] || '').toLowerCase().trim(),
                                question.correctText.toLowerCase().trim()
                              ) >= 0.8 ? 'correct' : 'incorrect')
                            : ''
                        }`}
                        value={userAnswers[question.id] || ''}
                        onChange={(e) => handleDictationAnswer(question.id, e.target.value)}
                        disabled={showResults}
                        placeholder="Type what you hear..."
                        rows={3}
                      />
                      {showResults && (
                        <div className="correct-text">
                          <strong>Đáp án đúng:</strong>
                          <p>{question.correctText}</p>
                          <p className="similarity-score">
                            Độ chính xác: {(calculateSimilarity(
                              (userAnswers[question.id] || '').toLowerCase().trim(),
                              question.correctText.toLowerCase().trim()
                            ) * 100).toFixed(0)}%
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!showResults ? (
              <button 
                className="submit-btn"
                onClick={handleSubmit}
                disabled={Object.keys(userAnswers).length !== selectedExercise.questions.length}
              >
                Nộp bài
              </button>
            ) : (
              <div className="results-section">
                <div className="score-display">
                  <BiTrophy className="trophy-icon" />
                  <h3>Kết quả của bạn</h3>
                  <div className="score">
                    {calculateScore().toFixed(0)}%
                  </div>
                  <p>
                    Bạn đã trả lời đúng {Math.round(calculateScore() * selectedExercise.questions.length / 100)}/{selectedExercise.questions.length} câu
                  </p>
                  <div className="score-stars">
                    {[1, 2, 3].map(star => (
                      <FaStar
                        key={star}
                        className={calculateScore() >= star * 33.33 ? 'star-filled' : 'star-empty'}
                      />
                    ))}
                  </div>
                </div>
                <button 
                  className="retry-btn"
                  onClick={() => resetExercise(true)} // Start new session when retry
                >
                  <FaRedo /> Làm lại
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListeningPage;
