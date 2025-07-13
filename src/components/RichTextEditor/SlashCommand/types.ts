import {type Editor} from '@tiptap/react';

export interface SlashCommandItem {
    title: string;
    description: string;
    icon: string;
    command: (editor: Editor) => void;
}

export interface CommandGroup {
    title: string;
    items: SlashCommandItem[];
}

export interface SlashCommandProps {
    editor: Editor;
    position: { top: number; left: number };
    onClose: () => void;
}

export interface CommandItemProps {
    command: SlashCommandItem;
    isSelected: boolean;
    editor: Editor;
    onClick: () => void;
    onMouseEnter: () => void;
}

export interface CommandGroupHeaderProps {
    title: string;
}

export interface CommandListProps {
    groups: CommandGroup[];
    selectedIndex: number;
    editor: Editor;
    onSelectCommand: (command: SlashCommandItem) => void;
    onMouseEnter: (index: number) => void;
    flatCommandsList: SlashCommandItem[]; // For keyboard navigation
}
