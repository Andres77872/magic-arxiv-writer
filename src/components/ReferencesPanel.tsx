import { useState, useEffect } from 'react';
import './ReferencesPanel.css';

interface ArxivReference {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  published: string;
  arxiv_id: string;
  categories: string[];
  url: string;
  relevance_score?: number;
}

interface ReferencesPanelProps {
  references: ArxivReference[];
  onCiteReference: (reference: ArxivReference) => void;
  onSearchReferences: (query: string) => void;
  isSearching?: boolean;
}

export function ReferencesPanel({ 
  references, 
  onCiteReference, 
  onSearchReferences, 
  isSearching = false 
}: ReferencesPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'title'>('relevance');

  // Get all unique categories from references
  const allCategories = Array.from(
    new Set(references.flatMap(ref => ref.categories))
  ).sort();

  // Filter and sort references
  const filteredReferences = references
    .filter(ref => {
      if (selectedCategories.length > 0) {
        return selectedCategories.some(cat => ref.categories.includes(cat));
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return (b.relevance_score || 0) - (a.relevance_score || 0);
        case 'date':
          return new Date(b.published).getTime() - new Date(a.published).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchReferences(searchQuery.trim());
    }
  };

  const formatAuthors = (authors: string[]) => {
    if (authors.length <= 3) {
      return authors.join(', ');
    }
    return `${authors.slice(0, 3).join(', ')} et al.`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const copyBibTeX = (reference: ArxivReference) => {
    const year = new Date(reference.published).getFullYear();
    const firstAuthor = reference.authors[0]?.split(' ').pop() || 'Unknown';
    const bibKey = `${firstAuthor.toLowerCase()}${year}${reference.arxiv_id.replace('.', '')}`;
    
    const bibTeX = `@article{${bibKey},
  title={${reference.title}},
  author={${reference.authors.join(' and ')}},
  journal={arXiv preprint arXiv:${reference.arxiv_id}},
  year={${year}},
  url={${reference.url}}
}`;

    navigator.clipboard.writeText(bibTeX);
  };

  return (
    <div className="references-panel">
      <div className="references-header">
        <h3>📚 Research References</h3>
        <div className="references-count">
          {references.length} {references.length === 1 ? 'paper' : 'papers'} found
        </div>
      </div>

      {/* Search Section */}
      <div className="references-search">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search arXiv papers (e.g., 'transformer attention mechanisms')"
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
                <span>🔍</span>
              )}
            </button>
          </div>
        </form>

        {/* Filters */}
        <div className="references-filters">
          <div className="filter-group">
            <label htmlFor="sort-by">Sort by:</label>
            <select 
              id="sort-by"
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="filter-select"
            >
              <option value="relevance">Relevance</option>
              <option value="date">Date</option>
              <option value="title">Title</option>
            </select>
          </div>

          {allCategories.length > 0 && (
            <div className="filter-group">
              <label>Categories:</label>
              <div className="category-filters">
                {allCategories.slice(0, 6).map(category => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategories(prev => 
                        prev.includes(category) 
                          ? prev.filter(c => c !== category)
                          : [...prev, category]
                      );
                    }}
                    className={`category-filter ${selectedCategories.includes(category) ? 'active' : ''}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* References List */}
      <div className="references-list">
        {filteredReferences.length === 0 ? (
          <div className="empty-references">
            <div className="empty-icon">📄</div>
            <p>No references found.</p>
            <p className="empty-hint">
              Try searching for relevant papers using the search box above.
            </p>
          </div>
        ) : (
          filteredReferences.map((reference) => (
            <div key={reference.id} className="reference-card">
              <div className="reference-header">
                <h4 className="reference-title">{reference.title}</h4>
                <div className="reference-metadata">
                  <span className="arxiv-id">arXiv:{reference.arxiv_id}</span>
                  {reference.relevance_score && (
                    <span className="relevance-score">
                      {Math.round(reference.relevance_score * 100)}% match
                    </span>
                  )}
                </div>
              </div>

              <div className="reference-authors">
                {formatAuthors(reference.authors)} • {formatDate(reference.published)}
              </div>

              <div className="reference-categories">
                {reference.categories.slice(0, 3).map(category => (
                  <span key={category} className="category-tag">
                    {category}
                  </span>
                ))}
              </div>

              <div className="reference-abstract">
                {reference.abstract.length > 200 
                  ? `${reference.abstract.substring(0, 200)}...`
                  : reference.abstract
                }
              </div>

              <div className="reference-actions">
                <button 
                  onClick={() => onCiteReference(reference)}
                  className="action-btn primary"
                  title="Insert citation"
                >
                  📝 Cite
                </button>
                <button 
                  onClick={() => copyBibTeX(reference)}
                  className="action-btn secondary"
                  title="Copy BibTeX"
                >
                  📋 BibTeX
                </button>
                <a 
                  href={reference.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-btn secondary"
                  title="Open paper"
                >
                  🔗 Open
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 