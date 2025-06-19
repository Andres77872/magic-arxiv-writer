import {useState} from 'react';
import './App.css';
import {ChatPanel} from './components/ChatPanel';
import {RichTextEditor} from './components/RichTextEditor';
import {ReferencesPanel} from './components/ReferencesPanel';
import {AcademicTemplates} from './components/AcademicTemplates';
import type {ArxivPaper} from './components/ReferencesPanel/types';
import './components/AcademicTemplates.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type ViewMode = 'edit' | 'preview' | 'split';
type PanelMode = 'chat' | 'references' | 'templates';

// Template interface for academic paper templates

interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  structure: string;
  prompts: string[];
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

    const [viewMode, setViewMode] = useState<ViewMode>('edit');
    const [panelMode, setPanelMode] = useState<PanelMode>('chat');
    
    // Calculate document stats
    const wordCount = markdown.split(/\s+/).filter(word => word.length > 0).length;
    const lineCount = markdown.split('\n').length;
    const charCount = markdown.length;

    const handleCiteReference = (reference: ArxivPaper) => {
        // Insert citation into the document
        const firstAuthor = reference.authors.split(',')[0]?.trim().split(' ').pop() || 'Unknown';
        const year = new Date(reference.date).getFullYear();
        const citation = `[${firstAuthor} et al., ${year}]`;
        const citationWithLink = `${citation}(#ref-${reference.id.replace('.', '')})`;
        
        // Add to document - you can customize the citation format
        const currentContent = markdown;
        const newContent = currentContent + `\n\n${citationWithLink}`;
        setMarkdown(newContent);
        
        // Add to references section if not already present
        if (!currentContent.includes(`## References`)) {
            const referencesSection = `\n\n## References\n\n`;
            setMarkdown(newContent + referencesSection);
        }
        
        const referenceEntry = `- **${reference.title}** (arXiv:${reference.id})\n  ${reference.authors}\n  *arXiv preprint arXiv:${reference.id}* (${year})\n  [https://arxiv.org/abs/${reference.id}](https://arxiv.org/abs/${reference.id})\n\n`;
        
        if (!currentContent.includes(reference.id)) {
            setMarkdown(newContent + referenceEntry);
        }
    };

    const handleUseTemplate = (template: Template) => {
        setMarkdown(template.structure);
        setPanelMode('chat'); // Switch to chat to start using AI prompts
    };

    const handleUsePrompt = () => {
        setPanelMode('chat');
        // The ChatPanel component now handles prompts internally through the EmptyState
        // Users can click on suggested prompts to start conversations
    };

    const handleClearDocument = () => {
        if (window.confirm('Are you sure you want to clear the document? This action cannot be undone.')) {
            setMarkdown('');
        }
    };

    const exportToPDF = () => {
        // TODO: Implement PDF export functionality
        console.log('Exporting to PDF...');
        // Placeholder implementation
        alert('PDF export functionality will be implemented soon!');
    };

    const exportToLatex = () => {
        // TODO: Convert markdown to LaTeX format
        console.log('Exporting to LaTeX...');
        // Placeholder implementation
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

    return (
        <div className="app-container">
            <header className="app-header">
                <div className="header-content">
                    <div className="header-title">
                        <h1>📄 ArXiv Writer Assistant</h1>
                        <p>AI-powered academic paper writing with arXiv integration & RAG search</p>
                        <div className="header-links">
                            <a href="https://arizmendi.io/" target="_blank" rel="noopener noreferrer" className="header-link">
                                🌐 Portfolio
                            </a>
                            <a href="https://github.com/Andres77872/magic-arxiv-writer" target="_blank" rel="noopener noreferrer" className="header-link">
                                📂 GitHub
                            </a>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button className="action-button secondary" onClick={handleClearDocument}>
                            <span>🗑️</span> Clear
                        </button>
                        <button className="action-button secondary" onClick={exportToLatex}>
                            <span>📐</span> LaTeX
                        </button>
                        <button className="action-button secondary" onClick={exportToPDF}>
                            <span>📄</span> PDF
                        </button>
                        <button className="action-button primary" onClick={handleExportMarkdown}>
                            <span>📥</span> Export
                        </button>
                    </div>
                </div>
            </header>
            
            <main className="main-content">
                {/* Left Panel - Dynamic content based on panel mode */}
                <aside className="left-panel">
                    <nav className="panel-selector">
                        <button 
                            className={`panel-tab ${panelMode === 'chat' ? 'active' : ''}`}
                            onClick={() => setPanelMode('chat')}
                            aria-label="AI Assistant Panel"
                        >
                            💬 AI Assistant
                        </button>
                        <button 
                            className={`panel-tab ${panelMode === 'references' ? 'active' : ''}`}
                            onClick={() => setPanelMode('references')}
                            aria-label="References Panel"
                        >
                            📚 References
                        </button>
                        <button 
                            className={`panel-tab ${panelMode === 'templates' ? 'active' : ''}`}
                            onClick={() => setPanelMode('templates')}
                            aria-label="Templates Panel"
                        >
                            📋 Templates
                        </button>
                    </nav>

                    <div className="panel-content">
                        {panelMode === 'chat' && (
                            <ChatPanel 
                                markdown={markdown} 
                                onUpdateMarkdown={setMarkdown}
                            />
                        )}
                        {panelMode === 'references' && (
                            <ReferencesPanel 
                                onCiteReference={handleCiteReference}
                                limit={20}
                            />
                        )}
                        {panelMode === 'templates' && (
                            <AcademicTemplates 
                                onUseTemplate={handleUseTemplate}
                                onUsePrompt={handleUsePrompt}
                            />
                        )}
                    </div>
                </aside>

                {/* Right Panel - Document Editor */}
                <section className="document-panel">
                    <header className="section-header">
                        <h2>📝 Document</h2>
                        <div className="document-controls">
                            <div className="view-mode-toggle" role="tablist">
                                <button 
                                    className={`mode-button ${viewMode === 'edit' ? 'active' : ''}`}
                                    onClick={() => setViewMode('edit')}
                                    title="Edit Mode"
                                    role="tab"
                                    aria-selected={viewMode === 'edit'}
                                >
                                    ✏️ Edit
                                </button>
                                <button 
                                    className={`mode-button ${viewMode === 'preview' ? 'active' : ''}`}
                                    onClick={() => setViewMode('preview')}
                                    title="Preview Mode"
                                    role="tab"
                                    aria-selected={viewMode === 'preview'}
                                >
                                    👁️ Preview
                                </button>
                                <button 
                                    className={`mode-button ${viewMode === 'split' ? 'active' : ''}`}
                                    onClick={() => setViewMode('split')}
                                    title="Split Mode"
                                    role="tab"
                                    aria-selected={viewMode === 'split'}
                                >
                                    ⚡ Split
                                </button>
                            </div>
                            <div className="document-stats" aria-label="Document Statistics">
                                <span className="stat" title={`${wordCount} words`}>
                                    {wordCount.toLocaleString()} words
                                </span>
                                <span className="stat" title={`${lineCount} lines`}>
                                    {lineCount.toLocaleString()} lines
                                </span>
                                <span className="stat" title={`${charCount} characters`}>
                                    {charCount.toLocaleString()} chars
                                </span>
                            </div>
                        </div>
                    </header>
                    
                    <div className={`editor-container ${viewMode}`}>
                        {(viewMode === 'edit' || viewMode === 'split') && (
                            <div className="editor-pane" role="tabpanel">
                                <RichTextEditor
                                    value={markdown}
                                    onChange={setMarkdown}
                                    placeholder="Start writing your academic paper..."
                                    height="100%"
                                />
                            </div>
                        )}
                        
                        {(viewMode === 'preview' || viewMode === 'split') && (
                            <div className="preview-pane" role="tabpanel">
                                <div className="preview-content markdown-preview">
                                    {markdown ? (
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {markdown}
                                        </ReactMarkdown>
                                    ) : (
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center', 
                                            height: '200px',
                                            color: 'var(--text-color-tertiary)',
                                            fontStyle: 'italic'
                                        }}>
                                            No content to preview
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default App;
