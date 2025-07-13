import React from 'react';
import './FloatingToolbar.css';
import './AIMenu.css';
import type { AIMenuProps } from './types';

export const AIMenu: React.FC<AIMenuProps> = ({
    showMenu,
    isProcessing,
    setShowMenu,
    handleAIAction,
    promptActions,
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
                    {promptActions.map((action) => (
                        <button
                            key={action.id}
                            className="ai-menu-item"
                            onClick={() => handleAIAction(action.id)}
                            disabled={isProcessing}
                        >
                            <span className="ai-menu-icon">{action.icon}</span>
                            <span className="ai-menu-text">{action.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
