import React, { useEffect, useState, useRef } from 'react';
import { type Editor } from '@tiptap/react';
import { commands } from './commandData';
import { CommandList } from './CommandList';
import type { SlashCommandProps, SlashCommandItem } from './types';
import './SlashCommand.css';

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
                    deleteSlashAndExecuteCommand(filteredCommands[selectedIndex]);
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

    const deleteSlashAndExecuteCommand = (command: SlashCommandItem) => {
        editor.chain().focus().deleteRange({
            from: editor.state.selection.from - 1,
            to: editor.state.selection.from,
        }).run();
        
        command.command(editor);
        onClose();
    };

    const handleSelectCommand = (command: SlashCommandItem) => {
        deleteSlashAndExecuteCommand(command);
    };

    const handleMouseEnter = (index: number) => {
        setSelectedIndex(index);
    };

    return (
        <div 
            ref={menuRef}
            className="slash-command-menu" 
            style={{ top: position.top, left: position.left }}
        >
            <CommandList 
                commands={filteredCommands}
                selectedIndex={selectedIndex}
                editor={editor}
                onSelectCommand={handleSelectCommand}
                onMouseEnter={handleMouseEnter}
            />
        </div>
    );
}

// Re-export types to make them available from the main import
export type { SlashCommandProps, SlashCommandItem } from './types';
