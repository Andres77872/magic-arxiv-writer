interface WritingModeIndicatorProps {
    mode?: 'writing' | 'editing' | 'idle';
}

export function WritingModeIndicator({ mode = 'writing' }: WritingModeIndicatorProps) {
    return (
        <div className="writing-mode-indicator">
            <span className="writing-mode-dot"></span>
            <span>{mode === 'writing' ? 'Writing' : mode === 'editing' ? 'Editing' : 'Ready'}</span>
        </div>
    );
} 