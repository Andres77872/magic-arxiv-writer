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

// Mock data for fallback
const mockPapers: ArxivPaper[] = [
  {
    id: '1706.03762',
    title: 'Attention Is All You Need',
    authors: 'Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin',
    abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
    date: '2017-06-12T17:57:59Z',
    doi: null,
    score: 0.95
  },
  {
    id: '1810.04805',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    authors: 'Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova',
    abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers.',
    date: '2018-10-11T18:33:37Z',
    doi: null,
    score: 0.92
  },
  {
    id: '2005.14165',
    title: 'Language Models are Few-Shot Learners',
    authors: 'Tom B. Brown, Benjamin Mann, Nick Ryder, Melanie Subbiah, Jared Kaplan, Prafulla Dhariwal, Arvind Neelakantan, Pranav Shyam, Girish Sastry, Amanda Askell, Sandhini Agarwal, Ariel Herbert-Voss, Gretchen Krueger, Tom Henighan, Rewon Child, Aditya Ramesh, Daniel M. Ziegler, Jeffrey Wu, Clemens Winter, Christopher Hesse, Mark Chen, Eric Sigler, Mateusz Litwin, Scott Gray, Benjamin Chess, Jack Clark, Christopher Berner, Sam McCandlish, Alec Radford, Ilya Sutskever, Dario Amodei',
    abstract: 'Recent work has demonstrated substantial gains on many NLP tasks and benchmarks by pre-training on a large corpus of text followed by fine-tuning on a specific task. While typically task-agnostic in architecture, this method still requires task-specific fine-tuning datasets of thousands or tens of thousands of examples.',
    date: '2020-05-28T17:29:35Z',
    doi: null,
    score: 0.89
  }
];

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
      console.log('API Response:', data); // Debug log
      
      // Transform and validate the data
      const transformedPapers: ArxivPaper[] = data.map((paper: any, index: number) => {
        const transformedPaper = {
          id: paper.id || `unknown-${index}`,
          title: paper.title || 'Untitled Paper',
          authors: paper.authors || 'Unknown Authors',
          abstract: paper.abstract || 'No abstract available',
          date: paper.date || new Date().toISOString(),
          doi: paper.doi || null,
          score: paper.score || (1.0 - (index * 0.05)),
        };
        
        console.log('Transformed paper:', transformedPaper); // Debug log
        return transformedPaper;
      });

      setPapers(transformedPapers);
    } catch (err) {
      console.error('Search error:', err);
      console.log('Using fallback mock data...');
      
      // Use mock data as fallback
      const filteredMockData = mockPapers.filter(paper => 
        paper.title.toLowerCase().includes(query.toLowerCase()) ||
        paper.abstract.toLowerCase().includes(query.toLowerCase()) ||
        paper.authors.toLowerCase().includes(query.toLowerCase())
      );
      
      setPapers(filteredMockData.length > 0 ? filteredMockData : mockPapers);
      setError(`API unavailable. Showing sample results for "${query}"`);
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
    searchPapers('transformer attention mechanisms');
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