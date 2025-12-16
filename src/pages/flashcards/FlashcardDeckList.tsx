import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/flashcards/FlashcardDeckList.css';
import { FaPlus, FaCopy, FaBook, FaClock, FaChartLine, FaLightbulb, FaTrash } from 'react-icons/fa';
import { MdSchool } from 'react-icons/md';
import { flashcardService } from '@/services/flashcards';

interface Deck {
  id: number;
  name: string;
  description: string;
  totalCards: number;
  learnedCards: number;
  dueCards: number;
  progressPercent: number;
  sourceDeckId: number | null;
}

interface DeckData {
  myDecks: Deck[];
  systemDecks: Deck[];
}

const FlashcardDeckList: React.FC = () => {
  const navigate = useNavigate();
  const [deckData, setDeckData] = useState<DeckData>({
    myDecks: [],
    systemDecks: []
  });
  const [activeTab, setActiveTab] = useState<'my' | 'system'>('my');
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const data = await flashcardService.getDashboard();
        setDeckData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching decks:', error);
        setLoading(false);
      }
    };

    fetchDecks();
  }, []);

  const handleStudyDeck = (deckId: number) => {
    navigate(`/flashcard/study/${deckId}`);
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const handleCloneDeck = async (deckId: number) => {
    try {
      await flashcardService.cloneDeck(deckId);
      showNotification('Deck đã được thêm vào kho của bạn!', 'success');
      const data = await flashcardService.getDashboard();
      setDeckData(data);
      setActiveTab('my');
    } catch (error) {
      console.error('Error cloning deck:', error);
      showNotification('Có lỗi xảy ra khi clone deck!', 'error');
    }
  };

  const handleCreateDeck = () => {
    // TODO: Navigate to create deck page or open modal
    alert('Tính năng tạo deck mới đang được phát triển!');
  };

  const handleDeleteDeck = async (deckId: number) => {
    if (!confirm('Bạn có chắc muốn xóa deck này?')) return;
    
    try {
      await flashcardService.deleteDeck(deckId);
      showNotification('Deck đã được xóa thành công!', 'success');
      const data = await flashcardService.getDashboard();
      setDeckData(data);
    } catch (error) {
      console.error('Error deleting deck:', error);
      showNotification('Có lỗi xảy ra khi xóa deck!', 'error');
    }
  };

  const renderDeckCard = (deck: Deck, isSystemDeck: boolean = false) => {
    return (
      <div key={deck.id} className="deck-card">
        <div className="deck-card-header">
          <h3 className="deck-name">{deck.name}</h3>
          {isSystemDeck && <span className="system-badge">Hệ thống</span>}
        </div>
        <p className="deck-description">{deck.description}</p>
        
        <div className="deck-stats">
          <div className="stat-item">
            <FaBook className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">{deck.totalCards}</span>
              <span className="stat-label">Tổng thẻ</span>
            </div>
          </div>
          <div className="stat-item">
            <FaClock className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">{deck.dueCards}</span>
              <span className="stat-label">Cần học</span>
            </div>
          </div>
          <div className="stat-item">
            <FaChartLine className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">{deck.learnedCards}</span>
              <span className="stat-label">Đã học</span>
            </div>
          </div>
        </div>

        {deck.progressPercent > 0 && (
          <div className="deck-progress">
            <div className="progress-wrapper">
              <div className="progress-bar-container">
                <div 
                  className={`progress-bar-fill ${deck.progressPercent === 100 ? 'complete' : ''}`}
                  style={{ width: `${deck.progressPercent}%` }}
                ></div>
              </div>
              <span className="progress-percent">{deck.progressPercent}%</span>
            </div>
          </div>
        )}

        <div className="deck-actions">
          {isSystemDeck ? (
            <button 
              className="btn-clone"
              onClick={() => handleCloneDeck(deck.id)}
            >
              <FaCopy /> Clone vào kho
            </button>
          ) : (
            <>
              <button 
                className="btn-study"
                onClick={() => handleStudyDeck(deck.id)}
                disabled={deck.dueCards === 0}
              >
                <MdSchool /> {deck.dueCards > 0 ? 'Học ngay' : 'Đã hoàn thành'}
              </button>
              <button 
                className="btn-delete"
                onClick={() => handleDeleteDeck(deck.id)}
              >
                <FaTrash /> Xóa
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flashcard-deck-list">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flashcard-deck-list">
      {/* Popup Notification */}
      {showPopup && (
        <div className={`popup-notification ${popupType}`}>
          <span>{popupMessage}</span>
        </div>
      )}

      <div className="deck-list-container">
        {/* Header */}
        <div className="deck-list-header">
          <div className="header-content">
            <h1>Flashcards - Học từ vựng</h1>
          </div>
          <button className="btn-create-deck" onClick={handleCreateDeck}>
            <FaPlus /> Tạo deck mới
          </button>
        </div>

        {/* Tabs */}
        <div className="deck-tabs">
          <button 
            className={`tab-btn ${activeTab === 'my' ? 'active' : ''}`}
            onClick={() => setActiveTab('my')}
          >
            <FaBook /> Kho của tôi ({deckData.myDecks.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'system' ? 'active' : ''}`}
            onClick={() => setActiveTab('system')}
          >
            <MdSchool /> Kho hệ thống ({deckData.systemDecks.length})
          </button>
        </div>

        {/* Deck Grid */}
        <div className="deck-grid">
          {activeTab === 'my' ? (
            deckData.myDecks.length > 0 ? (
              deckData.myDecks.map(deck => renderDeckCard(deck, false))
            ) : (
              <div className="empty-state">
                <MdSchool className="empty-icon" />
                <h3>Chưa có deck nào</h3>
                <p>Hãy tạo deck mới hoặc clone từ kho hệ thống để bắt đầu học!</p>
                <button className="btn-browse-system" onClick={() => setActiveTab('system')}>
                  Khám phá kho hệ thống
                </button>
              </div>
            )
          ) : (
            deckData.systemDecks.length > 0 ? (
              deckData.systemDecks.map(deck => renderDeckCard(deck, true))
            ) : (
              <div className="empty-state">
                <MdSchool className="empty-icon" />
                <h3>Không có deck hệ thống</h3>
                <p>Hiện tại chưa có deck nào trong kho hệ thống.</p>
              </div>
            )
          )}
        </div>

        {/* Info Section */}
        <div className="info-section">
          <FaLightbulb className="lightbulb-icon" />
          <h3>Hướng dẫn sử dụng</h3>
          <div className="info-grid">
            <div className="info-card">
              <h4>Kho của tôi</h4>
              <p>Quản lý các deck bạn đã tạo hoặc clone từ hệ thống. Học tập và theo dõi tiến độ của bạn.</p>
            </div>
            <div className="info-card">
              <h4>Kho hệ thống</h4>
              <p>Khám phá các deck được tạo sẵn bởi hệ thống. Clone về để bắt đầu học ngay!</p>
            </div>
            <div className="info-card">
              <h4>Tạo deck mới</h4>
              <p>Tạo deck riêng với từ vựng bạn muốn học. Tùy chỉnh và quản lý theo ý muốn.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardDeckList;
