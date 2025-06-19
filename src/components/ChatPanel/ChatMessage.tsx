import { ChatTimer } from './ChatTimer';
import { type MessageProps } from './types';

export function ChatMessage({ 
    message, 
    isGenerating = false, 
    metrics,
    nodeExecutions = []
}: MessageProps) {
    const isUser = message.role === 'user';

    return (
        <div className={`chat-message ${message.role}`}>
            <div className="message-avatar">
                {isUser ? '👤' : '🤖'}
            </div>
            <div className="message-content">
                <div className="message-text">
                    {isGenerating && !message.content ? (
                        <div className="typing-indicator">
                            <span />
                            <span />
                            <span />
                            Generating content...
                        </div>
                    ) : (
                        message.content.slice(-360) || "Thinking..."
                    )}
                </div>
                
                {metrics && isUser && (
                    <ChatTimer
                        sendTime={metrics.sendTime}
                        processTime={metrics.processTime}
                        generatingTime={metrics.generatingTime}
                        totalTime={metrics.totalTime}
                        startTime={metrics.startTime}
                        isStreaming={metrics.isStreaming}
                    />
                )}
                
                {nodeExecutions.length > 0 && !isUser && (
                    <div className="node-feedback">
                        <details>
                            <summary>🔧 Execution Details</summary>
                            <ul>
                                {nodeExecutions.map((node) => (
                                    <li key={node.node_id}>
                                        <strong>{node.node_class}</strong> ({node.node_id.slice(-4)}):{' '}
                                        {node.status === 'running'
                                            ? '⏳ Running...'
                                            : `✅ ${node.execution_time.toFixed(2)}s`}
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