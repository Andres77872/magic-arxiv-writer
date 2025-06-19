import TurndownService from 'turndown';
import {type MarkdownConversionService} from '../types';

// Initialize turndown service for HTML to Markdown conversion
const createTurndownService = (): TurndownService => {
    const service = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced',
        bulletListMarker: '-',
        emDelimiter: '*',
        strongDelimiter: '**'
    });

    // Custom rules for better academic writing
    service.addRule('academicHeadings', {
        filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        replacement: function (content, node) {
            const hLevel = parseInt(node.nodeName.charAt(1));
            const hPrefix = '#'.repeat(hLevel);
            return `\n\n${hPrefix} ${content}\n\n`;
        }
    });

    service.addRule('preserveLineBreaks', {
        filter: 'br',
        replacement: () => '\n'
    });

    return service;
};

// Convert markdown to HTML for initial content
const markdownToHtml = (markdown: string): string => {
    if (!markdown) return '';

    // Enhanced markdown to HTML conversion
    return markdown
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        .replace(/^\- (.*$)/gim, '<ul><li>$1</li></ul>')
        .replace(/^\d+\. (.*$)/gim, '<ol><li>$1</li></ol>')
        .replace(/^> (.*$)/gim, '<blockquote><p>$1</p></blockquote>')
        .replace(/---/g, '<hr>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^/, '<p>')
        .replace(/$/, '</p>')
        .replace(/<\/p><p><\/p>/g, '</p><p>')
        .replace(/<p><h/g, '<h')
        .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
        .replace(/<p><ul>/g, '<ul>')
        .replace(/<\/ul><\/p>/g, '</ul>')
        .replace(/<p><ol>/g, '<ol>')
        .replace(/<\/ol><\/p>/g, '</ol>')
        .replace(/<p><blockquote>/g, '<blockquote>')
        .replace(/<\/blockquote><\/p>/g, '</blockquote>')
        .replace(/<p><hr><\/p>/g, '<hr>')
        .replace(/<p><pre>/g, '<pre>')
        .replace(/<\/pre><\/p>/g, '</pre>');
};

// Create markdown conversion service
export const createMarkdownConverter = (): MarkdownConversionService => {
    const turndownService = createTurndownService();

    return {
        markdownToHtml,
        htmlToMarkdown: (html: string) => turndownService.turndown(html)
    };
}; 