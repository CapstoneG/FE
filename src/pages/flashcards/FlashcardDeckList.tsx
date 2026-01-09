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
  const [showCreateDeckModal, setShowCreateDeckModal] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showAddCardsModal, setShowAddCardsModal] = useState(false);
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [wordsInput, setWordsInput] = useState('');
  const [isAddingCards, setIsAddingCards] = useState(false);

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
    setShowCreateDeckModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateDeckModal(false);
    setNewDeckName('');
    setNewDeckDescription('');
  };

  const handleSubmitCreateDeck = async () => {
    if (!newDeckName.trim()) {
      showNotification('Vui lòng nhập tên deck!', 'error');
      return;
    }

    setIsCreating(true);
    try {
      await flashcardService.createDeck({
        name: newDeckName,
        description: newDeckDescription
      });
      showNotification('Deck mới đã được tạo thành công!', 'success');
      const data = await flashcardService.getDashboard();
      setDeckData(data);
      handleCloseCreateModal();
    } catch (error) {
      console.error('Error creating deck:', error);
      showNotification('Có lỗi xảy ra khi tạo deck!', 'error');
    } finally {
      setIsCreating(false);
    }
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

  const handleOpenAddCards = (deckId: number) => {
    setSelectedDeckId(deckId);
    setShowAddCardsModal(true);
  };

  const handleCloseAddCards = () => {
    setShowAddCardsModal(false);
    setSelectedDeckId(null);
    setWordsInput('');
  };

  const handleSubmitAddCards = async () => {
    if (!selectedDeckId || !wordsInput.trim()) {
      showNotification('Vui lòng nhập từ vựng!', 'error');
      return;
    }

    // Parse words from input (comma or newline separated)
    const words = wordsInput
      .split(/[,\n]+/)
      .map(word => word.trim())
      .filter(word => word.length > 0);

    if (words.length === 0) {
      showNotification('Vui lòng nhập ít nhất một từ!', 'error');
      return;
    }

    setIsAddingCards(true);
    try {
      await flashcardService.generateFlashcards({
        deckId: selectedDeckId,
        word: words
      });
      showNotification(`Đã thêm ${words.length} từ vào deck thành công!`, 'success');
      const data = await flashcardService.getDashboard();
      setDeckData(data);
      handleCloseAddCards();
    } catch (error) {
      console.error('Error generating flashcards:', error);
      showNotification('Có lỗi xảy ra khi thêm flashcard!', 'error');
    } finally {
      setIsAddingCards(false);
    }
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
                <MdSchool /> {deck.learnedCards < deck.totalCards ? 'Học ngay' : 'Hoàn thành'}
              </button>
              <button 
                className="btn-add-cards"
                onClick={() => handleOpenAddCards(deck.id)}
                title="Thêm flashcard"
              >
                <FaPlus />
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

      {/* Create Deck Modal */}
      {showCreateDeckModal && (
        <div className="modal-overlay" onClick={handleCloseCreateModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Tạo Deck Mới</h2>
              <button className="modal-close" onClick={handleCloseCreateModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="deck-name">Tên Deck <span className="required">*</span></label>
                <input
                  id="deck-name"
                  type="text"
                  className="form-input"
                  placeholder="Nhập tên deck..."
                  value={newDeckName}
                  onChange={(e) => setNewDeckName(e.target.value)}
                  autoFocus
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="deck-description">Mô tả</label>
                <textarea
                  id="deck-description"
                  className="form-textarea"
                  placeholder="Nhập mô tả cho deck (tùy chọn)..."
                  value={newDeckDescription}
                  onChange={(e) => setNewDeckDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn-cancel"
                onClick={handleCloseCreateModal}
                disabled={isCreating}
              >
                Hủy
              </button>
              <button 
                className="btn-create"
                onClick={handleSubmitCreateDeck}
                disabled={isCreating || !newDeckName.trim()}
              >
                {isCreating ? 'Đang tạo...' : 'Tạo Deck'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Flashcards Modal */}
      {showAddCardsModal && (
        <div className="modal-overlay" onClick={handleCloseAddCards}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Thêm Flashcard</h2>
              <button className="modal-close" onClick={handleCloseAddCards}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="words-input">Từ vựng <span className="required">*</span></label>
                <textarea
                  id="words-input"
                  className="form-textarea"
                  placeholder="Nhập từ vựng (mỗi từ cách nhau bởi dấu phẩy hoặc xuống dòng)"
                  value={wordsInput}
                  onChange={(e) => setWordsInput(e.target.value)}
                  rows={8}
                  autoFocus
                />
                <small className="form-hint">
                  Bạn có thể nhập nhiều từ, phân cách bằng dấu phẩy hoặc xuống dòng ( Tối đa 10 từ )
                </small>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn-cancel"
                onClick={handleCloseAddCards}
                disabled={isAddingCards}
              >
                Hủy
              </button>
              <button 
                className="btn-create"
                onClick={handleSubmitAddCards}
                disabled={isAddingCards || !wordsInput.trim()}
              >
                {isAddingCards ? 'Đang thêm...' : 'Thêm Flashcard'}
              </button>
            </div>
          </div>
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
