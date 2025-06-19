import { type ConnectionStatus } from './types';

interface PanelHeaderProps {
    connectionStatus: ConnectionStatus;
}

export function PanelHeader({ connectionStatus }: PanelHeaderProps) {
    return (
        <div className="chat-panel-header">
            <h2>💬 AI Assistant</h2>
            <div className="connection-status">
                <div className={`status-indicator ${connectionStatus}`} />
                <span className="status-text">
                    {connectionStatus === 'connected' && 'Connected'}
                    {connectionStatus === 'connecting' && 'Connecting...'}
                    {connectionStatus === 'disconnected' && 'Disconnected'}
                </span>
            </div>
        </div>
    );
} 