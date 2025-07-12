// Common types for the FloatingToolbar components
import { Editor } from '@tiptap/react';

// AI action types
export type AIAction = string;

// Prompt Action definition
export interface PromptAction {
    id: AIAction;
    name: string;
    icon: string;
    model: string;
    promptTemplate: string;
}

// Prompt Actions JSON structure
export interface PromptActionsConfig {
    actions: PromptAction[];
}

// Main FloatingToolbar component props
export interface FloatingToolbarProps {
    editor: Editor;
}

// AIMenu component props
export interface AIMenuProps {
    editor: Editor;
    showMenu: boolean;
    isProcessing: boolean;
    setShowMenu: (show: boolean) => void;
    handleAIAction: (action: AIAction) => void;
    promptActions: PromptAction[];
}

// TextFormatButtons component props
export type TextFormatButtonsProps = Pick<FloatingToolbarProps, 'editor'>;

// LinkButtons component props
export type LinkButtonsProps = Pick<FloatingToolbarProps, 'editor'>;
