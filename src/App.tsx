import {useState} from 'react';
import './App.css';
import MDEditor, { getCommands, getExtraCommands } from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import {ChatSection} from './components/ChatSection';

function App() {
    const [markdown, setMarkdown] = useState('');

    return (
        <div className="main">
            <ChatSection markdown={markdown} onUpdateMarkdown={setMarkdown}/>
            <div className="markdown-section">
                <div className="panel-header">Document</div>
                <div className="editor-wrapper">
                    <MDEditor
                        value={markdown}
                        onChange={(value = '') => setMarkdown(value)}
                        placeholder="Start writing your document..."
                        preview="edit"
                        commands={getCommands()}
                        extraCommands={getExtraCommands()}
                        textareaProps={{
                            placeholder: 'Write your document here...',
                            style: { fontSize: 'var(--font-size-md)', lineHeight: 'var(--line-height-normal)' },
                        }}
                        height="100%"
                        visiableDragbar={false}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
