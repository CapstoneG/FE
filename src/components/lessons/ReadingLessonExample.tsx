import ReadingLesson from './ReadingLesson';

/**
 * ReadingLesson Component Examples
 * 
 * This file demonstrates how to use the ReadingLesson component
 * with different reading levels and content types.
 */

// Example 1: Beginner Level - Simple Story
export const BeginnerExample = () => {
  const vocabularyItems = [
    {
      word: "park",
      pronunciation: "/pɑːrk/",
      meaning: "Công viên - A public garden or area of land",
      example: "The children play in the park every Sunday."
    },
    {
      word: "sunny",
      pronunciation: "/ˈsʌni/",
      meaning: "Có nắng - Full of sunshine, bright",
      example: "It's a sunny day, perfect for a picnic."
    },
    {
      word: "friend",
      pronunciation: "/frend/",
      meaning: "Bạn bè - A person you like and enjoy being with",
      example: "Emma is my best friend from school."
    },
    {
      word: "enjoy",
      pronunciation: "/ɪnˈdʒɔɪ/",
      meaning: "Thích, tận hưởng - To take pleasure in something",
      example: "I enjoy reading books on weekends."
    },
    {
      word: "happy",
      pronunciation: "/ˈhæpi/",
      meaning: "Vui vẻ, hạnh phúc - Feeling pleasure or contentment",
      example: "She feels happy when she is with her family."
    }
  ];

  const paragraphs = [
    {
      id: 1,
      content: "Tom and Sarah are good friends. Every Saturday, they go to the park together. They like to play games and talk about their week.",
      translation: "Tom và Sarah là những người bạn tốt. Mỗi thứ Bảy, họ cùng nhau đi đến công viên. Họ thích chơi trò chơi và nói chuyện về tuần của họ."
    },
    {
      id: 2,
      content: "Last Saturday was a beautiful sunny day. Tom brought a ball and Sarah brought some snacks. They played football for an hour.",
      translation: "Thứ Bảy tuần trước là một ngày nắng đẹp. Tom mang theo một quả bóng và Sarah mang theo một ít đồ ăn nhẹ. Họ chơi bóng đá trong một giờ."
    },
    {
      id: 3,
      content: "After playing, they sat under a big tree. Sarah shared her cookies with Tom. They talked about their favorite movies and books.",
      translation: "Sau khi chơi, họ ngồi dưới một cái cây lớn. Sarah chia sẻ bánh quy của cô ấy với Tom. Họ nói chuyện về những bộ phim và cuốn sách yêu thích của họ."
    },
    {
      id: 4,
      content: "Tom and Sarah enjoy spending time together. They feel happy when they are at the park. They plan to go again next Saturday.",
      translation: "Tom và Sarah thích dành thời gian bên nhau. Họ cảm thấy hạnh phúc khi ở công viên. Họ dự định sẽ đi lại vào thứ Bảy tới."
    }
  ];

  const keyPoints = [
    {
      id: 1,
      icon: "👥",
      title: "Friendship",
      content: "Tom and Sarah are good friends who enjoy spending time together."
    },
    {
      id: 2,
      icon: "🎾",
      title: "Activities",
      content: "They play football and share snacks in the park."
    },
    {
      id: 3,
      icon: "😊",
      title: "Feelings",
      content: "Both friends feel happy when they are together."
    },
    {
      id: 4,
      icon: "📅",
      title: "Regular Plans",
      content: "They meet every Saturday and plan to continue."
    }
  ];

  const comprehensionQuestions = [
    {
      id: 1,
      question: "When do Tom and Sarah go to the park?",
      options: [
        "Every Sunday",
        "Every Saturday",
        "Every Friday",
        "Every day"
      ],
      correctAnswer: "Every Saturday",
      explanation: "The passage states 'Every Saturday, they go to the park together.'"
    },
    {
      id: 2,
      question: "What did Tom bring to the park?",
      options: [
        "Some snacks",
        "A book",
        "A ball",
        "A bike"
      ],
      correctAnswer: "A ball",
      explanation: "According to the passage, 'Tom brought a ball' to the park."
    },
    {
      id: 3,
      question: "How long did they play football?",
      options: [
        "30 minutes",
        "45 minutes",
        "One hour",
        "Two hours"
      ],
      correctAnswer: "One hour",
      explanation: "The passage mentions 'They played football for an hour.'"
    },
    {
      id: 4,
      question: "How do Tom and Sarah feel at the park?",
      options: [
        "Tired",
        "Bored",
        "Happy",
        "Sad"
      ],
      correctAnswer: "Happy",
      explanation: "The passage states 'They feel happy when they are at the park.'"
    }
  ];

  return (
    <ReadingLesson
      category="Short Story"
      level="beginner"
      readingTime={5}
      title="A Day at the Park"
      subtitle="A simple story about friendship and fun"
      introduction="This is a story about two friends who love spending time together at the park. It teaches us about friendship and doing activities we enjoy."
      vocabulary={vocabularyItems}
      paragraphs={paragraphs}
      keyPoints={keyPoints}
      comprehensionQuestions={comprehensionQuestions}
      culturalNote="In many countries, parks are important social spaces where people meet friends, exercise, and relax. Spending time outdoors with friends is a healthy way to build relationships."
      tips={[
        "Practice reading the story out loud to improve pronunciation",
        "Try to understand the main idea before looking at translations",
        "Use the vocabulary section to learn new words in context",
        "Answer the comprehension questions without looking back at the text first"
      ]}
      onComplete={() => console.log('Beginner reading completed!')}
    />
  );
};

