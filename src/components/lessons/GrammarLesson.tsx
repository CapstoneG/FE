import React, { useState } from 'react';
import { FaBook, FaLightbulb, FaCheckCircle } from 'react-icons/fa';
import './GrammarLesson.css';

interface Example {
  sentence: string;
  translation: string;
  highlight: string;
}

interface Formula {
  type: string;
  formula: string;
  verbType: 'REGULAR_VERB' | 'TO_BE';
  examples: Example[];
}

interface Grammar {
  topic: string;
  explanation: string;
  signalWord: string;
  formulas: Formula[];
}

interface GrammarLessonProps {
  grammar: Grammar;
  onComplete?: () => void;
}

const GrammarLesson: React.FC<GrammarLessonProps> = ({ grammar, onComplete }) => {
  // Group formulas by verb type
  const regularVerbFormulas = grammar.formulas.filter(f => f.verbType === 'REGULAR_VERB');
  const toBeFormulas = grammar.formulas.filter(f => f.verbType === 'TO_BE');
  
  const [selectedVerbType, setSelectedVerbType] = useState<'REGULAR_VERB' | 'TO_BE'>(
    regularVerbFormulas.length > 0 ? 'REGULAR_VERB' : 'TO_BE'
  );
  const [selectedFormulaIndexByType, setSelectedFormulaIndexByType] = useState<{
    REGULAR_VERB: number;
    TO_BE: number;
  }>({
    REGULAR_VERB: 0,
    TO_BE: 0,
  });
  const [completedFormulas, setCompletedFormulas] = useState<Set<number>>(new Set());

  const currentFormulas = selectedVerbType === 'REGULAR_VERB' ? regularVerbFormulas : toBeFormulas;
  const currentFormulaIndex = selectedFormulaIndexByType[selectedVerbType];
  const currentFormula = currentFormulas[currentFormulaIndex];
  
  // Get global index for completion tracking
  const getGlobalIndex = () => {
    return grammar.formulas.findIndex(f => f === currentFormula);
  };

  const handleMarkAsUnderstood = () => {
    const globalIndex = getGlobalIndex();
    const newCompleted = new Set(completedFormulas);
    newCompleted.add(globalIndex);
    setCompletedFormulas(newCompleted);

    if (newCompleted.size === grammar.formulas.length && onComplete) {
      onComplete();
    }
  };

  const handleFormulaTabClick = (index: number) => {
    setSelectedFormulaIndexByType({
      ...selectedFormulaIndexByType,
      [selectedVerbType]: index,
    });
  };

  const isFormulaCompleted = (formula: Formula) => {
    const index = grammar.formulas.findIndex(f => f === formula);
    return completedFormulas.has(index);
  };

  const highlightText = (sentence: string, highlight: string) => {
    if (!highlight) return sentence;
    
    const parts = sentence.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={index} className="highlight-grammar-lesson">{part}</span>
      ) : (
        part
      )
    );
  };

  const getVerbTypeLabel = (verbType: 'REGULAR_VERB' | 'TO_BE') => {
    return verbType === 'REGULAR_VERB' ? 'Regular Verb' : 'To Be';
  };

  return (
    <div className="grammar-lesson-container-grammar-lesson">
      {/* Header */}
      <div className="grammar-header-grammar-lesson">
        <div className="header-content-grammar-lesson">
          <FaBook className="header-icon-grammar-lesson" />
          <div className="header-text-grammar-lesson">
            <h2 className="grammar-title-grammar-lesson">{grammar.topic}</h2>
            <p className="grammar-description-grammar-lesson">{grammar.explanation}</p>
          </div>
        </div>
        {grammar.signalWord && (
          <div className="signal-words-grammar-lesson">
            <FaLightbulb className="signal-icon-grammar-lesson" />
            <span className="signal-label-grammar-lesson">Signal words:</span>
            <span className="signal-text-grammar-lesson">{grammar.signalWord}</span>
          </div>
        )}
      </div>

      {/* Verb Type Navigation */}
      {regularVerbFormulas.length > 0 && toBeFormulas.length > 0 && (
        <div className="verb-type-tabs-grammar-lesson">
          <button
            className={`verb-type-tab-grammar-lesson ${
              selectedVerbType === 'REGULAR_VERB' ? 'active-verb-type-grammar-lesson' : ''
            }`}
            onClick={() => setSelectedVerbType('REGULAR_VERB')}
          >
            Regular Verb
          </button>
          <button
            className={`verb-type-tab-grammar-lesson ${
              selectedVerbType === 'TO_BE' ? 'active-verb-type-grammar-lesson' : ''
            }`}
            onClick={() => setSelectedVerbType('TO_BE')}
          >
            To Be
          </button>
        </div>
      )}

      {/* Formula Type Navigation */}
      {currentFormulas.length > 0 && (
        <div className="formula-tabs-grammar-lesson">
          {currentFormulas.map((formula, index) => (
            <button
              key={index}
              className={`formula-tab-grammar-lesson ${
                currentFormulaIndex === index ? 'active-grammar-lesson' : ''
              } ${isFormulaCompleted(formula) ? 'completed-grammar-lesson' : ''}`}
              onClick={() => handleFormulaTabClick(index)}
            >
              {isFormulaCompleted(formula) && (
                <FaCheckCircle className="tab-check-icon-grammar-lesson" />
              )}
              {formula.type}
            </button>
          ))}
        </div>
      )}

      {/* Formula Content */}
      <div className="formula-content-grammar-lesson">
        <div className="formula-card-grammar-lesson">
          <div className="formula-header-grammar-lesson">
            <span className="formula-type-badge-grammar-lesson">{currentFormula.type}</span>
            <span className="verb-type-badge-grammar-lesson">{getVerbTypeLabel(currentFormula.verbType)}</span>
          </div>
          
          <div className="formula-box-grammar-lesson">
            <h3 className="formula-title-grammar-lesson">Formula</h3>
            <p className="formula-text-grammar-lesson">{currentFormula.formula}</p>
          </div>

          {/* Examples */}
          <div className="examples-section-grammar-lesson">
            <h4 className="examples-title-grammar-lesson">Examples</h4>
            <div className="examples-list-grammar-lesson">
              {currentFormula.examples.map((example, index) => (
                <div key={index} className="example-card-grammar-lesson">
                  <div className="example-number-grammar-lesson">{index + 1}</div>
                  <div className="example-content-grammar-lesson">
                    <p className="example-sentence-grammar-lesson">
                      {highlightText(example.sentence, example.highlight)}
                    </p>
                    <p className="example-translation-grammar-lesson">
                      {example.translation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default GrammarLesson;
