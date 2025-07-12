import React from 'react';
import './FloatingToolbar.css';
import type { TextFormatButtonsProps } from './types';

export const TextFormatButtons: React.FC<TextFormatButtonsProps> = ({ editor }) => {
    return (
        <>
            {/* Heading Options Group */}
            <div className="ft-button-group">
                <button
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={`ft-button ${editor.isActive('paragraph') ? 'ft-active-button' : ''}`}
                    title="Normal Text"
                >
                    ¶
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`ft-button ${editor.isActive('heading', { level: 1 }) ? 'ft-active-button' : ''}`}
                    title="Heading 1"
                >
                    H1
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`ft-button ${editor.isActive('heading', { level: 2 }) ? 'ft-active-button' : ''}`}
                    title="Heading 2"
                >
                    H2
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`ft-button ${editor.isActive('heading', { level: 3 }) ? 'ft-active-button' : ''}`}
                    title="Heading 3"
                >
                    H3
                </button>
            </div>

            <div className="ft-separator"></div>
            
            {/* Text Formatting Group */}
            <div className="ft-button-group">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`ft-button ${editor.isActive('bold') ? 'ft-active-button' : ''}`}
                    title="Bold"
                >
                    B
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`ft-button ${editor.isActive('italic') ? 'ft-active-button' : ''}`}
                    title="Italic"
                >
                    I
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`ft-button ${editor.isActive('strike') ? 'ft-active-button' : ''}`}
                    title="Strikethrough"
                >
                    S
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={`ft-button ${editor.isActive('code') ? 'ft-active-button' : ''}`}
                    title="Code"
                >
                    &lt;/&gt;
                </button>
            </div>
            
            <div className="ft-separator"></div>
            
            {/* List Options Group */}
            <div className="ft-button-group">
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`ft-button ${editor.isActive('bulletList') ? 'ft-active-button' : ''}`}
                    title="Bullet List"
                >
                    •
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`ft-button ${editor.isActive('orderedList') ? 'ft-active-button' : ''}`}
                    title="Numbered List"
                >
                    1.
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`ft-button ${editor.isActive('blockquote') ? 'ft-active-button' : ''}`}
                    title="Blockquote"
                >
                    "
                </button>
            </div>
        </>
    );
};
