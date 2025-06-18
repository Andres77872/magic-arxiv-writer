interface PanelHeaderProps {
  papersCount: number;
  lastSearchQuery: string;
}

export function PanelHeader({ papersCount, lastSearchQuery }: PanelHeaderProps) {
  return (
    <div className="references-header">
      <div className="header-content">
        <h3>📚 Research References</h3>
        <div className="header-subtitle">
          Search and cite arXiv papers with semantic similarity search
        </div>
      </div>
      {papersCount > 0 && (
        <div className="references-count">
          <span className="count-number">{papersCount}</span>
          <span className="count-text">
            {papersCount === 1 ? 'paper' : 'papers'}
            {lastSearchQuery && <span className="search-context"> for "{lastSearchQuery}"</span>}
          </span>
        </div>
      )}
    </div>
  );
} 