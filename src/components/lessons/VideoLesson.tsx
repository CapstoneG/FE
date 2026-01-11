import React, { useEffect, useRef, useState } from 'react';
import './VideoLesson.css';
import { getVideoNotes, addVideoNote, deleteVideoNote } from '../../services/lessonService';
import type { LessonContent } from '../../services/lessonService';

// Định nghĩa type cho note (local state)
interface VideoNote {
  id?: number;
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
    parsedContent?: LessonContent;
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
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);

  // Get videoId from lesson data
  const videoId = lesson?.parsedContent?.video?.id;

  // Load notes from API when videoId changes
  useEffect(() => {
    if (videoId) {
      loadNotes();
    }
  }, [videoId]);

  // Load notes từ API
  const loadNotes = async () => {
    if (!videoId) return;
    
    setIsLoadingNotes(true);
    try {
      const notesData = await getVideoNotes(videoId);
      const convertedNotes: VideoNote[] = notesData.map(note => ({
        id: note.id,
        time: note.timestamp,
        text: note.content
      }));
      setNotes(convertedNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setIsLoadingNotes(false);
    }
  };

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
  const handleAddNote = async () => {
    const text = noteText.trim();
    if (!text) {
      alert('Vui lòng nhập nội dung ghi chú');
      return;
    }

    if (!playerRef.current || !videoId) {
      alert('Video player chưa sẵn sàng');
      return;
    }

    const time = Math.floor(playerRef.current.currentTime());
    
    try {
      const newNoteFromAPI = await addVideoNote(videoId, time, text);
      const newNote: VideoNote = {
        id: newNoteFromAPI.id,
        time: newNoteFromAPI.timestamp,
        text: newNoteFromAPI.content
      };

      setNotes((prevNotes) => [...prevNotes, newNote]);
      setNoteText('');
      setShowNoteInput(false);
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Không thể thêm ghi chú. Vui lòng thử lại.');
    }
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
  const handleDeleteNote = async (index: number) => {
    const note = notes[index];
    
    if (!note.id) {
      // Nếu note chưa có ID (chưa lưu), chỉ xóa local
      setNotes((prevNotes) => prevNotes.filter((_, i) => i !== index));
      return;
    }
    
    try {
      await deleteVideoNote(note.id);
      setNotes((prevNotes) => prevNotes.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Không thể xóa ghi chú. Vui lòng thử lại.');
    }
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
            onClick={() => setShowNoteInput(!showNoteInput)}
            title="Thêm ghi chú mới"
          >
            +
          </button>
        </div>

        {/* Note Input Form - appears between header and list */}
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
          {isLoadingNotes ? (
            <p className="no-notes">Đang tải ghi chú...</p>
          ) : notes.length === 0 ? (
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
