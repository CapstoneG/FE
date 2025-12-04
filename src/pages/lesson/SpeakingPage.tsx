import React, { useState, useRef } from 'react';
import '@/styles/lesson/SpeakingPage.css'
import { FaMicrophone, FaPlay, FaPause, FaRedo, FaCheckCircle, FaClock, FaComments, FaStop, FaLightbulb } from 'react-icons/fa';
import { BiTrophy } from 'react-icons/bi';
import { MdCompareArrows } from 'react-icons/md';

interface SpeakingPrompt {
  id: number;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  topic: string;
  thumbnail: string;
  promptText: string;
  questionText: string[];
  modelAudio?: string;
  tips: string[];
  sampleResponse?: string;
  rubric: {
    pronunciation: string;
    fluency: string;
    vocabulary: string;
    grammar: string;
    taskAchievement: string;
  };
}

const SpeakingPage: React.FC = () => {
  const [selectedPrompt, setSelectedPrompt] = useState<SpeakingPrompt | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [isPlayingModel, setIsPlayingModel] = useState(false);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countdownTime, setCountdownTime] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  
  const modelAudioRef = useRef<HTMLAudioElement>(null);
  const recordedAudioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const countdownRef = useRef<number | null>(null);

  const speakingPrompts: SpeakingPrompt[] = [
    {
      id: 1,
      title: "Giới thiệu bản thân",
      level: 'Beginner',
      duration: '1 phút',
      topic: 'Introduction',
      thumbnail: "https://i.pinimg.com/1200x/67/2a/04/672a04cf6ce8229352b269bf1774cd0d.jpg",
      promptText: 'Trong bài tập này, bạn sẽ giới thiệu về bản thân trong khoảng 30 giây đến 1 phút.',
      questionText: [
        'Tên và tuổi của bạn?',
        'Bạn sống ở đâu?',
        'Bạn làm nghề gì hoặc đang học gì?',
        'Sở thích của bạn là gì?',
        'Bạn có kế hoạch gì trong tương lai?'
      ],
      modelAudio: '/audio/self_introduction.mp3',
      tips: [
        'Sử dụng thì hiện tại đơn để nói về thông tin cá nhân',
        'Chuẩn bị 2-3 sở thích để nói chi tiết',
        'Luyện tập cách phát âm tên của bạn rõ ràng',
        'Mỉm cười khi nói để giọng nói tự nhiên hơn'
      ],
      sampleResponse: `Hello, my name is Linh and I'm 25 years old. I live in Ho Chi Minh City, in District 2. I work as a software engineer at a tech company. In my free time, I enjoy reading books, especially novels and science fiction. I also like playing badminton with my friends on weekends. In the future, I plan to improve my English skills and travel to Australia to visit my relatives next year.`,
      rubric: {
        pronunciation: 'Phát âm rõ ràng, dễ hiểu',
        fluency: 'Nói trôi chảy, ít dừng không cần thiết',
        vocabulary: 'Sử dụng từ vựng đa dạng về thông tin cá nhân',
        grammar: 'Sử dụng đúng thì và cấu trúc câu',
        taskAchievement: 'Trả lời đầy đủ tất cả các câu hỏi'
      }
    },
    {
      id: 2,
      title: "Mô tả ngôi nhà của bạn",
      level: 'Beginner',
      duration: '1 phút',
      topic: 'Home',
      thumbnail: "https://i.pinimg.com/1200x/67/2a/04/672a04cf6ce8229352b269bf1774cd0d.jpg",
      promptText: 'Mô tả ngôi nhà hoặc căn hộ bạn đang sống. Bạn có 1 phút để nói về chủ đề này.',
      questionText: [
        'Bạn sống ở loại nhà nào?',
        'Ngôi nhà của bạn có bao nhiêu phòng?',
        'Phòng nào là phòng bạn thích nhất và tại sao?',
        'Bạn sống ở đó bao lâu rồi?',
        'Bạn thích điều gì nhất về ngôi nhà của bạn?'
      ],
      modelAudio: '/audio/home_description.mp3',
      tips: [
        'Sử dụng từ vựng mô tả không gian và vị trí',
        'Dùng tính từ để làm phong phú bài nói',
        'Kết hợp thì hiện tại đơn và hiện tại tiếp diễn',
        'Nhớ nói rõ lý do tại sao bạn thích một phòng nào đó'
      ],
      sampleResponse: `I live in an apartment in the city center. It's not very big, but it's comfortable and modern. My apartment has two bedrooms, one living room, a kitchen, and one bathroom. My favorite room is the living room because it's spacious and bright with large windows. I have been living here for about 3 years. What I like most about my apartment is its location - it's close to my workplace and there are many restaurants and shops nearby.`,
      rubric: {
        pronunciation: 'Phát âm rõ ràng, nhấn đúng âm',
        fluency: 'Nói liên tục, ít ngắt quãng',
        vocabulary: 'Sử dụng từ vựng đa dạng về nhà cửa và không gian',
        grammar: 'Sử dụng đúng thì và cấu trúc câu',
        taskAchievement: 'Trả lời đầy đủ các câu hỏi'
      }
    },
    {
      id: 3,
      title: "Nói về sở thích",
      level: 'Intermediate',
      duration: '2 phút',
      topic: 'Hobbies',
      thumbnail: "https://i.pinimg.com/1200x/67/2a/04/672a04cf6ce8229352b269bf1774cd0d.jpg",
      promptText: 'Nói về một sở thích hoặc hoạt động bạn thích làm trong thời gian rảnh. Bạn có 2 phút để trình bày.',
      questionText: [
        'Sở thích của bạn là gì?',
        'Bạn bắt đầu sở thích này khi nào?',
        'Tại sao bạn thích hoạt động này?',
        'Bạn thường làm hoạt động này như thế nào và bao lâu một lần?',
        'Bạn có khuyên người khác thử sở thích này không? Tại sao?'
      ],
      modelAudio: '/audio/hobby_description.mp3',
      tips: [
        'Sử dụng từ vựng đa dạng để mô tả cảm xúc',
        'Kết hợp thì quá khứ đơn để nói về việc bắt đầu sở thích',
        'Dùng thì hiện tại đơn để nói về thói quen',
        'Chuẩn bị 2-3 lý do cụ thể tại sao bạn thích hoạt động đó'
      ],
      sampleResponse: `My favorite hobby is photography. I started getting interested in photography about five years ago when my friend gave me a second-hand camera for my birthday. I love this hobby because it allows me to be creative and capture beautiful moments. Photography also encourages me to explore new places and see things from different perspectives. I usually go out to take photos every weekend, especially during sunrise or sunset when the lighting is perfect. Each session typically lasts around 2-3 hours. I would definitely recommend this hobby to others because it doesn't require expensive equipment to start with - even a smartphone can take great photos nowadays. It's also a wonderful way to document memories and express yourself artistically.`,
      rubric: {
        pronunciation: 'Phát âm rõ ràng, nhấn đúng âm',
        fluency: 'Nói tự nhiên, liền mạch với tốc độ phù hợp',
        vocabulary: 'Sử dụng từ vựng phong phú, có từ chuyên ngành',
        grammar: 'Sử dụng đúng và đa dạng cấu trúc câu',
        taskAchievement: 'Trả lời đầy đủ và chi tiết các câu hỏi'
      }
    },
    {
      id: 4,
      title: "Mô tả và so sánh ảnh",
      level: 'Intermediate',
      duration: '2 phút',
      topic: 'Description',
      thumbnail: "https://i.pinimg.com/1200x/67/2a/04/672a04cf6ce8229352b269bf1774cd0d.jpg",
      promptText: 'Bạn sẽ thấy hai hình ảnh về các thành phố. Hãy mô tả và so sánh hai hình ảnh này, đồng thời nói về nơi bạn thích sống hơn.',
      questionText: [
        'Bạn thấy gì trong hai hình ảnh này?',
        'Hai hình ảnh giống và khác nhau như thế nào?',
        'Bạn thích sống ở đâu hơn và tại sao?',
        'Theo bạn, cuộc sống ở thành phố lớn và thành phố nhỏ có gì khác biệt?',
        'Xu hướng sinh sống của người dân trong tương lai sẽ như thế nào?'
      ],
      modelAudio: '/audio/compare_cities.mp3',
      tips: [
        'Bắt đầu bằng cách mô tả tổng quát về hai hình ảnh',
        'Sử dụng từ nối so sánh: whereas, while, however, in contrast',
        'Dùng cấu trúc so sánh: more than, less than, as...as',
        'Đưa ra ý kiến cá nhân với lý do cụ thể',
        'Kết luận bằng dự đoán hoặc nhận xét chung'
      ],
      sampleResponse: `The two images show different types of cities. In the first picture, I can see a large metropolis with many skyscrapers, busy streets, and a lot of traffic. It seems to be a financial district in a major city like New York or Tokyo. In the second image, there is a smaller town with lower buildings, less traffic, and more green spaces. The architecture looks more traditional and the pace seems more relaxed.

The main similarities between these cities are that both have buildings, roads, and people living there. However, they differ significantly in size, atmosphere, and probably lifestyle. While the big city appears crowded and fast-paced, the smaller town looks more peaceful and community-oriented.

Personally, I would prefer to live in the smaller town because I value peace and quiet, clean air, and a stronger sense of community. I think life would be less stressful there, and I could enjoy nature more easily. In big cities, people often face problems like pollution, high living costs, and long commutes, although they offer more job opportunities and entertainment options.

I believe in the future, we might see more people moving to medium-sized cities that offer a balance between career opportunities and quality of life, especially as remote work becomes more common. People want the conveniences of urban life without the drawbacks of megacities.`,
      rubric: {
        pronunciation: 'Phát âm rõ ràng, đặc biệt với từ khó',
        fluency: 'Nói tự nhiên, chuyển ý mạch lạc',
        vocabulary: 'Sử dụng từ vựng phong phú về đô thị và môi trường',
        grammar: 'Sử dụng đúng cấu trúc so sánh và đa dạng thì',
        taskAchievement: 'Mô tả, so sánh đầy đủ và đưa ra quan điểm cá nhân rõ ràng'
      }
    },
    {
      id: 5,
      title: "Thảo luận vấn đề và giải pháp",
      level: 'Advanced',
      duration: '3 phút',
      topic: 'Environment',
      thumbnail: "https://i.pinimg.com/1200x/67/2a/04/672a04cf6ce8229352b269bf1774cd0d.jpg",
      promptText: 'Bạn sẽ thảo luận về vấn đề ô nhiễm nhựa đang ảnh hưởng đến môi trường biển. Bạn có 3 phút để trình bày quan điểm của mình.',
      questionText: [
        'Tại sao ô nhiễm nhựa trở thành vấn đề nghiêm trọng hiện nay?',
        'Loại nhựa nào gây hại nhất cho môi trường biển và sinh vật biển?',
        'Trách nhiệm giải quyết vấn đề này thuộc về ai?',
        'Những giải pháp nào có thể giúp giảm thiểu ô nhiễm nhựa?',
        'Làm thế nào để nâng cao nhận thức của cộng đồng về vấn đề này?'
      ],
      modelAudio: '/audio/plastic_pollution.mp3',
      tips: [
        'Bắt đầu với số liệu hoặc ví dụ thực tế để gây ấn tượng',
        'Phân tích vấn đề theo nhiều khía cạnh: xã hội, kinh tế, môi trường',
        'Đề xuất giải pháp cụ thể và khả thi',
        'Sử dụng từ vựng học thuật và chuyên ngành môi trường',
        'Kết luận với lời kêu gọi hành động'
      ],
      sampleResponse: `Plastic pollution has emerged as one of the most pressing environmental challenges of our time. According to recent studies, approximately 8 million metric tons of plastic waste enter our oceans annually, which is equivalent to dumping a garbage truck of plastic into the ocean every minute.

Single-use plastics such as straws, bags, and food containers are particularly harmful to marine environments because they take hundreds of years to decompose. Meanwhile, microplastics – tiny particles less than 5mm in size – pose an even more insidious threat as they enter the food chain and can be ingested by marine organisms and eventually humans.

The responsibility for addressing this crisis falls on multiple stakeholders. Governments need to implement and enforce stricter regulations on plastic production and disposal. Corporations must innovate to find sustainable alternatives and take responsibility for the entire lifecycle of their products. However, individuals also play a crucial role through their consumption choices and disposal habits.

Several promising solutions exist to combat plastic pollution. First, implementing comprehensive plastic bans and taxes has proven effective in countries like Rwanda and Ireland. Second, investing in waste management infrastructure, particularly in developing nations where much ocean plastic originates, is essential. Third, advancing biodegradable materials and circular economy approaches can help reduce our dependence on conventional plastics.

To raise community awareness, education programs should be integrated into school curricula from an early age. Social media campaigns showcasing the impact of plastic pollution can also be powerful. Additionally, community clean-up events not only remove existing pollution but also create firsthand experiences that change people's perspectives.

In conclusion, tackling plastic pollution requires coordinated efforts across all sectors of society. While the challenge is immense, with collective action and innovation, we can significantly reduce the amount of plastic entering our oceans and protect marine ecosystems for future generations.`,
      rubric: {
        pronunciation: 'Phát âm rõ ràng, tự tin với từ chuyên ngành',
        fluency: 'Nói trôi chảy, chuyển ý mạch lạc, tốc độ phù hợp',
        vocabulary: 'Sử dụng từ vựng học thuật và chuyên ngành môi trường đa dạng',
        grammar: 'Sử dụng cấu trúc câu phức, đa dạng thì và thể',
        taskAchievement: 'Phân tích vấn đề toàn diện, đề xuất giải pháp cụ thể, kết luận hiệu quả'
      }
    },
    {
      id: 6,
      title: "Phỏng vấn công việc",
      level: 'Advanced',
      duration: '4 phút',
      topic: 'Career',
      thumbnail: "https://i.pinimg.com/1200x/67/2a/04/672a04cf6ce8229352b269bf1774cd0d.jpg",
      promptText: 'Hãy tưởng tượng bạn đang tham gia một cuộc phỏng vấn xin việc cho vị trí mà bạn mong muốn. Bạn có 4 phút để trả lời các câu hỏi phỏng vấn.',
      questionText: [
        'Giới thiệu bản thân và lý do bạn ứng tuyển vị trí này?',
        'Những kinh nghiệm và kỹ năng nào khiến bạn phù hợp với vị trí này?',
        'Điểm mạnh và điểm yếu của bạn là gì?',
        'Bạn có thể kể về một thách thức lớn bạn đã đối mặt và cách bạn vượt qua nó?',
        'Bạn thấy mình ở đâu trong 5 năm tới và bạn dự định phát triển sự nghiệp như thế nào?'
      ],
      modelAudio: '/audio/job_interview.mp3',
      tips: [
        'Chuẩn bị câu trả lời ngắn gọn, súc tích nhưng đầy đủ thông tin',
        'Sử dụng phương pháp STAR (Situation, Task, Action, Result) để kể về kinh nghiệm',
        'Đưa ra ví dụ cụ thể để minh họa cho điểm mạnh và kỹ năng',
        'Tỏ ra tự tin nhưng khiêm tốn',
        'Kết thúc bằng câu hỏi thể hiện sự quan tâm đến công ty'
      ],
      sampleResponse: `Good morning. My name is David Nguyen, and I'm excited to be interviewing for the Marketing Manager position. I'm passionate about digital marketing and have been following your company's innovative campaigns for years. I believe my creative approach and analytical skills would be valuable to your team.

Over the past seven years, I've developed extensive experience in digital marketing. At my current company, I led a team that increased online engagement by 70% through targeted social media campaigns and content marketing. My technical skills include proficiency in Google Analytics, SEO optimization, and various CRM systems. I also have strong leadership abilities, having managed teams of up to 10 people.

My greatest strength is my ability to analyze market trends and translate that data into creative marketing strategies. For example, I identified an untapped demographic in our market and developed a campaign that resulted in a 45% increase in sales from that segment. As for weaknesses, I sometimes become too focused on perfecting details, which can impact timelines. I've addressed this by implementing better project management tools and setting more realistic deadlines.

A significant challenge I faced was when our company experienced a public relations crisis after a product recall. I was tasked with rebuilding customer trust through our marketing channels. I developed a transparent communication strategy, openly acknowledging the issue and clearly explaining the steps we were taking to resolve it. I created a series of authentic video messages from our CEO and established a dedicated customer support system. Within three months, our customer satisfaction scores returned to pre-crisis levels, and we retained 85% of our client base.

In five years, I see myself having grown within your organization, perhaps leading larger marketing initiatives or exploring international markets. I'm committed to continuous learning and recently completed a certification in digital marketing analytics. I'm also interested in mentoring junior team members, as developing talent is something I find fulfilling professionally.

May I ask what you consider the most important qualities for success in this position at your company?`,
      rubric: {
        pronunciation: 'Phát âm rõ ràng, tự tin, ngữ điệu phù hợp',
        fluency: 'Nói trôi chảy, tự nhiên, tốc độ phù hợp với tình huống phỏng vấn',
        vocabulary: 'Sử dụng từ vựng chuyên ngành và từ vựng kinh doanh đa dạng',
        grammar: 'Sử dụng đúng ngữ pháp, đa dạng cấu trúc câu',
        taskAchievement: 'Trả lời đầy đủ, súc tích, có ví dụ cụ thể, logic và thuyết phục'
      }
    }
  ];

  // Start recording function
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        setIsRecording(false);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start countdown if prompt has a specified duration
      if (selectedPrompt) {
        const durationInSeconds = parseInt(selectedPrompt.duration.split(' ')[0]) * 60;
        setCountdownTime(durationInSeconds);
        setIsCounting(true);
        
        countdownRef.current = setInterval(() => {
          setCountdownTime(prevTime => {
            if (prevTime <= 1) {
              clearInterval(countdownRef.current!);
              setIsCounting(false);
              stopRecording();
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not start recording. Please make sure you have given microphone permission.');
    }
  };

  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      
      // Clear countdown interval
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        setIsCounting(false);
      }
    }
  };

  // Reset recording function
  const resetRecording = () => {
    setRecordedAudio(null);
    setIsPlayingRecorded(false);
    if (recordedAudioRef.current) {
      recordedAudioRef.current.pause();
      recordedAudioRef.current.currentTime = 0;
    }
  };

  // Play model audio
  const toggleModelAudio = () => {
    if (modelAudioRef.current) {
      if (isPlayingModel) {
        modelAudioRef.current.pause();
      } else {
        modelAudioRef.current.play();
      }
      setIsPlayingModel(!isPlayingModel);
    }
  };

  // Play recorded audio
  const toggleRecordedAudio = () => {
    if (recordedAudioRef.current) {
      if (isPlayingRecorded) {
        recordedAudioRef.current.pause();
      } else {
        recordedAudioRef.current.play();
      }
      setIsPlayingRecorded(!isPlayingRecorded);
    }
  };

  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle prompt selection
  const handlePromptSelect = (prompt: SpeakingPrompt) => {
    setSelectedPrompt(prompt);
    setRecordedAudio(null);
    setIsSubmitted(false);
    setShowSample(false);
    setShowTips(false);
    
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      setIsCounting(false);
    }
  };

  // Handle level filter change
  const handleLevelChange = (level: string) => {
    setSelectedLevel(level);
  };

  // Handle submission
  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  // Filter prompts by level
  const filteredPrompts = selectedLevel === 'All'
    ? speakingPrompts
    : speakingPrompts.filter(prompt => prompt.level === selectedLevel);

  return (
    <div className="speaking-page">
      <section className="speaking-hero">
        <div className="container">
          <div className="speaking-hero-content">
            <FaMicrophone className="speaking-icon" />
            <h1>Luyện nói tiếng Anh</h1>
            <p>Nâng cao kỹ năng giao tiếp của bạn thông qua các bài tập thực hành</p>
          </div>
        </div>
      </section>

      <section className="speaking-content">
        <div className="container">
          {!selectedPrompt ? (
            <>
              <div className="speaking-filter">
                <h2>Chọn chủ đề luyện nói</h2>
                <div className="filter-buttons">
                  <button 
                    className={selectedLevel === 'All' ? 'active' : ''} 
                    onClick={() => handleLevelChange('All')}
                  >
                    Tất cả
                  </button>
                  <button 
                    className={selectedLevel === 'Beginner' ? 'active' : ''} 
                    onClick={() => handleLevelChange('Beginner')}
                  >
                    Sơ cấp
                  </button>
                  <button 
                    className={selectedLevel === 'Intermediate' ? 'active' : ''} 
                    onClick={() => handleLevelChange('Intermediate')}
                  >
                    Trung cấp
                  </button>
                  <button 
                    className={selectedLevel === 'Advanced' ? 'active' : ''} 
                    onClick={() => handleLevelChange('Advanced')}
                  >
                    Cao cấp
                  </button>
                </div>
              </div>

              <div className="speaking-prompts-grid">
                {filteredPrompts.map(prompt => (
                  <div 
                    key={prompt.id} 
                    className="speaking-prompt-card" 
                    onClick={() => handlePromptSelect(prompt)}
                  >
                    <div className="prompt-thumbnail">
                      {prompt.thumbnail.startsWith('http') ? 
                        <img className="thumbnail-image" src={prompt.thumbnail} alt={prompt.title} /> : 
                        prompt.thumbnail
                      }
                    </div>
                    <div className="prompt-info">
                      <h3>{prompt.title}</h3>
                      <div className="prompt-meta">
                        <span className={`level-badge ${prompt.level.toLowerCase()}`}>{prompt.level}</span>
                        <span className="duration"><FaClock /> {prompt.duration}</span>
                        <span className="topic">{prompt.topic}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="speaking-exercise">
              <div className="exercise-header">
                <button className="back-button" onClick={() => setSelectedPrompt(null)}>
                  &larr; Quay lại
                </button>
                <h2>{selectedPrompt.title}</h2>
                <div className="prompt-meta">
                  <span className={`level-badge ${selectedPrompt.level.toLowerCase()}`}>
                    {selectedPrompt.level}
                  </span>
                  <span className="duration"><FaClock /> {selectedPrompt.duration}</span>
                  <span className="topic">{selectedPrompt.topic}</span>
                </div>
              </div>

              <div className="exercise-content">
                <div className="prompt-section">
                  <div className="prompt-text">
                    <h3>Hướng dẫn</h3>
                    <p>{selectedPrompt.promptText}</p>
                    
                    <div className="questions">
                      <h4>Câu hỏi:</h4>
                      <ul>
                        {selectedPrompt.questionText.map((question, index) => (
                          <li key={index}>{question}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="preparation-tip">
                      <FaLightbulb /> <strong>Mẹo:</strong> Hãy dành 30 giây để chuẩn bị ý tưởng trước khi bắt đầu ghi âm.
                    </div>
                  </div>

                  <div className="exercise-actions">
                    <div className="tips-toggle" onClick={() => setShowTips(!showTips)}>
                      <FaLightbulb /> {showTips ? 'Ẩn mẹo' : 'Xem mẹo'}
                    </div>
                    {selectedPrompt.modelAudio && (
                      <div className="model-audio">
                        <button className="model-button" onClick={toggleModelAudio}>
                          {isPlayingModel ? <FaPause /> : <FaPlay />} Nghe mẫu
                        </button>
                        <audio 
                          ref={modelAudioRef} 
                          src={selectedPrompt.modelAudio}
                          onEnded={() => setIsPlayingModel(false)}
                        />
                      </div>
                    )}
                  </div>

                  {showTips && (
                    <div className="tips-section">
                      <h3>Mẹo hữu ích</h3>
                      <ul>
                        {selectedPrompt.tips.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="recording-section">
                  <h3>Ghi âm câu trả lời của bạn</h3>
                  
                  {isCounting && (
                    <div className="countdown-timer">
                      <FaClock /> Thời gian còn lại: {formatTime(countdownTime)}
                    </div>
                  )}
                  
                  <div className="recording-controls">
                    {!isRecording && !recordedAudio && (
                      <button 
                        className="record-button"
                        onClick={startRecording}
                      >
                        <FaMicrophone /> Bắt đầu ghi âm
                      </button>
                    )}
                    
                    {isRecording && (
                      <button 
                        className="stop-button"
                        onClick={stopRecording}
                      >
                        <FaStop /> Dừng ghi âm
                      </button>
                    )}
                    
                    {recordedAudio && (
                      <>
                        <div className="recorded-audio-controls">
                          <button 
                            className="play-button"
                            onClick={toggleRecordedAudio}
                          >
                            {isPlayingRecorded ? <FaPause /> : <FaPlay />} {isPlayingRecorded ? 'Tạm dừng' : 'Phát'}
                          </button>
                          <button 
                            className="reset-button"
                            onClick={resetRecording}
                          >
                            <FaRedo /> Ghi lại
                          </button>
                          {!isSubmitted && (
                            <button 
                              className="submit-button"
                              onClick={handleSubmit}
                            >
                              <FaCheckCircle /> Nộp bài
                            </button>
                          )}
                        </div>
                        <audio 
                          ref={recordedAudioRef}
                          src={recordedAudio}
                          onEnded={() => setIsPlayingRecorded(false)}
                        />
                      </>
                    )}
                  </div>
                </div>

                {recordedAudio && isSubmitted && (
                  <div className="feedback-section">
                    <h3>Đánh giá kỹ năng nói</h3>
                    
                    {selectedPrompt.sampleResponse && (
                      <div className="sample-toggle" onClick={() => setShowSample(!showSample)}>
                        <FaComments /> {showSample ? 'Ẩn câu trả lời mẫu' : 'Xem câu trả lời mẫu'}
                      </div>
                    )}
                    
                    {showSample && selectedPrompt.sampleResponse && (
                      <div className="sample-answer">
                        <h4>Câu trả lời mẫu:</h4>
                        <p>{selectedPrompt.sampleResponse}</p>
                      </div>
                    )}
                    
                    <div className="comparison-section">
                      <h4><MdCompareArrows /> So sánh với câu trả lời của bạn</h4>
                      <div className="audio-comparison">
                        {selectedPrompt.modelAudio && (
                          <div className="model-audio-player">
                            <h5>Bản mẫu</h5>
                            <button onClick={toggleModelAudio}>
                              {isPlayingModel ? <FaPause /> : <FaPlay />}
                            </button>
                          </div>
                        )}
                        <div className="user-audio-player">
                          <h5>Bản của bạn</h5>
                          <button onClick={toggleRecordedAudio}>
                            {isPlayingRecorded ? <FaPause /> : <FaPlay />}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rubric-section">
                      <h4>Tiêu chí đánh giá</h4>
                      <div className="rubric-criteria">
                        <div className="rubric-item">
                          <h5>Phát âm</h5>
                          <p>{selectedPrompt.rubric.pronunciation}</p>
                        </div>
                        <div className="rubric-item">
                          <h5>Trôi chảy</h5>
                          <p>{selectedPrompt.rubric.fluency}</p>
                        </div>
                        <div className="rubric-item">
                          <h5>Từ vựng</h5>
                          <p>{selectedPrompt.rubric.vocabulary}</p>
                        </div>
                        <div className="rubric-item">
                          <h5>Ngữ pháp</h5>
                          <p>{selectedPrompt.rubric.grammar}</p>
                        </div>
                        <div className="rubric-item">
                          <h5>Hoàn thành nhiệm vụ</h5>
                          <p>{selectedPrompt.rubric.taskAchievement}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="practice-more">
                      <h4><BiTrophy /> Tiếp tục luyện tập</h4>
                      <p>Hãy thử những bài tập khác để nâng cao kỹ năng nói của bạn.</p>
                      <button 
                        className="next-exercise-button"
                        onClick={() => setSelectedPrompt(null)}
                      >
                        Chọn bài tập khác
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SpeakingPage;