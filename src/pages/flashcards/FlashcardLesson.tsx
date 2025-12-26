import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '@/styles/flashcards/FlashcardLesson.css';
import { FaCheck } from 'react-icons/fa';
import { flashcardService } from '@/services/flashcards';
import { submitFlashcardResults } from '@/services/studyService';
import volumeIcon from '@/assets/volume.png';

interface FlashCard {
  cardId: number;
  frontText: string;
  backText: string;
  exampleSentence?: string;
  phonetic?: string;
}

interface StudyResult {
  cardId: number;
  quality: number;
}

// API response interface
interface StudyCardResponse {
  id: number;
  term: string;
  phonetic: string;
  definition: string;
  partOfSpeech: string;
  exampleSentence: string;
  deckIds: number[];
  nextReviewAt: string | null;
}

const QUALITY_OPTIONS = [
  { value: 5, label: 'Easy', description: 'Perfect recall' },
  { value: 4, label: 'Good', description: 'Correct with hesitation' },
  { value: 3, label: 'Okay', description: 'Correct with difficulty' },
  { value: 2, label: 'Hard', description: 'Incorrect, but familiar' },
  { value: 1, label: 'Very Hard', description: 'Complete blackout' },
];

const FlashcardLesson: React.FC = () => {
  const navigate = useNavigate();
  const { deckId } = useParams<{ deckId: string }>();
  
  const [flashcards, setFlashcards] = useState<FlashCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState<StudyResult[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch flashcards from API
  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!deckId) {
        setError('Deck ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const studyCards: StudyCardResponse[] = await flashcardService.getStudySession(parseInt(deckId));
        
        // Map API response to FlashCard interface
        const mappedCards: FlashCard[] = studyCards.map((card) => ({
          cardId: card.id,
          frontText: card.term,
          backText: card.definition,
          exampleSentence: card.exampleSentence,
          phonetic: card.phonetic,
        }));
        
        setFlashcards(mappedCards);
        setError(null);
      } catch (err) {
        console.error('Error fetching flashcards:', err);
        setError('Failed to load flashcards. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [deckId]);

  const currentCard = flashcards[currentCardIndex];
  const totalCards = flashcards.length;
  const progressPercent = ((currentCardIndex + 1) / totalCards) * 100;

  // Check if current card already rated (prevent duplicate)
  const isCurrentCardRated = results.some(r => r.cardId === currentCard?.cardId);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const speakWord = (text: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation(); // Prevent card flip when clicking speaker
    }
    
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleQualitySelect = (quality: number) => {
    if (!currentCard || isCurrentCardRated) return;

    // Save result
    const newResult: StudyResult = {
      cardId: currentCard.cardId,
      quality: quality,
    };
    
    setResults([...results, newResult]);

    // Move to next card or complete
    setTimeout(() => {
      if (currentCardIndex < totalCards - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
        setIsFlipped(false);
      } else {
        setIsCompleted(true);
      }
    }, 300);
  };

  const submitStudyResults = async () => {
    setIsSubmitting(true);
    
    if (!deckId) {
      alert('Deck ID is missing');
      setIsSubmitting(false);
      return;
    }
    
    try {
      await submitFlashcardResults({
        deckId: parseInt(deckId),
        results: results,
      });
      
      navigate('/flashcard');
    } catch (error) {
      console.error('Error submitting results:', error);
      alert('Failed to submit results. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (results.length > 0) {
      const confirm = window.confirm(
        'You have unsaved progress. Are you sure you want to exit?'
      );
      if (!confirm) return;
    }
    navigate('/flashcard');
  };

  // Loading state
  if (loading) {
    return (
      <div className="flashcard-lesson">
        <div className="lesson-container">
          <div className="completion-screen">
            <div className="spinner"></div>
            <p>Loading flashcards...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flashcard-lesson">
        <div className="lesson-container">
          <div className="completion-screen">
            <h2 style={{ color: '#ef4444' }}>Error</h2>
            <p>{error}</p>
            <button className="finish-btn" onClick={() => navigate('/flashcard')}>
              Back to Decks
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="flashcard-lesson">
        <div className="lesson-container">
          <div className="completion-screen">
            <div className="completion-icon">
              <FaCheck />
            </div>
            <h1>Lesson Completed!</h1>
            <p className="completion-message">
              Great job! You've studied all {totalCards} flashcards.
            </p>
            <p className="encouragement">
              Keep practicing daily to improve your retention!
            </p>
            <button
              className="finish-btn"
              onClick={submitStudyResults}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Finish & Save Progress'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="flashcard-lesson">
        <div className="lesson-container">
          <p>No flashcards available.</p>
        </div>
      </div>
    );
  }

  return (
      <div className="flashcard-lesson">
        <div className="lesson-container">
          
          {/* Progress and Close Button Row */}
          <div className="progress-close-row">
            {/* Progress Section */}
            <div className="progress-section">
              <div className="progress-info">
                <span className="progress-text-flashcard">
                  Card {currentCardIndex + 1} / {totalCards}
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <button className="close-btn-side" onClick={handleClose} aria-label="Close">
              ✕
            </button>
          </div>

        {/* Study Area - Flashcard + Action side by side */}
        <div className="study-area">
          {/* Flashcard Area */}
          <div className="flashcard-area">
            <div 
              className={`flashcard ${isFlipped ? 'flipped' : ''}`}
              onClick={handleFlip}
            >
              <div className="flashcard-inner">
                {/* Front Side */}
                <div className="flashcard-face flashcard-front">
                  <div className="card-content">
                    <p className="front-text">{currentCard.frontText}</p>
                    <p className="flip-hint">Click to flip</p>
                  </div>
                </div>

                {/* Back Side */}
                <div className="flashcard-face flashcard-back">
                  <div className="card-content">
                    <div className="word-phonetic-group">
                      <p className="word-title">{currentCard.frontText}</p>
                      {currentCard.phonetic && (
                        <p className="phonetic-text">{currentCard.phonetic}</p>
                      )}
                    </div>
                    <button 
                      className="speak-btn-card"
                      onClick={(e) => speakWord(currentCard.frontText, e)}
                      title="Listen to pronunciation"
                      aria-label="Pronounce word"
                    >
                      <img src={volumeIcon} alt="Volume" className="volume-icon" />
                    </button>
                    <div className="divider-flashcard" />
                    <p className="back-text">{currentCard.backText}</p>
                    {currentCard.exampleSentence && (
                      <div className="example-section">
                        <p className="example-label">Example:</p>
                        <p className="example-text">{currentCard.exampleSentence}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Area (shown after flipping) */}
          {isFlipped && (
            <div className="action-area">
              <p className="action-label">How well did you remember?</p>
              <div className="quality-buttons">
                {QUALITY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    className={`quality-btn quality-${option.value}`}
                    onClick={() => handleQualitySelect(option.value)}
                    disabled={isCurrentCardRated}
                  >
                    <span className="quality-label">{option.label}</span>
                    <span className="quality-description">{option.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashcardLesson;

