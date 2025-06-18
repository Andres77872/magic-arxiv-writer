import type { SortOption } from './types';

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (query: string) => void;
  isSearching: boolean;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  error: string | null;
  setError: (error: string | null) => void;
  limit: number;
  avgScore: number;
}

export function SearchSection({
  searchQuery,
  setSearchQuery,
  onSearch,
  isSearching,
  sortBy,
  setSortBy,
  error,
  setError,
  limit,
  avgScore
}: SearchSectionProps) {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const quickSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="references-search">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-wrapper">
          <div className="search-icon">🔍</div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search arXiv papers (e.g., 'attention mechanisms in transformers')"
            className="search-input"
            disabled={isSearching}
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={isSearching || !searchQuery.trim()}
          >
            {isSearching ? (
              <div className="search-spinner"></div>
            ) : (
              'Search'
            )}
          </button>
        </div>
        
        <div className="search-suggestions">
          <button 
            type="button" 
            onClick={() => quickSearch('large language models')}
            className="suggestion-chip"
          >
            LLM
          </button>
          <button 
            type="button" 
            onClick={() => quickSearch('computer vision')}
            className="suggestion-chip"
          >
            Computer Vision
          </button>
          <button 
            type="button" 
            onClick={() => quickSearch('neural networks')}
            className="suggestion-chip"
          >
            Neural Networks
          </button>
          <button 
            type="button" 
            onClick={() => quickSearch('reinforcement learning')}
            className="suggestion-chip"
          >
            Reinforcement Learning
          </button>
        </div>
      </form>

      <div className="references-filters">
        <div className="filter-group">
          <label htmlFor="sort-by">Sort by:</label>
          <select 
            id="sort-by"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="filter-select"
          >
            <option value="score">Relevance Score</option>
            <option value="date">Publication Date</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
        
        <div className="filter-info">
          <span className="filter-badge">
            Limit: {limit} papers
          </span>
          <span className="filter-badge">
            ColPali Enhanced
          </span>
          {avgScore > 0 && (
            <span className="filter-badge score-stats">
              Avg Score: {avgScore.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
          <button 
            onClick={() => setError(null)}
            className="error-dismiss"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
} 