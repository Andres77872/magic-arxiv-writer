import type {FormEvent} from 'react';
import {useEffect, useRef, useState, useCallback} from 'react';
import { PanelHeader } from './PanelHeader';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { EmptyState } from './EmptyState';
import { type ChatPanelProps, type ChatMessage as ChatMessageType, type ChatMetrics, type NodeExecution, type ConnectionStatus } from './types';
import './index.css';

interface ChatTurn {
    user: ChatMessageType;
    assistant?: ChatMessageType;
}

export function ChatPanel({markdown, onUpdateMarkdown}: ChatPanelProps) {
    const [chatHistory, setChatHistory] = useState<ChatMessageType[]>([]);
    const [input, setInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connected');
    const [metricsHistory, setMetricsHistory] = useState<ChatMetrics[]>([]);
    const [currentGenerationSummary, setCurrentGenerationSummary] = useState('');
    const chatHistoryRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);



    useEffect(() => {
        if (chatHistoryRef.current) {
            const {scrollTop, scrollHeight, clientHeight} = chatHistoryRef.current;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
            
            if (isNearBottom) {
                chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
            }
        }
    }, [chatHistory]);

    const handlePromptSelect = useCallback((prompt: string) => {
        setInput(prompt);
        inputRef.current?.focus();
    }, []);

    const handleSubmit = useCallback(async (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        const instruction = input.trim();
        if (!instruction || isGenerating) return;

        const userMessage: ChatMessageType = {role: 'user', content: instruction};
        const newHistory = [...chatHistory, userMessage];
        setChatHistory(newHistory);
        setInput('');
        setIsGenerating(true);
        setCurrentGenerationSummary('Starting generation...');
        setConnectionStatus('connecting');
        
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

        // Prepare placeholder for assistant response - only showing generation summary
        setChatHistory((h) => [...h, {role: 'assistant', content: 'Generating content for your document...'}]);
        const assistantMessageIndex = newHistory.length;

        try {
            setConnectionStatus('connected');
            let firstByteTime: number | null = null;
            let processTime: number | null = null;
            let updatedContent = '';
            let wordCount = 0;
            
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
                setConnectionStatus('disconnected');
                return;
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;

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
                                    execs.push(entry as NodeExecution);
                                } else {
                                    execs[idxNode] = entry as NodeExecution;
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
                            wordCount = updatedContent.split(/\s+/).filter(word => word.length > 0).length;
                            
                            // Update editor with full content for smooth animation
                            onUpdateMarkdown(updatedContent);
                            
                            // Update chat with only generation summary (last ~50 characters + word count)
                            const contentTail = updatedContent.slice(-50).trim();
                            const summary = `<div class="generation-status">Generating content... <span class="word-count-badge">${wordCount} words</span></div><div class="content-preview">"...${contentTail}"</div>`;
                            setCurrentGenerationSummary(summary);
                            
                            setChatHistory((h) =>
                                h.map((msg, idx) =>
                                    idx === assistantMessageIndex ? {...msg, content: summary} : msg
                                )
                            );
                        }
                    } catch (err) {
                        console.error('Could not parse stream message', err);
                    }
                }
            }
            
            // Final summary when done
            const finalSummary = `<div class="generation-complete">Generated ${wordCount} words of content for your document.</div>`;
            setCurrentGenerationSummary(finalSummary);
            setChatHistory((h) =>
                h.map((msg, idx) =>
                    idx === assistantMessageIndex ? {...msg, content: finalSummary} : msg
                )
            );
            
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
        } catch (error) {
            console.error('Request failed:', error);
            setConnectionStatus('disconnected');
            setChatHistory((h) => h.slice(0, -1)); // Remove the empty assistant message
        } finally {
            setIsGenerating(false);
            setCurrentGenerationSummary('');
            inputRef.current?.focus();
        }
    }, [input, isGenerating, chatHistory, markdown, metricsHistory, onUpdateMarkdown]);

    // Group messages into user/assistant turns
    const turns: ChatTurn[] = [];
    for (let i = 0; i < chatHistory.length; i++) {
        if (chatHistory[i].role === 'user') {
            const userMsg = chatHistory[i];
            let assistantMsg: ChatMessageType | undefined;
            if (i + 1 < chatHistory.length && chatHistory[i + 1].role === 'assistant') {
                assistantMsg = chatHistory[i + 1];
                i++;
            }
            turns.push({user: userMsg, assistant: assistantMsg});
        }
    }

    return (
        <div className="chat-panel">
            <PanelHeader connectionStatus={connectionStatus} />
            
            <div className="chat-history" ref={chatHistoryRef}>
                {turns.length === 0 ? (
                    <EmptyState onPromptSelect={handlePromptSelect} />
                ) : (
                    turns.map((turn, idx) => (
                        <div key={idx} className="chat-turn">
                            <ChatMessage 
                                message={turn.user}
                                metrics={metricsHistory[idx]}
                            />
                            {turn.assistant && (
                                <ChatMessage 
                                    message={turn.assistant}
                                    isGenerating={isGenerating && idx === turns.length - 1 && !turn.assistant.content}
                                    nodeExecutions={metricsHistory[idx]?.nodeExecutions}
                                />
                            )}
                        </div>
                    ))
                )}
            </div>
            
            <ChatInput
                ref={inputRef}
                value={input}
                onChange={setInput}
                onSubmit={handleSubmit}
                disabled={isGenerating}
                isLoading={isGenerating}
            />
        </div>
    );
} 