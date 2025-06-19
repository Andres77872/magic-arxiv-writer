import {type EditorStatsProps} from './types';

export function EditorStats({wordCount, characterCount}: EditorStatsProps) {
    return (
        <div className="toolbar-stats" role="status" aria-label="Document statistics">
            <div className="stat-item">
                <span className="stat-label" aria-label="Word count">Words:</span>
                <span className="stat-value" aria-live="polite">{wordCount.toLocaleString()}</span>
            </div>
            <div className="stat-item">
                <span className="stat-label" aria-label="Character count">Chars:</span>
                <span className="stat-value" aria-live="polite">{characterCount.toLocaleString()}</span>
            </div>
        </div>
    );
} 