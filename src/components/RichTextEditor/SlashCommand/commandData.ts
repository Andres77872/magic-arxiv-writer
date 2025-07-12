import { type Editor } from '@tiptap/react';
import type { SlashCommandItem, CommandGroup } from './types';

// Define individual commands
const headingAndParagraphCommands: SlashCommandItem[] = [
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
];

const listCommands: SlashCommandItem[] = [
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
];

const blockCommands: SlashCommandItem[] = [
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
];

const dividerCommands: SlashCommandItem[] = [
    {
        title: 'Divider',
        description: 'Visual separator',
        icon: '—',
        command: (editor: Editor) => editor.chain().focus().setHorizontalRule().run(),
    },
];

const aiCommands: SlashCommandItem[] = [
    {
        title: 'Beat',
        description: 'Add AI generated content',
        icon: '✨',
        command: (editor: Editor) => {
            // Placeholder for AI content generation logic
            // This would typically integrate with an AI service
            const aiPlaceholder = '\n[AI content will be generated here]\n';
            editor.chain().focus().insertContent(aiPlaceholder).run();
            // In a real implementation, you would trigger an AI content generation flow here
        },
    },
];

// Organize commands into groups
export const commandGroups: CommandGroup[] = [
    {
        title: 'AI',
        items: aiCommands,
    },
    {
        title: 'Text',
        items: headingAndParagraphCommands,
    },
    {
        title: 'Lists',
        items: listCommands,
    },
    {
        title: 'Blocks',
        items: blockCommands,
    },
    {
        title: 'Other',
        items: dividerCommands,
    },
];

// Flattened list for backward compatibility and keyboard navigation
export const commands: SlashCommandItem[] = [
    ...aiCommands,
    ...headingAndParagraphCommands,
    ...listCommands,
    ...blockCommands,
    ...dividerCommands,
];
