import React, { useState, useEffect, useRef } from 'react';
import type { NodeViewProps } from '@tiptap/react';
import { NodeViewWrapper } from '@tiptap/react';
import { useAIService } from '../../AIService';
import type { AIMessage } from '../../AIService';
import { AIBeatHeader } from './AIBeatHeader';
import { AIBeatBody } from './AIBeatBody';
import { AIBeatFooter } from './AIBeatFooter';
import { acceptAIContent, denyAIContent, removeAIHighlighting } from './AIGeneratedMark';
import './AIBeat.css';

// Type definition for content confirmation
interface ContentConfirmation {
  isShown: boolean;
  position: { x: number; y: number };
  range: { from: number; to: number } | null;
}

export const AIBeat = (props: NodeViewProps) => {
  const [prompt, setPrompt] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [aiCharCount, setAiCharCount] = useState(0);
  const [aiWordCount, setAiWordCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previousContent, setPreviousContent] = useState('');
  const [confirmation, setConfirmation] = useState<ContentConfirmation>({
    isShown: false,
    position: { x: 0, y: 0 },
    range: null
  });
  
  // State to track if there's pending AI-generated content
  const [hasPendingContent, setHasPendingContent] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const aiService = useAIService();

  // Focus the textarea when the component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Detect AI-generated content in the document
  useEffect(() => {
    // Check for pending AI-generated content whenever editor state changes
    if (!props.editor) return;
    
    const checkForPendingContent = () => {
      const { state } = props.editor;
      let foundPendingContent = false;
      
      state.doc.descendants((node, pos) => {
        if (foundPendingContent) return false; // Stop once we find pending content
        
        if (node.isText) {
          // Check if this node has pending AI mark
          const hasPendingAIMark = node.marks.some(mark => 
            mark.type.name === 'aiGenerated' && 
            mark.attrs.status === 'pending');
            
          if (hasPendingAIMark) {
            foundPendingContent = true;
            // Set the range for the content
            setConfirmation({
              isShown: true,
              position: { x: 0, y: 0 },
              range: { from: pos, to: pos + node.nodeSize }
            });
            return false;
          }
        }
        return true;
      });
      
      setHasPendingContent(foundPendingContent);
      
      // If no pending content found, make sure confirmation is not shown
      if (!foundPendingContent && confirmation.isShown) {
        setConfirmation({
          isShown: false,
          position: { x: 0, y: 0 },
          range: null
        });
      }
    };
    
    // Initial check
    checkForPendingContent();
    
    // Set up event listeners to update status
    const handleTransactionUpdate = () => {
      checkForPendingContent();
    };
    
    // Handle content editing to automatically accept content when edited
    const handleContentEdited = () => {
      if (confirmation.isShown && confirmation.range) {
        // User edited content, automatically accept it
        handleAcceptContent();
      }
    };
    
    props.editor.on('transaction', handleTransactionUpdate);
    document.addEventListener('contentEdited', handleContentEdited as EventListener);
    
    return () => {
      props.editor.off('transaction', handleTransactionUpdate);
      document.removeEventListener('contentEdited', handleContentEdited as EventListener);
    };
  }, [props.editor, confirmation.isShown]);

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
            setIsGenerating(false);
            
            // Calculate and update AI-generated text statistics
            setAiCharCount(finalContent.length);
            setAiWordCount(finalContent.trim().split(/\s+/).filter(Boolean).length);
            
            // Get current content to check if we need to avoid duplication
            const nodeSize = editor.state.doc.nodeAt(pos)?.nodeSize || 1;
            const insertPos = pos + nodeSize;
            
            // Find any existing AI-generated content
            let existingContent = "";
            let endPos = insertPos;
            let foundEnd = false;
            
            // Check if AI-generated content already exists after our position
            editor.state.doc.nodesBetween(insertPos, editor.state.doc.content.size, (node, nodePos) => {
              if (!foundEnd) {
                if (node.isText && node.marks.some(mark => mark.type.name === 'aiGenerated')) {
                  // Accumulate existing content
                  existingContent += node.text || "";
                } else if (existingContent) {
                  // We've found the end of AI-generated content
                  endPos = nodePos;
                  foundEnd = true;
                  return false;
                }
              }
              return !foundEnd;
            });
            
            // Only insert content if there's no matching content already there
            // This prevents duplication when streaming ends
            if (!existingContent || existingContent.trim() !== finalContent.trim()) {
              // If we have existing content, replace it to avoid duplication
              if (existingContent) {
                editor.chain()
                  .setTextSelection(insertPos)
                  .deleteRange({ from: insertPos, to: endPos })
                  .insertContent({
                    type: 'text',
                    text: finalContent,
                    marks: [{ type: 'aiGenerated' }]
                  })
                  .run();
              } else {
                // No existing content, just insert new content
                editor.chain()
                  .insertContentAt(insertPos, {
                    type: 'text',
                    text: finalContent,
                    marks: [{ type: 'aiGenerated' }]
                  })
                  .run();
              }
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

  // Handle accepting AI content
  const handleAcceptContent = () => {
    if (confirmation.range && props.editor) {
      acceptAIContent(props.editor, confirmation.range);
      // Make sure all AI content highlighting is removed
      removeAIHighlighting(props.editor);
      setConfirmation({
        isShown: false,
        position: { x: 0, y: 0 },
        range: null
      });
    }
  };

  // Handle denying AI content
  const handleDenyContent = () => {
    if (confirmation.range && props.editor) {
      denyAIContent(props.editor, confirmation.range);
      setConfirmation({
        isShown: false,
        position: { x: 0, y: 0 },
        range: null
      });
    }
  };

  return (
    <>
      <NodeViewWrapper className="ai-beat-container">
        <AIBeatHeader handleRemove={handleRemove} />
        
        <AIBeatBody
          prompt={prompt}
          setPrompt={setPrompt}
          textareaRef={textareaRef}
          handleKeyDown={handleKeyDown}
          isGenerating={isGenerating}
        />
        
        <AIBeatFooter
          characterCount={characterCount}
          wordCount={wordCount}
          aiCharCount={aiCharCount}
          aiWordCount={aiWordCount}
          handleSend={handleSend}
          isLoading={isLoading}
          isGenerating={isGenerating}
          prompt={prompt}
          showAcceptReject={hasPendingContent}
          onAccept={handleAcceptContent}
          onDeny={handleDenyContent}
        />
      </NodeViewWrapper>

    </>
  );
};
