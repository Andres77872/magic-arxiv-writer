import { useState, useEffect } from 'react';
import { SearchSection } from './SearchSection';
import { PaperCard } from './PaperCard';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';
import { PanelHeader } from './PanelHeader';
import { PanelFooter } from './PanelFooter';
import { type ArxivPaper } from './types';
import './ReferencesPanel.css';

interface ReferencesPanelProps {
  onCiteReference: (reference: ArxivPaper) => void;
  limit?: number;
}

export function ReferencesPanel({ 
  onCiteReference,
  limit = 10
}: ReferencesPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [papers, setPapers] = useState<ArxivPaper[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState<'score' | 'date' | 'title'>('score');
  const [error, setError] = useState<string | null>(null);
  const [lastSearchQuery, setLastSearchQuery] = useState('');
  const [expandedAbstracts, setExpandedAbstracts] = useState<Set<string>>(new Set());

  // Search papers using the ArXiv API
  const searchPapers = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);
    setLastSearchQuery(query);
    setExpandedAbstracts(new Set());

    try {
      const formData = new URLSearchParams();
      formData.append('query', query);
      formData.append('limit', limit.toString());
      formData.append('lite_search', 'true');

      const response = await fetch('https://llm.arz.ai/rag/source/arxiv', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      const transformedPapers: ArxivPaper[] = data.map((paper: any, index: number) => ({
        id: paper.id,
        title: paper.title,
        authors: paper.authors,
        abstract: paper.abstract,
        date: paper.date,
        doi: paper.doi,
        score: paper.score || (1.0 - (index * 0.05)),
      }));

      setPapers(transformedPapers);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Failed to search papers');
      setPapers([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Sort papers based on selected criteria
  const sortedPapers = [...papers].sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return (b.score || 0) - (a.score || 0);
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  // Toggle abstract expansion
  const toggleAbstract = (paperId: string) => {
    const newExpanded = new Set(expandedAbstracts);
    if (newExpanded.has(paperId)) {
      newExpanded.delete(paperId);
    } else {
      newExpanded.add(paperId);
    }
    setExpandedAbstracts(newExpanded);
  };

  // Load sample papers on mount
  useEffect(() => {
    if (papers.length === 0) {
      searchPapers('transformer attention mechanisms');
    }
  }, []);

  return (
    <div className="references-panel">
      <PanelHeader 
        papersCount={papers.length}
        lastSearchQuery={lastSearchQuery}
      />

      <SearchSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={searchPapers}
        isSearching={isSearching}
        sortBy={sortBy}
        setSortBy={setSortBy}
        error={error}
        setError={setError}
        limit={limit}
        avgScore={sortedPapers.length > 0 ? sortedPapers.reduce((sum, p) => sum + (p.score || 0), 0) / sortedPapers.length : 0}
      />

      <div className="references-list">
        {isSearching ? (
          <LoadingState />
        ) : sortedPapers.length === 0 ? (
          <EmptyState 
            lastSearchQuery={lastSearchQuery}
            onSearch={searchPapers}
          />
        ) : (
          sortedPapers.map((paper, index) => (
            <PaperCard
              key={paper.id}
              paper={paper}
              rank={index + 1}
              isExpanded={expandedAbstracts.has(paper.id)}
              onToggleAbstract={() => toggleAbstract(paper.id)}
              onCite={() => onCiteReference(paper)}
              onSearchRelated={() => searchPapers(`related to ${paper.title.split(' ').slice(0, 5).join(' ')}`)}
            />
          ))
        )}
      </div>

      {sortedPapers.length > 0 && (
        <PanelFooter 
          papers={sortedPapers}
          onCiteReference={onCiteReference}
        />
      )}
    </div>
  );
} 