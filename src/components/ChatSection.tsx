import type {ChangeEvent, FormEvent, KeyboardEvent} from 'react';
import {useEffect, useRef, useState} from 'react';
import {ChatTimer} from './ChatTimer';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatSectionProps {
    markdown: string;
    onUpdateMarkdown: (content: string) => void;
}

interface NodeExecution {
    node_id: string;
    node_class: string;
    start_time: number;
    end_time: number;
    execution_time: number;
    status: 'running' | 'completed';
}

export function ChatSection({markdown, onUpdateMarkdown}: ChatSectionProps) {
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [metricsHistory, setMetricsHistory] = useState<
        {
            sendTime: number;
            processTime: number;
            generatingTime: number;
            totalTime: number;
            startTime: number;
            isStreaming: boolean;
            nodeExecutions: NodeExecution[];
        }[]
    >([]);
    const chatHistoryRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [chatHistory]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        const textarea = inputRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [input]);

    const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        const instruction = input.trim();
        if (!instruction) return;

        const userMessage: ChatMessage = {role: 'user', content: instruction};
        const newHistory = [...chatHistory, userMessage];
        setChatHistory(newHistory);
        setInput('');
        setIsGenerating(true);
        const metricsIndex = metricsHistory.length;
        const tFetchStart = performance.now();
        setMetricsHistory((m) => [
            ...m,
            {
                sendTime: 0,
                processTime: 0,
                generatingTime: 0,
                totalTime: 0,
                startTime: tFetchStart,
                isStreaming: true,
                nodeExecutions: [],
            },
        ]);

        const oldUserMessages = chatHistory
            .filter((msg) => msg.role === 'user')
            .map((msg) => ({role: 'user', content: msg.content}));
        const lastAssistant = chatHistory.filter((msg) => msg.role === 'assistant').slice(-1)[0];
        const memoryMessages = [
            ...oldUserMessages,
            ...(lastAssistant ? [{role: 'assistant', content: lastAssistant.content}] : []),
            {role: 'user', content: `Current document:\n\n${markdown}`},
            userMessage,
        ];

        // Prepare placeholder for assistant response
        setChatHistory((h) => [...h, {role: 'assistant', content: ''}]);
        const assistantMessageIndex = newHistory.length;

        try {
            let firstByteTime: number | null = null;
            let processTime: number | null = null;
            const response = await fetch('https://magic.arz.ai/chat/openai/v1/completion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'agt-d8056405-2686-4e05-a5dd-38fc31a4a543',
                },
                body: JSON.stringify({
                    model: 'agt-d8056405-2686-4e05-a5dd-38fc31a4a543',
                    messages: memoryMessages,
                    stream: true,
                }),
            });

            if (!response.ok || !response.body) {
                console.error('Error from API', await response.text());
                return;
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let updatedContent = '';

            while (!done) {
                const {value, done: doneReading} = await reader.read();
                const now = performance.now();
                if (firstByteTime === null) {
                    firstByteTime = now - tFetchStart;
                    setMetricsHistory((m) => {
                        const newMetrics = [...m];
                        newMetrics[metricsIndex] = {
                            ...newMetrics[metricsIndex],
                            sendTime: firstByteTime!,
                        };
                        return newMetrics;
                    });
                }
                done = doneReading;
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter((line) => line.trim().startsWith('data:'));
                for (const line of lines) {
                    const data = line.replace(/^data: /, '');
                    if (data === '[DONE]') {
                        done = true;
                        break;
                    }
                    try {
                        const parsed = JSON.parse(data);
                        const meta = parsed.extras?.meta;
                        if (meta) {
                            setMetricsHistory((m) => {
                                const newMetrics = [...m];
                                const execs = newMetrics[metricsIndex].nodeExecutions.slice();
                                const idxNode = execs.findIndex((n) => n.node_id === meta.node_id);
                                const entry = {
                                    node_id: meta.node_id,
                                    node_class: meta.node_class,
                                    start_time: meta.start_time,
                                    end_time: meta.end_time,
                                    execution_time: meta.execution_time,
                                    status: meta.execution_time && meta.execution_time > 0 ? 'completed' : 'running',
                                };
                                if (idxNode === -1) {
                                    execs.push(entry);
                                } else {
                                    execs[idxNode] = entry;
                                }
                                newMetrics[metricsIndex] = {
                                    ...newMetrics[metricsIndex],
                                    nodeExecutions: execs,
                                };
                                return newMetrics;
                            });
                        }
                        const content = parsed.choices[0].delta.content;
                        if (content) {
                            if (processTime === null && firstByteTime !== null) {
                                processTime = performance.now() - tFetchStart - firstByteTime;
                                setMetricsHistory((m) => {
                                    const newMetrics = [...m];
                                    newMetrics[metricsIndex] = {
                                        ...newMetrics[metricsIndex],
                                        processTime: processTime!,
                                    };
                                    return newMetrics;
                                });
                            }
                            updatedContent += content;
                            setChatHistory((h) =>
                                h.map((msg, idx) =>
                                    idx === assistantMessageIndex ? {...msg, content: updatedContent} : msg
                                )
                            );
                            onUpdateMarkdown(updatedContent);
                        }
                    } catch (err) {
                        console.error('Could not parse stream message', err);
                    }
                }
            }
            const tEnd = performance.now();
            const finalTotalTime = tEnd - tFetchStart;
            setMetricsHistory((m) => {
                const newMetrics = [...m];
                const {sendTime, processTime} = newMetrics[metricsIndex];
                newMetrics[metricsIndex] = {
                    ...newMetrics[metricsIndex],
                    generatingTime: finalTotalTime - (sendTime + processTime),
                    totalTime: finalTotalTime,
                    isStreaming: false,
                };
                return newMetrics;
            });
        } finally {
            setIsGenerating(false);
            inputRef.current?.focus();
        }
    };

    // Group messages into user/assistant turns
    type ChatTurn = { user: ChatMessage; assistant?: ChatMessage };
    const turns: ChatTurn[] = [];
    for (let i = 0; i < chatHistory.length; i++) {
        if (chatHistory[i].role === 'user') {
            const userMsg = chatHistory[i];
            let assistantMsg: ChatMessage | undefined;
            if (i + 1 < chatHistory.length && chatHistory[i + 1].role === 'assistant') {
                assistantMsg = chatHistory[i + 1];
                i++;
            }
            turns.push({user: userMsg, assistant: assistantMsg});
        }
    }

    return (
        <div className="chat-section">
            <div className="panel-header">Chat</div>
            <div className="chat-history" ref={chatHistoryRef}>
                {turns.length === 0 ? (
                    <div className="empty-placeholder">Type a message to begin...</div>
                ) : (
                    turns.map((turn, idx) => (
                        <div key={idx} className="chat-turn">
                            <div className="chat-message user">
                                {turn.user.content}
                                {metricsHistory[idx] && (
                                    <ChatTimer
                                        sendTime={metricsHistory[idx].sendTime}
                                        processTime={metricsHistory[idx].processTime}
                                        generatingTime={metricsHistory[idx].generatingTime}
                                        totalTime={metricsHistory[idx].totalTime}
                                        startTime={metricsHistory[idx].startTime}
                                        isStreaming={metricsHistory[idx].isStreaming}
                                    />
                                )}
                            </div>
                            {turn.assistant && (
                                <div className="chat-message assistant">
                                    {turn.assistant.content.slice(-360)}
                                    {metricsHistory[idx]?.nodeExecutions.length > 0 && (
                                        <div className="node-feedback">
                                            <details>
                                                <summary>Node execution details</summary>
                                                <ul>
                                                    {metricsHistory[idx].nodeExecutions.map((node) => (
                                                        <li key={node.node_id}>
                                                            <strong>{node.node_class}</strong> ({node.node_id}):{' '}
                                                            {node.status === 'running'
                                                                ? 'Running...'
                                                                : `${node.execution_time.toFixed(2)}s`}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </details>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
            <form onSubmit={handleSubmit} className="chat-input">
        <textarea
            ref={inputRef}
            rows={2}
            placeholder="Ask for changes (e.g. improve grammar, add conclusion)"
            value={input}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                }
            }}
            disabled={isGenerating}
        />
                <button type="submit" disabled={isGenerating || !input.trim()}>
                    {isGenerating ? 'Generating...' : 'Send'}
                </button>
            </form>
        </div>
    );
}