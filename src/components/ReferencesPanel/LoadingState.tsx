interface LoadingStateProps {
    showSkeleton?: boolean;
}

export function LoadingState({showSkeleton = false}: LoadingStateProps = {}) {
    if (showSkeleton) {
        return (
            <div className="loading-skeleton">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="skeleton-card">
                        <div className="skeleton-line title"/>
                        <div className="skeleton-line author"/>
                        <div className="skeleton-line abstract"/>
                        <div className="skeleton-line abstract"/>
                        <div className="skeleton-line abstract"/>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="references-loading">
            <div className="loading-spinner-large"/>
            <div className="loading-text">Searching arXiv papers...</div>
        </div>
    );
} 