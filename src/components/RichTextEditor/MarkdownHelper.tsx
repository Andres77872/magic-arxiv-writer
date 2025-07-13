export function MarkdownHelper() {
    const shortcuts = [
        { key: '# ', description: 'Heading 1' },
        { key: '## ', description: 'Heading 2' },
        { key: '### ', description: 'Heading 3' },
        { key: '**text**', description: 'Bold' },
        { key: '*text*', description: 'Italic' },
        { key: '`code`', description: 'Inline code' },
        { key: '```', description: 'Code block' },
        { key: '- ', description: 'Bullet list' },
        { key: '1. ', description: 'Numbered list' },
        { key: '> ', description: 'Quote' },
        { key: '---', description: 'Divider' },
        { key: '[text](url)', description: 'Link' },
    ];

    return (
        <div className="markdown-helper">
            <h3>Markdown Shortcuts</h3>
            <div className="markdown-shortcuts">
                {shortcuts.map((shortcut, index) => (
                    <div key={index} className="markdown-shortcut">
                        <code>{shortcut.key}</code>
                        <span>{shortcut.description}</span>
                    </div>
                ))}
            </div>
            <div className="markdown-tip">
                <strong>Tip:</strong> Type <code>/</code> to see all available block commands
            </div>
        </div>
    );
} 