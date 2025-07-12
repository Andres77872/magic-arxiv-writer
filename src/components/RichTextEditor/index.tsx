import {useEditor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import Focus from '@tiptap/extension-focus';
import Link from '@tiptap/extension-link';
import {useEffect, useMemo, useState, useRef} from 'react';
import {type RichTextEditorProps} from './types';
import {LoadingState} from './LoadingState';
import {EditorContent} from './EditorContent';
import {EditorStatusBar} from './EditorStatusBar';
import {FloatingToolbar} from './FloatingToolbar';
import {SlashCommand} from './SlashCommand';
import {WritingModeIndicator} from './WritingModeIndicator';
import {createMarkdownConverter} from './utils/markdownConverter';
import {updateCounts} from './utils/wordCounter';
import './index.css';

export function RichTextEditor({
                                   value,
                                   onChange,
                                   placeholder,
                                   height = '100%'
                               }: RichTextEditorProps) {

    const [wordCount, setWordCount] = useState(0);
    const [characterCount, setCharacterCount] = useState(0);
    const [showSlashCommand, setShowSlashCommand] = useState(false);
    const [slashCommandPos, setSlashCommandPos] = useState({ top: 0, left: 0 });
    const editorRef = useRef<HTMLDivElement>(null);

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
                placeholder: placeholder || 'Type "/" for commands...',
                emptyEditorClass: 'is-editor-empty',
            }),
            Focus.configure({
                className: 'is-focused',
                mode: 'all',
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'editor-link',
                },
            }),
        ],
        content: markdownConverter.markdownToHtml(value),
        onUpdate: ({editor}) => {
            const html = editor.getHTML();
            const markdown = markdownConverter.htmlToMarkdown(html);
            onChange(markdown);

            const counts = updateCounts(html);
            setWordCount(counts.wordCount);
            setCharacterCount(counts.characterCount);

            // Check for slash command
            const { selection } = editor.state;
            const { $from } = selection;
            const textBefore = $from.nodeBefore?.text || '';
            
            if (textBefore.endsWith('/')) {
                const coords = editor.view.coordsAtPos(selection.from);
                if (editorRef.current) {
                    const editorRect = editorRef.current.getBoundingClientRect();
                    setSlashCommandPos({
                        top: coords.top - editorRect.top + 20,
                        left: coords.left - editorRect.left,
                    });
                    setShowSlashCommand(true);
                }
            } else {
                setShowSlashCommand(false);
            }
        },
        onCreate: ({editor}) => {
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



    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                if (showSlashCommand) {
                    setShowSlashCommand(false);
                }
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
    }, [editor, showSlashCommand]);

    if (!editor) {
        return <LoadingState/>;
    }

    return (
        <div
            ref={editorRef}
            className="rich-text-editor"
            style={{height: height}}
        >
            <div className="editor-top-toolbar">
                <WritingModeIndicator />
            </div>

            <div className="editor-content-wrapper">
                <EditorContent editor={editor}/>
                <FloatingToolbar editor={editor}/>
                
                {showSlashCommand && (
                    <SlashCommand
                        editor={editor}
                        position={slashCommandPos}
                        onClose={() => setShowSlashCommand(false)}
                    />
                )}
            </div>

            <EditorStatusBar 
                editor={editor}
                wordCount={wordCount}
                characterCount={characterCount}
            />
        </div>
    );
} 