# ChatPanel Component

A modular chat interface component for interacting with an AI assistant. This component follows the same architectural
pattern as the ReferencesPanel.

## Structure

```
ChatPanel/
├── index.tsx           # Main ChatPanel component
├── index.css           # Main styles
├── types.ts            # TypeScript definitions
├── ChatInput.tsx       # Message input with auto-resize
├── ChatInput.css       # Input component styles
├── ChatTimer.tsx       # Performance metrics display
├── ChatTimer.css       # Timer component styles
├── ChatMessage.tsx     # Individual message component
├── ChatMessage.css     # Message component styles
├── EmptyState.tsx      # Empty state with suggested prompts
├── EmptyState.css      # Empty state styles
├── PanelHeader.tsx     # Header with connection status
├── PanelHeader.css     # Header component styles
└── README.md           # This documentation
```

## Components

### ChatPanel (Main Component)

- Manages chat state and message history
- Handles API communication for streaming responses
- Orchestrates all sub-components
- Tracks performance metrics and node executions

### ChatInput

- Auto-resizing textarea for message input
- Enter to send, Shift+Enter for newline
- Loading states and disabled states
- Focus management

### ChatTimer

- Real-time performance metrics display
- Shows send, process, generation, and total times
- Updates during streaming responses
- Formatted timing displays

### ChatMessage

- Renders individual user/assistant messages
- Handles typing indicators
- Shows performance metrics for user messages
- Displays node execution details for assistant responses

### EmptyState

- Shows welcome message and suggested prompts
- Interactive prompt buttons
- Guides new users

### PanelHeader

- Displays connection status with visual indicators
- Panel title and branding
- Responsive design

## Usage

```tsx
import { ChatPanel } from './components/ChatPanel';

function App() {
  const [markdown, setMarkdown] = useState('');

  return (
    <ChatPanel
      markdown={markdown}
      onUpdateMarkdown={setMarkdown}
    />
  );
}
```

## Props

### ChatPanelProps

- `markdown: string` - Current document content
- `onUpdateMarkdown: (content: string) => void` - Callback for content updates

## Features

- **Streaming Responses**: Real-time streaming of AI responses
- **Performance Metrics**: Detailed timing information for each request
- **Node Execution Tracking**: Shows internal processing steps
- **Connection Status**: Visual indicators for connection state
- **Suggested Prompts**: Predefined prompts for common tasks
- **Auto-scroll**: Automatically scrolls to newest messages
- **Responsive Design**: Works on desktop and mobile devices
- **Keyboard Shortcuts**: Enter to send, Shift+Enter for newline

## API Integration

The component integrates with the Magic ArXiv Writer API:

- Endpoint: `https://magic.arz.ai/chat/openai/v1/completion`
- Supports streaming responses
- Includes conversation memory
- Tracks execution metadata

## Styling

All components use CSS custom properties (CSS variables) for theming:

- Consistent with the overall application design
- Responsive breakpoints for mobile/tablet
- Dark/light theme support through CSS variables
- Smooth animations and transitions

## Performance

- Efficient message grouping (user/assistant turns)
- Real-time metrics tracking
- Optimized scrolling behavior
- Minimal re-renders through proper state management 