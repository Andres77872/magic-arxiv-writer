import type {FormEvent} from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import {PanelHeader} from './PanelHeader';
import {ChatInput} from './ChatInput';
import {ChatMessage} from './ChatMessage';
import {EmptyState} from './EmptyState';
import {
    type ChatMessage as ChatMessageType,
    type ChatMetrics,
    type ChatPanelProps
} from './types';
import { useAIService, type AIMessage } from '../AIService';
import './index.css';

interface ChatTurn {
    user: ChatMessageType;
    assistant?: ChatMessageType;
}

export function ChatPanel({markdown, onUpdateMarkdown}: ChatPanelProps) {
    const [chatHistory, setChatHistory] = useState<ChatMessageType[]>([]);
    const [input, setInput] = useState('');
    const [metricsHistory, setMetricsHistory] = useState<ChatMetrics[]>([]);
    const chatHistoryRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    
    // Use the AI service hook
    const aiService = useAIService();


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
        if (!instruction || aiService.isGenerating) return;

        const userMessage: ChatMessageType = {role: 'user', content: instruction};
        const newHistory = [...chatHistory, userMessage];
        setChatHistory(newHistory);
        setInput('');

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
            .map((msg) => ({role: 'user' as const, content: msg.content}));
        const lastAssistant = chatHistory.filter((msg) => msg.role === 'assistant').slice(-1)[0];
        const memoryMessages: AIMessage[] = [
            ...oldUserMessages,
            ...(lastAssistant ? [{role: 'assistant' as const, content: lastAssistant.content}] : []),
            {role: 'user' as const, content: `Current document:\n\n${markdown}`},
            {role: 'user' as const, content: userMessage.content},
        ];

        // Prepare placeholder for assistant response - only showing generation summary
        setChatHistory((h) => [...h, {role: 'assistant', content: 'Generating content for your document...'}]);
        const assistantMessageIndex = newHistory.length;
        let wordCount = 0;

        await aiService.generateCompletion({
            model: 'agt-d8056405-2686-4e05-a5dd-38fc31a4a543',
            messages: memoryMessages,
            onContent: (updatedContent) => {
                // Update editor with full content for smooth animation
                onUpdateMarkdown(updatedContent);

                // Update chat with only generation summary (last ~50 characters + word count)
                wordCount = updatedContent.split(/\s+/).filter(word => word.length > 0).length;
                const contentTail = updatedContent.slice(-50).trim();
                const summary = `<div class="generation-status">Generating content... <span class="word-count-badge">${wordCount} words</span></div><div class="content-preview">"...${contentTail}"</div>`;

                setChatHistory((h) =>
                    h.map((msg, idx) =>
                        idx === assistantMessageIndex ? {...msg, content: summary} : msg
                    )
                );
            },
            onMetrics: (metrics) => {
                setMetricsHistory((m) => {
                    const newMetrics = [...m];
                    newMetrics[metricsIndex] = {
                        ...newMetrics[metricsIndex],
                        ...metrics,
                    };
                    return newMetrics;
                });
            },
            onComplete: () => {
                // Final summary when done
                const finalSummary = `<div class="generation-complete">Generated ${wordCount} words of content for your document.</div>`;
                setChatHistory((h) =>
                    h.map((msg, idx) =>
                        idx === assistantMessageIndex ? {...msg, content: finalSummary} : msg
                    )
                );
            },
            onError: (error) => {
                console.error('AI Service error:', error);
                setChatHistory((h) => h.slice(0, -1)); // Remove the empty assistant message
            },
        });

        inputRef.current?.focus();
    }, [input, aiService, chatHistory, markdown, metricsHistory, onUpdateMarkdown]);

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
            <PanelHeader connectionStatus={aiService.connectionStatus}/>

            <div className="chat-history" ref={chatHistoryRef}>
                {turns.length === 0 ? (
                    <EmptyState onPromptSelect={handlePromptSelect}/>
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
                                    isGenerating={aiService.isGenerating && idx === turns.length - 1 && !turn.assistant.content}
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
                disabled={aiService.isGenerating}
                isLoading={aiService.isGenerating}
            />
        </div>
    );
} 