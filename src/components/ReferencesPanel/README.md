# ReferencesPanel Component

A modular, well-structured React component for searching and managing academic paper references with semantic similarity
search and collapsible card interface.

## Architecture

The ReferencesPanel has been refactored into a collection of primitive components for better maintainability,
reusability, and UI/UX:

### Component Structure

```
src/components/ReferencesPanel/
├── index.tsx              # Main orchestrator component
├── types.ts               # Shared TypeScript interfaces
├── ReferencesPanel.css    # Component styles
├── PanelHeader.tsx        # Header with title and paper count
├── SearchSection.tsx      # Search input, suggestions, and filters
├── LoadingState.tsx       # Loading spinner and progress
├── EmptyState.tsx         # Empty state with suggestions
├── PaperCard.tsx          # Individual paper display card with collapse/expand
├── ScoreBadge.tsx         # Relevance score indicator
├── PaperActions.tsx       # Action buttons (Cite, BibTeX, etc.)
├── PaperStats.tsx         # Paper statistics and related actions
├── PanelFooter.tsx        # Bulk actions and summary stats
└── README.md              # This documentation
```

## Component Responsibilities

### Main Components

- **`index.tsx`**: Main component that orchestrates all sub-components, manages state, and handles API calls
- **`PaperCard.tsx`**: Displays individual paper information with collapsible interface, expandable abstracts and
  metadata
- **`SearchSection.tsx`**: Handles search input, quick suggestions, sorting, and error states

### Primitive Components

- **`PanelHeader.tsx`**: Shows panel title, subtitle, and paper count
- **`LoadingState.tsx`**: Animated loading state during API calls
- **`EmptyState.tsx`**: Helpful empty state with search suggestions
- **`ScoreBadge.tsx`**: Color-coded relevance score display
- **`PaperActions.tsx`**: Action buttons for citing, copying BibTeX, viewing, etc.
- **`PaperStats.tsx`**: Statistics display and related paper search
- **`PanelFooter.tsx`**: Summary statistics and bulk citation actions

## Features

### Enhanced Card Interface

- **Collapsible Cards**: Cards start collapsed showing only title and first author
- **Expand on Demand**: Click to expand and see full paper details
- **Improved Scanning**: Users can quickly scan many papers and expand only interesting ones
- **Overflow Protection**: Proper text truncation and responsive design
- **Smooth Animations**: Cards expand/collapse with smooth transitions

### Search & Discovery

- Real-time arXiv paper search with semantic similarity
- Quick search suggestions for common topics
- Advanced sorting by relevance, date, or title
- Error handling with user-friendly messages
- Fallback mock data when API is unavailable

### Paper Display

- **Collapsed View**: Title + first author + score badge + expand button
- **Expanded View**: Full paper details with all metadata, abstract, actions
- Score-based color coding (excellent, very good, good, fair, low)
- Expandable abstracts with reading time estimates
- Rich metadata display (authors, dates, categories)
- Clickable titles linking to arXiv
- Safe data handling with fallbacks for missing fields

### Citation Management

- One-click citation insertion
- Automatic BibTeX generation and copying
- Bulk citation of best matches (score ≥ 80%)
- Smart reference formatting

### User Experience

- Responsive design for mobile and desktop
- Loading states and progress indicators
- Empty states with helpful suggestions
- Robust error handling and data validation
- Improved paper browsing efficiency

## Usage

```tsx
import { ReferencesPanel } from './components/ReferencesPanel';
import type { ArxivPaper } from './components/ReferencesPanel/types';

function App() {
  const handleCiteReference = (paper: ArxivPaper) => {
    // Handle citation insertion into document
    console.log('Citing paper:', paper.title);
  };

  return (
    <ReferencesPanel 
      onCiteReference={handleCiteReference}
      limit={10} // Optional: number of papers to fetch
    />
  );
}
```

## Card Interface

### Collapsed State

- Shows paper rank, score badge, and expand button
- Displays paper title (truncated to 2 lines on desktop, 3 on mobile)
- Shows first author name + count of additional authors
- Compact view for efficient browsing
- Click anywhere to expand

### Expanded State

- Full paper metadata and details
- All authors with proper formatting
- Expandable abstract with reading time
- DOI links when available
- Action buttons (Cite, BibTeX, View, PDF)
- Paper statistics and related search
- Collapse button to return to compact view

## API Integration

The component integrates with the arXiv search API at `https://llm.arz.ai/rag/source/arxiv`:

### Request Format

```typescript
const formData = new URLSearchParams();
formData.append('query', searchQuery);
formData.append('limit', limit.toString());
formData.append('lite_search', 'true');

fetch('https://llm.arz.ai/rag/source/arxiv', {
  method: 'POST',
  headers: {
    'accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: formData,
});
```

### Response Format

The API returns an array of papers with the following structure:

```typescript
interface ArxivPaper {
  id: string;           // arXiv ID (e.g., "2023.12345")
  title: string;        // Paper title
  authors: string;      // Comma-separated author names
  abstract: string;     // Paper abstract
  date: string;         // Publication date
  doi?: string | null;  // DOI if available
  score?: number;       // Relevance score (0-1)
}
```

### Fallback Mechanism

When the API is unavailable, the component automatically falls back to high-quality mock data including famous papers
like:

- "Attention Is All You Need" (Transformers)
- "BERT: Pre-training of Deep Bidirectional Transformers"
- "Language Models are Few-Shot Learners" (GPT-3)

## Error Handling & Data Validation

The component includes robust error handling:

- **API Failures**: Graceful fallback to mock data
- **Missing Data**: Safe defaults for all fields
- **Invalid Dates**: Proper date validation and formatting
- **Network Issues**: User-friendly error messages
- **Empty Responses**: Helpful empty states with suggestions
- **Overflow Protection**: Text truncation and responsive layouts

## Styling

The component uses CSS custom properties for theming and includes:

- Score-based color coding
- Smooth expand/collapse animations
- Responsive breakpoints with mobile optimizations
- Overflow protection with proper text truncation
- Dark theme support
- Custom scrollbars
- Hover and focus states
- Accessibility-friendly interactions

## Responsive Design

### Desktop

- Collapsed cards show 2-line titles
- Comfortable spacing and larger interactive elements
- Side-by-side metadata layout

### Mobile (768px and below)

- Collapsed cards show 3-line titles for better readability
- Adjusted padding and spacing
- Optimized touch targets
- Stacked layouts for better mobile UX

### Small Mobile (480px and below)

- Further optimized spacing
- Full-width action buttons
- Simplified layouts

## Extensibility

The modular structure makes it easy to:

- Add new card states (e.g., bookmarked, reading)
- Customize collapse/expand behavior
- Add new paper metadata fields
- Customize citation formats
- Integrate with different APIs
- Add new action buttons
- Modify search behavior
- Enhance UI components

## Performance

- Efficient re-rendering with React keys and state management
- Optimized API calls with error recovery
- Lazy loading of expanded content
- CSS animations using GPU acceleration
- Optimized re-flows with proper CSS containment
- Memory-efficient state management 