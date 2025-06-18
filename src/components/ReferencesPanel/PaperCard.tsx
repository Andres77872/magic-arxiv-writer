import type { ArxivPaper } from './types';
import { ScoreBadge } from './ScoreBadge';
import { PaperActions } from './PaperActions';
import { PaperStats } from './PaperStats';

interface PaperCardProps {
  paper: ArxivPaper;
  rank: number;
  isExpanded: boolean;
  onToggleAbstract: () => void;
  onCite: () => void;
  onSearchRelated: () => void;
}

export function PaperCard({
  paper,
  rank,
  isExpanded,
  onToggleAbstract,
  onCite,
  onSearchRelated
}: PaperCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'score-excellent';
    if (score >= 0.8) return 'score-very-good';
    if (score >= 0.7) return 'score-good';
    if (score >= 0.6) return 'score-fair';
    return 'score-low';
  };

  const formatAuthors = (authors: string) => {
    const authorList = authors.split(',').map(a => a.trim());
    if (authorList.length <= 3) {
      return authorList.join(', ');
    }
    return `${authorList.slice(0, 3).join(', ')} et al.`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  const extractCategory = (id: string) => {
    const match = id.match(/^(\d{4})\.(\d{5})$/);
    if (match) {
      const categoryCode = match[2].substring(0, 2);
      const categoryMap: Record<string, string> = {
        '01': 'cs.AI',
        '02': 'cs.CL',
        '03': 'cs.CV',
        '04': 'cs.LG',
        '05': 'stat.ML',
        '06': 'math.ST',
        '07': 'cs.NE',
        '08': 'cs.IR',
        '09': 'cs.HC',
        '10': 'cs.RO'
      };
      return categoryMap[categoryCode] || 'cs.AI';
    }
    return 'cs.AI';
  };

  return (
    <div className={`reference-card ${getScoreColor(paper.score || 0)}`}>
      <div className="card-header">
        <div className="paper-rank">#{rank}</div>
        <div className="paper-metadata">
          <ScoreBadge score={paper.score || 0} />
          <span className="arxiv-id">arXiv:{paper.id}</span>
          <span className="paper-date" title={formatDate(paper.date)}>
            {getRelativeTime(paper.date)}
          </span>
          <span className="paper-category">
            {extractCategory(paper.id)}
          </span>
        </div>
      </div>

      <h4 
        className="paper-title" 
        onClick={() => window.open(`https://arxiv.org/abs/${paper.id}`, '_blank')}
      >
        {paper.title}
      </h4>

      <div className="paper-authors">
        <span className="authors-icon">👥</span>
        <span className="authors-text">{formatAuthors(paper.authors)}</span>
        <span className="authors-count">
          ({paper.authors.split(',').length} author{paper.authors.split(',').length !== 1 ? 's' : ''})
        </span>
      </div>

      <div className="paper-abstract">
        <div className="abstract-content">
          {isExpanded ? (
            paper.abstract
          ) : (
            paper.abstract.length > 200 
              ? `${paper.abstract.substring(0, 200)}...`
              : paper.abstract
          )}
        </div>
        {paper.abstract.length > 200 && (
          <button 
            className="read-more-btn"
            onClick={onToggleAbstract}
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {paper.doi && (
        <div className="paper-doi">
          <span className="doi-label">DOI:</span>
          <a 
            href={`https://doi.org/${paper.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="doi-link"
          >
            {paper.doi}
          </a>
        </div>
      )}

      <PaperActions 
        paper={paper}
        onCite={onCite}
      />

      <PaperStats 
        paper={paper}
        onSearchRelated={onSearchRelated}
      />
    </div>
  );
} 