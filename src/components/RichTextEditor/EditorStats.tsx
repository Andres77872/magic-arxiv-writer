import { type EditorStatsProps } from './types';

export function EditorStats({ wordCount, characterCount }: EditorStatsProps) {
  return (
    <div className="toolbar-stats">
      <div className="stat-item">
        <span className="stat-label">Words:</span>
        <span className="stat-value">{wordCount.toLocaleString()}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Chars:</span>
        <span className="stat-value">{characterCount.toLocaleString()}</span>
      </div>
    </div>
  );
} 