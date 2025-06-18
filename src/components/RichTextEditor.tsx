import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Typography from '@tiptap/extension-typography'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useMemo, useState, useRef } from 'react'
import TurndownService from 'turndown'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: string
}

export function RichTextEditor({ value, onChange, placeholder, height = '100%' }: RichTextEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [characterCount, setCharacterCount] = useState(0)
  const editorRef = useRef<HTMLDivElement>(null)

  // Initialize turndown service for HTML to Markdown conversion
  const turndownService = useMemo(() => {
    const service = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-',
      emDelimiter: '*',
      strongDelimiter: '**'
    })
    
    // Custom rules for better academic writing
    service.addRule('academicHeadings', {
      filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      replacement: function (content, node) {
        const hLevel = parseInt(node.nodeName.charAt(1))
        const hPrefix = '#'.repeat(hLevel)
        return `\n\n${hPrefix} ${content}\n\n`
      }
    })
    
    service.addRule('preserveLineBreaks', {
      filter: 'br',
      replacement: () => '\n'
    })
    
    return service
  }, [])

  // Convert markdown to HTML for initial content
  const markdownToHtml = (markdown: string): string => {
    if (!markdown) return ''
    
    // Enhanced markdown to HTML conversion
    return markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/^\- (.*$)/gim, '<ul><li>$1</li></ul>')
      .replace(/^\d+\. (.*$)/gim, '<ol><li>$1</li></ol>')
      .replace(/^> (.*$)/gim, '<blockquote><p>$1</p></blockquote>')
      .replace(/---/g, '<hr>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>')
      .replace(/<\/p><p><\/p>/g, '</p><p>')
      .replace(/<p><h/g, '<h')
      .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
      .replace(/<p><ul>/g, '<ul>')
      .replace(/<\/ul><\/p>/g, '</ul>')
      .replace(/<p><ol>/g, '<ol>')
      .replace(/<\/ol><\/p>/g, '</ol>')
      .replace(/<p><blockquote>/g, '<blockquote>')
      .replace(/<\/blockquote><\/p>/g, '</blockquote>')
      .replace(/<p><hr><\/p>/g, '<hr>')
      .replace(/<p><pre>/g, '<pre>')
      .replace(/<\/pre><\/p>/g, '</pre>')
  }

  // Count words and characters
  const updateCounts = (text: string) => {
    const plainText = text.replace(/<[^>]*>/g, '').trim()
    const words = plainText ? plainText.split(/\s+/).length : 0
    const characters = plainText.length
    setWordCount(words)
    setCharacterCount(characters)
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        code: {
          HTMLAttributes: {
            class: 'code-inline',
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'code-block',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'blockquote-academic',
          },
        },
      }),
      Typography,
      Placeholder.configure({
        placeholder: placeholder || 'Start writing your academic paper...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: markdownToHtml(value),
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const markdown = turndownService.turndown(html)
      onChange(markdown)
      updateCounts(html)
    },
    onCreate: ({ editor }) => {
      updateCounts(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'rich-text-editor-content',
        'data-testid': 'rich-text-editor',
      },
    },
  })

  // Update editor content when value changes from outside
  useEffect(() => {
    if (editor && value !== turndownService.turndown(editor.getHTML())) {
      editor.commands.setContent(markdownToHtml(value))
      updateCounts(editor.getHTML())
    }
  }, [value, editor, turndownService])

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    setTimeout(() => {
      editor?.commands.focus()
    }, 100)
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'b':
            event.preventDefault()
            editor?.chain().focus().toggleBold().run()
            break
          case 'i':
            event.preventDefault()
            editor?.chain().focus().toggleItalic().run()
            break
          case 'k':
            event.preventDefault()
            editor?.chain().focus().toggleCode().run()
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [editor, isFullscreen])

  if (!editor) {
    return (
      <div className="rich-text-editor-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <p>Loading editor...</p>
      </div>
    )
  }

  return (
    <div 
      ref={editorRef}
      className={`rich-text-editor ${isFullscreen ? 'fullscreen' : ''}`}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      {/* Enhanced Toolbar */}
      <div className="editor-toolbar">
        <div className="toolbar-section-left">
          <div className="toolbar-group">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`toolbar-button ${editor.isActive('heading', { level: 1 }) ? 'active' : ''}`}
              title="Title (Ctrl+Alt+1)"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`toolbar-button ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
              title="Heading (Ctrl+Alt+2)"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`toolbar-button ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}
              title="Subheading (Ctrl+Alt+3)"
            >
              H3
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={`toolbar-button ${editor.isActive('paragraph') ? 'active' : ''}`}
              title="Paragraph"
            >
              P
            </button>
          </div>

          <div className="toolbar-separator"></div>

          <div className="toolbar-group">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`toolbar-button ${editor.isActive('bold') ? 'active' : ''}`}
              title="Bold (Ctrl+B)"
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`toolbar-button ${editor.isActive('italic') ? 'active' : ''}`}
              title="Italic (Ctrl+I)"
            >
              <em>I</em>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`toolbar-button ${editor.isActive('code') ? 'active' : ''}`}
              title="Inline Code (Ctrl+K)"
            >
              {'</>'}
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`toolbar-button ${editor.isActive('strike') ? 'active' : ''}`}
              title="Strikethrough"
            >
              <s>S</s>
            </button>
          </div>

          <div className="toolbar-separator"></div>

          <div className="toolbar-group">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`toolbar-button ${editor.isActive('bulletList') ? 'active' : ''}`}
              title="Bullet List"
            >
              <span className="list-icon">•</span>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`toolbar-button ${editor.isActive('orderedList') ? 'active' : ''}`}
              title="Numbered List"
            >
              <span className="list-icon">1.</span>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`toolbar-button ${editor.isActive('codeBlock') ? 'active' : ''}`}
              title="Code Block"
            >
              {'{ }'}
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`toolbar-button ${editor.isActive('blockquote') ? 'active' : ''}`}
              title="Quote"
            >
              <span className="quote-icon">"</span>
            </button>
          </div>

          <div className="toolbar-separator"></div>

          <div className="toolbar-group">
            <button
              type="button"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="toolbar-button"
              title="Horizontal Rule"
            >
              <span className="hr-icon">―</span>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setHardBreak().run()}
              className="toolbar-button"
              title="Line Break"
            >
              <span className="break-icon">↵</span>
            </button>
          </div>

          <div className="toolbar-separator"></div>

          <div className="toolbar-group">
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="toolbar-button"
              title="Undo (Ctrl+Z)"
            >
              <span className="undo-icon">↶</span>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="toolbar-button"
              title="Redo (Ctrl+Y)"
            >
              <span className="redo-icon">↷</span>
            </button>
          </div>
        </div>

        <div className="toolbar-section-right">
          <div className="toolbar-stats">
            <span className="stat-item">
              <span className="stat-label">Words:</span>
              <span className="stat-value">{wordCount}</span>
            </span>
            <span className="stat-item">
              <span className="stat-label">Chars:</span>
              <span className="stat-value">{characterCount}</span>
            </span>
          </div>

          <div className="toolbar-separator"></div>

          <div className="toolbar-group">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="toolbar-button"
              title={isFullscreen ? 'Exit Fullscreen (ESC)' : 'Fullscreen'}
            >
              <span className="fullscreen-icon">
                {isFullscreen ? '⊗' : '⊞'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content with Enhanced Scrolling */}
      <div className="editor-content-wrapper">
        <div className="editor-scroll-container">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Status Bar */}
      <div className="editor-status-bar">
        <div className="status-left">
          <span className="status-item">
            {editor.isActive('heading', { level: 1 }) && 'Title'}
            {editor.isActive('heading', { level: 2 }) && 'Heading 2'}
            {editor.isActive('heading', { level: 3 }) && 'Heading 3'}
            {editor.isActive('paragraph') && !editor.isActive('heading') && 'Paragraph'}
            {editor.isActive('bulletList') && 'Bullet List'}
            {editor.isActive('orderedList') && 'Numbered List'}
            {editor.isActive('codeBlock') && 'Code Block'}
            {editor.isActive('blockquote') && 'Quote'}
          </span>
        </div>
        <div className="status-right">
          <span className="status-item keyboard-hint">
            Use Ctrl+B for bold, Ctrl+I for italic, Ctrl+K for code
          </span>
        </div>
      </div>
    </div>
  )
}