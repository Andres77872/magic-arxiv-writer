import { type Editor } from '@tiptap/react';
import type { SlashCommandItem } from './types';

export const commands: SlashCommandItem[] = [
    {
        title: 'Heading 1',
        description: 'Big section heading',
        icon: 'H1',
        command: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
        title: 'Heading 2',
        description: 'Medium section heading',
        icon: 'H2',
        command: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
        title: 'Heading 3',
        description: 'Small section heading',
        icon: 'H3',
        command: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
        title: 'Paragraph',
        description: 'Plain text paragraph',
        icon: '¶',
        command: (editor: Editor) => editor.chain().focus().setParagraph().run(),
    },
    {
        title: 'Bullet List',
        description: 'Create a simple list',
        icon: '•',
        command: (editor: Editor) => editor.chain().focus().toggleBulletList().run(),
    },
    {
        title: 'Numbered List',
        description: 'Create a numbered list',
        icon: '1.',
        command: (editor: Editor) => editor.chain().focus().toggleOrderedList().run(),
    },
    {
        title: 'Quote',
        description: 'Capture a quote',
        icon: '"',
        command: (editor: Editor) => editor.chain().focus().toggleBlockquote().run(),
    },
    {
        title: 'Code Block',
        description: 'Display code with syntax',
        icon: '{ }',
        command: (editor: Editor) => editor.chain().focus().toggleCodeBlock().run(),
    },
    {
        title: 'Divider',
        description: 'Visual separator',
        icon: '—',
        command: (editor: Editor) => editor.chain().focus().setHorizontalRule().run(),
    },
];
