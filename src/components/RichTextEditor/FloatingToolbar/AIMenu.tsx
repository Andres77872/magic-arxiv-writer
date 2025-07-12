import React from 'react';
import styles from './FloatingToolbar.module.css';
import aiStyles from './AIMenu.module.css';
import type { AIMenuProps } from './types';

export const AIMenu: React.FC<AIMenuProps> = ({
    showMenu,
    isProcessing,
    setShowMenu,
    handleAIAction,
}) => {
    return (
        <div className={aiStyles.menuContainer}>
            <button
                onClick={() => setShowMenu(!showMenu)}
                className={`${styles.button} ${aiStyles.aiButton} ${showMenu ? styles.activeButton : ''} ${isProcessing ? aiStyles.processing : ''}`}
                title="AI Assistant"
                disabled={isProcessing}
            >
                {isProcessing ? '⏳' : '✨'}
            </button>
            
            {showMenu && (
                <div className={aiStyles.dropdownMenu}>
                    <button
                        className={aiStyles.menuItem}
                        onClick={() => handleAIAction('extend')}
                        disabled={isProcessing}
                    >
                        <span className={aiStyles.menuIcon}>📝</span>
                        <span className={aiStyles.menuText}>Extend</span>
                    </button>
                    <button
                        className={aiStyles.menuItem}
                        onClick={() => handleAIAction('rewrite')}
                        disabled={isProcessing}
                    >
                        <span className={aiStyles.menuIcon}>✍️</span>
                        <span className={aiStyles.menuText}>Rewrite</span>
                    </button>
                    <button
                        className={aiStyles.menuItem}
                        onClick={() => handleAIAction('references')}
                        disabled={isProcessing}
                    >
                        <span className={aiStyles.menuIcon}>📚</span>
                        <span className={aiStyles.menuText}>Search for references</span>
                    </button>
                    <button
                        className={aiStyles.menuItem}
                        onClick={() => handleAIAction('translate')}
                        disabled={isProcessing}
                    >
                        <span className={aiStyles.menuIcon}>🌐</span>
                        <span className={aiStyles.menuText}>Translate</span>
                    </button>
                </div>
            )}
        </div>
    );
};
