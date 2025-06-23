import {type Editor, BubbleMenu} from '@tiptap/react';
import { useState, useRef, useEffect } from 'react';
import { useAIService } from '../AIService';

interface FloatingToolbarProps {
    editor: Editor;
}

type AIAction = 'extend' | 'rewrite' | 'references' | 'translate';

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
            let aiResponse = '';
            
            await generateCompletion({
                model: model, // Example model ID, adjust as needed
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
                onContent: (content) => {
                    aiResponse = content;
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
            className="floating-toolbar"
        >
            {/* Text Formatting Options */}
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`floating-toolbar-button ${editor.isActive('bold') ? 'is-active' : ''}`}
                title="Bold (Ctrl+B)"
            >
                <strong>B</strong>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`floating-toolbar-button ${editor.isActive('italic') ? 'is-active' : ''}`}
                title="Italic (Ctrl+I)"
            >
                <em>I</em>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`floating-toolbar-button ${editor.isActive('strike') ? 'is-active' : ''}`}
                title="Strikethrough"
            >
                <s>S</s>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={`floating-toolbar-button ${editor.isActive('code') ? 'is-active' : ''}`}
                title="Code (Ctrl+K)"
            >
                {'</>'}
            </button>
            
            <div className="floating-toolbar-separator"></div>
            
            {/* Heading Options */}
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`floating-toolbar-button ${editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}`}
                title="Heading 1"
            >
                H1
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`floating-toolbar-button ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`}
                title="Heading 2"
            >
                H2
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`floating-toolbar-button ${editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}`}
                title="Heading 3"
            >
                H3
            </button>

            <div className="floating-toolbar-separator"></div>
            
            {/* List Options */}
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`floating-toolbar-button ${editor.isActive('bulletList') ? 'is-active' : ''}`}
                title="Bullet List"
            >
                •
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`floating-toolbar-button ${editor.isActive('orderedList') ? 'is-active' : ''}`}
                title="Numbered List"
            >
                1.
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`floating-toolbar-button ${editor.isActive('blockquote') ? 'is-active' : ''}`}
                title="Blockquote"
            >
                "
            </button>
            
            <div className="floating-toolbar-separator"></div>
            
            {/* Link Options */}
            <button
                onClick={() => {
                    const url = window.prompt('Enter URL:');
                    if (url) {
                        const { from, to } = editor.state.selection;
                        editor.chain().focus().setTextSelection({ from, to }).toggleLink({ href: url }).run();
                    }
                }}
                className={`floating-toolbar-button ${editor.isActive('link') ? 'is-active' : ''}`}
                title="Link"
            >
                🔗
            </button>
            {editor.isActive('link') && (
                <button
                    onClick={() => editor.chain().focus().unsetLink().run()}
                    className="floating-toolbar-button"
                    title="Remove Link"
                >
                    ❌
                </button>
            )}
            
            <div className="floating-toolbar-separator"></div>
            
            {/* AI Options */}
            <div className="ai-menu-container" ref={aiMenuRef}>
                <button
                    onClick={() => setShowAIMenu(!showAIMenu)}
                    className={`floating-toolbar-button ai-button ${showAIMenu ? 'is-active' : ''} ${isProcessing ? 'is-processing' : ''}`}
                    title="AI Assistant"
                    disabled={isProcessing}
                >
                    {isProcessing ? '⏳' : '✨'}
                </button>
                
                {showAIMenu && (
                    <div className="ai-dropdown-menu">
                        <button
                            className="ai-menu-item"
                            onClick={() => handleAIAction('extend')}
                            disabled={isProcessing}
                        >
                            <span className="ai-menu-icon">📝</span>
                            <span className="ai-menu-text">Extend</span>
                        </button>
                        <button
                            className="ai-menu-item"
                            onClick={() => handleAIAction('rewrite')}
                            disabled={isProcessing}
                        >
                            <span className="ai-menu-icon">✍️</span>
                            <span className="ai-menu-text">Rewrite</span>
                        </button>
                        <button
                            className="ai-menu-item"
                            onClick={() => handleAIAction('references')}
                            disabled={isProcessing}
                        >
                            <span className="ai-menu-icon">📚</span>
                            <span className="ai-menu-text">Search for references</span>
                        </button>
                        <button
                            className="ai-menu-item"
                            onClick={() => handleAIAction('translate')}
                            disabled={isProcessing}
                        >
                            <span className="ai-menu-icon">🌐</span>
                            <span className="ai-menu-text">Translate</span>
                        </button>
                    </div>
                )}
            </div>
        </BubbleMenu>
    );
} 