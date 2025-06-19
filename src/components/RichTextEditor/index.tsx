import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useMemo, useState, useRef } from 'react';
import { type RichTextEditorProps } from './types';
import { LoadingState } from './LoadingState';
import { EditorToolbar } from './EditorToolbar';
import { EditorContent } from './EditorContent';
import { EditorStatusBar } from './EditorStatusBar';
import { createMarkdownConverter } from './utils/markdownConverter';
import { updateCounts } from './utils/wordCounter';
import './index.css';

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder, 
  height = '100%' 
}: RichTextEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);

  // Initialize markdown converter service
  const markdownConverter = useMemo(() => createMarkdownConverter(), []);

  // Initialize TipTap editor
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
    content: markdownConverter.markdownToHtml(value),
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const markdown = markdownConverter.htmlToMarkdown(html);
      onChange(markdown);
      
      const counts = updateCounts(html);
      setWordCount(counts.wordCount);
      setCharacterCount(counts.characterCount);
    },
    onCreate: ({ editor }) => {
      const counts = updateCounts(editor.getHTML());
      setWordCount(counts.wordCount);
      setCharacterCount(counts.characterCount);
    },
    editorProps: {
      attributes: {
        class: 'rich-text-editor-content',
        'data-testid': 'rich-text-editor',
      },
    },
  });

  // Update editor content when value changes from outside
  useEffect(() => {
    if (editor && value !== markdownConverter.htmlToMarkdown(editor.getHTML())) {
      editor.commands.setContent(markdownConverter.markdownToHtml(value));
      const counts = updateCounts(editor.getHTML());
      setWordCount(counts.wordCount);
      setCharacterCount(counts.characterCount);
    }
  }, [value, editor, markdownConverter]);

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      editor?.commands.focus();
    }, 100);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'b':
            event.preventDefault();
            editor?.chain().focus().toggleBold().run();
            break;
          case 'i':
            event.preventDefault();
            editor?.chain().focus().toggleItalic().run();
            break;
          case 'k':
            event.preventDefault();
            editor?.chain().focus().toggleCode().run();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editor, isFullscreen]);

  if (!editor) {
    return <LoadingState />;
  }

  return (
    <div 
      className={`rich-text-editor ${isFullscreen ? 'fullscreen' : ''}`}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      <EditorToolbar
        editor={editor}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        wordCount={wordCount}
        characterCount={characterCount}
      />

      <EditorContent editor={editor} />

      <EditorStatusBar editor={editor} />
    </div>
  );
} 