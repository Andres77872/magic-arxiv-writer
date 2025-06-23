import {type Editor} from '@tiptap/react';

interface EditorStatusBarProps {
    editor: Editor;
    wordCount?: number;
    characterCount?: number;
}

export function EditorStatusBar({editor, wordCount, characterCount}: EditorStatusBarProps) {
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
            <div className="status-stats">
                {wordCount !== undefined && (
                    <span className="status-stat">
                        {wordCount} {wordCount === 1 ? 'word' : 'words'}
                    </span>
                )}
                {characterCount !== undefined && (
                    <span className="status-stat">
                        {characterCount} {characterCount === 1 ? 'character' : 'characters'}
                    </span>
                )}
                <span className="status-stat">
                    {currentNode}
                </span>
            </div>

            <div className="keyboard-hint">
                Type <kbd>/</kbd> for commands • <kbd>Ctrl+B</kbd> Bold • <kbd>Ctrl+I</kbd> Italic
            </div>
        </div>
    );
} 