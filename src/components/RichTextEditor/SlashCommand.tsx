import {type Editor} from '@tiptap/react';
import {useEffect, useState, useRef} from 'react';

export interface SlashCommandItem {
    title: string;
    description: string;
    icon: string;
    command: (editor: Editor) => void;
}

interface SlashCommandProps {
    editor: Editor;
    position: { top: number; left: number };
    onClose: () => void;
}

const commands: SlashCommandItem[] = [
    {
        title: 'Heading 1',
        description: 'Big section heading',
        icon: 'H1',
        command: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
        title: 'Heading 2',
        description: 'Medium section heading',
        icon: 'H2',
        command: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
        title: 'Heading 3',
        description: 'Small section heading',
        icon: 'H3',
        command: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
        title: 'Paragraph',
        description: 'Plain text paragraph',
        icon: '¶',
        command: (editor) => editor.chain().focus().setParagraph().run(),
    },
    {
        title: 'Bullet List',
        description: 'Create a simple list',
        icon: '•',
        command: (editor) => editor.chain().focus().toggleBulletList().run(),
    },
    {
        title: 'Numbered List',
        description: 'Create a numbered list',
        icon: '1.',
        command: (editor) => editor.chain().focus().toggleOrderedList().run(),
    },
    {
        title: 'Quote',
        description: 'Capture a quote',
        icon: '"',
        command: (editor) => editor.chain().focus().toggleBlockquote().run(),
    },
    {
        title: 'Code Block',
        description: 'Display code with syntax',
        icon: '{ }',
        command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    },
    {
        title: 'Divider',
        description: 'Visual separator',
        icon: '—',
        command: (editor) => editor.chain().focus().setHorizontalRule().run(),
    },
];

export function SlashCommand({ editor, position, onClose }: SlashCommandProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [searchQuery] = useState('');
    const menuRef = useRef<HTMLDivElement>(null);

    const filteredCommands = commands.filter(command =>
        command.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        command.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
            } else if (event.key === 'Enter') {
                event.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    // Remove the slash from the editor
                    editor.chain().focus().deleteRange({
                        from: editor.state.selection.from - 1,
                        to: editor.state.selection.from,
                    }).run();
                    
                    filteredCommands[selectedIndex].command(editor);
                    onClose();
                }
            } else if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [editor, filteredCommands, selectedIndex, onClose]);

    useEffect(() => {
        // Reset selected index when search changes
        setSelectedIndex(0);
    }, [searchQuery]);

    if (filteredCommands.length === 0) {
        return null;
    }

    return (
        <div 
            ref={menuRef}
            className="slash-command-menu" 
            style={{ top: position.top, left: position.left }}
        >
            {filteredCommands.map((command, index) => (
                <div
                    key={command.title}
                    className={`slash-command-item ${index === selectedIndex ? 'is-selected' : ''}`}
                    onClick={() => {
                        editor.chain().focus().deleteRange({
                            from: editor.state.selection.from - 1,
                            to: editor.state.selection.from,
                        }).run();
                        command.command(editor);
                        onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                >
                    <div className="slash-command-icon">{command.icon}</div>
                    <div className="slash-command-content">
                        <div className="slash-command-title">{command.title}</div>
                        <div className="slash-command-description">{command.description}</div>
                    </div>
                </div>
            ))}
        </div>
    );
} 