interface EmptyStateProps {
    lastSearchQuery: string;
    onSearch: (query: string) => void;
}

export function EmptyState({lastSearchQuery, onSearch}: EmptyStateProps) {
    const suggestions = [
        'machine learning',
        'deep learning',
        'artificial intelligence',
        'computer vision',
        'natural language processing'
    ];

    return (
        <div className="references-empty">
            <div className="empty-icon">📄</div>
            <h3>No papers found</h3>
            <p>
                {lastSearchQuery
                    ? `No results for "${lastSearchQuery}". Try different keywords or broader terms.`
                    : 'Start by searching for research papers relevant to your work.'
                }
            </p>
            <div className="empty-suggestions">
                {suggestions.map((suggestion) => (
                    <button
                        key={suggestion}
                        className="empty-suggestion"
                        onClick={() => onSearch(suggestion)}
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    );
} 