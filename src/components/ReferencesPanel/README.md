# ReferencesPanel Component

A modular, well-structured React component for searching and managing academic paper references with ColPali embeddings integration.

## Architecture

The ReferencesPanel has been refactored into a collection of primitive components for better maintainability, reusability, and UI/UX:

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
├── PaperCard.tsx          # Individual paper display card
├── ScoreBadge.tsx         # Relevance score indicator
├── PaperActions.tsx       # Action buttons (Cite, BibTeX, etc.)
├── PaperStats.tsx         # Paper statistics and related actions
├── PanelFooter.tsx        # Bulk actions and summary stats
└── README.md              # This documentation
```

## Component Responsibilities

### Main Components

- **`index.tsx`**: Main component that orchestrates all sub-components, manages state, and handles API calls
- **`PaperCard.tsx`**: Displays individual paper information with expandable abstracts and metadata
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

### Search & Discovery
- Real-time arXiv paper search with ColPali embeddings
- Quick search suggestions for common topics
- Advanced sorting by relevance, date, or title
- Error handling with user-friendly messages

### Paper Display
- Score-based color coding (excellent, very good, good, fair, low)
- Expandable abstracts with reading time estimates
- Rich metadata display (authors, dates, categories)
- Clickable titles linking to arXiv

### Citation Management
- One-click citation insertion
- Automatic BibTeX generation and copying
- Bulk citation of best matches (score ≥ 80%)
- Smart reference formatting

### User Experience
- Responsive design for mobile and desktop
- Loading states and progress indicators
- Empty states with helpful suggestions
- Keyboard shortcuts and accessibility

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

## Styling

The component uses CSS custom properties for theming and includes:
- Score-based color coding
- Smooth animations and transitions
- Responsive breakpoints
- Dark theme support
- Custom scrollbars
- Hover and focus states

## Extensibility

The modular structure makes it easy to:
- Add new paper metadata fields
- Customize citation formats
- Integrate with different APIs
- Add new action buttons
- Modify search behavior
- Enhance UI components

## Performance

- Efficient re-rendering with React keys
- Debounced search to avoid excessive API calls
- Lazy loading of expanded abstracts
- Optimized CSS with component-scoped styles
- Memory-efficient state management 