import React, { useState } from 'react';

interface MarkdownHelperProps {
  isVisible?: boolean;
}

const markdownShortcuts = [
  { syntax: '**text**', result: 'Bold', shortcut: 'Ctrl+B' },
  { syntax: '*text*', result: 'Italic', shortcut: 'Ctrl+I' },
  { syntax: '`code`', result: 'Inline Code', shortcut: 'Ctrl+K' },
  { syntax: '# Title', result: 'Heading 1', shortcut: 'Ctrl+Alt+1' },
  { syntax: '## Title', result: 'Heading 2', shortcut: 'Ctrl+Alt+2' },
  { syntax: '### Title', result: 'Heading 3', shortcut: 'Ctrl+Alt+3' },
  { syntax: '> quote', result: 'Blockquote', shortcut: '' },
  { syntax: '- item', result: 'Bullet List', shortcut: '' },
  { syntax: '1. item', result: 'Numbered List', shortcut: '' },
  { syntax: '```\ncode\n```', result: 'Code Block', shortcut: '' },
  { syntax: '---', result: 'Horizontal Rule', shortcut: '' },
  { syntax: '[text](url)', result: 'Link', shortcut: '' },
];

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