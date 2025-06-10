import { useState, useEffect, useRef } from 'react';
import type { FormEvent, KeyboardEvent, ChangeEvent } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatSectionProps {
  markdown: string;
  onUpdateMarkdown: (content: string) => void;
}

export function ChatSection({ markdown, onUpdateMarkdown }: ChatSectionProps) {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const instruction = input.trim();
    if (!instruction) return;

    const userMessage: ChatMessage = { role: 'user', content: instruction };
    const newHistory = [...chatHistory, userMessage];
    setChatHistory(newHistory);
    setInput('');
    setIsGenerating(true);

    const systemMessage =
      'You are a helpful assistant specialized in editing technical reports in markdown format.';

    const oldUserMessages = chatHistory
      .filter((msg) => msg.role === 'user')
      .map((msg) => ({ role: 'user', content: msg.content }));
    const lastAssistant = chatHistory.filter((msg) => msg.role === 'assistant').slice(-1)[0];
    const memoryMessages = [
      { role: 'system', content: systemMessage },
      ...oldUserMessages,
      ...(lastAssistant ? [{ role: 'assistant', content: lastAssistant.content }] : []),
      { role: 'user', content: `Current document:\n\n${markdown}` },
      userMessage,
    ];

    // Prepare placeholder for assistant response
    setChatHistory((h) => [...h, { role: 'assistant', content: '' }]);
    const assistantMessageIndex = newHistory.length;

    try {
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
        const { value, done: doneReading } = await reader.read();
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
            const content = parsed.choices[0].delta.content;
            if (content) {
              updatedContent += content;
              setChatHistory((h) =>
                h.map((msg, idx) =>
                  idx === assistantMessageIndex ? { ...msg, content: updatedContent } : msg
                )
              );
              onUpdateMarkdown(updatedContent);
            }
          } catch (err) {
            console.error('Could not parse stream message', err);
          }
        }
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="chat-section">
      <div className="panel-header">Chat</div>
      <div className="chat-history" ref={chatHistoryRef}>
        {chatHistory.length === 0 ? (
          <div className="empty-placeholder">Type a message to begin...</div>
        ) : (
          chatHistory.map((m, i) => {
            const display =
              m.content.length > 150 ? `…${m.content.slice(-150)}` : m.content;
            return (
              <div key={i} className={`chat-message ${m.role}`}>
                {display}
              </div>
            );
          })
        )}
      </div>
      <form onSubmit={handleSubmit} className="chat-input">
        <textarea
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