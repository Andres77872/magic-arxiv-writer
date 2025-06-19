import {useEffect, useState} from 'react';
import {type ChatMessage as ChatMessageType, type ChatMetrics, type NodeExecution} from './types';
import {ChatTimer} from './ChatTimer';

interface ChatMessageProps {
    message: ChatMessageType;
    isGenerating?: boolean;
    metrics?: ChatMetrics;
    nodeExecutions?: NodeExecution[];
}

export function ChatMessage({message, isGenerating = false, metrics, nodeExecutions}: ChatMessageProps) {
    const [displayedContent, setDisplayedContent] = useState('');
    const [showCursor, setShowCursor] = useState(false);

    // Smooth streaming effect for generated content
    useEffect(() => {
        if (message.role === 'assistant' && isGenerating) {
            setShowCursor(true);
            setDisplayedContent(message.content);
        } else if (message.role === 'assistant' && !isGenerating) {
            setShowCursor(false);
            setDisplayedContent(message.content);
        } else {
            setDisplayedContent(message.content);
        }
    }, [message.content, isGenerating, message.role]);

    const formatContent = (content: string) => {
        if (!content) return '';

        // Check if it's a generation summary (contains HTML)
        if (content.includes('generation-status') || content.includes('generation-complete')) {
            return content; // Return HTML as-is for generation summaries
        }

        // Simple markdown-like formatting for regular chat
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .split('\n')
            .map(line => line.trim())
            .join('<br/>');
    };

    // Determine if this is a generation summary message
    const isGenerationSummary = message.content.includes('generation-status') ||
        message.content.includes('generation-complete') ||
        (isGenerating && message.role === 'assistant');

    return (
        <div className={`chat-message ${message.role} ${isGenerating ? 'generating' : ''}`}>
            <div className="message-avatar">
                {message.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="message-content">
                <div
                    className={`message-text ${isGenerating ? 'streaming' : ''} ${isGenerationSummary ? 'generation-summary' : ''}`}
                    dangerouslySetInnerHTML={{
                        __html: formatContent(displayedContent) + (showCursor ? '<span class="stream-cursor">|</span>' : '')
                    }}
                />
                {showCursor && (
                    <div className="typing-indicator">
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <span className="typing-text">AI is thinking...</span>
                    </div>
                )}
                {metrics && (
                    <ChatTimer
                        sendTime={metrics.sendTime}
                        processTime={metrics.processTime}
                        generatingTime={metrics.generatingTime}
                        totalTime={metrics.totalTime}
                        startTime={metrics.startTime}
                        isStreaming={metrics.isStreaming}
                    />
                )}
                {nodeExecutions && nodeExecutions.length > 0 && (
                    <div className="node-feedback">
                        <details>
                            <summary>Node Execution Details ({nodeExecutions.length} steps)</summary>
                            <ul>
                                {nodeExecutions.map((node, idx) => (
                                    <li key={idx}>
                                        <strong>{node.node_class}</strong> -
                                        <span className="node-id">{node.node_id.slice(-4)}</span> -
                                        <span className={`node-status ${node.status}`}>{node.status}</span>
                                        {node.execution_time && ` (${node.execution_time.toFixed(2)}ms)`}
                                    </li>
                                ))}
                            </ul>
                        </details>
                    </div>
                )}
            </div>
        </div>
    );
} 