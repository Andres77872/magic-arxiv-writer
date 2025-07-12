// Common types for the FloatingToolbar components
import { Editor } from '@tiptap/react';

// AI action types
export type AIAction = 'extend' | 'rewrite' | 'references' | 'translate';

// Main FloatingToolbar component props
export interface FloatingToolbarProps {
    editor: Editor;
}

// AIMenu component props
export interface AIMenuProps {
    editor: Editor; // Using proper type instead of 'any'
    showMenu: boolean;
    isProcessing: boolean;
    setShowMenu: (show: boolean) => void;
    handleAIAction: (action: AIAction) => void;
}

// TextFormatButtons component props
export type TextFormatButtonsProps = Pick<FloatingToolbarProps, 'editor'>;

// LinkButtons component props
export type LinkButtonsProps = Pick<FloatingToolbarProps, 'editor'>;
