import { useState } from 'react';
import './App.css';
import { Header } from './components/Header';
import { Auth } from './components/Auth';
import { MainContent } from './components/MainContent';

interface User {
    user_hash: string;
    username: string;
    email: string;
    user_type: string;
    created_at: string | null;
    updated_at: string | null;
}

function App() {
    const [markdown, setMarkdown] = useState(`# Welcome to ArXiv Writer Assistant

This is your AI-powered academic writing companion, specifically designed for creating high-quality arXiv papers with proper citations and references.

## Getting Started

1. **🎯 Choose a Template**: Use academic templates for different research areas
2. **🔍 Search References**: Find relevant arXiv papers using semantic search  
3. **💬 AI Assistant**: Get help with writing, structuring, and improving your paper
4. **📝 Rich Editor**: Write naturally with visual formatting that outputs clean markdown

## Features

- **RAG-powered Search**: ColPali embeddings for finding relevant arXiv papers
- **Smart Citations**: Automatic reference management and BibTeX generation
- **Academic Templates**: Pre-built structures for different research domains
- **AI Writing Assistant**: Specialized prompts for academic writing
- **Real-time Preview**: See your paper as it will appear when published

Start by exploring the templates or asking the AI assistant for help with your research topic!`);

    // Authentication state
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    // Header action handlers
    const handleClearDocument = () => {
        if (window.confirm('Are you sure you want to clear the document? This action cannot be undone.')) {
            setMarkdown('');
        }
    };

    const exportToPDF = () => {
        // TODO: Implement PDF export functionality
        console.log('Exporting to PDF...');
        alert('PDF export functionality will be implemented soon!');
    };

    const exportToLatex = () => {
        // TODO: Convert markdown to LaTeX format
        console.log('Exporting to LaTeX...');
        alert('LaTeX export functionality will be implemented soon!');
    };

    const handleExportMarkdown = () => {
        try {
            const blob = new Blob([markdown], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'arxiv-paper.md';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to export markdown:', error);
            alert('Failed to export the document. Please try again.');
        }
    };

    // Auth handlers
    const handleLoginSuccess = (userData: User) => {
        setIsLoggedIn(true);
        setUser(userData);
        setShowLoginModal(false);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
    };

    const handleLoginClick = () => {
        setShowLoginModal(true);
    };

    const handleCloseModal = () => {
        setShowLoginModal(false);
    };

    return (
        <div className="app-container">
            <Header
                isLoggedIn={isLoggedIn}
                user={user}
                onLoginClick={handleLoginClick}
                onLogout={handleLogout}
                onClearDocument={handleClearDocument}
                onExportLatex={exportToLatex}
                onExportPDF={exportToPDF}
                onExportMarkdown={handleExportMarkdown}
            />

            <Auth
                showLoginModal={showLoginModal}
                onClose={handleCloseModal}
                onLoginSuccess={handleLoginSuccess}
            />

            <MainContent
                markdown={markdown}
                onUpdateMarkdown={setMarkdown}
            />
        </div>
    );
}

export default App;
