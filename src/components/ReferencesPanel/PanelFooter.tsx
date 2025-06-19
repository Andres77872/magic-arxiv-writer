import type {ArxivPaper} from './types';

interface PanelFooterProps {
    papers: ArxivPaper[];
    onCiteReference: (reference: ArxivPaper) => void;
}

export function PanelFooter({papers, onCiteReference}: PanelFooterProps) {
    const getScoreStats = () => {
        const scores = papers.map(p => p.score || 0);
        const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const excellentCount = scores.filter(s => s >= 0.9).length;
        const goodCount = scores.filter(s => s >= 0.7 && s < 0.9).length;

        return {avgScore, excellentCount, goodCount};
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
    const bestMatchesCount = papers.filter(p => (p.score || 0) >= 0.8).slice(0, 3).length;

    return (
        <div className="panel-footer">
            <div className="footer-stats">
                <div className="footer-stat">
                    <span className="footer-stat-label">Avg Score</span>
                    <span className="footer-stat-value">{stats.avgScore.toFixed(2)}</span>
                </div>

                <div className="footer-stat">
                    <span className="footer-stat-label">Excellent</span>
                    <span className="footer-stat-value">{stats.excellentCount}</span>
                </div>

                <div className="footer-stat">
                    <span className="footer-stat-label">Good+</span>
                    <span className="footer-stat-value">{stats.goodCount}</span>
                </div>

                <div className="footer-stat">
                    <span className="footer-stat-label">Total</span>
                    <span className="footer-stat-value">{papers.length}</span>
                </div>
            </div>

            <div className="footer-actions">
                {hasBestMatches && (
                    <button
                        className="footer-btn"
                        onClick={citeBestMatches}
                        title={`Cite top ${bestMatchesCount} papers with score ≥ 80%`}
                    >
                        ⭐ Cite Best ({bestMatchesCount})
                    </button>
                )}

                <button
                    className="footer-btn secondary"
                    onClick={() => window.open('https://arxiv.org', '_blank')}
                    title="Browse arXiv"
                >
                    🔗 arXiv
                </button>
            </div>
        </div>
    );
} 