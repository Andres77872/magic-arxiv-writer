interface PanelHeaderProps {
    papersCount: number;
}

export function PanelHeader({papersCount}: PanelHeaderProps) {
    return (
        <div className="panel-header">
            <h2>📚 References</h2>
            <div className="panel-stats">
                <div className="stat-badge">
                    <span className="stat-value">{papersCount}</span>
                    <span>papers found</span>
                </div>
            </div>
        </div>
    );
} 