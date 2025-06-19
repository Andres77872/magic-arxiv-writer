import {type ToolbarGroupProps} from './types';

export function ToolbarGroup({children}: ToolbarGroupProps) {
    return (
        <div className="toolbar-group">
            {children}
        </div>
    );
} 