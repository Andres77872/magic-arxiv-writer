import {useState} from 'react';
import './App.css';
import MDEditor, { getCommands, getExtraCommands } from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import {ChatSection} from './components/ChatSection';

function App() {
    const [markdown, setMarkdown] = useState(`# Welcome to ArXiv Writer Assistant

Start by asking the AI to help you write your academic paper. For example:

- "Generate an introduction for a machine learning paper about transformers"
- "Create a methodology section for computer vision research"
- "Write an abstract for a paper on neural network optimization"

The AI will help you create and refine your academic content in real-time.`);

    return (
        <div className="app-container">
            <header className="app-header">
                <div className="header-content">
                    <div className="header-title">
                        <h1>📄 ArXiv Writer Assistant</h1>
                        <p>AI-powered academic paper writing with real-time collaboration</p>
                    </div>
                    <div className="header-actions">
                        <button className="action-button secondary" onClick={() => setMarkdown('')}>
                            <span>🗑️</span> Clear Document
                        </button>
                        <button className="action-button primary" onClick={() => {
                            const blob = new Blob([markdown], { type: 'text/markdown' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'paper.md';
                            a.click();
                            URL.revokeObjectURL(url);
                        }}>
                            <span>📥</span> Export
                        </button>
                    </div>
                </div>
            </header>
            
            <main className="main-content">
                <ChatSection markdown={markdown} onUpdateMarkdown={setMarkdown}/>
                <div className="markdown-section">
                    <div className="section-header">
                        <h2>📝 Document</h2>
                        <div className="document-stats">
                            <span className="stat">
                                {markdown.split(/\s+/).filter(word => word.length > 0).length} words
                            </span>
                            <span className="stat">
                                {markdown.split('\n').length} lines
                            </span>
                        </div>
                    </div>
                    <div className="editor-wrapper">
                        <MDEditor
                            value={markdown}
                            onChange={(value = '') => setMarkdown(value)}
                            preview="edit"
                            commands={getCommands()}
                            extraCommands={getExtraCommands()}
                            textareaProps={{
                                placeholder: 'Your academic paper content will appear here...',
                                style: { fontSize: 'var(--font-size-md)', lineHeight: 'var(--line-height-normal)' },
                            }}
                            height="100%"
                            visiableDragbar={false}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;
