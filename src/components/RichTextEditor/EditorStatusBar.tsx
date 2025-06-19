import {type EditorStatusBarProps} from './types';

export function EditorStatusBar({editor}: EditorStatusBarProps) {
    const canUndo = editor?.can().undo();
    const canRedo = editor?.can().redo();

    const activeFormats = [];
    if (editor?.isActive('bold')) activeFormats.push('Bold');
    if (editor?.isActive('italic')) activeFormats.push('Italic');
    if (editor?.isActive('code')) activeFormats.push('Code');
    if (editor?.isActive('strike')) activeFormats.push('Strike');

    const currentNode = editor?.isActive('heading', {level: 1}) ? 'H1'
        : editor?.isActive('heading', {level: 2}) ? 'H2'
            : editor?.isActive('heading', {level: 3}) ? 'H3'
                : editor?.isActive('bulletList') ? 'List'
                    : editor?.isActive('orderedList') ? 'Numbered List'
                        : editor?.isActive('blockquote') ? 'Quote'
                            : editor?.isActive('codeBlock') ? 'Code Block'
                                : 'Paragraph';

    return (
        <div className="editor-status-bar" role="status" aria-label="Editor status">
            <div className="status-left">
        <span className="status-item" aria-label={`Current element: ${currentNode}`}>
          <strong>{currentNode}</strong>
        </span>
                {activeFormats.length > 0 && (
                    <span className="status-item" aria-label={`Active formats: ${activeFormats.join(', ')}`}>
            {activeFormats.join(' • ')}
          </span>
                )}
            </div>

            <div className="status-right">
        <span className="keyboard-hint" aria-label="Keyboard shortcuts">
          <kbd>Ctrl+B</kbd> Bold • <kbd>Ctrl+I</kbd> Italic • <kbd>Ctrl+K</kbd> Code • <kbd>ESC</kbd> Exit Fullscreen
        </span>
                {(canUndo || canRedo) && (
                    <span className="status-item" aria-label="Undo/Redo status">
            {canUndo && '↶ Undo'} {canUndo && canRedo && ' • '} {canRedo && '↷ Redo'}
          </span>
                )}
            </div>
        </div>
    );
} 