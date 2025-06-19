import { type EmptyStateProps } from './types';

const suggestedPrompts = [
    "📝 Generate an arXiv paper outline for transformer architectures",
    "🔍 Search for recent papers on attention mechanisms and provide citations",
    "🔬 Create a methodology section with mathematical notation and algorithms", 
    "📊 Write a results section comparing with state-of-the-art baselines",
    "📖 Review and improve this academic text for arXiv submission",
    "🎯 Generate related work section with proper academic comparisons",
    "📐 Format mathematical equations and theoretical proofs",
    "🏷️ Add proper citations and references in academic style"
];

export function EmptyState({ onPromptSelect }: EmptyStateProps) {
    const handleSuggestedPrompt = (prompt: string) => {
        onPromptSelect(prompt.replace(/^[📝🔍🔬📊📖🎯📐🏷️]\s/, ''));
    };

    return (
        <div className="chat-empty-state">
            <div className="empty-icon">🤖</div>
            <h3>Ready to help with your paper!</h3>
            <p>Start a conversation with the AI assistant to generate and refine your academic content.</p>
            
            <div className="suggested-prompts">
                <h4>Try these suggestions:</h4>
                {suggestedPrompts.map((prompt, idx) => (
                    <button 
                        key={idx}
                        className="suggestion-pill"
                        onClick={() => handleSuggestedPrompt(prompt)}
                    >
                        {prompt}
                    </button>
                ))}
            </div>
        </div>
    );
} 