// Example 2: Intermediate Level - Article
export const IntermediateExample = () => {
  const vocabularyItems = [
    {
      word: "sustainable",
      pronunciation: "/səˈsteɪnəbl/",
      meaning: "Bền vững - Able to continue over time without damaging the environment",
      example: "We need to develop sustainable energy sources."
    },
    {
      word: "renewable",
      pronunciation: "/rɪˈnjuːəbl/",
      meaning: "Có thể tái tạo - Can be replaced naturally and used again",
      example: "Solar power is a renewable energy source."
    },
    {
      word: "fossil fuels",
      pronunciation: "/ˈfɒsl fjuːəlz/",
      meaning: "Nhiên liệu hóa thạch - Coal, oil, or gas formed from ancient plants and animals",
      example: "Burning fossil fuels contributes to climate change."
    },
    {
      word: "emission",
      pronunciation: "/ɪˈmɪʃn/",
      meaning: "Khí thải - Gas or substance released into the air",
      example: "We must reduce carbon emissions to protect our planet."
    },
    {
      word: "implement",
      pronunciation: "/ˈɪmplɪment/",
      meaning: "Thực hiện - To put a plan or system into action",
      example: "The government plans to implement new environmental policies."
    }
  ];

  const paragraphs = [
    {
      id: 1,
      content: "Climate change is one of the most pressing challenges of our time. Rising global temperatures, extreme weather events, and melting ice caps are just some of the consequences we face. Scientists worldwide agree that human activities, particularly the burning of fossil fuels, are the primary cause of this crisis.",
      translation: "Biến đổi khí hậu là một trong những thách thức cấp bách nhất của thời đại chúng ta. Nhiệt độ toàn cầu tăng, các hiện tượng thời tiết cực đoan và băng tan ở hai cực chỉ là một số hậu quả mà chúng ta đang đối mặt. Các nhà khoa học trên toàn thế giới đồng ý rằng các hoạt động của con người, đặc biệt là việc đốt nhiên liệu hóa thạch, là nguyên nhân chính của cuộc khủng hoảng này."
    },
    {
      id: 2,
      content: "Renewable energy offers a promising solution to reduce our carbon footprint. Solar panels, wind turbines, and hydroelectric systems can generate clean electricity without producing harmful emissions. Many countries are investing heavily in these technologies to transition away from fossil fuels.",
      translation: "Năng lượng tái tạo cung cấp một giải pháp đầy hứa hẹn để giảm lượng khí thải carbon của chúng ta. Các tấm pin mặt trời, tuabin gió và hệ thống thủy điện có thể tạo ra điện sạch mà không tạo ra khí thải có hại. Nhiều quốc gia đang đầu tư mạnh vào các công nghệ này để chuyển đổi khỏi nhiên liệu hóa thạch."
    },
    {
      id: 3,
      content: "However, the transition to sustainable energy is not without challenges. The initial costs of renewable infrastructure can be high, and some technologies depend on weather conditions. Energy storage remains a technical hurdle that researchers are working to overcome.",
      translation: "Tuy nhiên, quá trình chuyển đổi sang năng lượng bền vững không phải là không có thách thức. Chi phí ban đầu của cơ sở hạ tầng năng lượng tái tạo có thể cao, và một số công nghệ phụ thuộc vào điều kiện thời tiết. Lưu trữ năng lượng vẫn là một rào cản kỹ thuật mà các nhà nghiên cứu đang nỗ lực vượt qua."
    },
    {
      id: 4,
      content: "Despite these obstacles, the benefits of renewable energy far outweigh the challenges. As technology improves and costs decrease, more households and businesses are adopting clean energy solutions. This shift represents not just an environmental necessity, but also an economic opportunity for innovation and job creation.",
      translation: "Bất chấp những trở ngại này, lợi ích của năng lượng tái tạo vượt xa những thách thức. Khi công nghệ cải thiện và chi phí giảm, ngày càng nhiều hộ gia đình và doanh nghiệp áp dụng các giải pháp năng lượng sạch. Sự chuyển đổi này không chỉ là một nhu cầu về môi trường, mà còn là một cơ hội kinh tế cho sự đổi mới và tạo việc làm."
    }
  ];

  const keyPoints = [
    {
      id: 1,
      icon: "🌍",
      title: "Climate Crisis",
      content: "Climate change is caused primarily by burning fossil fuels."
    },
    {
      id: 2,
      icon: "♻️",
      title: "Clean Solutions",
      content: "Renewable energy sources can replace fossil fuels."
    },
    {
      id: 3,
      icon: "⚡",
      title: "Technical Challenges",
      content: "High costs and storage issues need to be addressed."
    },
    {
      id: 4,
      icon: "💼",
      title: "Economic Benefits",
      content: "Clean energy creates jobs and innovation opportunities."
    }
  ];

  const comprehensionQuestions = [
    {
      id: 1,
      question: "According to the passage, what is the primary cause of climate change?",
      options: [
        "Natural disasters",
        "Burning fossil fuels",
        "Solar radiation",
        "Ocean currents"
      ],
      correctAnswer: "Burning fossil fuels",
      explanation: "The passage clearly states that 'human activities, particularly the burning of fossil fuels, are the primary cause of this crisis.'"
    },
    {
      id: 2,
      question: "What is mentioned as an advantage of renewable energy?",
      options: [
        "It's always cheaper than fossil fuels",
        "It doesn't depend on weather",
        "It produces clean electricity without harmful emissions",
        "It doesn't require any infrastructure"
      ],
      correctAnswer: "It produces clean electricity without harmful emissions",
      explanation: "The passage mentions that renewable energy can 'generate clean electricity without producing harmful emissions.'"
    },
    {
      id: 3,
      question: "What challenge does the passage mention about renewable energy?",
      options: [
        "It's illegal in many countries",
        "It produces too much energy",
        "The initial infrastructure costs can be high",
        "It requires too much maintenance"
      ],
      correctAnswer: "The initial infrastructure costs can be high",
      explanation: "The passage states 'The initial costs of renewable infrastructure can be high' as one of the challenges."
    }
  ];

  return (
    <ReadingLesson
      category="Environmental Science"
      level="intermediate"
      readingTime={8}
      title="The Future of Renewable Energy"
      subtitle="Understanding clean energy solutions for climate change"
      imageUrl="https://example.com/renewable-energy.jpg"
      introduction="Climate change demands urgent action. This article explores how renewable energy technologies offer hope for a sustainable future, despite current challenges."
      vocabulary={vocabularyItems}
      paragraphs={paragraphs}
      keyPoints={keyPoints}
      comprehensionQuestions={comprehensionQuestions}
      culturalNote="Different countries approach renewable energy differently based on their geography, economy, and political systems. For example, Iceland uses abundant geothermal energy, while desert nations focus on solar power."
      tips={[
        "Look for the main argument and supporting evidence in each paragraph",
        "Pay attention to transition words like 'however' and 'despite'",
        "Try to summarize each paragraph in one sentence",
        "Consider both advantages and disadvantages presented in the text"
      ]}
      onComplete={() => console.log('Intermediate reading completed!')}
    />
  );
};

