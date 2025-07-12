import React from 'react';
import { CommandItem } from './CommandItem';
import type { CommandListProps } from './types';
import './SlashCommand.css';

export const CommandList: React.FC<CommandListProps> = ({
    commands,
    selectedIndex,
    editor,
    onSelectCommand,
    onMouseEnter
}) => {
    return (
        <>
            {commands.map((command, index) => (
                <CommandItem
                    key={command.title}
                    command={command}
                    isSelected={index === selectedIndex}
                    editor={editor}
                    onClick={() => onSelectCommand(command)}
                    onMouseEnter={() => onMouseEnter(index)}
                />
            ))}
        </>
    );
};
