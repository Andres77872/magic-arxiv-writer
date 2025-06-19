import {useState} from 'react';
import './AcademicTemplates.css';

interface Template {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    structure: string;
    prompts: string[];
}

interface AcademicTemplatesProps {
    onUseTemplate: (template: Template) => void;
    onUsePrompt: (prompt: string) => void;
}

const TEMPLATES: Template[] = [
    {
        id: 'ml-research',
        name: 'Machine Learning Research Paper',
        description: 'Complete structure for ML research with methodology, experiments, and results',
        icon: '🤖',
        category: 'Machine Learning',
        structure: `# Title: [Your Research Title]

## Abstract
[Brief summary of your research, methodology, key findings, and contributions]

## 1. Introduction
[Context, motivation, problem statement, and research questions]

## 2. Related Work
[Literature review and comparison with existing approaches]

## 3. Methodology
[Detailed description of your approach, algorithms, and theoretical foundation]

## 4. Experiments
[Experimental setup, datasets, metrics, and implementation details]

## 5. Results and Discussion
[Experimental results, analysis, and interpretation]

## 6. Conclusion
[Summary of contributions, limitations, and future work]

## References
[Will be populated automatically based on citations]`,
        prompts: [
            'Generate an abstract for a machine learning paper about [your topic]',
            'Write an introduction explaining the motivation for [your research problem]',
            'Create a related work section comparing existing approaches to [your method]',
            'Describe the methodology for [your algorithm/approach]',
            'Design experiments to evaluate [your method] on [dataset/task]',
            'Analyze the results and discuss the implications of [your findings]'
        ]
    },
    {
        id: 'cv-paper',
        name: 'Computer Vision Paper',
        description: 'Template for computer vision research with visual analysis',
        icon: '👁️',
        category: 'Computer Vision',
        structure: `# Title: [Your CV Research Title]

## Abstract
[Summary focusing on visual task, dataset, and performance improvements]

## 1. Introduction
[Visual problem description, challenges, and proposed solution]

## 2. Related Work
[Survey of existing computer vision approaches]

## 3. Approach
[Architecture description, loss functions, and training strategy]

## 4. Experiments
### 4.1 Datasets
[Description of datasets used]

### 4.2 Implementation Details
[Training procedures, hyperparameters, hardware]

### 4.3 Evaluation Metrics
[Metrics specific to your visual task]

## 5. Results
### 5.1 Quantitative Results
[Tables and metrics]

### 5.2 Qualitative Analysis
[Visual examples and failure cases]

## 6. Ablation Studies
[Component analysis and design choices]

## 7. Conclusion
[Summary and future directions]

## References`,
        prompts: [
            'Create an abstract for a computer vision paper on [visual task]',
            'Write an introduction for [image/video processing problem]',
            'Describe a neural network architecture for [CV task]',
            'Design ablation studies for [your CV method]',
            'Compare results with state-of-the-art methods on [dataset]'
        ]
    },
    {
        id: 'nlp-paper',
        name: 'NLP Research Paper',
        description: 'Natural Language Processing research template',
        icon: '💬',
        category: 'Natural Language Processing',
        structure: `# Title: [Your NLP Research Title]

## Abstract
[Overview of language task, approach, and linguistic contributions]

## 1. Introduction
[Language problem, linguistic challenges, and motivation]

## 2. Background
[Linguistic theory, related NLP work, and preliminaries]

## 3. Model Architecture
[Model design, attention mechanisms, and language representations]

## 4. Training and Data
[Datasets, preprocessing, training procedures]

## 5. Evaluation
[Tasks, metrics, baselines, and experimental setup]

## 6. Results and Analysis
[Performance analysis, linguistic insights, error analysis]

## 7. Conclusion
[Contributions to NLP and linguistics]

## References`,
        prompts: [
            'Generate an abstract for an NLP paper on [language task]',
            'Explain the linguistic motivation for [your NLP problem]',
            'Describe a transformer-based model for [text processing task]',
            'Design evaluation metrics for [NLP task]',
            'Analyze the linguistic patterns learned by [your model]'
        ]
    },
    {
        id: 'theory-paper',
        name: 'Theoretical Paper',
        description: 'Mathematical and theoretical computer science template',
        icon: '📐',
        category: 'Theory',
        structure: `# Title: [Your Theoretical Contribution]

## Abstract
[Mathematical problem, theoretical contributions, and significance]

## 1. Introduction
[Problem formulation, motivation, and theoretical context]

## 2. Preliminaries
[Definitions, notation, and background theory]

## 3. Main Results
[Theorems, proofs, and theoretical analysis]

## 4. Algorithms and Complexity
[Algorithmic contributions and complexity analysis]

## 5. Applications
[Practical implications and use cases]

## 6. Discussion
[Theoretical implications and open problems]

## 7. Conclusion
[Summary of theoretical contributions]

## References`,
        prompts: [
            'Formulate the theoretical problem for [mathematical concept]',
            'Prove the complexity bounds for [your algorithm]',
            'Provide theoretical justification for [your approach]',
            'Analyze the convergence properties of [your method]',
            'Discuss the theoretical implications of [your results]'
        ]
    },
    {
        id: 'survey-paper',
        name: 'Survey Paper',
        description: 'Comprehensive survey and review template',
        icon: '📊',
        category: 'Survey',
        structure: `# Title: A Survey of [Research Area]

## Abstract
[Scope of survey, key areas covered, and main insights]

## 1. Introduction
[Field overview, survey scope, and organization]

## 2. Background and Taxonomy
[Field definitions and categorization framework]

## 3. [Major Area 1]
[Detailed review of first major research direction]

## 4. [Major Area 2]
[Second major research direction]

## 5. [Major Area 3]
[Third major research direction]

## 6. Comparative Analysis
[Cross-method comparisons and evaluation]

## 7. Challenges and Future Directions
[Open problems and research opportunities]

## 8. Conclusion
[Summary of field state and recommendations]

## References`,
        prompts: [
            'Create a comprehensive taxonomy for [research field]',
            'Survey the main approaches in [research area]',
            'Compare and contrast methods for [specific problem]',
            'Identify key challenges in [research domain]',
            'Analyze trends and future directions in [field]'
        ]
    }
];

