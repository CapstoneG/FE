import React, { useState, useEffect } from 'react';
import { FaMicrophone, FaGlobe, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import chatbotService from '../services/aiService';
import type { Variant, Context } from '../services/aiService';
import './SpeakingTrainingPage.css';

interface ScenarioDisplay {
  id: string;
  title: string;
  description: string;
  icon: string;
  contexts?: Context[];
}

const SpeakingTrainingPage: React.FC = () => {
  const navigate = useNavigate();
  const [variants, setVariants] = useState<Variant[]>([]);
  const [scenarios, setScenarios] = useState<ScenarioDisplay[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioDisplay | null>(null);
  const [selectedContext, setSelectedContext] = useState<Context | null>(null);
  const [showScenarioPopup, setShowScenarioPopup] = useState<boolean>(false);
  const [showContextPopup, setShowContextPopup] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load variants and scenarios from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [variantsData, scenariosData] = await Promise.all([
          chatbotService.getVariants(),
          chatbotService.getVariantScenarios()
        ]);
        
        setVariants(variantsData);
        
        // Transform API scenarios to display format
        const displayScenarios: ScenarioDisplay[] = scenariosData.map(scenario => ({
          id: scenario.id,
          title: scenario.name,
          description: scenario.description,
          icon: '💬',
          contexts: scenario.contexts
        }));
        
        setScenarios(displayScenarios);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleVariantSelect = (variant: Variant) => {
    setSelectedVariant(variant);
    setShowScenarioPopup(true);
  };

  const handleScenarioSelect = (scenario: ScenarioDisplay) => {
    setSelectedScenario(scenario);
    if (scenario.contexts && scenario.contexts.length > 0) {
      setShowContextPopup(true);
    }
  };

  const handleContextSelect = (context: Context) => {
    setSelectedContext(context);
  };

  const handleClosePopup = () => {
    setShowScenarioPopup(false);
    setShowContextPopup(false);
    setSelectedScenario(null);
    setSelectedContext(null);
  };

  const handleStartTraining = async () => {
    if (selectedVariant && selectedScenario && selectedContext) {
      try {
        const sessionResponse = await chatbotService.createSession({
          user_id: 1, 
          variant_id: selectedVariant.id,
          scenario_id: selectedScenario.id,
          context_id: selectedContext.id
        });

        // Navigate with session_id
        navigate(
          `/speaking-training/practice?variant=${selectedVariant.id}&scenario=${selectedScenario.id}&context=${selectedContext.id}`,
          { state: { sessionId: sessionResponse.session_id } }
        );
      } catch (error) {
        console.error('Error creating session:', error);
        alert('Không thể tạo phiên luyện tập. Vui lòng thử lại!');
      }
    }
  };

  return (
    <div className="speaking-training-page">
      <div className="training-container">
        {/* Header Section */}
        <div className="training-header">
          <h1 className="training-title">SpeakUp</h1>
          <p className="training-subtitle">
            Luyện tập kỹ năng nói với công nghệ nhận diện giọng nói AI
          </p>
        </div>

        {/* Language Selection Section */}
        <div className="language-selection">
          <div className="selection-header">
            <FaGlobe size={24} />
            <h2>Chọn phiên bản tiếng Anh</h2>
          </div>
          <p className="selection-description">
            Chọn một phiên bản để bắt đầu luyện tập phát âm và giao tiếp
          </p>

          {isLoading ? (
            <div className="loading-state">Đang tải...</div>
          ) : (
            <div className="languages-grid">
              {variants.map((variant) => (
                <div
                  key={variant.id}
                  className={`language-card ${selectedVariant?.id === variant.id ? 'selected' : ''}`}
                  onClick={() => handleVariantSelect(variant)}
                >
                  <div className="language-flag">{variant.flag_icon}</div>
                  <div className="language-info">
                    <h3 className="language-name">{variant.name}</h3>
                    <p className="language-native">{variant.name}</p>
                  </div>
                  {selectedVariant?.id === variant.id && (
                    <div className="selected-indicator">
                      <FaCheckCircle size={24} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
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
                    className={`scenario-card ${selectedScenario?.id === scenario.id ? 'selected' : ''}`}
                    onClick={() => handleScenarioSelect(scenario)}
                  >
                    <div className="scenario-icon">{scenario.icon}</div>
                    <div className="scenario-info">
                      <h3 className="scenario-title">{scenario.title}</h3>
                      <p className="scenario-description">{scenario.description}</p>
                    </div>
                    {selectedScenario?.id === scenario.id && (
                      <div className="selected-indicator">
                        <FaCheckCircle size={20} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="popup-actions">
                <button
                  className={`start-btn ${!selectedScenario ? 'disabled' : ''}`}
                  onClick={() => selectedScenario && setShowContextPopup(true)}
                  disabled={!selectedScenario}
                >
                  Tiếp theo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Context Selection Popup */}
        {showContextPopup && selectedScenario && (
          <div className="scenario-popup-overlay" onClick={handleClosePopup}>
            <div className="scenario-popup" onClick={(e) => e.stopPropagation()}>
              <div className="popup-header">
                <h2>Chọn ngữ cảnh cụ thể</h2>
                <button className="close-popup-btn" onClick={handleClosePopup}>
                  <FaTimes size={24} />
                </button>
              </div>
              
              <p className="popup-description">
                Chọn một ngữ cảnh trong tình huống "{selectedScenario.title}"
              </p>

              <div className="scenarios-grid">
                {selectedScenario.contexts?.map((context) => (
                  <div
                    key={context.id}
                    className={`scenario-card ${selectedContext?.id === context.id ? 'selected' : ''}`}
                    onClick={() => handleContextSelect(context)}
                  >
                    <div className="scenario-icon">💬</div>
                    <div className="scenario-info">
                      <h3 className="scenario-title">{context.name}</h3>
                      <p className="scenario-description">{context.description}</p>
                    </div>
                    {selectedContext?.id === context.id && (
                      <div className="selected-indicator">
                        <FaCheckCircle size={20} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="popup-actions">
                <button
                  className="back-btn-secondary"
                  onClick={() => {
                    setShowContextPopup(false);
                    setSelectedContext(null);
                  }}
                >
                  Quay lại
                </button>
                <button
                  className={`start-btn ${!selectedContext ? 'disabled' : ''}`}
                  onClick={handleStartTraining}
                  disabled={!selectedContext}
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
