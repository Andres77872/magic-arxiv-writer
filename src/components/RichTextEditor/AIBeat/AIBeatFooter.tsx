import React from 'react';
import './AIBeat.css';

interface AIBeatFooterProps {
  characterCount: number;
  wordCount: number;
  aiCharCount: number;
  aiWordCount: number;
  handleSend: () => void;
  isLoading: boolean;
  isGenerating: boolean;
  prompt: string;
  showAcceptReject: boolean;
  onAccept?: () => void;
  onDeny?: () => void;
}

export const AIBeatFooter: React.FC<AIBeatFooterProps> = ({
  characterCount,
  wordCount,
  aiCharCount,
  aiWordCount,
  handleSend,
  isLoading,
  isGenerating,
  prompt,
  showAcceptReject,
  onAccept,
  onDeny
}) => {
  return (
    <div className="ai-beat-footer">
      <div className="ai-beat-counts">
        <div className="ai-beat-count-item">
          <span>Input: {characterCount} chars / {wordCount} words</span>
        </div>
        {aiCharCount > 0 && (
          <div className="ai-beat-count-item">
            <span>AI Generated: {aiCharCount} chars / {aiWordCount} words</span>
          </div>
        )}
      </div>
      <div className="ai-beat-send-wrapper">
        <div className="ai-beat-tooltip">Ctrl+Enter to send</div>
        <button 
          className="ai-beat-send-btn" 
          onClick={handleSend}
          disabled={!prompt.trim() || isLoading || isGenerating}
        >
          {isGenerating ? 'Generating...' : isLoading ? 'Processing...' : 'Send'}
        </button>
        {showAcceptReject && (
          <>
            <button 
              className="ai-beat-action-btn ai-beat-deny-btn" 
              onClick={onDeny}
              title="Delete generated content"
            >
              Delete
            </button>
            <button 
              className="ai-beat-action-btn ai-beat-accept-btn" 
              onClick={onAccept}
              title="Accept generated content"
            >
              Accept
            </button>
          </>
        )}
      </div>
    </div>
  );
};
