import React, { useState } from 'react';
import '@/styles/lesson/WritingPage.css';
import { FaPen, FaClock, FaRedo, FaCheckCircle, FaStar, FaLightbulb, FaBook } from 'react-icons/fa';
import { BiTrophy } from 'react-icons/bi';

interface WritingPrompt {
  id: number;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  topic: string;
  thumbnail: string;
  prompt: string;
  wordCountMin: number;
  wordCountMax: number;
  tips: string[];
  sampleAnswer?: string;
  rubric: {
    grammar: string;
    vocabulary: string;
    coherence: string;
    taskAchievement: string;
  };
}

const WritingPage: React.FC = () => {
  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt | null>(null);
  const [userText, setUserText] = useState('');
  const [showSample, setShowSample] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const writingPrompts: WritingPrompt[] = [
    {
      id: 1,
      title: "Viết về ngày của bạn",
      level: 'Beginner',
      duration: '15 phút',
      topic: 'Daily Life',
      thumbnail: "https://i.pinimg.com/1200x/67/2a/04/672a04cf6ce8229352b269bf1774cd0d.jpg",
      prompt: 'Viết một đoạn văn ngắn (50-80 từ) mô tả một ngày bình thường của bạn. Bạn thức dậy lúc mấy giờ? Bạn làm gì trong ngày? Bạn thích hoạt động nào nhất?',
      wordCountMin: 50,
      wordCountMax: 80,
      tips: [
        'Sử dụng thì hiện tại đơn (present simple) để mô tả thói quen',
        'Dùng các từ nối như: first, then, after that, finally',
        'Mô tả theo trình tự thời gian'
      ],
      sampleAnswer: `Every day, I wake up at 6:30 AM. First, I brush my teeth and take a shower. Then, I have breakfast with my family. After that, I go to school at 7:30 AM. I study different subjects like English, Math, and Science. At noon, I have lunch with my friends. In the afternoon, I come back home and do my homework. In the evening, I have dinner and watch TV. Finally, I go to bed at 10 PM. My favorite activity is playing with my friends during break time.`,
      rubric: {
        grammar: 'Sử dụng đúng thì hiện tại đơn, cấu trúc câu cơ bản',
        vocabulary: 'Từ vựng về hoạt động hàng ngày',
        coherence: 'Trình bày logic, có trình tự thời gian',
        taskAchievement: 'Đáp ứng đầy đủ yêu cầu, đủ số từ'
      }
    },
    {
      id: 2,
      title: "Mô tả món ăn yêu thích",
      level: 'Beginner',
      duration: '20 phút',
      topic: 'Food',
      thumbnail: "https://i.pinimg.com/1200x/67/2a/04/672a04cf6ce8229352b269bf1774cd0d.jpg",
      prompt: 'Viết về món ăn yêu thích của bạn (60-100 từ). Đó là món gì? Nó có vị như thế nào? Tại sao bạn thích nó? Bạn thường ăn nó khi nào?',
      wordCountMin: 60,
      wordCountMax: 100,
      tips: [
        'Sử dụng tính từ mô tả vị: delicious, sweet, spicy, salty',
        'Dùng cấu trúc "I like... because..."',
        'Mô tả cảm giác khi ăn món đó'
      ],
      sampleAnswer: `My favorite food is pho, a traditional Vietnamese noodle soup. It is delicious and healthy. Pho has soft rice noodles, beef or chicken, and fresh herbs. The broth is very flavorful and aromatic. I like pho because it is warm and comforting, especially on cold days. The combination of meat, noodles, and herbs creates a perfect taste. I usually eat pho for breakfast with my family on weekends. Sometimes, we go to a famous pho restaurant near our house. Eating pho makes me feel happy and satisfied.`,
      rubric: {
        grammar: 'Sử dụng tính từ, câu đơn và câu ghép',
        vocabulary: 'Từ vựng về đồ ăn và mô tả vị',
        coherence: 'Mô tả rõ ràng, có cảm xúc',
        taskAchievement: 'Trả lời đầy đủ các câu hỏi'
      }
    },
    {
      id: 3,
      title: "Viết email cho bạn",
      level: 'Intermediate',
      duration: '25 phút',
      topic: 'Communication',
      thumbnail: "https://i.pinimg.com/1200x/67/2a/04/672a04cf6ce8229352b269bf1774cd0d.jpg",
      prompt: 'Viết một email (120-150 từ) cho bạn của bạn về kế hoạch du lịch sắp tới. Giới thiệu về điểm đến, thời gian, hoạt động dự định và mời bạn cùng đi.',
      wordCountMin: 120,
      wordCountMax: 150,
      tips: [
        'Bắt đầu với lời chào: Dear [Name], Hi [Name]',
        'Chia thành đoạn: giới thiệu, nội dung chính, lời kết',
        'Sử dụng thì tương lai (will, going to) cho kế hoạch',
        'Kết thúc với: Best regards, See you soon'
      ],
      sampleAnswer: `Dear Sarah,\n\nI hope this email finds you well. I'm writing to tell you about my upcoming trip to Da Nang next month, and I would love for you to join me!\n\nWe're planning to go from July 15th to July 20th. Da Nang is a beautiful coastal city with amazing beaches and delicious food. We're going to stay at a hotel near My Khe Beach. During the trip, we'll visit the Marble Mountains, explore the old town of Hoi An, and try lots of local seafood. We can also relax on the beach and enjoy the sunset together.\n\nI think it would be so much fun if you could come with us. Let me know if you're interested! I can help you with the booking.\n\nLooking forward to hearing from you soon.\n\nBest regards,\nAnh`,
      rubric: {
        grammar: 'Sử dụng đúng thì, cấu trúc câu phức',
        vocabulary: 'Từ vựng về du lịch, lời mời',
        coherence: 'Bố cục email rõ ràng, có đoạn văn',
        taskAchievement: 'Đầy đủ thông tin, phong cách phù hợp'
      }
    },
    {
      id: 4,
      title: "Lợi ích của việc học ngoại ngữ",
      level: 'Intermediate',
      duration: '30 phút',
      topic: 'Education',
      thumbnail: "https://i.pinimg.com/1200x/67/2a/04/672a04cf6ce8229352b269bf1774cd0d.jpg",
      prompt: 'Viết một đoạn văn (150-200 từ) về lợi ích của việc học ngoại ngữ. Nêu ít nhất 3 lợi ích và giải thích chi tiết.',
      wordCountMin: 150,
      wordCountMax: 200,
      tips: [
        'Viết câu chủ đề rõ ràng',
        'Mỗi lợi ích là một đoạn riêng',
        'Sử dụng từ nối: Firstly, Secondly, Moreover, In addition',
        'Kết luận tóm tắt ý chính'
      ],
      sampleAnswer: `Learning a foreign language brings numerous benefits to our lives. I believe that everyone should learn at least one additional language besides their mother tongue.\n\nFirstly, learning a foreign language improves career opportunities. In today's globalized world, many companies need employees who can communicate in multiple languages. People who speak more than one language often get better job positions and higher salaries.\n\nSecondly, it enhances cognitive abilities. Studies show that bilingual people have better memory, problem-solving skills, and concentration. Learning a new language exercises our brain and keeps it active and healthy.\n\nMoreover, understanding a foreign language allows us to connect with different cultures. We can travel more easily, make friends from other countries, and appreciate diverse perspectives. This cultural awareness makes us more open-minded and tolerant.\n\nIn conclusion, learning a foreign language is valuable for professional development, mental health, and cultural understanding. It opens doors to new opportunities and enriches our lives in many ways.`,
      rubric: {
        grammar: 'Cấu trúc câu đa dạng, sử dụng mệnh đề quan hệ',
        vocabulary: 'Từ vựng học thuật, từ đồng nghĩa',
        coherence: 'Bố cục rõ ràng, luận điểm mạch lạc',
        taskAchievement: 'Đủ 3 lợi ích với giải thích cụ thể'
      }
    },
    {
      id: 5,
      title: "Phân tích xu hướng công nghệ",
      level: 'Advanced',
      duration: '40 phút',
      topic: 'Technology',
      thumbnail: "https://i.pinimg.com/1200x/67/2a/04/672a04cf6ce8229352b269bf1774cd0d.jpg",
      prompt: 'Viết một bài luận (250-300 từ) phân tích tác động của trí tuệ nhân tạo (AI) đối với xã hội hiện đại. Đưa ra quan điểm, lập luận và ví dụ cụ thể.',
      wordCountMin: 250,
      wordCountMax: 300,
      tips: [
        'Viết phần mở bài giới thiệu chủ đề và thesis statement',
        'Thân bài gồm 2-3 đoạn phân tích các mặt khác nhau',
        'Sử dụng cấu trúc học thuật và từ vựng chuyên ngành',
        'Kết bài tóm tắt và đưa ra quan điểm cá nhân'
      ],
      sampleAnswer: `The rapid advancement of artificial intelligence (AI) has fundamentally transformed modern society, bringing both remarkable benefits and significant challenges. This essay will examine the multifaceted impact of AI on our daily lives, economy, and ethical considerations.\n\nOn the positive side, AI has revolutionized numerous industries by increasing efficiency and productivity. In healthcare, AI-powered diagnostic systems can detect diseases earlier and more accurately than traditional methods, potentially saving countless lives. For instance, machine learning algorithms can analyze medical images to identify cancer cells with remarkable precision. Similarly, in manufacturing, AI-driven automation has optimized production processes, reduced costs, and improved product quality.\n\nHowever, the rise of AI also presents considerable concerns. The automation of jobs threatens employment in various sectors, particularly affecting workers in routine-based occupations. According to recent studies, millions of jobs could be displaced by AI technology within the next decade. Furthermore, there are pressing ethical questions regarding AI decision-making, data privacy, and algorithmic bias. When AI systems make critical decisions about loan approvals, hiring, or criminal sentencing, we must ensure they operate fairly and transparently.\n\nIn conclusion, while AI offers tremendous potential to improve our lives, we must approach its development and implementation thoughtfully. Society needs robust regulations, ethical frameworks, and educational initiatives to maximize AI's benefits while mitigating its risks. Only through responsible innovation can we harness AI's power for the greater good.`,
      rubric: {
        grammar: 'Cấu trúc phức tạp, độ chính xác cao',
        vocabulary: 'Từ vựng học thuật, thuật ngữ chuyên ngành',
        coherence: 'Lập luận chặt chẽ, logic rõ ràng',
        taskAchievement: 'Phân tích sâu, đa chiều với ví dụ cụ thể'
      }
    },
    {
      id: 6,
      title: "Viết thư phàn nàn chính thức",
      level: 'Advanced',
      duration: '35 phút',
      topic: 'Business',
      thumbnail: "https://i.pinimg.com/1200x/67/2a/04/672a04cf6ce8229352b269bf1774cd0d.jpg",
      prompt: 'Viết một lá thư phàn nàn chính thức (200-250 từ) gửi đến một công ty về sản phẩm/dịch vụ không đạt yêu cầu. Mô tả vấn đề, nêu yêu cầu giải quyết.',
      wordCountMin: 200,
      wordCountMax: 250,
      tips: [
        'Sử dụng giọng văn trang trọng, lịch sự nhưng kiên quyết',
        'Cấu trúc: Lời mở đầu - Mô tả vấn đề - Yêu cầu - Lời kết',
        'Đề cập cụ thể: ngày tháng, số đơn hàng, sản phẩm',
        'Đưa ra thời hạn giải quyết hợp lý'
      ],
      sampleAnswer: `Dear Customer Service Manager,\n\nI am writing to express my dissatisfaction with a recent purchase I made from your online store and to request a prompt resolution to this matter.\n\nOn October 10th, 2024, I ordered a laptop computer (Model XPS 15, Order #45789) from your website for $1,299. The product was delivered on October 15th, but upon inspection, I discovered several significant issues. Firstly, the laptop screen has a noticeable crack in the lower right corner, which was not mentioned in the product description. Secondly, the device fails to charge properly, despite multiple attempts with different power outlets. This suggests a defective battery or charging port.\n\nI was extremely disappointed by this experience, particularly given your company's reputation for quality products. The laptop was intended as a gift for my daughter's university studies, and this situation has caused considerable inconvenience. I have been a loyal customer for over five years and have never encountered such problems before.\n\nTherefore, I am requesting either a full refund or an immediate replacement with a fully functional unit. I would appreciate your response within five business days and expect a prepaid return shipping label for the defective product.\n\nI trust that you will handle this matter professionally and restore my confidence in your brand.\n\nYours sincerely,\nMichael Johnson`,
      rubric: {
        grammar: 'Hoàn hảo về mặt ngữ pháp, phong cách trang trọng',
        vocabulary: 'Từ vựng business, phrasal verbs chính thức',
        coherence: 'Bố cục thư chuẩn, diễn đạt chuyên nghiệp',
        taskAchievement: 'Đầy đủ thông tin, yêu cầu rõ ràng'
      }
    }
  ];

  const filteredPrompts = useMemo(() => {
    if (selectedLevel === 'All') return writingPrompts;
    return writingPrompts.filter(p => p.level === selectedLevel);
  }, [selectedLevel]);

  const wordCount = userText.trim().split(/\s+/).filter(word => word.length > 0).length;

  const handlePromptSelect = (prompt: WritingPrompt) => {
    setSelectedPrompt(prompt);
    setUserText('');
    setShowSample(false);
    setShowTips(false);
    setIsSubmitted(false);
  };

  const handleSubmit = () => {
    if (wordCount < selectedPrompt!.wordCountMin) {
      alert(`Bài viết của bạn chưa đủ số từ tối thiểu (${selectedPrompt!.wordCountMin} từ)`);
      return;
    }
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setUserText('');
    setIsSubmitted(false);
  };

  return (
    <div className="writing-page">
      {/* Hero Section */}
      <section className="writing-hero">
        <div className="hero-content">
          <div className="hero-icon">✍️</div>
          <h1>Writing Practice</h1>
          <p>Nâng cao kỹ năng viết tiếng Anh qua các bài tập đa dạng</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="writing-container">
        {!selectedPrompt ? (
          <>
            {/* Level Filter */}
            <div className="filter-section">
              <h3>Chọn cấp độ:</h3>
              <div className="level-filters">
                {['All', 'Beginner', 'Intermediate', 'Advanced'].map(level => (
                  <button
                    key={level}
                    className={`filter-btn ${selectedLevel === level ? 'active' : ''}`}
                    onClick={() => setSelectedLevel(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Writing Prompts Grid */}
            <div className="prompts-grid">
              {filteredPrompts.map(prompt => (
                <div key={prompt.id} className="prompt-card" onClick={() => handlePromptSelect(prompt)}>
                  <div className="prompt-thumbnail">
                    {prompt.thumbnail.startsWith('http') ? 
                      <img className="thumbnail-image" src={prompt.thumbnail} alt={prompt.title} /> : 
                      prompt.thumbnail
                    }
                  </div>
                  <div className="prompt-content">
                    <div className="prompt-header">
                      <h3>{prompt.title}</h3>
                      <span className={`level-badge ${prompt.level.toLowerCase()}`}>
                        {prompt.level}
                      </span>
                    </div>
                    <div className="prompt-meta">
                      <span className="meta-item">
                        <FaClock /> {prompt.duration}
                      </span>
                      <span className="meta-item">
                        <FaPen /> {prompt.wordCountMin}-{prompt.wordCountMax} từ
                      </span>
                    </div>
                    <p className="prompt-topic">📚 {prompt.topic}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="writing-exercise">
            <button className="back-btn" onClick={() => setSelectedPrompt(null)}>
              ← Quay lại danh sách
            </button>

            <div className="exercise-layout">
              {/* Left Panel - Prompt Info */}
              <div className="prompt-panel">
                <div className="prompt-info-card">
                  <div className="prompt-title-section">
                    <div className="prompt-emoji">
                      {selectedPrompt.thumbnail.startsWith('http') ? 
                        <img className="thumbnail-image" src={selectedPrompt.thumbnail} alt={selectedPrompt.title} /> : 
                        selectedPrompt.thumbnail
                      }
                    </div>
                    <div>
                      <h2>{selectedPrompt.title}</h2>
                      <div className="prompt-badges">
                        <span className={`badge ${selectedPrompt.level.toLowerCase()}`}>
                          {selectedPrompt.level}
                        </span>
                        <span className="badge duration">
                          <FaClock /> {selectedPrompt.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="prompt-text">
                    <h4>📝 Đề bài:</h4>
                    <p>{selectedPrompt.prompt}</p>
                  </div>

                  <div className="word-requirement">
                    <FaBook />
                    <span>Yêu cầu: {selectedPrompt.wordCountMin} - {selectedPrompt.wordCountMax} từ</span>
                  </div>

                  {/* Tips Section */}
                  <div className="tips-section">
                    <button 
                      className="tips-toggle"
                      onClick={() => setShowTips(!showTips)}
                    >
                      <FaLightbulb /> {showTips ? 'Ẩn gợi ý' : 'Xem gợi ý'}
                    </button>
                    {showTips && (
                      <ul className="tips-list">
                        {selectedPrompt.tips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Rubric Section */}
                  <div className="rubric-section">
                    <h4>📊 Tiêu chí đánh giá:</h4>
                    <div className="rubric-items">
                      <div className="rubric-item">
                        <strong>Ngữ pháp:</strong> {selectedPrompt.rubric.grammar}
                      </div>
                      <div className="rubric-item">
                        <strong>Từ vựng:</strong> {selectedPrompt.rubric.vocabulary}
                      </div>
                      <div className="rubric-item">
                        <strong>Mạch lạc:</strong> {selectedPrompt.rubric.coherence}
                      </div>
                      <div className="rubric-item">
                        <strong>Hoàn thành yêu cầu:</strong> {selectedPrompt.rubric.taskAchievement}
                      </div>
                    </div>
                  </div>

                  {/* Sample Answer */}
                  {selectedPrompt.sampleAnswer && (
                    <div className="sample-section">
                      <button 
                        className="sample-toggle"
                        onClick={() => setShowSample(!showSample)}
                      >
                        <FaStar /> {showSample ? 'Ẩn bài mẫu' : 'Xem bài mẫu'}
                      </button>
                      {showSample && (
                        <div className="sample-answer">
                          <p>{selectedPrompt.sampleAnswer}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel - Writing Area */}
              <div className="writing-panel">
                <div className="writing-card">
                  <div className="writing-header">
                    <h3>Bài viết của bạn</h3>
                    <div className="word-counter">
                      <span className={`count ${wordCount < selectedPrompt.wordCountMin ? 'insufficient' : 'sufficient'}`}>
                        {wordCount}
                      </span>
                      <span className="count-label">/ {selectedPrompt.wordCountMin}-{selectedPrompt.wordCountMax} từ</span>
                    </div>
                  </div>

                  <textarea
                    className="writing-textarea"
                    placeholder="Bắt đầu viết ở đây..."
                    value={userText}
                    onChange={(e) => setUserText(e.target.value)}
                    disabled={isSubmitted}
                  />

                  <div className="writing-actions">
                    <button 
                      className="action-btn reset-btn"
                      onClick={handleReset}
                      disabled={!userText}
                    >
                      <FaRedo /> Làm lại
                    </button>
                    <button 
                      className="action-btn submit-btn"
                      onClick={handleSubmit}
                      disabled={isSubmitted || wordCount === 0}
                    >
                      <FaCheckCircle /> Nộp bài
                    </button>
                  </div>

                  {isSubmitted && (
                    <div className="submission-feedback">
                      <div className="feedback-icon">
                        <BiTrophy />
                      </div>
                      <h3>Bài viết đã được nộp!</h3>
                      <p>Bạn đã hoàn thành bài tập với <strong>{wordCount} từ</strong>.</p>
                      <div className="feedback-tips">
                        <p><strong>💡 Gợi ý cải thiện:</strong></p>
                        <ul>
                          <li>Đọc lại bài viết và kiểm tra lỗi chính tả</li>
                          <li>So sánh với bài mẫu để học cách diễn đạt hay</li>
                          <li>Chú ý các tiêu chí đánh giá đã nêu</li>
                          <li>Thực hành thêm với các đề bài khác</li>
                        </ul>
                      </div>
                      <button 
                        className="continue-btn"
                        onClick={() => setSelectedPrompt(null)}
                      >
                        Tiếp tục với đề bài khác
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function useMemo<T>(factory: () => T, deps: React.DependencyList): T {
  const [value, setValue] = React.useState<T>(factory);
  
  React.useEffect(() => {
    setValue(factory());
  }, deps);
  
  return value;
}

export default WritingPage;
