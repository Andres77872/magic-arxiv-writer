import {type LoadingStateProps} from './types';

export function LoadingState({message = 'Loading editor...'}: LoadingStateProps) {
    return (
        <div className="rich-text-editor-loading">
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
            <div>{message}</div>
        </div>
    );
} 