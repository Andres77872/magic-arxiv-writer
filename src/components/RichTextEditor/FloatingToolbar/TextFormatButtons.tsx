import React from 'react';
import './FloatingToolbar.css';
import type { TextFormatButtonsProps } from './types';

export const TextFormatButtons: React.FC<TextFormatButtonsProps> = ({ editor }) => {
    return (
        <>
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
            <div className="ft-separator"></div>
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
        </>
    );
};
