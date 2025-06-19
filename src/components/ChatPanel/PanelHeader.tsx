import { type ConnectionStatus } from './types';

interface PanelHeaderProps {
    connectionStatus: ConnectionStatus;
}

export function PanelHeader({ connectionStatus }: PanelHeaderProps) {
    const getStatusConfig = () => {
        switch (connectionStatus) {
            case 'connected':
                return {
                    text: 'Ready to assist',
                    subtext: 'AI is online',
                    icon: '✨',
                    className: 'connected',
                    tooltip: 'AI Assistant is connected and ready to help with your academic writing'
                };
            case 'connecting':
                return {
                    text: 'Connecting...',
                    subtext: 'Please wait',
                    icon: '🔄',
                    className: 'connecting',
                    tooltip: 'Establishing connection to AI Assistant'
                };
            case 'disconnected':
                return {
                    text: 'Disconnected',
                    subtext: 'Check connection',
                    icon: '⚠️',
                    className: 'disconnected',
                    tooltip: 'AI Assistant is offline. Please check your internet connection'
                };
            default:
                return {
                    text: 'Unknown',
                    subtext: '',
                    icon: '❓',
                    className: 'unknown',
                    tooltip: 'Connection status unknown'
                };
        }
    };

    const statusConfig = getStatusConfig();

    return (
        <header className="chat-panel-header" role="banner">
            <h2>💬 AI Assistant</h2>
            <div 
                className={`connection-status ${statusConfig.className}`}
                role="status" 
                aria-label={`Connection status: ${statusConfig.text} - ${statusConfig.subtext}`}
                title={statusConfig.tooltip}
            >
                <div 
                    className={`status-indicator ${connectionStatus}`}
                    aria-hidden="true"
                />
                <div className="status-content">
                    <div className="status-main">
                        <span className="status-icon" aria-hidden="true">{statusConfig.icon}</span>
                        <span className="status-text">{statusConfig.text}</span>
                    </div>
                    {statusConfig.subtext && (
                        <div className="status-subtext">{statusConfig.subtext}</div>
                    )}
                </div>
            </div>
        </header>
    );
} 