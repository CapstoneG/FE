import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/flashcards/FlashcardDeckList.css';
import { FaPlus, FaCopy, FaBook, FaClock, FaChartLine, FaLightbulb, FaTrash, FaUndo, FaChartBar } from 'react-icons/fa';
import { MdSchool } from 'react-icons/md';
import { flashcardService } from '@/services/flashcards';
import type { DeckStudyStatsResponse } from '@/services/flashcards';

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
  const [showStatsPopup, setShowStatsPopup] = useState(false);
  const [deckStats, setDeckStats] = useState<DeckStudyStatsResponse | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

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
    navigate(`/flashcard/lesson/${deckId}`);
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

  const handleResetDeck = async (deckId: number) => {
    if (!confirm('Bạn có chắc muốn reset tiến độ học của deck này? Tất cả tiến độ sẽ bị xóa!')) return;
    
    try {
      await flashcardService.resetDeckProgress(deckId);
      showNotification('Tiến độ deck đã được reset thành công!', 'success');
      const data = await flashcardService.getDashboard();
      setDeckData(data);
    } catch (error) {
      console.error('Error resetting deck:', error);
      showNotification('Có lỗi xảy ra khi reset deck!', 'error');
    }
  };

  const handleShowStats = async (deckId: number) => {
    setLoadingStats(true);
    setShowStatsPopup(true);
    try {
      const stats = await flashcardService.getDeckStats(deckId);
      setDeckStats(stats);
    } catch (error) {
      console.error('Error fetching deck stats:', error);
      showNotification('Có lỗi xảy ra khi tải thống kê!', 'error');
      setShowStatsPopup(false);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleCloseStats = () => {
    setShowStatsPopup(false);
    setDeckStats(null);
  };

  const renderDeckCard = (deck: Deck, isSystemDeck: boolean = false) => {
    return (
      <div key={deck.id} className="deck-card">
        <div className="deck-card-header">
          <h3 className="deck-name">{deck.name}</h3>
          <div className="deck-header-right">
            {!isSystemDeck && (
              <button 
                className="btn-stats-icon"
                onClick={() => handleShowStats(deck.id)}
                title="Xem thống kê chi tiết"
              >
                <FaChartBar />
              </button>
            )}
            {isSystemDeck && <span className="system-badge">Hệ thống</span>}
          </div>
        </div>
        <p className="deck-description">{deck.description}</p>
        
        <div className={`deck-stats ${isSystemDeck ? 'deck-stats-single' : ''}`}>
          <div className="stat-item">
            <FaBook className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">{deck.totalCards}</span>
              <span className="stat-label">Tổng thẻ</span>
            </div>
          </div>
          {!isSystemDeck && (
            <>
              <div className={`stat-item ${deck.dueCards > 0 ? 'stat-item-highlight' : ''}`}>
                <FaClock className="stat-icon" />
                <div className="stat-info">
                  <span className="stat-value">{deck.dueCards}</span>
                  <span className="stat-label">Quá hạn</span>
                </div>
              </div>
              <div className="stat-item">
                <FaChartLine className="stat-icon" />
                <div className="stat-info">
                  <span className="stat-value">{deck.learnedCards}</span>
                  <span className="stat-label">Đã học</span>
                </div>
              </div>
            </>
          )}
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
                disabled={deck.learnedCards === deck.totalCards}
              >
                <MdSchool /> {deck.learnedCards < deck.totalCards ? 'Học ngay' : 'Đã hoàn thành'}
              </button>
              <button 
                className="btn-reset"
                onClick={() => handleResetDeck(deck.id)}
                title="Reset tiến độ"
              >
                <FaUndo />
              </button>
              <button 
                className="btn-delete"
                onClick={() => handleDeleteDeck(deck.id)}
              >
                <FaTrash />
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

      {/* Stats Popup */}
      {showStatsPopup && (
        <div className="stats-popup-overlay" onClick={handleCloseStats}>
          <div className="stats-popup" onClick={(e) => e.stopPropagation()}>
            <div className="stats-popup-header">
              <h2>Thống kê chi tiết</h2>
            </div>
            
            {loadingStats ? (
              <div className="stats-loading">
                <div className="spinner"></div>
                <p>Đang tải thống kê...</p>
              </div>
            ) : deckStats ? (
              <div className="stats-content">
                <div className="stats-deck-name">{deckStats.deckName}</div>
                
                <div className="stats-grid">
                  <div className="stats-card">
                    <div className="stats-card-info">
                      <div className="stats-card-value">{deckStats.totalCards}</div>
                      <div className="stats-card-label">Tổng số thẻ</div>
                    </div>
                  </div>

                  <div className="stats-card highlight-orange"> 
                    <div className="stats-card-info">
                      <div className="stats-card-value">{deckStats.learningCards}</div>
                      <div className="stats-card-label">Đang học</div>
                    </div>
                  </div>

                  <div className="stats-card highlight-blue">
                    <div className="stats-card-info">
                      <div className="stats-card-value">{deckStats.reviewCards}</div>
                      <div className="stats-card-label">Đang ôn tập</div>
                    </div>
                  </div>

                  <div className="stats-card highlight-red">
                    <div className="stats-card-info">
                      <div className="stats-card-value">{deckStats.dueTodayCards}</div>
                      <div className="stats-card-label">Đến hạn ôn hôm nay</div>
                    </div>
                  </div>

                  <div className="stats-card highlight-green">
                    <div className="stats-card-info">
                      <div className="stats-card-value">{deckStats.studiedToday}</div>
                      <div className="stats-card-label">Đã học hôm nay</div>
                    </div>
                  </div>

                  <div className="stats-card">
                    <div className="stats-card-info">
                      <div className="stats-card-value">{deckStats.progressPercent}%</div>
                      <div className="stats-card-label">Hoàn thành</div>
                    </div>
                  </div>

                  <div className="stats-card">
                    <div className="stats-card-info">
                      <div className="stats-card-value">{deckStats.totalReviews}</div>
                      <div className="stats-card-label">Tổng lượt ôn</div>
                    </div>
                  </div>
                </div>

                {deckStats.lastStudyAt && (
                  <div className="stats-last-study">
                    <strong>Lần học gần nhất:</strong>{' '}
                    {new Date(deckStats.lastStudyAt).toLocaleString('vi-VN')}
                  </div>
                )}
              </div>
            ) : null}
          </div>
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
