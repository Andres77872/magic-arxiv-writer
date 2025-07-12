import { useState, useRef, useEffect } from 'react';
import { BubbleMenu } from '@tiptap/react';
import { useAIService } from '../../AIService';
import './FloatingToolbar.css';

// Import types, primitive components, and JSON configuration
import type { FloatingToolbarProps, AIAction, PromptAction, PromptActionsConfig } from './types';
import { TextFormatButtons } from './TextFormatButtons';
import { LinkButtons } from './LinkButtons';
import { AIMenu } from './AIMenu';
import promptActionsData from './promptActions.json';

export function FloatingToolbar({ editor }: FloatingToolbarProps) {
    const [showAIMenu, setShowAIMenu] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [promptActions, setPromptActions] = useState<PromptAction[]>([]);
    const aiMenuRef = useRef<HTMLDivElement>(null);
    const { generateCompletion } = useAIService();
    
    // Load prompt actions from JSON
    useEffect(() => {
        const config = promptActionsData as PromptActionsConfig;
        setPromptActions(config.actions);
    }, []);

    // Close AI menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (aiMenuRef.current && !aiMenuRef.current.contains(event.target as Node)) {
                setShowAIMenu(false);
            }
        };

        if (showAIMenu) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showAIMenu]);

    if (!editor) {
        return null;
    }

    const getSelectedText = () => {
        const { from, to } = editor.state.selection;
        const text = editor.state.doc.textBetween(from, to);
        return text;
    };

    const handleAIAction = async (action: AIAction) => {
        const selectedText = getSelectedText();
        if (!selectedText || isProcessing) return;

        setIsProcessing(true);
        setShowAIMenu(false);

        // Find the selected action from the loaded JSON
        const selectedAction = promptActions.find(a => a.id === action);
        if (!selectedAction) {
            console.error('Action not found:', action);
            setIsProcessing(false);
            return;
        }

        // Prepare the prompt based on the action from JSON
        const prompt = selectedAction.promptTemplate.replace('{{selectedText}}', selectedText);
        const model = selectedAction.model;

        try {
            await generateCompletion({
                model: model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are an academic writing assistant. Provide clear, concise, and well-structured responses.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                onContent: () => {
                    // Content is handled in onComplete
                },
                onComplete: (finalContent) => {
                    // Replace the selected text with the AI response
                    const { from, to } = editor.state.selection;
                    editor.chain()
                        .focus()
                        .deleteRange({ from, to })
                        .insertContent(finalContent)
                        .run();
                },
                onError: (error) => {
                    console.error('AI Service error:', error);
                    alert('An error occurred while processing your request. Please try again.');
                }
            });
        } catch (error) {
            console.error('Error in AI action:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <BubbleMenu 
            editor={editor} 
            tippyOptions={{ 
                duration: 100,
                placement: 'top',
                maxWidth: '640px',
            }}
            className="ft-container"
        >
            {/* Text Formatting Buttons */}
            <TextFormatButtons editor={editor} />
            
            {/* Link Management */}
            <LinkButtons editor={editor} />
            
            {/* AI Menu */}
            <div ref={aiMenuRef}>
                <AIMenu
                    editor={editor}
                    showMenu={showAIMenu}
                    isProcessing={isProcessing}
                    setShowMenu={setShowAIMenu}
                    handleAIAction={handleAIAction}
                    promptActions={promptActions}
                />
            </div>
        </BubbleMenu>
    );
}
