import React from 'react';
import type { CommandItemProps } from './types';
import './SlashCommand.css';

export const CommandItem: React.FC<CommandItemProps> = ({
    command,
    isSelected,
    editor,
    onClick,
    onMouseEnter
}) => {
    return (
        <div
            className={`slash-command-item ${isSelected ? 'is-selected' : ''}`}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
        >
            <div className="slash-command-icon">{command.icon}</div>
            <div className="slash-command-content">
                <div className="slash-command-title">{command.title}</div>
                <div className="slash-command-description">{command.description}</div>
            </div>
        </div>
    );
};