// Example 3: Advanced Level - Academic Article
export const AdvancedExample = () => {
  const vocabularyItems = [
    {
      word: "phenomenon",
      pronunciation: "/fəˈnɒmɪnən/",
      meaning: "Hiện tượng - An observable fact or event",
      example: "Global warming is a complex phenomenon affecting all life on Earth."
    },
    {
      word: "cognitive",
      pronunciation: "/ˈkɒɡnətɪv/",
      meaning: "Nhận thức - Related to mental processes of understanding",
      example: "Reading improves cognitive abilities and critical thinking."
    },
    {
      word: "hypothesis",
      pronunciation: "/haɪˈpɒθəsɪs/",
      meaning: "Giả thuyết - A proposed explanation for a phenomenon",
      example: "Scientists test their hypothesis through careful experiments."
    },
    {
      word: "empirical",
      pronunciation: "/ɪmˈpɪrɪkl/",
      meaning: "Thực nghiệm - Based on observation or experience",
      example: "The theory is supported by empirical evidence."
    },
    {
      word: "paradigm",
      pronunciation: "/ˈpærədaɪm/",
      meaning: "Mô hình, khuôn mẫu - A typical pattern or model",
      example: "The discovery led to a paradigm shift in scientific thinking."
    }
  ];

  const paragraphs = [
    {
      id: 1,
      content: "The intersection of artificial intelligence and neuroscience represents one of the most intriguing frontiers in contemporary scientific research. As machine learning algorithms become increasingly sophisticated, researchers are drawing parallels between artificial neural networks and the biological neural networks that constitute the human brain. This convergence has sparked a renaissance in our understanding of both computational intelligence and human cognition.",
      translation: "Giao điểm giữa trí tuệ nhân tạo và khoa học thần kinh đại diện cho một trong những lĩnh vực hấp dẫn nhất trong nghiên cứu khoa học đương đại. Khi các thuật toán học máy ngày càng tinh vi, các nhà nghiên cứu đang rút ra những điểm tương đồng giữa mạng neural nhân tạo và mạng neural sinh học cấu thành não người. Sự hội tụ này đã châm ngòi cho một sự phục hưng trong hiểu biết của chúng ta về cả trí thông minh tính toán và nhận thức con người."
    },
    {
      id: 2,
      content: "The fundamental architecture of artificial neural networks, inspired by biological neurons, consists of interconnected nodes that process information through weighted connections. Each node receives inputs, performs computations, and transmits outputs to subsequent layers. This hierarchical structure mirrors the layered organization of the visual cortex, where increasingly complex features are extracted through successive processing stages.",
      translation: "Kiến trúc cơ bản của mạng neural nhân tạo, được lấy cảm hứng từ các tế bào thần kinh sinh học, bao gồm các nút kết nối xử lý thông tin thông qua các kết nối có trọng số. Mỗi nút nhận đầu vào, thực hiện tính toán và truyền đầu ra đến các lớp tiếp theo. Cấu trúc phân cấp này phản ánh tổ chức theo lớp của vỏ não thị giác, nơi các đặc điểm ngày càng phức tạp được trích xuất thông qua các giai đoạn xử lý liên tiếp."
    },
    {
      id: 3,
      content: "However, significant disparities exist between artificial and biological neural networks. The human brain operates with approximately 86 billion neurons and trillions of synaptic connections, exhibiting remarkable energy efficiency and adaptability. Conversely, even the most advanced AI systems require substantial computational resources and struggle with tasks that humans perform effortlessly, such as contextual understanding and creative problem-solving.",
      translation: "Tuy nhiên, tồn tại những sự khác biệt đáng kể giữa mạng neural nhân tạo và sinh học. Bộ não con người hoạt động với khoảng 86 tỷ tế bào thần kinh và hàng nghìn tỷ kết nối synap, thể hiện hiệu suất năng lượng và khả năng thích nghi đáng kinh ngạc. Ngược lại, ngay cả các hệ thống AI tiên tiến nhất cũng đòi hỏi nguồn tính toán đáng kể và gặp khó khăn với các nhiệm vụ mà con người thực hiện dễ dàng, chẳng hạn như hiểu ngữ cảnh và giải quyết vấn đề sáng tạo."
    }
  ];

  const keyPoints = [
    {
      id: 1,
      icon: "🧠",
      title: "Neural Networks",
      content: "AI architecture inspired by biological brain structure."
    },
    {
      id: 2,
      icon: "🔬",
      title: "Scientific Convergence",
      content: "Neuroscience and AI research inform each other."
    },
    {
      id: 3,
      icon: "⚙️",
      title: "Hierarchical Processing",
      content: "Both systems use layered information processing."
    },
    {
      id: 4,
      icon: "💡",
      title: "Key Differences",
      content: "Human brains are more efficient and adaptable than AI."
    }
  ];

  const comprehensionQuestions = [
    {
      id: 1,
      question: "What does the passage suggest about the relationship between AI and neuroscience?",
      options: [
        "They are completely unrelated fields",
        "AI has replaced neuroscience research",
        "They inform and influence each other",
        "Neuroscience is more important than AI"
      ],
      correctAnswer: "They inform and influence each other",
      explanation: "The passage describes 'a renaissance in our understanding of both computational intelligence and human cognition', indicating mutual influence."
    },
    {
      id: 2,
      question: "How does the passage characterize the human brain compared to AI systems?",
      options: [
        "Less powerful and slower",
        "More energy-efficient and adaptable",
        "Exactly the same in function",
        "Better at mathematical calculations"
      ],
      correctAnswer: "More energy-efficient and adaptable",
      explanation: "The passage states the human brain exhibits 'remarkable energy efficiency and adaptability' compared to AI systems."
    }
  ];

  return (
    <ReadingLesson
      category="Scientific Research"
      level="advanced"
      readingTime={10}
      title="Artificial Intelligence and the Human Brain"
      subtitle="Exploring the convergence of neuroscience and machine learning"
      imageUrl="https://example.com/ai-brain.jpg"
      introduction="This academic article examines the fascinating parallels and differences between artificial neural networks and biological brain structures, offering insights into both computational and human intelligence."
      vocabulary={vocabularyItems}
      paragraphs={paragraphs}
      keyPoints={keyPoints}
      comprehensionQuestions={comprehensionQuestions}
      culturalNote="The development of AI raises important ethical and philosophical questions across cultures about consciousness, intelligence, and what it means to be human. Different societies approach these questions through their unique cultural and religious perspectives."
      tips={[
        "Identify the thesis and main arguments in academic texts",
        "Look for comparison and contrast structures",
        "Pay attention to technical terminology and its context",
        "Consider the implications and broader significance of the research",
        "Practice paraphrasing complex sentences in your own words"
      ]}
      onComplete={() => console.log('Advanced reading completed!')}
    />
  );
};

export default BeginnerExample;
