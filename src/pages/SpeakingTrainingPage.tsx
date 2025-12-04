import React, { useState } from 'react';
// import './SpeakingTrainingPage.css';
import { FaMicrophone, FaGlobe, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: string;
}

const SpeakingTrainingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [showScenarioPopup, setShowScenarioPopup] = useState<boolean>(false);
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customDescription, setCustomDescription] = useState<string>('');

  const languages: Language[] = [
    { code: 'en-US', name: 'English (US)', nativeName: 'English', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', nativeName: 'English', flag: '🇬🇧' },
  ];

  const scenarios: Scenario[] = [
    {
      id: 'restaurant',
      title: 'Nhà hàng',
      description: 'Luyện tập đặt bàn, gọi món và thanh toán',
      icon: '',
      difficulty: 'Dễ'
    },
    {
      id: 'shopping',
      title: 'Mua sắm',
      description: 'Hỏi giá, thử đồ và mua hàng',
      icon: '',
      difficulty: 'Dễ'
    },
    {
      id: 'hotel',
      title: 'Khách sạn',
      description: 'Đặt phòng, check-in và yêu cầu dịch vụ',
      icon: '',
      difficulty: 'Trung bình'
    },
    {
      id: 'airport',
      title: 'Sân bay',
      description: 'Làm thủ tục, hỏi đường và lên máy bay',
      icon: '',
      difficulty: 'Trung bình'
    },
    {
      id: 'interview',
      title: 'Phỏng vấn xin việc',
      description: 'Trả lời câu hỏi phỏng vấn chuyên nghiệp',
      icon: '',
      difficulty: 'Khó'
    },
    {
      id: 'presentation',
      title: 'Thuyết trình',
      description: 'Trình bày ý tưởng và thảo luận',
      icon: '',
      difficulty: 'Khó'
    }
  ];

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setShowScenarioPopup(true);
  };

  const handleScenarioSelect = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    if (scenarioId === 'custom') {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
    }
  };

  const handleClosePopup = () => {
    setShowScenarioPopup(false);
    setSelectedScenario('');
    setShowCustomInput(false);
    setCustomTitle('');
    setCustomDescription('');
  };

  const handleStartTraining = () => {
    if (selectedLanguage && selectedScenario) {
      if (selectedScenario === 'custom') {
        const customScenarioData = encodeURIComponent(JSON.stringify({ title: customTitle, description: customDescription }));
        navigate(`/speaking-training/practice?lang=${selectedLanguage}&scenario=custom&data=${customScenarioData}`);
      } else {
        navigate(`/speaking-training/practice?lang=${selectedLanguage}&scenario=${selectedScenario}`);
      }
    }
  };

  return (
    <div className="speaking-training-page">
      <div className="training-container">
        {/* Header Section */}
        <div className="training-header">
          <h1 className="training-title">Speaking Training</h1>
          <p className="training-subtitle">
            Luyện tập kỹ năng nói với công nghệ nhận diện giọng nói AI
          </p>
        </div>

        {/* Language Selection Section */}
        <div className="language-selection">
          <div className="selection-header">
            <FaGlobe size={24} />
            <h2>Chọn ngôn ngữ bạn muốn luyện tập</h2>
          </div>
          <p className="selection-description">
            Chọn một ngôn ngữ để bắt đầu luyện tập phát âm và giao tiếp
          </p>

          <div className="languages-grid">
            {languages.map((language) => (
              <div
                key={language.code}
                className={`language-card ${selectedLanguage === language.code ? 'selected' : ''}`}
                onClick={() => handleLanguageSelect(language.code)}
              >
                <div className="language-flag">{language.flag}</div>
                <div className="language-info">
                  <h3 className="language-name">{language.name}</h3>
                  <p className="language-native">{language.nativeName}</p>
                </div>
                {selectedLanguage === language.code && (
                  <div className="selected-indicator">
                    <FaCheckCircle size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Scenario Popup */}
        {showScenarioPopup && (
          <div className="scenario-popup-overlay" onClick={handleClosePopup}>
            <div className="scenario-popup" onClick={(e) => e.stopPropagation()}>
              <div className="popup-header">
                <h2>Chọn tình huống luyện tập</h2>
                <button className="close-popup-btn" onClick={handleClosePopup}>
                  <FaTimes size={24} />
                </button>
              </div>
              
              <p className="popup-description">
                Chọn một tình huống để bắt đầu luyện tập giao tiếp
              </p>

              <div className="scenarios-grid">
                {scenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className={`scenario-card ${selectedScenario === scenario.id ? 'selected' : ''}`}
                    onClick={() => handleScenarioSelect(scenario.id)}
                  >
                    <div className="scenario-icon">{scenario.icon}</div>
                    <div className="scenario-info">
                      <h3 className="scenario-title">{scenario.title}</h3>
                      <p className="scenario-description">{scenario.description}</p>
                      <span className={`difficulty-badge ${scenario.difficulty.toLowerCase()}`}>
                        {scenario.difficulty}
                      </span>
                    </div>
                    {selectedScenario === scenario.id && (
                      <div className="selected-indicator">
                        <FaCheckCircle size={20} />
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Custom Scenario Card */}
                <div
                  className={`scenario-card custom-scenario ${selectedScenario === 'custom' ? 'selected' : ''}`}
                  onClick={() => handleScenarioSelect('custom')}
                >
                  <div className="scenario-icon"></div>
                  <div className="scenario-info">
                    <h3 className="scenario-title">Tự tạo tình huống</h3>
                    <p className="scenario-description">Tạo tình huống riêng theo nhu cầu của bạn</p>
                    <span className="difficulty-badge custom">
                      Tùy chỉnh
                    </span>
                  </div>
                  {selectedScenario === 'custom' && (
                    <div className="selected-indicator">
                      <FaCheckCircle size={20} />
                    </div>
                  )}
                </div>
              </div>

              {/* Custom Scenario Input */}
              {showCustomInput && (
                <div className="custom-scenario-input">
                  <h3>Nhập thông tin tình huống của bạn</h3>
                  <div className="input-group">
                    <label htmlFor="custom-title">Tiêu đề tình huống</label>
                    <input
                      id="custom-title"
                      type="text"
                      placeholder="VD: Đi siêu thị, Gặp bác sĩ, Hỏi đường..."
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      className="custom-input"
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="custom-description">Mô tả tình huống</label>
                    <textarea
                      id="custom-description"
                      placeholder="Mô tả chi tiết tình huống bạn muốn luyện tập..."
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      className="custom-textarea"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              <div className="popup-actions">
                <button
                  className={`start-btn ${!selectedScenario || (selectedScenario === 'custom' && (!customTitle.trim() || !customDescription.trim())) ? 'disabled' : ''}`}
                  onClick={handleStartTraining}
                  disabled={!selectedScenario || (selectedScenario === 'custom' && (!customTitle.trim() || !customDescription.trim()))}
                >
                  <FaMicrophone size={18} />
                  Bắt đầu luyện tập
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeakingTrainingPage;
