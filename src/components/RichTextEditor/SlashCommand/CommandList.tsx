import React from 'react';
import { CommandItem } from './CommandItem';
import { CommandGroupHeader } from './CommandGroupHeader';
import type { CommandListProps } from './types';
import './SlashCommand.css';

export const CommandList: React.FC<CommandListProps> = ({
    groups,
    selectedIndex,
    editor,
    onSelectCommand,
    onMouseEnter,
    // flatCommandsList not used directly in this component
    // but is required in the interface for consistency
}) => {
    // Track global index for selected items
    let runningIndex = 0;
    
    return (
        <>
            {groups.map((group) => (
                <div className="slash-command-group" key={group.title}>
                    <CommandGroupHeader title={group.title} />
                    
                    {group.items.map((command) => {
                        const currentIndex = runningIndex;
                        runningIndex += 1;
                        
                        return (
                            <CommandItem
                                key={`${group.title}-${command.title}`}
                                command={command}
                                isSelected={currentIndex === selectedIndex}
                                editor={editor}
                                onClick={() => onSelectCommand(command)}
                                onMouseEnter={() => onMouseEnter(currentIndex)}
                            />
                        );
                    })}
                </div>
            ))}
        </>
    );
};
