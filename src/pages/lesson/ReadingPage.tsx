import React, { useMemo, useState } from 'react';
import '@/styles/lesson/ReadingPage.css'
import { FaBookOpen, FaClock, FaMinus, FaPlus, FaRedo, FaStar, FaCheckCircle } from 'react-icons/fa';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

type Level = 'Beginner' | 'Intermediate' | 'Advanced';

interface ReadingPassage {
  id: number;
  title: string;
  level: Level;
  estimatedMinutes: number;
  topic: string;
  thumbnail: string; // emoji or small icon
  text: string;
  questions: Question[];
}

const ReadingPage: React.FC = () => {
  const [selectedPassage, setSelectedPassage] = useState<ReadingPassage | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<'All' | Level>('All');
  const [fontScale, setFontScale] = useState(1); // 0.9 ~ 1.4
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);

  const passages: ReadingPassage[] = [
    {
      id: 1,
      title: 'A Morning Routine',
      level: 'Beginner',
      estimatedMinutes: 3,
      topic: 'Daily Life',
      thumbnail: "https://i.pinimg.com/1200x/67/2a/04/672a04cf6ce8229352b269bf1774cd0d.jpg",
      text:
        `Every morning, Emma wakes up at 6:30. She makes her bed and brushes her teeth. After that, she prepares a simple breakfast: toast with jam and a cup of tea. At 7:15, she leaves her apartment and walks to the bus stop. The bus ride to work takes about twenty minutes. Emma enjoys listening to music or reading a short article on her phone during the trip. She arrives at the office at 7:45 and greets her coworkers with a smile.`,
      questions: [
        {
          id: 1,
          text: 'What time does Emma wake up?',
          options: ['6:00', '6:30', '7:00', '7:30'],
          correctAnswer: 1,
        },
        {
          id: 2,
          text: 'How long is the bus ride to work?',
          options: ['10 minutes', '15 minutes', '20 minutes', '30 minutes'],
          correctAnswer: 2,
        },
        {
          id: 3,
          text: 'What does Emma usually do on the bus?',
          options: ['Sleeps', 'Talks on the phone', 'Listens to music or reads', 'Eats breakfast'],
          correctAnswer: 2,
        },
      ],
    },
    {
      id: 2,
      title: 'City Parks and Well-being',
      level: 'Intermediate',
      estimatedMinutes: 5,
      topic: 'Health',
      thumbnail: "https://i.pinimg.com/1200x/67/2a/04/672a04cf6ce8229352b269bf1774cd0d.jpg",
      text:
        `City parks play an essential role in improving public health and community well-being. Green spaces encourage physical activity by providing safe, pleasant areas for walking, running, and cycling. They also reduce stress and anxiety by offering a natural escape from noisy, crowded streets. Researchers have found that people who regularly visit parks tend to report higher levels of happiness and stronger social connections. To maximize these benefits, cities should invest in maintaining clean, accessible parks with diverse facilities for all age groups.`,
      questions: [
        {
          id: 1,
          text: 'What is one benefit of city parks mentioned in the passage?',
          options: ['They increase traffic', 'They reduce stress', 'They raise noise levels', 'They limit social connections'],
          correctAnswer: 1,
        },
        {
          id: 2,
          text: 'According to researchers, regular park visitors often:',
          options: ['Feel lonelier', 'Report higher happiness', 'Avoid physical activity', 'Spend less time outdoors'],
          correctAnswer: 1,
        },
        {
          id: 3,
          text: 'What should cities do to maximize benefits?',
          options: ['Ban cycling', 'Reduce green spaces', 'Invest in clean, accessible parks', 'Close parks at noon'],
          correctAnswer: 2,
        },
      ],
    },
    {
      id: 3,
      title: 'The Future of Remote Work',
      level: 'Advanced',
      estimatedMinutes: 7,
      topic: 'Technology',
      thumbnail: "https://i.pinimg.com/1200x/67/2a/04/672a04cf6ce8229352b269bf1774cd0d.jpg",
      text:
        `Remote work has evolved from a rare perk to a mainstream practice across many industries. While it offers flexibility and access to global talent, it also introduces challenges related to collaboration, culture, and performance measurement. Organizations are experimenting with hybrid models, combining office days for strategic collaboration with at-home days for focused individual tasks. In the long term, companies that invest in clear communication norms, asynchronous workflows, and equitable meeting practices are more likely to succeed. Moreover, cities may reimagine infrastructure to support distributed workforces, including better neighborhood work hubs and upgraded home connectivity.`,
      questions: [
        {
          id: 1,
          text: 'What is a key challenge of remote work?',
          options: ['Finding global talent', 'Collaboration and culture', 'Office rent costs', 'Hardware upgrades'],
          correctAnswer: 1,
        },
        {
          id: 2,
          text: 'What approach are many organizations trying?',
          options: ['Full-time office', 'Full-time remote only', 'Hybrid models', 'No meetings'],
          correctAnswer: 2,
        },
        {
          id: 3,
          text: 'Which investment can improve long-term success?',
          options: ['Longer daily meetings', 'Asynchronous workflows', 'Smaller teams only', 'No communication rules'],
          correctAnswer: 1,
        },
      ],
    },
  ];

  const filteredPassages = useMemo(() => {
    return selectedLevel === 'All'
      ? passages
      : passages.filter((p) => p.level === selectedLevel);
  }, [passages, selectedLevel]);

  const wordCount = (text: string) => text.trim().split(/\s+/).length;

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    if (!showResults) {
      setUserAnswers({ ...userAnswers, [questionId]: answerIndex });
    }
  };

  const handleSubmit = () => setShowResults(true);

  const resetExercise = () => {
    setUserAnswers({});
    setShowResults(false);
  };

  const calculateScore = () => {
    if (!selectedPassage) return 0;
    let correct = 0;
    selectedPassage.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) correct++;
    });
    return (correct / selectedPassage.questions.length) * 100;
  };

  return (
    <div className="reading-page">
      <div className="reading-hero">
        <div className="hero-content">
          <FaBookOpen className="hero-icon" />
          <h1>Luyện Đọc Tiếng Anh</h1>
          <p>Nâng cao kỹ năng đọc hiểu với các đoạn văn theo chủ đề và câu hỏi kiểm tra</p>
        </div>
      </div>

      <div className="reading-container">
        {!selectedPassage ? (
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

            <div className="passages-grid">
              {filteredPassages.map((p) => (
                <div
                  key={p.id}
                  className="passage-card"
                  onClick={() => {
                    setSelectedPassage(p);
                    resetExercise();
                  }}
                >
                  <div className="passage-thumbnail">
                    {p.thumbnail.startsWith('http') ? 
                      <img className="thumbnail-image" src={p.thumbnail} alt={p.title} /> : 
                      <span className="thumbnail-emoji">{p.thumbnail}</span>
                    }
                    <span className={`level-badge ${p.level.toLowerCase()}`}>{p.level}</span>
                  </div>
                  <div className="passage-info">
                    <h3>{p.title}</h3>
                    <div className="passage-meta">
                      <span className="topic-tag">{p.topic}</span>
                      <span className="duration">
                        <FaClock /> {p.estimatedMinutes} phút
                      </span>
                    </div>
                    <button className="start-btn">Bắt đầu</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="reading-player">
            <button
              className="back-btn"
              onClick={() => {
                setSelectedPassage(null);
                resetExercise();
              }}
            >
              ← Quay lại
            </button>

            <div className="player-header">
              <h2>{selectedPassage.title}</h2>
              <span className={`level-badge ${selectedPassage.level.toLowerCase()}`}>
                {selectedPassage.level}
              </span>
            </div>

            <div className="reading-controls">
              <div className="stat">
                Từ: {wordCount(selectedPassage.text)}
              </div>
              <div className="stat">
                <FaClock /> ~{selectedPassage.estimatedMinutes} phút
              </div>
              <div className="font-controls">
                <button
                  className="control-btn"
                  onClick={() => setFontScale((s) => Math.max(0.9, parseFloat((s - 0.1).toFixed(2))))}
                >
                  <FaMinus />
                </button>
                <span className="font-size-label">{Math.round(fontScale * 100)}%</span>
                <button
                  className="control-btn"
                  onClick={() => setFontScale((s) => Math.min(1.4, parseFloat((s + 0.1).toFixed(2))))}
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            <div className="passage-content" style={{ fontSize: `${fontScale}rem` }}>
              <p>{selectedPassage.text}</p>
            </div>

            <div className="questions-section">
              <h3>Câu hỏi</h3>
              {selectedPassage.questions.map((q, idx) => (
                <div key={q.id} className="question-card">
                  <p className="question-text">
                    <strong>Câu {idx + 1}:</strong> {q.text}
                  </p>
                  <div className="options-list">
                    {q.options.map((option, oIdx) => (
                      <label
                        key={oIdx}
                        className={`option-label ${
                          userAnswers[q.id] === oIdx ? 'selected' : ''
                        } ${
                          showResults && oIdx === q.correctAnswer
                            ? 'correct'
                            : showResults && userAnswers[q.id] === oIdx
                            ? 'incorrect'
                            : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          checked={userAnswers[q.id] === oIdx}
                          onChange={() => handleAnswerSelect(q.id, oIdx)}
                          disabled={showResults}
                        />
                        <span className="option-text">{option}</span>
                        {showResults && oIdx === q.correctAnswer && (
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
                disabled={
                  !selectedPassage ||
                  Object.keys(userAnswers).length !== selectedPassage.questions.length
                }
              >
                Nộp bài
              </button>
            ) : (
              <div className="results-section">
                <div className="score-display">
                  <h3>Kết quả của bạn</h3>
                  <div className="score">{calculateScore().toFixed(0)}%</div>
                  <p>
                    Bạn đã trả lời đúng{' '}
                    {selectedPassage.questions.filter(
                      (q) => userAnswers[q.id] === q.correctAnswer
                    ).length}
                    /{selectedPassage.questions.length} câu
                  </p>
                  <div className="score-stars">
                    {[1, 2, 3].map((star) => (
                      <FaStar
                        key={star}
                        className={calculateScore() >= star * 33.33 ? 'star-filled' : 'star-empty'}
                      />
                    ))}
                  </div>
                </div>
                <button className="retry-btn" onClick={resetExercise}>
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

export default ReadingPage;
