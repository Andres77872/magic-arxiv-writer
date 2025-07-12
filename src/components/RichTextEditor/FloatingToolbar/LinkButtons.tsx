import React from 'react';
import styles from './FloatingToolbar.module.css';
import type { LinkButtonsProps } from './types';

export const LinkButtons: React.FC<LinkButtonsProps> = ({ editor }) => {
    return (
        <>
            <div className={styles.separator}></div>
            <button
                onClick={() => {
                    const url = window.prompt('Enter URL:');
                    if (url) {
                        const { from, to } = editor.state.selection;
                        editor.chain().focus().setTextSelection({ from, to }).toggleLink({ href: url }).run();
                    }
                }}
                className={`${styles.button} ${editor.isActive('link') ? styles.activeButton : ''}`}
                title="Link"
            >
                🔗
            </button>
            {editor.isActive('link') && (
                <button
                    onClick={() => editor.chain().focus().unsetLink().run()}
                    className={styles.button}
                    title="Remove Link"
                >
                    ❌
                </button>
            )}
            <div className={styles.separator}></div>
        </>
    );
};
