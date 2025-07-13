import React, { useState } from 'react';
import { ChatPanel } from '../ChatPanel';
import { RichTextEditor } from '../RichTextEditor';
import { ReferencesPanel } from '../ReferencesPanel';
import { AcademicTemplates } from '../AcademicTemplates';
import type { ArxivPaper } from '../ReferencesPanel/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './index.css';

type ViewMode = 'edit' | 'preview' | 'split';
type PanelMode = 'chat' | 'references' | 'templates';

interface Template {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    structure: string;
    prompts: string[];
}

interface MainContentProps {
    markdown: string;
    onUpdateMarkdown: (markdown: string) => void;
}

export const MainContent: React.FC<MainContentProps> = ({
    markdown,
    onUpdateMarkdown,
}) => {
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
        onUpdateMarkdown(newContent);

        // Add to references section if not already present
        if (!currentContent.includes(`## References`)) {
            const referencesSection = `\n\n## References\n\n`;
            onUpdateMarkdown(newContent + referencesSection);
        }

        const referenceEntry = `- **${reference.title}** (arXiv:${reference.id})\n  ${reference.authors}\n  *arXiv preprint arXiv:${reference.id}* (${year})\n  [https://arxiv.org/abs/${reference.id}](https://arxiv.org/abs/${reference.id})\n\n`;

        if (!currentContent.includes(reference.id)) {
            onUpdateMarkdown(newContent + referenceEntry);
        }
    };

    const handleUseTemplate = (template: Template) => {
        onUpdateMarkdown(template.structure);
        setPanelMode('chat'); // Switch to chat to start using AI prompts
    };

    const handleUsePrompt = () => {
        setPanelMode('chat');
        // The ChatPanel component now handles prompts internally through the EmptyState
        // Users can click on suggested prompts to start conversations
    };

    return (
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
                            onUpdateMarkdown={onUpdateMarkdown}
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
                                onChange={onUpdateMarkdown}
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
    );
}; 