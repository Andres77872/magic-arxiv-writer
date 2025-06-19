import type {ArxivPaper} from './types';

interface PaperActionsProps {
    paper: ArxivPaper;
    onCite: () => void;
}

export function PaperActions({paper, onCite}: PaperActionsProps) {
    const generateBibTeX = (paper: ArxivPaper) => {
        const year = new Date(paper.date).getFullYear();
        const firstAuthor = paper.authors.split(',')[0]?.trim().split(' ').pop() || 'Unknown';
        const key = `${firstAuthor}${year}${paper.id.replace(/\./g, '')}`;

        return `@article{${key},
  title={${paper.title}},
  author={${paper.authors}},
  journal={arXiv preprint arXiv:${paper.id}},
  year={${year}},
  ${paper.doi ? `doi={${paper.doi}},` : ''}
  url={https://arxiv.org/abs/${paper.id}}
}`;
    };

    const copyBibTeX = async () => {
        try {
            const bibtex = generateBibTeX(paper);
            await navigator.clipboard.writeText(bibtex);
            console.log('BibTeX copied to clipboard');
        } catch (err) {
            console.error('Failed to copy BibTeX:', err);
        }
    };

    const openPDF = () => {
        window.open(`https://arxiv.org/pdf/${paper.id}.pdf`, '_blank');
    };

    const openArxiv = () => {
        window.open(`https://arxiv.org/abs/${paper.id}`, '_blank');
    };

    return (
        <div className="paper-actions">
            <button
                className="action-btn primary"
                onClick={onCite}
                title="Add citation to document"
            >
                📎 Cite
            </button>

            <button
                className="action-btn secondary"
                onClick={copyBibTeX}
                title="Copy BibTeX to clipboard"
            >
                📋 BibTeX
            </button>

            <button
                className="action-btn secondary"
                onClick={openArxiv}
                title="View on arXiv"
            >
                🔗 View
            </button>

            <button
                className="action-btn secondary"
                onClick={openPDF}
                title="Download PDF"
            >
                📄 PDF
            </button>
        </div>
    );
} 