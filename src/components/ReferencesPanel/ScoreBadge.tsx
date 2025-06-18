import './ScoreBadge.css';

interface ScoreBadgeProps {
  score: number;
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'score-excellent';
    if (score >= 0.8) return 'score-very-good';
    if (score >= 0.7) return 'score-good';
    if (score >= 0.6) return 'score-fair';
    return 'score-low';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.9) return 'Excellent Match';
    if (score >= 0.8) return 'Very Good Match';
    if (score >= 0.7) return 'Good Match';
    if (score >= 0.6) return 'Fair Match';
    return 'Weak Match';
  };

  return (
    <div className="score-indicator">
      <div className={`score-badge ${getScoreColor(score)}`}>
        <span className="score-value">{(score * 100).toFixed(0)}%</span>
        <span className="score-label">{getScoreLabel(score)}</span>
      </div>
    </div>
  );
} 