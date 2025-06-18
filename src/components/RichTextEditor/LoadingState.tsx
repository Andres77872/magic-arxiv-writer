import { type LoadingStateProps } from './types';
import './LoadingState.css';

export function LoadingState({ message = 'Loading editor...' }: LoadingStateProps) {
  return (
    <div className="rich-text-editor-loading">
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
      <p>{message}</p>
    </div>
  );
} 