import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '@/styles/flashcards/FlashcardStudy.css';
import { FaArrowLeft, FaArrowRight, FaShuffle, FaRotate } from 'react-icons/fa6';
import { IoVolumeHigh } from 'react-icons/io5';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { flashcardService } from '@/services/flashcards';
import { useStudyEvents } from '@/hooks';
import type { StudyCard } from '@/services/flashcards';

interface Flashcard {
  id: number;
  word: string;
  pronunciation: string;
  meaning: string;
  example: string;
  partOfSpeech: string;
  isFavorite: boolean;
}

const FlashcardStudy: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deckName, setDeckName] = useState('');

  // Track study session for flashcard learning
  useStudyEvents({
    deckId: parseInt(deckId || '0'),
    activityType: 'FLASHCARD',
    skill: 'VOCAB', 
    autoStart: true,  
    autoEnd: true,    
    onStatsUpdate: (event) => {
      console.log('[Flashcard Study] Stats updated:', event);
    },
  });

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        if (!deckId) return;
        
        const studyCards = await flashcardService.getStudySession(parseInt(deckId));
        
        // Map StudyCard to Flashcard
        const cards: Flashcard[] = studyCards.map((card: StudyCard) => ({
          id: card.id,
          word: card.term,
          pronunciation: card.phonetic,
          meaning: card.definition,
          example: card.exampleSentence,
          partOfSpeech: card.partOfSpeech,
          isFavorite: false
        }));
        
        setFlashcards(cards);
        setDeckName(`Deck #${deckId}`);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [deckId]);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const toggleFavorite = () => {
    const updatedCards = flashcards.map(card =>
      card.id === currentCard.id ? { ...card, isFavorite: !card.isFavorite } : card
    );
    setFlashcards(updatedCards);
  };

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleExit = () => {
    navigate('/flashcard');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === ' ') {
        e.preventDefault();
        handleFlip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flashcards.length]);

  if (loading) {
    return (
      <div className="flashcard-study">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải flashcards...</p>
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="flashcard-study">
        <div className="empty-container">
          <h2>Không có flashcard nào</h2>
          <p>Deck này chưa có flashcard để học.</p>
          <button onClick={handleExit}>Quay lại</button>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="flashcard-study">
      <div className="study-container">
        {/* Header */}
        <div className="study-header">
          <button className="btn-exit" onClick={handleExit}>
            Thoát
          </button>
          <div className="deck-info">
            <h2>{deckName}</h2>
          </div>
        </div>

        {/* Main Content - 3 columns */}
        <div className="study-main">
          {/* Left - Progress */}
          <div className="progress-sidebar">
            <div className="progress-info">
              <span className="progress-text">
                {currentIndex + 1} / {flashcards.length}
              </span>
              <div className="progress-bar-vertical">
                <div 
                  className="progress-fill" 
                  style={{ height: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Center - Flashcard */}
          <div className="flashcard-wrapper">
            <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
              <div className="flashcard-front">
                <div className="card-content">
                  <h2 className="word">{currentCard.word}</h2>
                  <div className="pronunciation-wrapper">
                    <span className="pronunciation">{currentCard.pronunciation}</span>
                    <button 
                      className="speak-btn"
                      onClick={(e) => { e.stopPropagation(); speakWord(currentCard.word); }}
                    >
                      <IoVolumeHigh />
                    </button>
                  </div>
                  <p className="hint">Nhấp để xem nghĩa hoặc nhấn Space</p>
                </div>
                <div className="flip-icon">
                  <FaRotate />
                </div>
              </div>
              <div className="flashcard-back">
                <div className="card-content">
                  <h3 className="word">{currentCard.word}</h3>
                  <p className="translation">({currentCard.partOfSpeech})</p>
                  <div className="meaning-section">
                    <h4>Định nghĩa:</h4>
                    <p>{currentCard.meaning}</p>
                  </div>
                  <div className="example-section">
                    <h4>Ví dụ:</h4>
                    <p className="example">{currentCard.example}</p>
                  </div>
                  <p className="hint">Nhấp để lật lại</p>
                </div>
                <div className="flip-icon">
                  <FaRotate />
                </div>
              </div>
            </div>
          </div>

          {/* Right - Tools */}
          <div className="tools-sidebar">
            <button 
              className="tool-btn"
              onClick={(e) => { e.stopPropagation(); toggleFavorite(); }}
            >
              {currentCard.isFavorite ? <MdFavorite /> : <MdFavoriteBorder />}
              <span>Yêu thích</span>
            </button>
            <button className="tool-btn" onClick={handleShuffle}>
              <FaShuffle />
              <span>Xáo trộn</span>
            </button>
          </div>
        </div>

        {/* Footer - Navigation */}
        <div className="study-footer">
          <button className="nav-btn prev" onClick={handlePrevious}>
            <FaArrowLeft /> Trước
          </button>
          <button className="nav-btn next" onClick={handleNext}>
            Tiếp <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardStudy;
