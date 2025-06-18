import type { ArxivPaper } from './types';
import './PaperStats.css';

interface PaperStatsProps {
  paper: ArxivPaper;
  onSearchRelated: () => void;
}

export function PaperStats({ paper, onSearchRelated }: PaperStatsProps) {
  const getWordCount = (text: string) => {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  };

  const getReadingTime = (text: string) => {
    const wordCount = getWordCount(text);
    const wordsPerMinute = 200; // Average reading speed
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  };

  return (
    <div className="paper-stats">
      <div className="stats-row">
        <div className="stat-item">
          <span className="stat-icon">📊</span>
          <span className="stat-label">Relevance:</span>
          <span className="stat-value">{((paper.score || 0) * 100).toFixed(1)}%</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-icon">📖</span>
          <span className="stat-label">Abstract:</span>
          <span className="stat-value">{getWordCount(paper.abstract)} words</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-icon">⏱️</span>
          <span className="stat-label">Reading time:</span>
          <span className="stat-value">{getReadingTime(paper.abstract)} min</span>
        </div>
      </div>
      
      <div className="stats-actions">
        <button 
          className="stats-action-btn"
          onClick={onSearchRelated}
          title="Find similar papers"
        >
          <span className="btn-icon">🔍</span>
          <span className="btn-text">Find Similar</span>
        </button>
      </div>
    </div>
  );
} 