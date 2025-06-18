import type { ArxivPaper } from './types';
import './PaperActions.css';

interface PaperActionsProps {
  paper: ArxivPaper;
  onCite: () => void;
}

export function PaperActions({ paper, onCite }: PaperActionsProps) {
  const generateBibTeX = (paper: ArxivPaper) => {
    const year = new Date(paper.date).getFullYear();
    const firstAuthor = paper.authors.split(',')[0].trim().split(' ').pop();
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

  const copyBibTeX = () => {
    const bibtex = generateBibTeX(paper);
    navigator.clipboard.writeText(bibtex).then(() => {
      // Could add a toast notification here
      console.log('BibTeX copied to clipboard');
    });
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
        <span className="btn-icon">📎</span>
        <span className="btn-text">Cite</span>
      </button>
      
      <button 
        className="action-btn secondary"
        onClick={copyBibTeX}
        title="Copy BibTeX to clipboard"
      >
        <span className="btn-icon">📋</span>
        <span className="btn-text">BibTeX</span>
      </button>
      
      <button 
        className="action-btn secondary"
        onClick={openArxiv}
        title="View on arXiv"
      >
        <span className="btn-icon">🔗</span>
        <span className="btn-text">View</span>
      </button>
      
      <button 
        className="action-btn secondary"
        onClick={openPDF}
        title="Download PDF"
      >
        <span className="btn-icon">📄</span>
        <span className="btn-text">PDF</span>
      </button>
    </div>
  );
} 