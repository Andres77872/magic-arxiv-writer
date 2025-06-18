import './LoadingState.css';

export function LoadingState() {
  return (
    <div className="loading-state">
      <div className="loading-spinner-large"></div>
      <p>Searching arXiv papers...</p>
      <div className="loading-progress">
        <div className="progress-bar"></div>
      </div>
    </div>
  );
} 