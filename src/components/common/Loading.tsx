import React from 'react';
import './Loading.css';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'spinner' | 'dots' | 'pulse';
  text?: string;
  fullScreen?: boolean;
  color?: string;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  variant = 'spinner',
  text,
  fullScreen = false,
  color,
  className = ''
}) => {
  const loadingClass = [
    'loading',
    `loading--${size}`,
    `loading--${variant}`,
    fullScreen ? 'loading--fullscreen' : '',
    className
  ].filter(Boolean).join(' ');

  const style = color ? { '--loading-color': color } as React.CSSProperties : undefined;

  const renderSpinner = () => (
    <div className="loading-spinner" style={style}>
      <div className="loading-spinner-circle"></div>
    </div>
  );

  const renderDots = () => (
    <div className="loading-dots" style={style}>
      <div className="loading-dot"></div>
      <div className="loading-dot"></div>
      <div className="loading-dot"></div>
    </div>
  );

  const renderPulse = () => (
    <div className="loading-pulse" style={style}>
      <div className="loading-pulse-circle"></div>
    </div>
  );

  const renderLoading = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className={loadingClass}>
      <div className="loading-content">
        {renderLoading()}
        {text && <div className="loading-text">{text}</div>}
      </div>
    </div>
  );
};

interface LoadingOverlayProps {
  show: boolean;
  text?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'spinner' | 'dots' | 'pulse';
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  show,
  text = 'Loading...',
  size = 'large',
  variant = 'spinner'
}) => {
  if (!show) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-overlay-backdrop"></div>
      <div className="loading-overlay-content">
        <Loading 
          size={size} 
          variant={variant} 
          text={text}
          color="white"
        />
      </div>
    </div>
  );
};