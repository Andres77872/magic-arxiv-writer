import type {ChangeEvent, FormEvent, KeyboardEvent} from 'react';
import {forwardRef, useEffect, useImperativeHandle, useRef} from 'react';
import {type ChatInputProps} from './types';

/**
 * ChatInput renders the message input form with auto-resizing textarea,
 * handling Enter-to-send (Shift+Enter for newline), and a send button.
 */
export const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(
    function ChatInput(
        {
            value,
            onChange,
            onSubmit,
            disabled = false,
            isLoading = false,
        }: ChatInputProps,
        ref,
    ) {
        const textareaRef = useRef<HTMLTextAreaElement>(null);
        useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

        // Focus on mount
        useEffect(() => {
            textareaRef.current?.focus();
        }, []);

        // Auto-resize textarea height based on content
        useEffect(() => {
            const ta = textareaRef.current;
            if (ta) {
                ta.style.height = 'auto';
                ta.style.height = `${ta.scrollHeight}px`;
            }
        }, [value]);

        const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSubmit();
            }
        };

        const handleSubmit = (e: FormEvent) => {
            e.preventDefault();
            onSubmit();
        };

        const canSend = !disabled && value.trim() && !isLoading;

        return (
            <div className="chat-input-container">
                <form onSubmit={handleSubmit} className="chat-input" role="form" aria-label="Message input">
                    <div className="input-wrapper">
                        <textarea
                            ref={textareaRef}
                            rows={1}
                            placeholder="Ask for changes (e.g., improve grammar, add conclusion, generate abstract...)"
                            value={value}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={disabled}
                            className="message-input"
                            aria-label="Type your message"
                            aria-describedby="input-hint"
                            maxLength={2000}
                        />
                        <button
                            type="submit"
                            disabled={!canSend}
                            aria-label={isLoading ? 'Generating response...' : 'Send message'}
                            className={`send-button ${isLoading ? 'loading' : ''}`}
                            title={isLoading ? 'Generating response...' : 'Send message (Enter)'}
                        >
                            {isLoading ? (
                                <div className="loading-spinner" aria-hidden="true">
                                    <div className="spinner"/>
                                </div>
                            ) : (
                                <>
                                    <span className="send-icon" aria-hidden="true">🚀</span>
                                    <span className="send-text">Generate</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
                <div className="input-hint" id="input-hint" role="note">
                    <span>
                        💡 Press <kbd>Enter</kbd> to send, <kbd>Shift+Enter</kbd> for new line
                        {value.length > 1800 && (
                            <span style={{color: 'var(--color-messages-warning)', marginLeft: 'var(--space-sm)'}}>
                                • {2000 - value.length} characters remaining
                            </span>
                        )}
                    </span>
                </div>
            </div>
        );
    },
); 