import {type Editor, BubbleMenu} from '@tiptap/react';

interface FloatingToolbarProps {
    editor: Editor;
}

export function FloatingToolbar({ editor }: FloatingToolbarProps) {
    if (!editor) {
        return null;
    }

    return (
        <BubbleMenu 
            editor={editor} 
            tippyOptions={{ 
                duration: 100,
                placement: 'top',
            }}
            className="floating-toolbar"
        >
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`floating-toolbar-button ${editor.isActive('bold') ? 'is-active' : ''}`}
                title="Bold (Ctrl+B)"
            >
                <strong>B</strong>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`floating-toolbar-button ${editor.isActive('italic') ? 'is-active' : ''}`}
                title="Italic (Ctrl+I)"
            >
                <em>I</em>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`floating-toolbar-button ${editor.isActive('strike') ? 'is-active' : ''}`}
                title="Strikethrough"
            >
                <s>S</s>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={`floating-toolbar-button ${editor.isActive('code') ? 'is-active' : ''}`}
                title="Code (Ctrl+K)"
            >
                {'</>'}
            </button>
            
            <div className="floating-toolbar-separator"></div>
            
            <button
                onClick={() => {
                    const url = window.prompt('Enter URL:');
                    if (url) {
                        const { from, to } = editor.state.selection;
                        editor.chain().focus().setTextSelection({ from, to }).toggleLink({ href: url }).run();
                    }
                }}
                className={`floating-toolbar-button ${editor.isActive('link') ? 'is-active' : ''}`}
                title="Link"
            >
                🔗
            </button>
            {editor.isActive('link') && (
                <button
                    onClick={() => editor.chain().focus().unsetLink().run()}
                    className="floating-toolbar-button"
                    title="Remove Link"
                >
                    ❌
                </button>
            )}
        </BubbleMenu>
    );
} 