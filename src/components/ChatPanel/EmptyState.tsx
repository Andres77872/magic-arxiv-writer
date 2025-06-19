import { type EmptyStateProps } from './types';

const suggestedPrompts = [
    {
        icon: "📝",
        title: "Generate Paper Outline",
        description: "Create an arXiv paper outline for transformer architectures",
        prompt: "Generate an arXiv paper outline for transformer architectures"
    },
    {
        icon: "🔍",
        title: "Research & Citations",
        description: "Search for recent papers on attention mechanisms and provide citations",
        prompt: "Search for recent papers on attention mechanisms and provide citations"
    },
    {
        icon: "🔬",
        title: "Methodology Section",
        description: "Create a methodology section with mathematical notation and algorithms",
        prompt: "Create a methodology section with mathematical notation and algorithms"
    },
    {
        icon: "📊",
        title: "Results & Comparison",
        description: "Write a results section comparing with state-of-the-art baselines",
        prompt: "Write a results section comparing with state-of-the-art baselines"
    },
    {
        icon: "📖",
        title: "Review & Improve",
        description: "Review and improve this academic text for arXiv submission",
        prompt: "Review and improve this academic text for arXiv submission"
    },
    {
        icon: "🎯",
        title: "Related Work",
        description: "Generate related work section with proper academic comparisons",
        prompt: "Generate related work section with proper academic comparisons"
    },
    {
        icon: "📐",
        title: "Mathematical Proofs",
        description: "Format mathematical equations and theoretical proofs",
        prompt: "Format mathematical equations and theoretical proofs"
    },
    {
        icon: "🏷️",
        title: "Citations & References",
        description: "Add proper citations and references in academic style",
        prompt: "Add proper citations and references in academic style"
    }
];

export function EmptyState({ onPromptSelect }: EmptyStateProps) {
    const handleSuggestedPrompt = (prompt: string) => {
        onPromptSelect(prompt);
    };

    return (
        <div className="chat-empty-state">
            <div className="empty-icon">🤖</div>
            <h3>Ready to help with your paper!</h3>
            <p>Start a conversation with the AI assistant to generate and refine your academic content.</p>
            
            <div className="suggested-prompts">
                <h4>Try these suggestions:</h4>
                <div className="prompts-grid">
                    {suggestedPrompts.map((item, idx) => (
                        <button 
                            key={idx}
                            className="suggestion-card"
                            style={{ '--animation-order': idx } as React.CSSProperties}
                            onClick={() => handleSuggestedPrompt(item.prompt)}
                            aria-label={`Suggestion: ${item.title} - ${item.description}`}
                        >
                            <div className="suggestion-icon" aria-hidden="true">
                                {item.icon}
                            </div>
                            <div className="suggestion-content">
                                <div className="suggestion-title">{item.title}</div>
                                <div className="suggestion-description">{item.description}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
} 