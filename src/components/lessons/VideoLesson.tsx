import React, { useEffect, useRef, useState } from 'react';
import './VideoLesson.css';

// Định nghĩa type cho note
interface VideoNote {
  time: number;
  text: string;
}

// Định nghĩa type cho Cloudinary Player
interface CloudinaryPlayer {
  currentTime(time?: number): number;
  play(): void;
  pause(): void;
  on(event: string, callback: () => void): void;
}

interface CloudinaryInstance {
  videoPlayer(
    elementId: string,
    options: { publicId: string; profile?: string }
  ): CloudinaryPlayer;
}

interface CloudinaryInstance {
  videoPlayer(
    elementId: string,
    options: { publicId: string; profile?: string }
  ): CloudinaryPlayer;
}

interface CloudinaryStatic {
  new(config: { cloud_name: string }): CloudinaryInstance;
}

declare global {
  interface Window {
    cloudinary?: {
      Cloudinary?: CloudinaryStatic;
    };
  }
  // eslint-disable-next-line no-var
  var cloudinary: {
    Cloudinary: {
      new(config: { cloud_name: string }): CloudinaryInstance;
    };
  };
}

interface VideoLessonProps {
  publicId?: string;
  cloudName?: string;
  videoUrl?: string;
  lesson?: {
    id: number;
    title: string;
    videoUrl: string;
    description: string;
    duration: string;
    completed: boolean;
  };
  courseTitle?: string;
  onBack?: () => void;
  hideHeader?: boolean;
  onComplete?: () => void;
}

