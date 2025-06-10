import { useState } from 'react';
import './App.css';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import { ChatSection } from './components/ChatSection';

function App() {
  const [markdown, setMarkdown] = useState('');

  return (
    <div id="root">
      <div className="main">
        <ChatSection markdown={markdown} onUpdateMarkdown={setMarkdown} />
        <div className="markdown-section">
          <div className="panel-header">Preview</div>
          <MarkdownRenderer content={markdown} />
        </div>
      </div>
    </div>
  );
}

export default App;
