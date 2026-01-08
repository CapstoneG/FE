import { useState, useRef, useEffect } from 'react';
import './SpeakingPage.css';
import { skillsService } from '../services/skills';
import { Pagination } from '../components';

interface SpeakingMetadata {
  estimatedTime: string;
  prompt: string;
  followUpQuestions: string[];
  ideaHints: string[];
  usefulPhrases: string[];
}

interface SpeakingExercise {
  id: number;
  title: string;
  topic: string;
  level: string;
  mediaUrl: string | null;
  thumbnail: string;
  skillType: string;
  metadata: SpeakingMetadata;
}

const SpeakingPage = () => {
  const [exercises, setExercises] = useState<SpeakingExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState<SpeakingExercise | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string>('');
  const [showPreparation, setShowPreparation] = useState(true);
  

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ==================== PAGINATION ====================
  const itemsPerPage = 9;
  const totalPages = Math.ceil(totalElements / itemsPerPage);

  // ==================== FETCH DATA ====================
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const response = await skillsService.getSpeakingExercises(currentPage);
        setExercises(response.content as unknown as SpeakingExercise[]);
        setTotalElements(response.totalElements);
      } catch (error) {
        console.error('Failed to fetch speaking exercises:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [currentPage]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };


  const handleRetry = () => {
    setAudioURL('');
    setRecordingTime(0);
  };

  const handleBackToList = () => {
    setSelectedExercise(null);
    handleRetry();
    setShowPreparation(true);
    setCurrentPage(0);
  };


  if (selectedExercise) {
    return (
      <div className="speaking-page">
        <button className="back-button" onClick={handleBackToList}>
          ← Back to Exercises
        </button>

        <div className="speaking-header">
          <div className="header-content-speaking">
            <h1>{selectedExercise.title}</h1>
          </div>
          <div className="exercise-info">
            <span className="info-badge level-badge">{selectedExercise.level}</span>
            <span className="info-badge topic-badge">{selectedExercise.topic}</span>
            <span className="info-badge time-badge">{selectedExercise.metadata.estimatedTime}</span>
          </div>
        </div>

        <div className="speaking-container">
          <div className="speaking-content">
            <div className="prompt-section">
              <div className="prompt-card">
                <div className="prompt-icon">💬</div>
                <h3 className="prompt-title">Speaking Topic</h3>
                <p className="prompt-text">{selectedExercise.metadata.prompt}</p>
                
                {selectedExercise.metadata.followUpQuestions.length > 0 && (
                  <div className="follow-up">
                    <h4>Follow-up questions:</h4>
                    <ul>
                      {selectedExercise.metadata.followUpQuestions.map((q, idx) => (
                        <li key={idx}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="encouragement-banner">
                <p>Take your time! It's okay to pause and think. Making mistakes is part of learning.</p>
              </div>
            </div>

            {showPreparation && (
              <div className="preparation-section">
                <div className="prep-header">
                  <h3>Preparation Support</h3>
                  <button 
                    className="toggle-prep-btn"
                    onClick={() => setShowPreparation(false)}
                  >
                    Hide
                  </button>
                </div>

                <div className="prep-content">
                  <div className="prep-card">
                    <h4>Idea Hints</h4>
                    <ul className="hints-list">
                      {selectedExercise.metadata.ideaHints.map((hint, idx) => (
                        <li key={idx}>{hint}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="prep-card">
                    <h4>Useful Phrases</h4>
                    <div className="phrases-list">
                      {selectedExercise.metadata.usefulPhrases.map((phrase, idx) => (
                        <span key={idx} className="phrase-chip">{phrase}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!showPreparation && (
              <button 
                className="show-prep-btn"
                onClick={() => setShowPreparation(true)}
              >
                Show Preparation Support
              </button>
            )}
          </div>

          <div className="recording-section">
            <div className="recording-card">
              <h3>Recording</h3>
              
              <div className={`mic-container ${isRecording ? 'recording' : ''}`}>
                {!isRecording && !audioURL && (
                  <button className="mic-button" onClick={startRecording}>
                    <span className="mic-text">Start Speaking</span>
                  </button>
                )}

                {isRecording && (
                  <>
                    <button className="mic-button recording-active" onClick={stopRecording}>
                      <span className="mic-text">Stop Recording</span>
                    </button>
                    <div className="recording-indicator">
                      <span className="rec-dot"></span>
                      Recording...
                    </div>
                  </>
                )}

                {audioURL && (
                  <div className="audio-playback">
                    <div className="audio-success">
                      <span className="success-icon">✓</span>
                      <p>Recording completed!</p>
                    </div>
                    <audio controls src={audioURL} className="audio-player">
                      Your browser does not support audio playback.
                    </audio>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>

        <div className="action-bar">
          <button className="btn-retry" onClick={handleRetry} disabled={!audioURL}>
            Retry Speaking
          </button>
          <button className="btn-complete" disabled={!audioURL}>
            ✓ Mark as Completed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="speaking-page">
      <div className="speaking-header">
        <h1>Speaking Practice</h1>
        <p className="header-subtitle">Practice speaking English with confidence</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ 
            display: 'inline-block',
            width: '50px',
            height: '50px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #6366f1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginTop: '20px', color: '#6b7280', fontSize: '16px' }}>Loading exercises...</p>
        </div>
      ) : (
        <>
          <div className="exercises-grid">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="exercise-card"
                onClick={() => setSelectedExercise(exercise)}
              >
                <div className="exercise-thumbnail">
                  <img src={exercise.thumbnail} alt={exercise.title} />
                  <div className="exercise-level">{exercise.level}</div>
                </div>
                <div className="exercise-content">
                  <h3 className="exercise-title">{exercise.title}</h3>
                  <div className="exercise-meta">
                    <span className="exercise-topic">{exercise.topic}</span>
                    <span className="exercise-time">{exercise.metadata.estimatedTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            onPageChange={setCurrentPage}
            itemLabel="exercises"
          />
        </>
      )}
    </div>
  );
};

export default SpeakingPage;
