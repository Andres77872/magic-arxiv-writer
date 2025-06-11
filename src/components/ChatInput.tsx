import type {ChangeEvent, FormEvent, KeyboardEvent} from 'react';
import {forwardRef, useEffect, useImperativeHandle, useRef} from 'react';

export interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    disabled?: boolean;
    isLoading?: boolean;
}

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

        return (
            <form onSubmit={handleSubmit} className="chat-input">
        <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Ask for changes (e.g. improve grammar, add conclusion)"
            value={value}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
        />
                <button type="submit" disabled={disabled || !value.trim() || isLoading} aria-label="Send message">
                    {isLoading ? (
                        <span className="loader" aria-hidden/>
                    ) :
                        "Generate"
                    }
                </button>
            </form>
        );
    },
);