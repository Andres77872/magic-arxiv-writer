import type { ArxivPaper } from './types';
import './PanelFooter.css';

interface PanelFooterProps {
  papers: ArxivPaper[];
  onCiteReference: (reference: ArxivPaper) => void;
}

export function PanelFooter({ papers, onCiteReference }: PanelFooterProps) {
  const getScoreStats = () => {
    const scores = papers.map(p => p.score || 0);
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    
    const excellentCount = scores.filter(s => s >= 0.9).length;
    const goodCount = scores.filter(s => s >= 0.7 && s < 0.9).length;
    
    return {
      avgScore,
      maxScore,
      minScore,
      excellentCount,
      goodCount
    };
  };

  const citeBestMatches = () => {
    const bestPapers = papers
      .filter(p => (p.score || 0) >= 0.8)
      .slice(0, 3);
    
    bestPapers.forEach(paper => {
      onCiteReference(paper);
    });
  };

  const stats = getScoreStats();
  const hasBestMatches = papers.some(p => (p.score || 0) >= 0.8);

  return (
    <div className="references-footer">
      <div className="footer-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.avgScore.toFixed(2)}</div>
            <div className="stat-label">Avg Score</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{stats.excellentCount}</div>
            <div className="stat-label">Excellent</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{stats.goodCount}</div>
            <div className="stat-label">Good+</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{papers.length}</div>
            <div className="stat-label">Total</div>
          </div>
        </div>
      </div>

      {hasBestMatches && (
        <div className="footer-actions">
          <button 
            className="bulk-action-btn"
            onClick={citeBestMatches}
            title="Cite top 3 papers with score ≥ 80%"
          >
            <span className="btn-icon">⭐</span>
            <span className="btn-text">Cite Best Matches</span>
            <span className="btn-badge">
              {papers.filter(p => (p.score || 0) >= 0.8).slice(0, 3).length}
            </span>
          </button>
        </div>
      )}
    </div>
  );
} 