import { useCallback, useState } from 'react';

export interface AIMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface AIServiceProps {
    model: string;
    messages: AIMessage[];
    onContent?: (content: string) => void;
    onMetrics?: (metrics: any) => void;
    onComplete?: (finalContent: string) => void;
    onError?: (error: Error) => void;
}

export interface AIServiceState {
    isGenerating: boolean;
    connectionStatus: 'connected' | 'connecting' | 'disconnected';
    content: string;
    error: Error | null;
}

export interface NodeExecution {
    node_id: string;
    node_class: string;
    start_time: number;
    end_time: number;
    execution_time: number;
    status: 'running' | 'completed';
}

export function useAIService() {
    const [state, setState] = useState<AIServiceState>({
        isGenerating: false,
        connectionStatus: 'connected',
        content: '',
        error: null,
    });

    const generateCompletion = useCallback(async ({
        model,
        messages,
        onContent,
        onMetrics,
        onComplete,
        onError,
    }: AIServiceProps) => {
        setState(prev => ({
            ...prev,
            isGenerating: true,
            connectionStatus: 'connecting',
            content: '',
            error: null,
        }));

        const tFetchStart = performance.now();
        let firstByteTime: number | null = null;
        let processTime: number | null = null;
        let updatedContent = '';
        const nodeExecutions: NodeExecution[] = [];

        try {
            setState(prev => ({ ...prev, connectionStatus: 'connected' }));

            const response = await fetch('https://magic.arz.ai/chat/openai/v1/completion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'DUMMY_TOKEN',
                },
                body: JSON.stringify({
                    model,
                    messages,
                    stream: true,
                }),
            });

            if (!response.ok || !response.body) {
                const errorText = await response.text();
                console.error('Error from API', errorText);
                throw new Error(`API Error: ${response.status} ${errorText}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                const now = performance.now();
                
                if (firstByteTime === null) {
                    firstByteTime = now - tFetchStart;
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
                            const idxNode = nodeExecutions.findIndex((n) => n.node_id === meta.node_id);
                            const entry = {
                                node_id: meta.node_id,
                                node_class: meta.node_class,
                                start_time: meta.start_time,
                                end_time: meta.end_time,
                                execution_time: meta.execution_time,
                                status: meta.execution_time && meta.execution_time > 0 ? 'completed' : 'running',
                            };
                            
                            if (idxNode === -1) {
                                nodeExecutions.push(entry as NodeExecution);
                            } else {
                                nodeExecutions[idxNode] = entry as NodeExecution;
                            }
                            
                            if (onMetrics) {
                                onMetrics({
                                    sendTime: firstByteTime,
                                    processTime,
                                    nodeExecutions: [...nodeExecutions],
                                });
                            }
                        }
                        
                        const content = parsed.choices[0].delta.content;
                        
                        if (content) {
                            if (processTime === null && firstByteTime !== null) {
                                processTime = performance.now() - tFetchStart - firstByteTime;
                            }
                            
                            updatedContent += content;
                            
                            setState(prev => ({ ...prev, content: updatedContent }));
                            
                            if (onContent) {
                                onContent(updatedContent);
                            }
                        }
                    } catch (err) {
                        console.error('Could not parse stream message', err);
                    }
                }
            }

            // Final metrics
            const tEnd = performance.now();
            const finalTotalTime = tEnd - tFetchStart;
            
            if (onMetrics) {
                onMetrics({
                    sendTime: firstByteTime,
                    processTime,
                    generatingTime: finalTotalTime - (firstByteTime || 0) - (processTime || 0),
                    totalTime: finalTotalTime,
                    isStreaming: false,
                    nodeExecutions,
                });
            }
            
            if (onComplete) {
                onComplete(updatedContent);
            }

        } catch (error) {
            console.error('Request failed:', error);
            const err = error instanceof Error ? error : new Error('Unknown error occurred');
            setState(prev => ({ 
                ...prev, 
                connectionStatus: 'disconnected',
                error: err 
            }));
            
            if (onError) {
                onError(err);
            }
        } finally {
            setState(prev => ({ ...prev, isGenerating: false }));
        }
    }, []);

    return {
        ...state,
        generateCompletion,
    };
} 