import React from 'react';
import './AIBeat.css';

interface AIBeatBodyProps {
  prompt: string;
  setPrompt: (value: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  isGenerating: boolean;
}

export const AIBeatBody: React.FC<AIBeatBodyProps> = ({
  prompt,
  setPrompt,
  textareaRef,
  handleKeyDown,
  isGenerating
}) => {
  return (
    <div className="ai-beat-content">
      <textarea
        ref={textareaRef}
        className="ai-beat-textarea"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask the AI for help with your paper..."
        autoFocus
        disabled={isGenerating}
      />
    </div>
  );
};
