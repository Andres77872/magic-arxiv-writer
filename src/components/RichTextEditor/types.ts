export interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    height?: string;
}

export interface EditorToolbarProps {
    editor: any;
    isFullscreen: boolean;
    onToggleFullscreen: () => void;
    wordCount: number;
    characterCount: number;
}

export interface ToolbarButtonProps {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    title?: string;
    children: React.ReactNode;
}

export interface ToolbarGroupProps {
    children: React.ReactNode;
}

export interface EditorStatsProps {
    wordCount: number;
    characterCount: number;
}

export interface EditorStatusBarProps {
    editor: any;
}

export interface LoadingStateProps {
    message?: string;
}

export interface EditorContentProps {
    editor: any;
}

export type MarkdownConversionService = {
    markdownToHtml: (markdown: string) => string;
    htmlToMarkdown: (html: string) => string;
}; 