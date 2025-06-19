import {type EditorToolbarProps} from './types';
import {ToolbarButton} from './ToolbarButton';
import {ToolbarGroup} from './ToolbarGroup';
import {EditorStats} from './EditorStats';

export function EditorToolbar({
                                  editor,
                                  isFullscreen,
                                  onToggleFullscreen,
                                  wordCount,
                                  characterCount
                              }: EditorToolbarProps) {
    if (!editor) return null;

    return (
        <div className="editor-toolbar">
            <div className="toolbar-section-left">
                <ToolbarGroup>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}
                        isActive={editor.isActive('heading', {level: 1})}
                        title="Title (Ctrl+Alt+1)"
                    >
                        H1
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}
                        isActive={editor.isActive('heading', {level: 2})}
                        title="Heading (Ctrl+Alt+2)"
                    >
                        H2
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({level: 3}).run()}
                        isActive={editor.isActive('heading', {level: 3})}
                        title="Subheading (Ctrl+Alt+3)"
                    >
                        H3
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setParagraph().run()}
                        isActive={editor.isActive('paragraph')}
                        title="Paragraph"
                    >
                        P
                    </ToolbarButton>
                </ToolbarGroup>

                <div className="toolbar-separator"></div>

                <ToolbarGroup>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        title="Bold (Ctrl+B)"
                    >
                        <strong>B</strong>
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        title="Italic (Ctrl+I)"
                    >
                        <em>I</em>
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        isActive={editor.isActive('strike')}
                        title="Strikethrough"
                    >
                        <s>S</s>
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        isActive={editor.isActive('code')}
                        title="Inline Code (Ctrl+K)"
                    >
                        {'</>'}
                    </ToolbarButton>
                </ToolbarGroup>

                <div className="toolbar-separator"></div>

                <ToolbarGroup>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        title="Bullet List"
                    >
                        <span className="list-icon">•</span>
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        title="Numbered List"
                    >
                        <span className="list-icon">1.</span>
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                        title="Quote"
                    >
                        <span className="quote-icon">"</span>
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        isActive={editor.isActive('codeBlock')}
                        title="Code Block"
                    >
                        {'{ }'}
                    </ToolbarButton>
                </ToolbarGroup>

                <div className="toolbar-separator"></div>

                <ToolbarGroup>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        title="Horizontal Rule"
                    >
                        <span className="hr-icon">―</span>
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setHardBreak().run()}
                        title="Line Break"
                    >
                        <span className="break-icon">↵</span>
                    </ToolbarButton>
                </ToolbarGroup>

                <div className="toolbar-separator"></div>

                <ToolbarGroup>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        title="Undo (Ctrl+Z)"
                    >
                        <span className="undo-icon">↶</span>
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        title="Redo (Ctrl+Y)"
                    >
                        <span className="redo-icon">↷</span>
                    </ToolbarButton>
                </ToolbarGroup>
            </div>

            <div className="toolbar-section-right">
                <EditorStats wordCount={wordCount} characterCount={characterCount}/>

                <div className="toolbar-separator"></div>

                <ToolbarGroup>
                    <ToolbarButton
                        onClick={onToggleFullscreen}
                        title={isFullscreen ? 'Exit Fullscreen (ESC)' : 'Fullscreen'}
                    >
            <span className="fullscreen-icon">
              {isFullscreen ? '⊗' : '⊞'}
            </span>
                    </ToolbarButton>
                </ToolbarGroup>
            </div>
        </div>
    );
} 