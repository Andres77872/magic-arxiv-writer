import React from 'react';
import './FloatingToolbar.css';
import type { LinkButtonsProps } from './types';

export const LinkButtons: React.FC<LinkButtonsProps> = ({ editor }) => {
    return (
        <>
            <div className="ft-separator"></div>
            <button
                onClick={() => {
                    const url = window.prompt('Enter URL:');
                    if (url) {
                        const { from, to } = editor.state.selection;
                        editor.chain().focus().setTextSelection({ from, to }).toggleLink({ href: url }).run();
                    }
                }}
                className={`ft-button ${editor.isActive('link') ? 'ft-active-button' : ''}`}
                title="Link"
            >
                🔗
            </button>
            {editor.isActive('link') && (
                <button
                    onClick={() => editor.chain().focus().unsetLink().run()}
                    className="ft-button"
                    title="Remove Link"
                >
                    ❌
                </button>
            )}
            <div className="ft-separator"></div>
        </>
    );
};
