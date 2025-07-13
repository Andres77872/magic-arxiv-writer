import React, { useState, useEffect, useRef } from 'react';
import type { NodeViewProps } from '@tiptap/react';
import { NodeViewWrapper } from '@tiptap/react';
import { useAIService } from '../../AIService';
import type { AIMessage } from '../../AIService';
import './AIBeat.css';

export const AIBeat = (props: NodeViewProps) => {
  const [prompt, setPrompt] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const aiService = useAIService();

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

  const getPreviousText = () => {
    const { editor } = props;
    const pos = props.getPos();
    
    if (typeof pos !== 'number') return '';
    
    // Get all content before this node's position
    const previousContent = editor.state.doc.textBetween(0, pos, '\n');
    return previousContent;
  };

  const getPromptTemplate = () => {
    return {
      "promptTemplate": "You are an academic writing assistant helping with a scientific document.\n\n<document_context>\n{{PreviusText}}\n</document_context>\n\n<instruction>\nContinue the academic text seamlessly based on the context above and following this request:\n{{UserInput}}\n</instruction>\n\nRespond with only the text continuation. Do not add introductions, explanations, or meta-commentary. Write in the same academic style, tone, and perspective as the provided context. Your response should read as if it's a natural continuation of the existing document.",
      "model": "agt-0c80d08b-542c-458b-b697-6ced8be42c5d"
    };
  };

  const handleSend = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    
    try {
      const previousText = getPreviousText();
      const promptTemplate = getPromptTemplate();
      
      // Format the messages for the AI service
      const messages: AIMessage[] = [
        {
          role: 'system',
          content: 'You are an academic writing assistant that helps continue text based on context.'
        },
        {
          role: 'user',
          content: promptTemplate.promptTemplate
            .replace('{{PreviusText}}', previousText)
            .replace('{{UserInput}}', prompt)
        }
      ];
      
      const { editor } = props;
      const pos = props.getPos();
      
      // Make sure getPos returns a valid position
      if (typeof pos === 'number') {
        // Start generating content
        
        await aiService.generateCompletion({
          model: promptTemplate.model,
          messages,
          onContent: (content) => {
            // We can observe content updates here if needed
            // but we'll let onComplete handle the final insertion
          },
          onComplete: (finalContent) => {
            // Delete this node
            editor.chain().focus().deleteRange({ from: pos, to: pos + 1 }).run();
            
            // Insert the AI response at the position where this node was
            editor.chain().focus().setTextSelection(pos).insertContent(finalContent).run();
          },
          onError: (error) => {
            console.error('Error generating content:', error);
          }
        });
      }
    } catch (error) {
      console.error('Error in handleSend:', error);
    } finally {
      setIsLoading(false);
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
          disabled={!prompt.trim() || isLoading}
        >
          {isLoading ? 'Generating...' : 'Send'}
        </button>
      </div>
    </NodeViewWrapper>
  );
};
