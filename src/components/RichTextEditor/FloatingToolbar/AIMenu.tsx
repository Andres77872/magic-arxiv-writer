import React from 'react';
import './FloatingToolbar.css';
import './AIMenu.css';
import type { AIMenuProps } from './types';

export const AIMenu: React.FC<AIMenuProps> = ({
    showMenu,
    isProcessing,
    setShowMenu,
    handleAIAction,
}) => {
    return (
        <div className="ai-menu-container">
            <button
                onClick={() => setShowMenu(!showMenu)}
                className={`ft-button ai-button ${showMenu ? 'ft-active-button' : ''} ${isProcessing ? 'processing' : ''}`}
                title="AI Assistant"
                disabled={isProcessing}
            >
                {isProcessing ? '⏳' : '✨'}
            </button>
            
            {showMenu && (
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
    );
};
