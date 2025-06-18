import { type EditorStatsProps } from './types';
import './EditorStats.css';

export function EditorStats({ wordCount, characterCount }: EditorStatsProps) {
  return (
    <div className="toolbar-stats">
      <span className="stat-item">
        <span className="stat-label">Words:</span>
        <span className="stat-value">{wordCount}</span>
      </span>
      <span className="stat-item">
        <span className="stat-label">Chars:</span>
        <span className="stat-value">{characterCount}</span>
      </span>
    </div>
  );
} 