const VideoLesson: React.FC<VideoLessonProps> = ({
  publicId,
  cloudName = 'dc5glptng',
  lesson,
}) => {
  // Determine the actual publicId to use
  const actualPublicId = publicId || (lesson?.videoUrl ? extractPublicId(lesson.videoUrl) : '');

  // Helper function to extract publicId from URL or use as-is
  function extractPublicId(url: string): string {
    // If it's already a publicId (no http/https), return as-is
    if (!url.startsWith('http')) {
      return url;
    }
    
    // Check if it's a Cloudinary embed URL
    if (url.includes('player.cloudinary.com/embed')) {
      // Extract public_id from embed URL query params
      const urlObj = new URL(url);
      const publicIdParam = urlObj.searchParams.get('public_id');
      if (publicIdParam) {
        return decodeURIComponent(publicIdParam);
      }
    }
    
    // Extract publicId from standard Cloudinary video URL
    const match = url.match(/\/video\/upload\/(?:v\d+\/)?(.*?)(?:\.[^.]+)?$/);
    return match ? match[1] : url;
  }
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<CloudinaryPlayer | null>(null);
  const isInitializedRef = useRef(false); // Track if player is already initialized
  const [notes, setNotes] = useState<VideoNote[]>([]);
  const [noteText, setNoteText] = useState('');
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);

  // Load Cloudinary Player script
  useEffect(() => {
    // Load CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href =
      'https://unpkg.com/cloudinary-video-player/dist/cld-video-player.min.css';
    document.head.appendChild(cssLink);

    // Load JS
    const script = document.createElement('script');
    script.src =
      'https://unpkg.com/cloudinary-video-player/dist/cld-video-player.min.js';
    script.async = true;
    script.onload = () => {
      // Wait for DOM to be fully ready
      setTimeout(() => {
        initializePlayer();
      }, 200);
    };
    document.body.appendChild(script);

    return () => {
      // Don't cleanup - let player stay initialized
      // Cleanup only on unmount
    };
  }, [actualPublicId]); // Add dependency to re-initialize when publicId changes

  // Khởi tạo Cloudinary Player
  const initializePlayer = () => {
    // Prevent re-initialization
    if (isInitializedRef.current) {
      console.log('Player already initialized, skipping...');
      return;
    }

    console.log('Initializing player...', {
      hasVideoRef: !!videoRef.current,
      hasCloudinary: typeof cloudinary !== 'undefined',
      actualPublicId,
    });

    // Wait for video element to be in DOM
    const videoElement = document.getElementById('cloudinary-video-player');
    console.log('Video element:', videoElement, 'Tag:', videoElement?.tagName);

    if (!videoElement || videoElement.tagName !== 'VIDEO') {
      console.error('Video element not found or not a VIDEO tag');
      return;
    }

    // Check if cloudinary is available globally
    if (typeof cloudinary === 'undefined' || !cloudinary.Cloudinary) {
      console.error('Cloudinary library not loaded');
      return;
    }

    if (!actualPublicId) {
      console.error('No publicId provided for video player');
      return;
    }

    try {
      // Use global cloudinary object like in HTML example
      // @ts-ignore - Cloudinary library exposes .new() as static method
      const cld = cloudinary.Cloudinary.new({
        cloud_name: cloudName,
      });

      console.log('Cloudinary instance created, initializing player...');

      // Use ID string like in HTML example
      const player = cld.videoPlayer('cloudinary-video-player', {
        publicId: actualPublicId,
        cloudName: cloudName,
        controls: true,
        autoplay: false,
        muted: false,
        sourceTypes: ['mp4', 'webm', 'ogv'],
        transformation: { quality: 'auto' },
      });

      console.log('Player initialized successfully', player);

      playerRef.current = player;
      isInitializedRef.current = true; // Mark as initialized
      setIsPlayerReady(true);

      // Add event listeners for debugging
      player.on('loadstart', () => console.log('Video load started'));
      player.on('loadeddata', () => console.log('Video data loaded'));
      player.on('canplay', () => console.log('Video can play'));
      player.on('error', (e: any) => console.error('Video error:', e));
      player.on('play', () => console.log('Video playing'));
      player.on('pause', () => console.log('Video paused'));
    } catch (error) {
      console.error('Error initializing Cloudinary player:', error);
    }
  };

  // Thêm note mới
  const handleAddNote = () => {
    const text = noteText.trim();
    if (!text) {
      alert('Vui lòng nhập nội dung ghi chú');
      return;
    }

    if (!playerRef.current) {
      alert('Video player chưa sẵn sàng');
      return;
    }

    const time = Math.floor(playerRef.current.currentTime());
    const newNote: VideoNote = { time, text };

    setNotes((prevNotes) => [...prevNotes, newNote]);
    setNoteText('');
    setShowNoteInput(false);
  };

  // Click vào note để nhảy đến thời điểm đó
  const handleNoteClick = (time: number) => {
    if (!playerRef.current) return;

    console.log('Seeking to time:', time);
    
    try {
      // Try different methods to seek
      const player = playerRef.current as any;
      
      // Method 1: Direct currentTime setter
      if (typeof player.currentTime === 'function') {
        player.currentTime(time);
      } else {
        // Method 2: Access underlying video element
        const videoEl = player.videojs?.el()?.querySelector('video') || 
                       document.querySelector('#cloudinary-video-player video');
        if (videoEl) {
          videoEl.currentTime = time;
        }
      }
      
      console.log('New time:', player.currentTime());
      player.play();
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };

  // Format giây thành mm:ss
  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Xóa note
  const handleDeleteNote = (index: number) => {
    setNotes((prevNotes) => prevNotes.filter((_, i) => i !== index));
  };

  return (
    <div className="video-lesson-container">
      <div className="video-wrapper">
        <video
          ref={videoRef}
          id="cloudinary-video-player"
          className="video-player"
        />
      </div>

      {/* Video Description */}
      {lesson?.description && (
        <div className="video-description">
          <h3>Mô tả video</h3>
          <p>{lesson.description}</p>
        </div>
      )}

      <div className="notes-section">
        <div className="notes-header">
          <h3 className="notes-title">
            Ghi chú của bạn ({notes.length})
          </h3>
          <button
            className="add-note-icon-btn"
            onClick={() => setShowNoteInput(true)}
            title="Thêm ghi chú mới"
          >
            +
          </button>
        </div>

        {/* Note Input Form */}
        {showNoteInput && (
          <div className="note-input-wrapper">
            <input
              type="text"
              className="note-input"
              placeholder="Nhập nội dung ghi chú của bạn..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleAddNote();
              }}
              autoFocus
            />
            <div className="note-actions">
              <button
                className="cancel-note-btn"
                onClick={() => {
                  setShowNoteInput(false);
                  setNoteText('');
                }}
              >
                Hủy
              </button>
              <button
                className="add-note-btn"
                onClick={handleAddNote}
              >
                Lưu ghi chú
              </button>
            </div>
          </div>
        )}

        <div className="notes-list">
          {notes.length === 0 ? (
            <p className="no-notes">Chưa có ghi chú nào</p>
          ) : (
            notes.map((note, index) => (
              <div
                key={index}
                className="note-item"
                onClick={() => handleNoteClick(note.time)}
              >
                <div className="note-content">
                  <span className="note-time">[{formatTime(note.time)}]</span>
                  <span className="note-text">{note.text}</span>
                </div>
                <button
                  className="delete-note-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNote(index);
                  }}
                >
                  Xóa
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoLesson;
