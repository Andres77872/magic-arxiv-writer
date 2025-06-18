import { type EditorStatusBarProps } from './types';
import './EditorStatusBar.css';

export function EditorStatusBar({ editor }: EditorStatusBarProps) {
  const getCurrentState = () => {
    if (!editor) return 'Ready';
    
    if (editor.isActive('heading', { level: 1 })) return 'Title';
    if (editor.isActive('heading', { level: 2 })) return 'Heading 2';
    if (editor.isActive('heading', { level: 3 })) return 'Heading 3';
    if (editor.isActive('bulletList')) return 'Bullet List';
    if (editor.isActive('orderedList')) return 'Numbered List';
    if (editor.isActive('codeBlock')) return 'Code Block';
    if (editor.isActive('blockquote')) return 'Quote';
    if (editor.isActive('paragraph') && !editor.isActive('heading')) return 'Paragraph';
    
    return 'Ready';
  };

  return (
    <div className="editor-status-bar">
      <div className="status-left">
        <span className="status-item">
          {getCurrentState()}
        </span>
      </div>
      <div className="status-right">
        <span className="status-item keyboard-hint">
          Use Ctrl+B for bold, Ctrl+I for italic, Ctrl+K for code
        </span>
      </div>
    </div>
  );
} 