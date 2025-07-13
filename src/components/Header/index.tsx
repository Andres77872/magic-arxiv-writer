import React from 'react';
import './index.css';

interface User {
    user_hash: string;
    username: string;
    email: string;
    user_type: string;
    created_at: string | null;
    updated_at: string | null;
}

interface HeaderProps {
    isLoggedIn: boolean;
    user: User | null;
    onLoginClick: () => void;
    onLogout: () => void;
    onClearDocument: () => void;
    onExportLatex: () => void;
    onExportPDF: () => void;
    onExportMarkdown: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    isLoggedIn,
    user,
    onLoginClick,
    onLogout,
    onClearDocument,
    onExportLatex,
    onExportPDF,
    onExportMarkdown,
}) => {
    return (
        <header className="app-header">
            <div className="header-content">
                <div className="header-title">
                    <h1>📄 ArXiv Writer Assistant</h1>
                    <p>AI-powered academic paper writing with arXiv integration & RAG search</p>
                    <div className="header-links">
                        <a href="https://arizmendi.io/" target="_blank" rel="noopener noreferrer"
                           className="header-link">
                            🌐 Portfolio
                        </a>
                        <a href="https://github.com/Andres77872/magic-arxiv-writer" target="_blank"
                           rel="noopener noreferrer" className="header-link">
                            📂 GitHub
                        </a>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="action-button secondary" onClick={onClearDocument}>
                        <span>🗑️</span> Clear
                    </button>
                    <button className="action-button secondary" onClick={onExportLatex}>
                        <span>📐</span> LaTeX
                    </button>
                    <button className="action-button secondary" onClick={onExportPDF}>
                        <span>📄</span> PDF
                    </button>
                    <button className="action-button primary" onClick={onExportMarkdown}>
                        <span>📥</span> Export
                    </button>
                    {isLoggedIn ? (
                        <div className="user-menu">
                            <span className="user-welcome">👋 {user?.username}</span>
                            <button className="action-button secondary" onClick={onLogout}>
                                <span>🚪</span> Logout
                            </button>
                        </div>
                    ) : (
                        <button className="action-button secondary" onClick={onLoginClick}>
                            <span>🔐</span> Login
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}; 