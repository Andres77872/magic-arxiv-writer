import {useState} from 'react';
import './App.css';
import {ChatSection} from './components/ChatSection';
import {RichTextEditor} from './components/RichTextEditor';
import {ReferencesPanel} from './components/ReferencesPanel';
import {AcademicTemplates} from './components/AcademicTemplates';
import './components/RichTextEditor.css';
import './components/ReferencesPanel.css';
import './components/AcademicTemplates.css';
import './components/DocumentEditor.css';
import './components/PanelSelector.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type ViewMode = 'edit' | 'preview' | 'split';
type PanelMode = 'chat' | 'references' | 'templates';

// Mock data for demonstration - replace with your API integration
interface ArxivReference {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  published: string;
  arxiv_id: string;
  categories: string[];
  url: string;
  relevance_score?: number;
}

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
    
    // Mock references data - replace with your API integration
    const [references, setReferences] = useState<ArxivReference[]>([]);
    const [isSearchingReferences, setIsSearchingReferences] = useState(false);

    // Handlers for academic features
    const handleSearchReferences = async (query: string) => {
        setIsSearchingReferences(true);
        
        // TODO: Replace with your actual API call to search arXiv papers using ColPali embeddings
        try {
            // Simulated API call - replace with your RAG search endpoint
            console.log('Searching arXiv papers for:', query);
            
            // Mock response - replace with actual data from your API
            const mockReferences: ArxivReference[] = [
                {
                    id: '1',
                    title: 'Attention Is All You Need',
                    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar'],
                    abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...',
                    published: '2017-06-12',
                    arxiv_id: '1706.03762',
                    categories: ['cs.CL', 'cs.LG'],
                    url: 'https://arxiv.org/abs/1706.03762',
                    relevance_score: 0.95
                }
            ];
            
            setTimeout(() => {
                setReferences(mockReferences);
                setIsSearchingReferences(false);
            }, 1000);
            
        } catch (error) {
            console.error('Error searching references:', error);
            setIsSearchingReferences(false);
        }
    };

    const handleCiteReference = (reference: ArxivReference) => {
        // Insert citation into the document
        const citation = `[${reference.authors[0]?.split(' ').pop() || 'Unknown'} et al., ${new Date(reference.published).getFullYear()}]`;
        const citationWithLink = `${citation}(#ref-${reference.arxiv_id.replace('.', '')})`;
        
        // Add to document - you can customize the citation format
        const currentContent = markdown;
        const newContent = currentContent + `\n\n${citationWithLink}`;
        setMarkdown(newContent);
        
        // Add to references section if not already present
        if (!currentContent.includes(`## References`)) {
            const referencesSection = `\n\n## References\n\n`;
            setMarkdown(newContent + referencesSection);
        }
        
        const referenceEntry = `- **${reference.title}** (${reference.arxiv_id})\n  ${reference.authors.join(', ')}\n  *arXiv preprint arXiv:${reference.arxiv_id}* (${new Date(reference.published).getFullYear()})\n  [${reference.url}](${reference.url})\n\n`;
        
        if (!currentContent.includes(reference.arxiv_id)) {
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
                                references={references}
                                onCiteReference={handleCiteReference}
                                onSearchReferences={handleSearchReferences}
                                isSearching={isSearchingReferences}
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
                                    {references.length} refs
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
