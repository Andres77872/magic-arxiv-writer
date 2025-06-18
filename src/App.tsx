import {useState} from 'react';
import './App.css';
import {ChatSection} from './components/ChatSection';
import {RichTextEditor} from './components/RichTextEditor';
import {ReferencesPanel} from './components/ReferencesPanel';
import {AcademicTemplates} from './components/AcademicTemplates';
import type {ArxivPaper} from './components/ReferencesPanel/types';
import './components/RichTextEditor.css';
import './components/AcademicTemplates.css';
import './components/DocumentEditor.css';
import './components/PanelSelector.css';
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
    
    // Reference count for display (will be managed by ReferencesPanel internally)
    const [referencesCount, setReferencesCount] = useState(0);

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

    const handleUsePrompt = (prompt: string) => {
        setPanelMode('chat');
        // The ChatSection component will need to be updated to accept initial prompts
        // For now, we'll switch to chat mode - you can enhance this further
    };

    const exportToPDF = () => {
        // TODO: Implement PDF export functionality
        console.log('Exporting to PDF...');
    };

    const exportToLatex = () => {
        // TODO: Convert markdown to LaTeX format
        console.log('Exporting to LaTeX...');
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <div className="header-content">
                    <div className="header-title">
                        <h1>📄 ArXiv Writer Assistant</h1>
                        <p>AI-powered academic paper writing with arXiv integration & RAG search</p>
                    </div>
                    <div className="header-actions">
                        <button className="action-button secondary" onClick={() => setMarkdown('')}>
                            <span>🗑️</span> Clear
                        </button>
                        <button className="action-button secondary" onClick={exportToLatex}>
                            <span>📐</span> LaTeX
                        </button>
                        <button className="action-button secondary" onClick={exportToPDF}>
                            <span>📄</span> PDF
                        </button>
                        <button className="action-button primary" onClick={() => {
                            const blob = new Blob([markdown], { type: 'text/markdown' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'arxiv-paper.md';
                            a.click();
                            URL.revokeObjectURL(url);
                        }}>
                            <span>📥</span> Export
                        </button>
                    </div>
                </div>
            </header>
            
            <main className="main-content">
                {/* Left Panel - Dynamic content based on panel mode */}
                <div className="left-panel">
                    <div className="panel-selector">
                        <button 
                            className={`panel-tab ${panelMode === 'chat' ? 'active' : ''}`}
                            onClick={() => setPanelMode('chat')}
                        >
                            💬 AI Assistant
                        </button>
                        <button 
                            className={`panel-tab ${panelMode === 'references' ? 'active' : ''}`}
                            onClick={() => setPanelMode('references')}
                        >
                            📚 References
                        </button>
                        <button 
                            className={`panel-tab ${panelMode === 'templates' ? 'active' : ''}`}
                            onClick={() => setPanelMode('templates')}
                        >
                            📋 Templates
                        </button>
                    </div>

                    <div className="panel-content">
                        {panelMode === 'chat' && (
                            <ChatSection markdown={markdown} onUpdateMarkdown={setMarkdown}/>
                        )}
                        {panelMode === 'references' && (
                            <ReferencesPanel 
                                onCiteReference={handleCiteReference}
                                limit={10}
                            />
                        )}
                        {panelMode === 'templates' && (
                            <AcademicTemplates 
                                onUseTemplate={handleUseTemplate}
                                onUsePrompt={handleUsePrompt}
                            />
                        )}
                    </div>
                </div>

                {/* Right Panel - Document Editor */}
                <div className="document-panel">
                    <div className="section-header">
                        <h2>📝 Document</h2>
                        <div className="document-controls">
                            <div className="view-mode-toggle">
                                <button 
                                    className={`mode-button ${viewMode === 'edit' ? 'active' : ''}`}
                                    onClick={() => setViewMode('edit')}
                                    title="Edit Mode"
                                >
                                    ✏️ Edit
                                </button>
                                <button 
                                    className={`mode-button ${viewMode === 'preview' ? 'active' : ''}`}
                                    onClick={() => setViewMode('preview')}
                                    title="Preview Mode"
                                >
                                    👁️ Preview
                                </button>
                                <button 
                                    className={`mode-button ${viewMode === 'split' ? 'active' : ''}`}
                                    onClick={() => setViewMode('split')}
                                    title="Split Mode"
                                >
                                    ⚡ Split
                                </button>
                            </div>
                            <div className="document-stats">
                                <span className="stat">
                                    {markdown.split(/\s+/).filter(word => word.length > 0).length} words
                                </span>
                                <span className="stat">
                                    {markdown.split('\n').length} lines
                                </span>
                                <span className="stat">
                                    {referencesCount} refs
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className={`editor-container ${viewMode}`}>
                        {(viewMode === 'edit' || viewMode === 'split') && (
                            <div className="editor-pane">
                                <RichTextEditor
                                    value={markdown}
                                    onChange={setMarkdown}
                                    placeholder="Start writing your academic paper..."
                                />
                            </div>
                        )}
                        
                        {(viewMode === 'preview' || viewMode === 'split') && (
                            <div className="preview-pane">
                                <div className="preview-content markdown-preview">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {markdown || '*No content to preview*'}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;
