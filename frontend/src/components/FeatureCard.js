import React from 'react';
import './FeatureCard.css';

function FeatureCard({ title, description, icon, color, onClick }) {
  return (
    <div 
      className="feature-card" 
      onClick={onClick}
      style={{ '--accent-color': color }}
    >
      <div className="feature-icon" style={{ background: color }}>
        {icon}
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
      <button className="feature-button" style={{ background: color }}>
        Начать →
      </button>
    </div>
  );
}

export default FeatureCard;

