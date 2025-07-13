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
  const [aiCharCount, setAiCharCount] = useState(0);
  const [aiWordCount, setAiWordCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previousContent, setPreviousContent] = useState('');
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
    setIsGenerating(true);
    setPreviousContent('');
    
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
            // Stream only the new tokens to the editor
            const newContent = content.substring(previousContent.length);
            setPreviousContent(content); // Update the previous content for next comparison
            
            if (newContent.length === 0) return; // Skip if there's no new content
            
            // Find the position after the AIBeat node and insert/update content
            // This ensures the generated text appears after the AIBeat component
            const nodeSize = editor.state.doc.nodeAt(pos)?.nodeSize || 1;
            const insertPos = pos + nodeSize;
            
            // Find all AI-generated nodes after the AIBeat
            let lastAINodeEnd = insertPos;
            let foundAIContent = false;
            
            // Scan document to find the end of any existing AI-generated content
            editor.state.doc.nodesBetween(insertPos, editor.state.doc.content.size, (node, nodePos) => {
              if (node.marks.some(mark => mark.type.name === 'aiGenerated')) {
                foundAIContent = true;
                const nodeEnd = nodePos + node.nodeSize;
                if (nodeEnd > lastAINodeEnd) {
                  lastAINodeEnd = nodeEnd;
                }
                return true;
              } else if (foundAIContent) {
                // We've found the end of AI content
                return false;
              }
              return true;
            });
            
            if (foundAIContent) {
              // If we have AI content, replace it all with the full updated content
              // This ensures we don't get duplicate/truncated content
              editor.chain()
                .deleteRange({ from: insertPos, to: lastAINodeEnd })
                .setTextSelection(insertPos)
                .insertContent({
                  type: 'text',
                  text: content, // Insert the complete content each time
                  marks: [{ type: 'aiGenerated' }]
                })
                .run();
            } else {
              // First insertion - insert new content after the AIBeat node
              editor.chain()
                .setTextSelection(insertPos)
                .insertContent({
                  type: 'text',
                  text: content, // Insert the complete content
                  marks: [{ type: 'aiGenerated' }]
                })
                .run();
            }
          },
          onComplete: (finalContent) => {
            // Mark generation as complete
            setIsGenerating(false);
            
            // Calculate and update AI-generated text statistics
            setAiCharCount(finalContent.length);
            setAiWordCount(finalContent.trim().split(/\s+/).filter(Boolean).length);
            
            // Ensure the final content is properly inserted
            // This handles any case where the streaming might have missed something
            const nodeSize = editor.state.doc.nodeAt(pos)?.nodeSize || 1;
            const insertPos = pos + nodeSize;
            
            // Find the end position of the existing AI content (if any)
            let endPos = insertPos;
            let foundEnd = false;
            
            editor.state.doc.nodesBetween(insertPos, editor.state.doc.content.size, (node, nodePos) => {
              if (!foundEnd && !node.marks.some(mark => mark.type.name === 'aiGenerated')) {
                endPos = nodePos;
                foundEnd = true;
                return false;
              }
              return !foundEnd;
            });
            
            // Replace with the final content to ensure everything is complete
            if (foundEnd) {
              editor.chain()
                .setTextSelection(insertPos)
                .deleteRange({ from: insertPos, to: endPos })
                .insertContent({
                  type: 'text',
                  text: finalContent,
                  marks: [{ type: 'aiGenerated' }]
                })
                .run();
            }
          },
          onError: (error) => {
            console.error('Error generating content:', error);
            setIsGenerating(false);
          }
        });
      }
    } catch (error) {
      console.error('Error in handleSend:', error);
      setIsGenerating(false);
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
          disabled={isGenerating}
        />
      </div>
      
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
        </div>
      </div>
    </NodeViewWrapper>
  );
};
