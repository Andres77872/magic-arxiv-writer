import React from 'react';
import type { CommandGroupHeaderProps } from './types';
import './SlashCommand.css';

export const CommandGroupHeader: React.FC<CommandGroupHeaderProps> = ({
    title
}) => {
    return (
        <div className="slash-command-group-header">
            {title}
        </div>
    );
};
