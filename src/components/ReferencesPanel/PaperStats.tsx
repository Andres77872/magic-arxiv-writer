import type { ArxivPaper } from './types';

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
      <div className="stat-group">
        <span className="stat-label">Relevance</span>
        <span className="stat-value-large">{((paper.score || 0) * 100).toFixed(1)}%</span>
      </div>
      
      <div className="stat-group">
        <span className="stat-label">Abstract</span>
        <span className="stat-value-large">{getWordCount(paper.abstract)} words</span>
      </div>
      
      <div className="stat-group">
        <span className="stat-label">Reading</span>
        <span className="stat-value-large">{getReadingTime(paper.abstract)} min</span>
      </div>
      
      <button 
        className="action-btn secondary"
        onClick={onSearchRelated}
        title="Find similar papers"
        style={{ marginLeft: 'auto' }}
      >
        🔍 Similar
      </button>
    </div>
  );
} 