# RichTextEditor Component

A feature-rich, academic-focused rich text editor built with TipTap and React. This component provides a comprehensive writing experience optimized for academic and professional content creation.

## Features

### Core Functionality
- **Rich Text Editing**: Full-featured WYSIWYG editor with markdown support
- **Academic Focus**: Optimized styling for academic papers and professional documents
- **Fullscreen Mode**: Distraction-free writing experience
- **Real-time Stats**: Live word and character counting
- **Keyboard Shortcuts**: Comprehensive keyboard support for power users

### Formatting Options
- **Text Formatting**: Bold, italic, strikethrough, inline code
- **Headings**: H1-H6 with academic styling
- **Lists**: Bullet and numbered lists with custom styling
- **Code Blocks**: Syntax-highlighted code blocks
- **Blockquotes**: Academic-style quotes with visual enhancements
- **Horizontal Rules**: Section dividers

### Advanced Features
- **Markdown Conversion**: Bidirectional markdown/HTML conversion
- **Auto-save**: Real-time content updates
- **Responsive Design**: Mobile-friendly interface
- **Accessibility**: Full keyboard navigation and screen reader support
- **Print Optimization**: Clean print layouts

## Component Structure

```
RichTextEditor/
├── index.tsx                 # Main component
├── index.css                 # Main container styles
├── types.ts                  # TypeScript interfaces
├── README.md                 # This documentation
├── LoadingState.tsx          # Loading component
├── LoadingState.css          # Loading styles
├── EditorToolbar.tsx         # Main toolbar component
├── EditorToolbar.css         # Toolbar styles
├── EditorContent.tsx         # Editor content wrapper
├── EditorContent.css         # Content and typography styles
├── EditorStatusBar.tsx       # Status bar component
├── EditorStatusBar.css       # Status bar styles
├── ToolbarButton.tsx         # Individual button component
├── ToolbarButton.css         # Button styles
├── ToolbarGroup.tsx          # Button group component
├── ToolbarGroup.css          # Group styles
├── EditorStats.tsx           # Stats display component
├── EditorStats.css           # Stats styles
└── utils/
    ├── markdownConverter.ts  # Markdown conversion utilities
    └── wordCounter.ts        # Text counting utilities
```

## Usage

### Basic Usage

```tsx
import { RichTextEditor } from './components/RichTextEditor';

function MyComponent() {
  const [content, setContent] = useState('');

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      placeholder="Start writing..."
      height="400px"
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Current markdown content |
| `onChange` | `(value: string) => void` | - | Content change handler |
| `placeholder` | `string` | "Start writing your academic paper..." | Placeholder text |
| `height` | `string` | "100%" | Editor height |

## Keyboard Shortcuts

### Text Formatting
- `Ctrl/Cmd + B` - Bold
- `Ctrl/Cmd + I` - Italic
- `Ctrl/Cmd + K` - Inline code

### Editor Actions
- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Y` - Redo
- `Escape` - Exit fullscreen (when in fullscreen)

### Heading Shortcuts
- `Ctrl/Cmd + Alt + 1` - H1
- `Ctrl/Cmd + Alt + 2` - H2
- `Ctrl/Cmd + Alt + 3` - H3

## Styling

### CSS Variables
The component uses CSS custom properties for theming:

```css
--background-color-primary    /* Main background */
--background-color-secondary  /* Secondary elements */
--background-color-tertiary   /* Toolbar background */
--text-color                  /* Primary text */
--text-color-secondary        /* Secondary text */
--accent-color               /* Brand accent */
--border-color               /* Borders */
--border-radius-small        /* Small radius */
--font-family-base           /* Main font */
--font-family-mono           /* Monospace font */
```

### Customization
Each component has its own CSS file allowing for granular customization:

```css
/* Customize toolbar buttons */
.toolbar-button {
  /* Your custom styles */
}

/* Customize editor content */
.rich-text-editor-content {
  /* Your custom styles */
}
```

## Academic Features

### Typography
- Professional heading hierarchy
- Optimized line spacing for readability
- Academic citation styling
- Print-optimized layouts

### Enhanced Elements
- **Code blocks**: Syntax highlighting with language indicators
- **Blockquotes**: Visual quote marks and academic styling
- **Lists**: Custom bullet points and numbering
- **Horizontal rules**: Decorative section dividers

### Writing Tools
- Real-time word and character counting
- Status bar showing current formatting
- Distraction-free fullscreen mode
- Keyboard-first workflow

## Technical Details

### Dependencies
- `@tiptap/react` - Core editor framework
- `@tiptap/starter-kit` - Basic editing features
- `@tiptap/extension-typography` - Typography enhancements
- `@tiptap/extension-placeholder` - Placeholder support
- `turndown` - HTML to Markdown conversion

### Performance
- Lazy loading of editor instance
- Optimized re-renders with useMemo
- Efficient markdown conversion
- Minimal DOM manipulation

### Accessibility
- Full keyboard navigation
- Screen reader support
- High contrast mode support
- Focus management
- ARIA labels and roles

## Browser Support

- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Mobile browsers (iOS 14+, Android 10+)
- Progressive enhancement for older browsers

## Contributing

When adding new features:

1. **Component Structure**: Follow the established pattern with separate files for components and styles
2. **Type Safety**: Add appropriate TypeScript interfaces to `types.ts`
3. **Styling**: Use CSS custom properties for consistency
4. **Testing**: Ensure keyboard accessibility and screen reader compatibility
5. **Documentation**: Update this README with new features

## Examples

### Custom Placeholder
```tsx
<RichTextEditor
  value={content}
  onChange={setContent}
  placeholder="Write your research paper..."
/>
```

### Fixed Height
```tsx
<RichTextEditor
  value={content}
  onChange={setContent}
  height="600px"
/>
```

### Integration with Form
```tsx
function PaperForm() {
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [content, setContent] = useState('');

  return (
    <form>
      <input 
        value={title} 
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Paper title..."
      />
      
      <RichTextEditor
        value={abstract}
        onChange={setAbstract}
        placeholder="Write your abstract..."
        height="200px"
      />
      
      <RichTextEditor
        value={content}
        onChange={setContent}
        placeholder="Write your paper content..."
        height="600px"
      />
    </form>
  );
}
``` 