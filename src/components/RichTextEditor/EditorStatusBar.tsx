import { type EditorStatusBarProps } from './types';

export function EditorStatusBar({ editor }: EditorStatusBarProps) {
  const canUndo = editor?.can().undo();
  const canRedo = editor?.can().redo();
  
  return (
    <div className="editor-status-bar">
      <div className="status-left">
        <span className="status-item">
          {editor?.isActive('bold') && 'Bold '}
          {editor?.isActive('italic') && 'Italic '}
          {editor?.isActive('code') && 'Code '}
        </span>
      </div>
      
      <div className="status-right">
        <span className="keyboard-hint">
          Ctrl+B Bold • Ctrl+I Italic • Ctrl+K Code • ESC Exit Fullscreen
        </span>
        <span className="status-item">
          {canUndo ? 'Can Undo' : ''} {canRedo ? 'Can Redo' : ''}
        </span>
      </div>
    </div>
  );
} 