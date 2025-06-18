import { type ToolbarGroupProps } from './types';
import './ToolbarGroup.css';

export function ToolbarGroup({ children, className = '' }: ToolbarGroupProps) {
  return (
    <div className={`toolbar-group ${className}`.trim()}>
      {children}
    </div>
  );
} 