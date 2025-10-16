import React from 'react';
import './OverviewCard.css';

interface OverviewCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconColor?: string;
}

const OverviewCard: React.FC<OverviewCardProps> = ({ 
  icon, 
  title, 
  description,
  iconColor = "#2563eb" 
}) => {
  return (
    <div className="overview-card">
      <div className="overview-icon" style={{ color: iconColor }}>
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default OverviewCard;
