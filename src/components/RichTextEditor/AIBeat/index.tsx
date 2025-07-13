import React, { useState, useEffect, useRef } from 'react';
import type { NodeViewProps } from '@tiptap/react';
import { NodeViewWrapper } from '@tiptap/react';
import './AIBeat.css';

export const AIBeat = (props: NodeViewProps) => {
  const [prompt, setPrompt] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus the textarea when the component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Update character and word counts when prompt changes
  useEffect(() => {
    setCharacterCount(prompt.length);
    setWordCount(prompt.trim().split(/\s+/).filter(Boolean).length);
  }, [prompt]);

  const handleSend = () => {
    if (!prompt.trim()) return;
    
    // Here you would implement the logic to send the prompt to your AI service
    // This is a placeholder for where you'd make the API call
    console.log('Sending AI prompt:', prompt);
    
    // After sending, you might want to replace this component with the AI response
    const { editor } = props;
    const pos = props.getPos();
    
    // Make sure getPos returns a valid position
    if (typeof pos === 'number') {
      // Delete this node
      editor.chain().focus().deleteRange({ from: pos, to: pos + 1 }).run();
      
      // Insert the AI response at the position where this node was
      editor.chain().focus().setTextSelection(pos).insertContent(`<p>AI response for: "${prompt}"</p>`).run();
    }
  };

  const handleRemove = () => {
    const { editor } = props;
    const pos = props.getPos();
    
    if (typeof pos === 'number') {
      // Delete this node
      editor.chain().focus().deleteRange({ from: pos, to: pos + 1 }).run();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
    
    // Close on Escape
    if (e.key === 'Escape') {
      e.preventDefault();
      handleRemove();
    }
  };

  return (
    <NodeViewWrapper className="ai-beat-container">
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
      
      <div className="ai-beat-content">
        <textarea
          ref={textareaRef}
          className="ai-beat-textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask the AI for help with your paper..."
          autoFocus
        />
      </div>
      
      <div className="ai-beat-footer">
        <div className="ai-beat-counts">
          <div className="ai-beat-count-item">
            <span>{characterCount} chars</span>
          </div>
          <div className="ai-beat-count-item">
            <span>{wordCount} words</span>
          </div>
        </div>
        <button 
          className="ai-beat-send-btn" 
          onClick={handleSend}
          disabled={!prompt.trim()}
        >
          Send
        </button>
      </div>
    </NodeViewWrapper>
  );
};
