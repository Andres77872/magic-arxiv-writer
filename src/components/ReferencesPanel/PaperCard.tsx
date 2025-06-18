import { useState } from 'react';
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
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  
  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'score-excellent';
    if (score >= 0.8) return 'score-very-good';
    if (score >= 0.7) return 'score-good';
    if (score >= 0.6) return 'score-fair';
    return 'score-low';
  };

  const formatAuthors = (authors: string) => {
    if (!authors || authors === 'Unknown Authors') return 'Unknown Authors';
    
    const authorList = authors.split(',').map(a => a.trim()).filter(a => a);
    if (authorList.length === 0) return 'Unknown Authors';
    if (authorList.length <= 3) {
      return authorList.join(', ');
    }
    return `${authorList.slice(0, 3).join(', ')} et al.`;
  };

  const getFirstAuthor = (authors: string) => {
    if (!authors || authors === 'Unknown Authors') return 'Unknown Author';
    
    const authorList = authors.split(',').map(a => a.trim()).filter(a => a);
    if (authorList.length === 0) return 'Unknown Author';
    return authorList[0];
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Unknown date';
    }
  };

  const getRelativeTime = (dateString: string) => {
    if (!dateString) return 'Unknown time';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Unknown time';
      
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
      return `${Math.ceil(diffDays / 365)} years ago`;
    } catch {
      return 'Unknown time';
    }
  };

  const extractCategory = (id: string) => {
    if (!id) return 'Unknown';
    
    // Try to extract category from arXiv ID pattern
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
    
    // Fallback for different ID patterns
    return 'cs.AI';
  };

  const getAuthorCount = (authors: string) => {
    if (!authors || authors === 'Unknown Authors') return 0;
    return authors.split(',').map(a => a.trim()).filter(a => a).length;
  };

  // Safe data access with fallbacks
  const safeTitle = paper.title || 'Untitled Paper';
  const safeAuthors = paper.authors || 'Unknown Authors';
  const safeAbstract = paper.abstract || 'No abstract available';
  const safeId = paper.id || 'unknown';
  const safeDate = paper.date || new Date().toISOString();
  const safeScore = paper.score || 0;

  const toggleCardExpansion = () => {
    setIsCardExpanded(!isCardExpanded);
  };

  return (
    <div className={`reference-card ${getScoreColor(safeScore)} ${isCardExpanded ? 'expanded' : 'collapsed'}`}>
      {/* Collapsed View */}
      {!isCardExpanded && (
        <div className="card-collapsed" onClick={toggleCardExpansion}>
          <div className="collapsed-header">
            <div className="paper-rank">#{rank}</div>
            <ScoreBadge score={safeScore} />
            <button className="expand-btn" title="Expand paper details">
              <span className="expand-icon">▼</span>
            </button>
          </div>
          
          <div className="collapsed-content">
            <h4 className="collapsed-title">{safeTitle}</h4>
            <div className="collapsed-author">
              <span className="author-icon">👤</span>
              <span className="author-name">{getFirstAuthor(safeAuthors)}</span>
              {getAuthorCount(safeAuthors) > 1 && (
                <span className="more-authors">+{getAuthorCount(safeAuthors) - 1} more</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Expanded View */}
      {isCardExpanded && (
        <div className="card-expanded">
          <div className="card-header">
            <div className="paper-rank">#{rank}</div>
            <div className="paper-metadata">
              <ScoreBadge score={safeScore} />
              <span className="arxiv-id">arXiv:{safeId}</span>
              <span className="paper-date" title={formatDate(safeDate)}>
                {getRelativeTime(safeDate)}
              </span>
              <span className="paper-category">
                {extractCategory(safeId)}
              </span>
            </div>
            <button className="collapse-btn" onClick={toggleCardExpansion} title="Collapse paper">
              <span className="collapse-icon">▲</span>
            </button>
          </div>

          <h4 
            className="paper-title" 
            onClick={() => safeId !== 'unknown' && window.open(`https://arxiv.org/abs/${safeId}`, '_blank')}
            style={{ cursor: safeId !== 'unknown' ? 'pointer' : 'default' }}
          >
            {safeTitle}
          </h4>

          <div className="paper-authors">
            <span className="authors-icon">👥</span>
            <span className="authors-text">{formatAuthors(safeAuthors)}</span>
            <span className="authors-count">
              ({getAuthorCount(safeAuthors)} author{getAuthorCount(safeAuthors) !== 1 ? 's' : ''})
            </span>
          </div>

          <div className="paper-abstract">
            <div className="abstract-content">
              {isExpanded ? (
                safeAbstract
              ) : (
                safeAbstract.length > 200 
                  ? `${safeAbstract.substring(0, 200)}...`
                  : safeAbstract
              )}
            </div>
            {safeAbstract.length > 200 && (
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
            paper={{
              ...paper,
              title: safeTitle,
              authors: safeAuthors,
              abstract: safeAbstract,
              id: safeId,
              date: safeDate
            }}
            onCite={onCite}
          />

          <PaperStats 
            paper={{
              ...paper,
              title: safeTitle,
              authors: safeAuthors,
              abstract: safeAbstract,
              id: safeId,
              date: safeDate,
              score: safeScore
            }}
            onSearchRelated={onSearchRelated}
          />
        </div>
      )}
    </div>
  );
} 