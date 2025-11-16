import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaCheckCircle, FaClock, FaChevronRight } from 'react-icons/fa';
import './VideoLesson.css';

interface LearningObjective {
  id: string;
  text: string;
}

interface NextLesson {
  id: number;
  title: string;
}

interface VideoLessonProps {
  lesson: {
    id: number;
    title: string;
    description: string;
    duration: string;
    videoUrl: string;
    completed?: boolean;
    learningObjectives?: LearningObjective[];
    nextLesson?: NextLesson;
  };
  courseTitle?: string;
  onBack: () => void;
  onComplete?: (lessonId: number) => void;
  onNextLesson?: (lessonId: number) => void;
}

const VideoLesson: React.FC<VideoLessonProps> = ({
  lesson,
  courseTitle = "Khóa học của tôi",
  onBack,
  onComplete,
  onNextLesson,
}) => {
  const [completed, setCompleted] = useState(lesson.completed || false);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const autoCompleteTriggered = useRef(false);

  // Load completion status from localStorage
  useEffect(() => {
    const storageKey = `lesson_${lesson.id}_completed`;
    const savedStatus = localStorage.getItem(storageKey);
    if (savedStatus === 'true') {
      setCompleted(true);
    }
    
    // Load progress
    const savedProgress = localStorage.getItem(`lesson_${lesson.id}_progress`);
    if (savedProgress) {
      setProgress(parseInt(savedProgress, 10));
    }
  }, [lesson.id]);

  // Listen to video player events via postMessage
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Accept messages from Cloudinary
      if (!event.origin.includes('cloudinary.com') && !event.origin.includes('player.cloudinary')) {
        return;
      }
      
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        
        // Handle different event formats
        const eventType = data.eventType || data.event || data.type;
        const currentTime = data.currentTime || data.time || 0;
        const duration = data.duration || data.totalTime || 1;
        
        // Handle video progress
        if (eventType === 'timeupdate' || eventType === 'progress' || eventType === 'playing') {
          const progressPercent = Math.min(100, Math.floor((currentTime / duration) * 100));
          
          if (progressPercent > 0) {
            setVideoProgress(progressPercent);
            setProgress(progressPercent);
            
            // Save progress to localStorage
            localStorage.setItem(`lesson_${lesson.id}_progress`, String(progressPercent));
            
            // Auto complete when video reaches 90%
            if (progressPercent >= 90 && !completed && !autoCompleteTriggered.current) {
              autoCompleteTriggered.current = true;
              handleAutoComplete();
            }
          }
        }
        
        // Handle video ended event
        if (eventType === 'ended' || eventType === 'end' || eventType === 'complete') {
          if (!completed && !autoCompleteTriggered.current) {
            autoCompleteTriggered.current = true;
            handleAutoComplete();
          }
        }
      } catch (error) {
        console.error('Error handling video message:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Try to initialize Cloudinary player events
    setTimeout(() => {
      if (iframeRef.current?.contentWindow) {
        try {
          iframeRef.current.contentWindow.postMessage({
            type: 'subscribe',
            events: ['play', 'pause', 'timeupdate', 'ended', 'progress']
          }, '*');
        } catch (e) {
          console.error('Failed to subscribe to player events:', e);
        }
      }
    }, 2000);
    
    // Also add a fallback timer to track video watching time
    let watchTime = 0;
    const watchInterval = setInterval(() => {
      if (!completed && !autoCompleteTriggered.current) {
        watchTime += 1;
        // Assume lesson duration is in "X phút" format, extract the number
        const durationMatch = lesson.duration.match(/(\d+)/);
        const estimatedDuration = durationMatch ? parseInt(durationMatch[1]) * 60 : 600; // default 10 minutes
        
        const watchProgress = Math.min(100, Math.floor((watchTime / estimatedDuration) * 100));
        
        // Update progress every 5 seconds
        if (watchTime % 5 === 0 && watchProgress > progress) {
          setProgress(watchProgress);
          localStorage.setItem(`lesson_${lesson.id}_progress`, String(watchProgress));
        }
        
        // Auto complete after watching for estimated duration
        if (watchTime >= estimatedDuration * 0.9 && !autoCompleteTriggered.current) {
          autoCompleteTriggered.current = true;
          handleAutoComplete();
        }
      }
    }, 1000);
    
    return () => {
      window.removeEventListener('message', handleMessage);
      clearInterval(watchInterval);
    };
  }, [lesson.id, completed, progress]);

  const handleAutoComplete = () => {
    console.log('handleAutoComplete called');
    setCompleted(true);
    setProgress(100);
    
    // Save to localStorage
    const storageKey = `lesson_${lesson.id}_completed`;
    localStorage.setItem(storageKey, 'true');
    localStorage.setItem(`lesson_${lesson.id}_progress`, '100');
    
    // Show completion message
    setShowCompletionMessage(true);
    console.log('Showing completion message');
    setTimeout(() => {
      setShowCompletionMessage(false);
      console.log('Hiding completion message');
    }, 5000); // Increased to 5 seconds for visibility
    
    // Callback to parent component
    if (onComplete) {
      onComplete(lesson.id);
    }
  };

  const handleMarkComplete = () => {
    const newStatus = !completed;
    setCompleted(newStatus);
    
    // Save to localStorage
    const storageKey = `lesson_${lesson.id}_completed`;
    localStorage.setItem(storageKey, String(newStatus));
    
    // Update progress to 100% when completed
    if (newStatus) {
      setProgress(100);
      localStorage.setItem(`lesson_${lesson.id}_progress`, '100');
      setShowCompletionMessage(true);
      setTimeout(() => setShowCompletionMessage(false), 3000);
      autoCompleteTriggered.current = true;
    } else {
      // Reset auto complete trigger if uncompleted
      autoCompleteTriggered.current = false;
    }
    
    // Callback to parent component
    if (onComplete) {
      onComplete(lesson.id);
    }
  };

  const handleNextLesson = () => {
    if (lesson.nextLesson && onNextLesson) {
      onNextLesson(lesson.nextLesson.id);
    }
  };

  return (
    <div className="video-lesson-container">
      {/* Completion Message Toast */}
      {showCompletionMessage && (
        <div className="video-lesson-toast">
          <FaCheckCircle style={{ fontSize: 24 }} />
          <span>🎉 Bạn đã hoàn thành bài học!</span>
        </div>
      )}

      {/* Header */}
      <header className="video-lesson-header">
        <button onClick={onBack} className="video-lesson-back-button">
          <FaArrowLeft />
          <span>Quay lại {courseTitle}</span>
        </button>
        
        <div className="video-lesson-header-right">
          <div className="video-lesson-duration-badge">
            <FaClock />
            <span>{lesson.duration}</span>
          </div>
        </div>
      </header>


      {/* Main Content */}
      <main className="video-lesson-main">
        {/* Title Section */}
        <div className="video-lesson-title-section">
          <h1 className="video-lesson-title">{lesson.title}</h1>
          <button
            onClick={handleMarkComplete}
            className={`video-lesson-complete-button ${completed ? 'completed' : ''}`}
          >
            <FaCheckCircle />
            <span>{completed ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}</span>
          </button>
        </div>
        

        {/* Video Player */}
        <div className="video-lesson-video-section">
          <div className="video-lesson-video-wrapper">
            {videoLoading && (
              <div className="video-lesson-video-loading">
                <div className="video-lesson-spinner" />
                <p>Đang tải video...</p>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={lesson.videoUrl}
              className="video-lesson-video-iframe"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
              loading="lazy"
              onLoad={() => setVideoLoading(false)}
              title={lesson.title}
            />
          </div>
        </div>

        {/* Description Section */}
        <div className="video-lesson-description-section">
          <h2 className="video-lesson-section-title">📖 Về bài học này</h2>
          <p className="video-lesson-description">{lesson.description}</p>
        </div>

        {/* Learning Objectives */}
        {lesson.learningObjectives && lesson.learningObjectives.length > 0 && (
          <div className="video-lesson-objectives-section">
            <h2 className="video-lesson-section-title">🎯 Mục tiêu học tập</h2>
            <ul className="video-lesson-objectives-list">
              {lesson.learningObjectives.map((objective) => (
                <li key={objective.id} className="video-lesson-objective-item">
                  <FaCheckCircle className="video-lesson-objective-icon" />
                  <span>{objective.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next Lesson Section */}
        {lesson.nextLesson && (
          <div className="video-lesson-next-lesson-section">
            <div className="video-lesson-next-lesson-card">
              <div className="video-lesson-next-lesson-content">
                <p className="video-lesson-next-lesson-label">Bài học tiếp theo</p>
                <h3 className="video-lesson-next-lesson-title">{lesson.nextLesson.title}</h3>
              </div>
              <button
                onClick={handleNextLesson}
                className="video-lesson-next-lesson-button"
                disabled={!completed}
              >
                <span>Tiếp tục</span>
                <FaChevronRight />
              </button>
            </div>
            {!completed && (
              <p className="video-lesson-next-lesson-hint">
                💡 Hoàn thành bài học hiện tại để mở khóa bài tiếp theo
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="video-lesson-action-buttons">
          <button onClick={onBack} className="video-lesson-secondary-button">
            Quay lại danh sách
          </button>
          {lesson.nextLesson && completed && (
            <button onClick={handleNextLesson} className="video-lesson-primary-button">
              <span>Bài tiếp theo</span>
              <FaChevronRight />
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default VideoLesson;
