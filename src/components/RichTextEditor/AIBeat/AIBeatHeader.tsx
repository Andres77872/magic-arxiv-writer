import React from 'react';
import './AIBeat.css';

interface AIBeatHeaderProps {
  handleRemove: () => void;
}

export const AIBeatHeader: React.FC<AIBeatHeaderProps> = ({ handleRemove }) => {
  return (
    <div className="ai-beat-header" data-drag-handle>
      <div className="ai-beat-title">
        <span className="ai-beat-icon">✨</span>
        AI Assistant
      </div>
      <button 
        className="ai-beat-remove-btn" 
        onClick={handleRemove}
        aria-label="Remove AI Beat"
      >
        ✕
      </button>
    </div>
  );
};
