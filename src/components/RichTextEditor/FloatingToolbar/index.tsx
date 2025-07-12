import { useState, useRef, useEffect } from 'react';
import { BubbleMenu } from '@tiptap/react';
import { useAIService } from '../../AIService';
import './FloatingToolbar.css';

// Import types and primitive components
import type { FloatingToolbarProps, AIAction } from './types';
import { TextFormatButtons } from './TextFormatButtons';
import { LinkButtons } from './LinkButtons';
import { AIMenu } from './AIMenu';

export function FloatingToolbar({ editor }: FloatingToolbarProps) {
    const [showAIMenu, setShowAIMenu] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const aiMenuRef = useRef<HTMLDivElement>(null);
    const { generateCompletion } = useAIService();

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

        // Prepare the prompt based on the action
        let prompt = '';
        let model = '';
        switch (action) {
            case 'extend':
                prompt = `Extend and elaborate on the following text, maintaining the same style and tone:\n\n"${selectedText}"`;
                model = 'agt-0c80d08b-542c-458b-b697-6ced8be42c5d';
                break;
            case 'rewrite':
                prompt = `Rewrite the following text to make it clearer and more engaging while preserving the original meaning:\n\n"${selectedText}"`;
                model = 'agt-0c80d08b-542c-458b-b697-6ced8be42c5d';
                break;
            case 'references':
                prompt = `Search for and provide relevant academic references for the following text. Format as a list of citations:\n\n"${selectedText}"`;
                model = 'agt-0c80d08b-542c-458b-b697-6ced8be42c5d';
                break;
            case 'translate':
                prompt = `Translate the following text to English (or to Spanish if already in English), maintaining academic tone:\n\n"${selectedText}"`;
                model = 'agt-0c80d08b-542c-458b-b697-6ced8be42c5d';
                break;
        }

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
                />
            </div>
        </BubbleMenu>
    );
}