export function AcademicTemplates({onUseTemplate, onUsePrompt}: AcademicTemplatesProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);

    const categories = ['all', ...Array.from(new Set(TEMPLATES.map(t => t.category)))];

    const filteredTemplates = selectedCategory === 'all'
        ? TEMPLATES
        : TEMPLATES.filter(t => t.category === selectedCategory);

    return (
        <div className="academic-templates">
            <div className="templates-header">
                <h3>📋 Academic Templates & Prompts</h3>
                <p>Choose a paper structure or use AI prompts to get started</p>
            </div>

            {/* Category Filter */}
            <div className="category-selector">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                    >
                        {category === 'all' ? 'All' : category}
                    </button>
                ))}
            </div>

            {/* Templates List */}
            <div className="templates-list">
                {filteredTemplates.map(template => (
                    <div key={template.id} className="template-card">
                        <div className="template-header">
                            <div className="template-info">
                                <span className="template-icon">{template.icon}</span>
                                <div>
                                    <h4 className="template-name">{template.name}</h4>
                                    <p className="template-description">{template.description}</p>
                                    <span className="template-category">{template.category}</span>
                                </div>
                            </div>
                            <div className="template-actions">
                                <button
                                    onClick={() => onUseTemplate(template)}
                                    className="action-btn primary"
                                    title="Use this template"
                                >
                                    📝 Use Template
                                </button>
                                <button
                                    onClick={() => setExpandedTemplate(
                                        expandedTemplate === template.id ? null : template.id
                                    )}
                                    className="action-btn secondary"
                                    title="View details"
                                >
                                    {expandedTemplate === template.id ? '👆 Collapse' : '👁️ Details'}
                                </button>
                            </div>
                        </div>

                        {expandedTemplate === template.id && (
                            <div className="template-details">
                                <div className="template-structure">
                                    <h5>📄 Paper Structure:</h5>
                                    <pre className="structure-preview">{template.structure.substring(0, 300)}...</pre>
                                </div>

                                <div className="template-prompts">
                                    <h5>🤖 AI Writing Prompts:</h5>
                                    <div className="prompts-list">
                                        {template.prompts.map((prompt, index) => (
                                            <div key={index} className="prompt-item">
                                                <span className="prompt-text">"{prompt}"</span>
                                                <button
                                                    onClick={() => onUsePrompt(prompt)}
                                                    className="prompt-use-btn"
                                                    title="Use this prompt"
                                                >
                                                    ✨ Use
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Quick Start Section */}
            <div className="quick-start">
                <h4>🚀 Quick Start Options</h4>
                <div className="quick-actions">
                    <button
                        onClick={() => onUsePrompt("Generate a complete arXiv paper outline for [your research topic], including all major sections, key points to cover, and suggested methodologies.")}
                        className="quick-action-btn"
                    >
                        📋 Generate Paper Outline
                    </button>
                    <button
                        onClick={() => onUsePrompt("Create an abstract for an arXiv paper about [your topic], highlighting the problem, methodology, key contributions, and results.")}
                        className="quick-action-btn"
                    >
                        📄 Write Abstract
                    </button>
                    <button
                        onClick={() => onUsePrompt("Review and improve the following academic text for clarity, coherence, and academic style: [paste your text]")}
                        className="quick-action-btn"
                    >
                        ✨ Improve Writing
                    </button>
                    <button
                        onClick={() => onUsePrompt("Search for and summarize recent arXiv papers related to [your research area] and explain how they relate to [your work].")}
                        className="quick-action-btn"
                    >
                        🔍 Find Related Work
                    </button>
                </div>
            </div>
        </div>
    );
} 