import { type ToolbarButtonProps } from './types';
import './ToolbarButton.css';

export function ToolbarButton({ 
  onClick, 
  isActive = false, 
  disabled = false, 
  title, 
  children, 
  className = '' 
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`toolbar-button ${isActive ? 'active' : ''} ${className}`.trim()}
    >
      {children}
    </button>
  );
} 