import React, { useState, useRef } from 'react';
import '@/styles/lesson/ListeningPage.css';
import { FaHeadphones, FaPlay, FaPause, FaRedo, FaCheckCircle, FaClock, FaVolumeUp, FaStar } from 'react-icons/fa';
import { MdSpeed } from 'react-icons/md';
import { BiTrophy } from 'react-icons/bi';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

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
}

const ListeningPage: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<ListeningExercise | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const exercises: ListeningExercise[] = [
    {
      id: 1,
      title: "Giới thiệu bản thân",
      level: 'Beginner',
      duration: '2:30',
      audioUrl: '/audio/introduction.mp3',
      topic: 'Daily Life',
      thumbnail: "https://i.pinimg.com/1200x/67/2a/04/672a04cf6ce8229352b269bf1774cd0d.jpg",
      transcript: `Hello, my name is Sarah. I'm 25 years old and I live in New York. I work as a teacher at a local school. In my free time, I like reading books and playing tennis. I have a small dog named Max. He's very friendly and loves to play in the park.`,
      questions: [
        {
          id: 1,
          text: "What is Sarah's job?",
          options: ['Doctor', 'Teacher', 'Engineer', 'Chef'],
          correctAnswer: 1
        },
        {
          id: 2,
          text: "What is the name of her dog?",
          options: ['Max', 'Rex', 'Buddy', 'Charlie'],
          correctAnswer: 0
        },
        {
          id: 3,
          text: "Where does Sarah live?",
          options: ['London', 'Paris', 'New York', 'Tokyo'],
          correctAnswer: 2
        }
      ]
    },
    {
      id: 2,
      title: "Đặt món ăn tại nhà hàng",
      level: 'Beginner',
      duration: '3:15',
      audioUrl: '/audio/restaurant.mp3',
      topic: 'Food & Dining',
      thumbnail: "https://i.pinimg.com/1200x/67/2a/04/672a04cf6ce8229352b269bf1774cd0d.jpg",
      transcript: `Waiter: Good evening! Welcome to our restaurant. Are you ready to order?\nCustomer: Yes, I'd like to have the grilled chicken with vegetables, please.\nWaiter: Excellent choice! Would you like anything to drink?\nCustomer: I'll have a glass of orange juice, please.\nWaiter: Perfect. Your order will be ready in about 15 minutes.`,
      questions: [
        {
          id: 1,
          text: "What did the customer order?",
          options: ['Grilled fish', 'Grilled chicken', 'Beef steak', 'Pasta'],
          correctAnswer: 1
        },
        {
          id: 2,
          text: "What drink did the customer choose?",
          options: ['Water', 'Coffee', 'Orange juice', 'Tea'],
          correctAnswer: 2
        },
        {
          id: 3,
          text: "How long will the food take?",
          options: ['10 minutes', '15 minutes', '20 minutes', '30 minutes'],
          correctAnswer: 1
        }
      ]
    },
    {
      id: 3,
      title: "Cuộc trò chuyện tại sân bay",
      level: 'Intermediate',
      duration: '4:20',
      audioUrl: '/audio/airport.mp3',
      topic: 'Travel',
      thumbnail: "https://i.pinimg.com/1200x/67/2a/04/672a04cf6ce8229352b269bf1774cd0d.jpg",
      transcript: `Officer: Good morning. May I see your passport, please?\nTraveler: Of course, here it is.\nOfficer: Thank you. What's the purpose of your visit?\nTraveler: I'm here for a business conference.\nOfficer: How long will you be staying?\nTraveler: About five days.\nOfficer: Where will you be staying?\nTraveler: At the Grand Hotel downtown.\nOfficer: Alright, everything looks good. Enjoy your stay!`,
      questions: [
        {
          id: 1,
          text: "Why is the traveler visiting?",
          options: ['Vacation', 'Business conference', 'Visiting family', 'Study'],
          correctAnswer: 1
        },
        {
          id: 2,
          text: "How long will the traveler stay?",
          options: ['Three days', 'Five days', 'One week', 'Two weeks'],
          correctAnswer: 1
        },
        {
          id: 3,
          text: "Where will the traveler stay?",
          options: ['Friends house', 'Hostel', 'Grand Hotel', 'Apartment'],
          correctAnswer: 2
        }
      ]
    },
    {
      id: 4,
      title: "Phỏng vấn xin việc",
      level: 'Intermediate',
      duration: '5:00',
      audioUrl: '/audio/interview.mp3',
      topic: 'Business',
      thumbnail: "https://i.pinimg.com/1200x/67/2a/04/672a04cf6ce8229352b269bf1774cd0d.jpg",
      transcript: `Interviewer: Thank you for coming in today. Can you tell me about your previous work experience?\nCandidate: Certainly. I worked at Tech Solutions for three years as a software developer. I was responsible for developing mobile applications and working with a team of five developers.\nInterviewer: That's impressive. What made you interested in this position?\nCandidate: I'm looking for new challenges and your company's innovative approach to technology really appeals to me.\nInterviewer: What would you say is your greatest strength?\nCandidate: I believe my ability to work well under pressure and my strong problem-solving skills are my greatest strengths.`,
      questions: [
        {
          id: 1,
          text: "How long did the candidate work at Tech Solutions?",
          options: ['Two years', 'Three years', 'Four years', 'Five years'],
          correctAnswer: 1
        },
        {
          id: 2,
          text: "What was the candidate's role at Tech Solutions?",
          options: ['Project Manager', 'Software Developer', 'Designer', 'Sales Representative'],
          correctAnswer: 1
        },
        {
          id: 3,
          text: "What does the candidate consider their greatest strength?",
          options: ['Leadership', 'Creativity', 'Working under pressure', 'Public speaking'],
          correctAnswer: 2
        }
      ]
    },
    {
      id: 5,
      title: "Bài giảng về biến đổi khí hậu",
      level: 'Advanced',
      duration: '6:30',
      audioUrl: '/audio/climate.mp3',
      topic: 'Academic',
      thumbnail: "https://i.pinimg.com/1200x/67/2a/04/672a04cf6ce8229352b269bf1774cd0d.jpg",
      transcript: `Today's lecture focuses on the impacts of climate change on global ecosystems. Scientific evidence shows that average temperatures have risen by approximately 1.1 degrees Celsius since the pre-industrial era. This warming has led to significant changes in weather patterns, including more frequent extreme weather events, rising sea levels, and shifts in precipitation patterns. The melting of polar ice caps is accelerating at an alarming rate, contributing to sea-level rise that threatens coastal communities worldwide. Additionally, many species are struggling to adapt to these rapid changes, leading to biodiversity loss. It's crucial that we take immediate action to reduce greenhouse gas emissions and implement sustainable practices to mitigate these effects.`,
      questions: [
        {
          id: 1,
          text: "By how much have average temperatures risen since the pre-industrial era?",
          options: ['0.5°C', '1.1°C', '1.5°C', '2.0°C'],
          correctAnswer: 1
        },
        {
          id: 2,
          text: "What is mentioned as a consequence of polar ice cap melting?",
          options: ['Stronger winds', 'Sea-level rise', 'Increased rainfall', 'Colder winters'],
          correctAnswer: 1
        },
        {
          id: 3,
          text: "What does the lecture emphasize we need to do?",
          options: ['Build more cities', 'Reduce greenhouse gas emissions', 'Increase population', 'Develop new technologies only'],
          correctAnswer: 1
        }
      ]
    },
    {
      id: 6,
      title: "Thảo luận về công nghệ AI",
      level: 'Advanced',
      duration: '7:00',
      audioUrl: '/audio/ai-discussion.mp3',
      topic: 'Technology',
      thumbnail: "https://i.pinimg.com/1200x/67/2a/04/672a04cf6ce8229352b269bf1774cd0d.jpg",
      transcript: `In recent years, artificial intelligence has made remarkable progress, transforming various industries from healthcare to finance. Machine learning algorithms can now analyze vast amounts of data to identify patterns that humans might miss. However, this technological advancement also raises important ethical questions. Privacy concerns are paramount as AI systems often require access to personal data. There's also the question of bias in AI algorithms, which can perpetuate existing societal inequalities if not carefully addressed. Furthermore, the potential impact on employment is significant, as automation could displace workers in certain sectors. Despite these challenges, AI also offers tremendous opportunities for innovation and solving complex problems. The key is to develop and implement AI responsibly, with appropriate regulations and ethical guidelines in place.`,
      questions: [
        {
          id: 1,
          text: "What is mentioned as a major concern regarding AI?",
          options: ['Cost', 'Privacy', 'Speed', 'Size'],
          correctAnswer: 1
        },
        {
          id: 2,
          text: "What can AI algorithms analyze?",
          options: ['Only numbers', 'Vast amounts of data', 'Simple patterns', 'Text only'],
          correctAnswer: 1
        },
        {
          id: 3,
          text: "What does the speaker emphasize about AI development?",
          options: ['It should be fast', 'It should be cheap', 'It should be responsible', 'It should be unlimited'],
          correctAnswer: 2
        }
      ]
    }
  ];

  const filteredExercises = selectedLevel === 'All' 
    ? exercises 
    : exercises.filter(ex => ex.level === selectedLevel);

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

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!selectedExercise) return 0;
    let correct = 0;
    selectedExercise.questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return (correct / selectedExercise.questions.length) * 100;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const resetExercise = () => {
    setUserAnswers({});
    setShowResults(false);
    setCurrentTime(0);
    setShowTranscript(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
    setIsPlaying(false);
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
            </div>

            <div className="exercises-grid">
              {filteredExercises.map(exercise => (
                <div 
                  key={exercise.id} 
                  className="exercise-card"
                  onClick={() => {
                    setSelectedExercise(exercise);
                    resetExercise();
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
                      <span className="topic-tag">{exercise.topic}</span>
                      <span className="duration">
                        <FaClock /> {exercise.duration}
                      </span>
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
              onClick={() => {
                setSelectedExercise(null);
                resetExercise();
              }}
            >
              ← Quay lại
            </button>

            <div className="player-header">
              <h2>{selectedExercise.title}</h2>
              <span className={`level-badge ${selectedExercise.level.toLowerCase()}`}>
                {selectedExercise.level}
              </span>
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
                    Bạn đã trả lời đúng {Object.values(userAnswers).filter((ans, idx) => ans === selectedExercise.questions[idx].correctAnswer).length}/{selectedExercise.questions.length} câu
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
                  onClick={resetExercise}
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
