# Notion-Style Rich Text Editor

A modern, Notion-inspired rich text editor for React that provides a beautiful writing experience with markdown support.

## Features

### ✨ Core Features
- **Block-based editing** - Each paragraph, heading, and element is a distinct block
- **Slash commands** - Type `/` to insert different block types
- **Floating toolbar** - Text formatting options appear on selection
- **Markdown shortcuts** - Full markdown syntax support
- **Clean, minimal UI** - Inspired by Notion's design philosophy
- **Fullscreen mode** - Distraction-free writing experience

### 🎯 Key Capabilities
- **Input/Output**: Always works with markdown
- **Rich visual editing**: WYSIWYG experience while editing
- **Keyboard shortcuts**: Efficient text formatting
- **Responsive design**: Works on all devices
- **Focus mode**: Highlights the current block

## Usage

```tsx
import { RichTextEditor } from './components/RichTextEditor';

function MyComponent() {
  const [content, setContent] = useState('# Hello World\n\nStart writing...');

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      placeholder="Type "/" for commands..."
      height="500px"
    />
  );
}
```

## Slash Commands

Type `/` anywhere in the editor to see available commands:

- `/h1` - Large heading
- `/h2` - Medium heading  
- `/h3` - Small heading
- `/p` - Paragraph
- `/list` - Bullet list
- `/numbered` - Numbered list
- `/quote` - Blockquote
- `/code` - Code block
- `/divider` - Horizontal line

## Keyboard Shortcuts

### Text Formatting
- `Ctrl/Cmd + B` - Bold
- `Ctrl/Cmd + I` - Italic
- `Ctrl/Cmd + K` - Inline code
- `Ctrl/Cmd + S` - Strikethrough

### Editor Controls
- `Ctrl/Cmd + Enter` - Toggle fullscreen
- `Escape` - Exit fullscreen or close menus
- `Enter` - Create new block
- `Backspace` (at start) - Merge with previous block

### Markdown Shortcuts
- `# ` - Heading 1
- `## ` - Heading 2
- `### ` - Heading 3
- `**text**` - Bold
- `*text*` - Italic
- `` `code` `` - Inline code
- ` ``` ` - Code block
- `- ` - Bullet list
- `1. ` - Numbered list
- `> ` - Quote
- `---` - Divider

## Component Architecture

```
RichTextEditor/
├── index.tsx              # Main editor component
├── FloatingToolbar.tsx    # Bubble menu for text selection
├── SlashCommand.tsx       # Slash command menu
├── BlockWrapper.tsx       # Block-level interactions
├── WritingModeIndicator.tsx # Status indicator
├── EditorStatusBar.tsx    # Word count & status
├── MarkdownHelper.tsx     # Markdown guide
└── utils/
    ├── markdownConverter.ts # MD <-> HTML conversion
    └── wordCounter.ts       # Text statistics
```

## Styling

The editor uses CSS variables from your design system for consistent theming:

```css
/* Key variables used */
--background-color-primary
--text-color
--accent-color
--border-color
--font-family-base
--space-* (spacing system)
--radius-* (border radius)
--shadow-* (shadows)
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | Markdown content |
| `onChange` | `(value: string) => void` | Required | Content change handler |
| `placeholder` | `string` | `'Type "/" for commands...'` | Placeholder text |
| `height` | `string \| number` | `'100%'` | Editor height |

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Dependencies

- `@tiptap/react` - Editor framework
- `@tiptap/starter-kit` - Basic extensions
- `@tiptap/extension-*` - Additional features
- `turndown` - HTML to Markdown conversion

## Future Enhancements

- [ ] Drag & drop blocks
- [ ] Collaborative editing
- [ ] Custom block types
- [ ] Image uploads
- [ ] Tables
- [ ] Nested blocks
- [ ] Block templates
- [ ] Export options (PDF, HTML) 