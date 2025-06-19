interface ScoreBadgeProps {
    score: number;
}

export function ScoreBadge({score}: ScoreBadgeProps) {
    const getScoreColor = (score: number) => {
        if (score >= 0.9) return 'score-excellent';
        if (score >= 0.8) return 'score-very-good';
        if (score >= 0.7) return 'score-good';
        if (score >= 0.6) return 'score-fair';
        return 'score-low';
    };

    return (
        <div className={`score-badge ${getScoreColor(score)}`} title={`Relevance score: ${(score * 100).toFixed(0)}%`}>
            {(score * 100).toFixed(0)}%
        </div>
    );
} 