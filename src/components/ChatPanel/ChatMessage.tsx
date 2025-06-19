import { ChatTimer } from './ChatTimer';
import { type MessageProps } from './types';

export function ChatMessage({ 
    message, 
    isGenerating = false, 
    metrics,
    nodeExecutions = []
}: MessageProps) {
    const isUser = message.role === 'user';
    const messageRole = isUser ? 'User' : 'AI Assistant';

    return (
        <article 
            className={`chat-message ${message.role}`}
            role="article"
            aria-label={`Message from ${messageRole}`}
        >
            <div 
                className="message-avatar"
                aria-label={`${messageRole} avatar`}
                role="img"
            >
                {isUser ? '👤' : '🤖'}
            </div>
            <div className="message-content">
                <div 
                    className="message-text"
                    role="region"
                    aria-label={`${messageRole} message content`}
                >
                    {isGenerating && !message.content ? (
                        <div 
                            className="typing-indicator" 
                            role="status" 
                            aria-live="polite"
                            aria-label="AI is generating content"
                        >
                            <span className="typing-dot" aria-hidden="true" />
                            <span className="typing-dot" aria-hidden="true" />
                            <span className="typing-dot" aria-hidden="true" />
                            <span className="typing-text">Generating content...</span>
                        </div>
                    ) : (
                        <span>{message.content.slice(-360) || "Thinking..."}</span>
                    )}
                </div>
                
                {metrics && isUser && (
                    <div role="complementary" aria-label="Message timing metrics">
                        <ChatTimer
                            sendTime={metrics.sendTime}
                            processTime={metrics.processTime}
                            generatingTime={metrics.generatingTime}
                            totalTime={metrics.totalTime}
                            startTime={metrics.startTime}
                            isStreaming={metrics.isStreaming}
                        />
                    </div>
                )}
                
                {nodeExecutions.length > 0 && !isUser && (
                    <div className="node-feedback" role="complementary" aria-label="Processing details">
                        <details>
                            <summary>🔧 Execution Details ({nodeExecutions.length} operations)</summary>
                            <ul role="list">
                                {nodeExecutions.map((node) => (
                                    <li key={node.node_id} role="listitem">
                                        <strong>{node.node_class}</strong> 
                                        <span className="node-id">({node.node_id.slice(-4)})</span>:{' '}
                                        <span className={`node-status ${node.status}`}>
                                            {node.status === 'running'
                                                ? '⏳ Running...'
                                                : `✅ ${node.execution_time.toFixed(2)}s`}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </details>
                    </div>
                )}
            </div>
        </article>
    );
} 