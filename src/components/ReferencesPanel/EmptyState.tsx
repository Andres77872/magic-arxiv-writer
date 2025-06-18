import './EmptyState.css';

interface EmptyStateProps {
  lastSearchQuery: string;
  onSearch: (query: string) => void;
}

export function EmptyState({ lastSearchQuery, onSearch }: EmptyStateProps) {
  return (
    <div className="empty-references">
      <div className="empty-icon">📄</div>
      <h4>No papers found</h4>
      <p className="empty-description">
        {lastSearchQuery 
          ? `No results for "${lastSearchQuery}". Try different keywords or broader terms.`
          : 'Start by searching for research papers relevant to your work.'
        }
      </p>
      <div className="empty-suggestions">
        <p>Try searching for:</p>
        <div className="suggestion-list">
          <button 
            className="suggestion-item"
            onClick={() => onSearch('machine learning')}
          >
            "machine learning"
          </button>
          <button 
            className="suggestion-item"
            onClick={() => onSearch('deep learning')}
          >
            "deep learning"
          </button>
          <button 
            className="suggestion-item"
            onClick={() => onSearch('artificial intelligence')}
          >
            "artificial intelligence"
          </button>
        </div>
      </div>
    </div>
  );
} 