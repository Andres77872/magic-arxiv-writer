import React from 'react';
import styles from './FloatingToolbar.module.css';
import type { TextFormatButtonsProps } from './types';

export const TextFormatButtons: React.FC<TextFormatButtonsProps> = ({ editor }) => {
    return (
        <>
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`${styles.button} ${editor.isActive('bold') ? styles.activeButton : ''}`}
                title="Bold"
            >
                B
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`${styles.button} ${editor.isActive('italic') ? styles.activeButton : ''}`}
                title="Italic"
            >
                I
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`${styles.button} ${editor.isActive('strike') ? styles.activeButton : ''}`}
                title="Strikethrough"
            >
                S
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={`${styles.button} ${editor.isActive('code') ? styles.activeButton : ''}`}
                title="Code"
            >
                &lt;/&gt;
            </button>
            <div className={styles.separator}></div>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`${styles.button} ${editor.isActive('bulletList') ? styles.activeButton : ''}`}
                title="Bullet List"
            >
                •
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`${styles.button} ${editor.isActive('orderedList') ? styles.activeButton : ''}`}
                title="Numbered List"
            >
                1.
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`${styles.button} ${editor.isActive('blockquote') ? styles.activeButton : ''}`}
                title="Blockquote"
            >
                "
            </button>
        </>
    );
};
