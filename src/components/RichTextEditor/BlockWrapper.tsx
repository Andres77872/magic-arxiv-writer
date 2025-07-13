import {type ReactNode, useRef, useState} from 'react';

interface BlockWrapperProps {
    children: ReactNode;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    isDraggable?: boolean;
}

export function BlockWrapper({ 
    children, 
    onDragStart, 
    onDragEnd,
    isDraggable = true 
}: BlockWrapperProps) {
    const [isDragging, setIsDragging] = useState(false);
    const blockRef = useRef<HTMLDivElement>(null);

    const handleDragStart = (e: React.DragEvent) => {
        if (!isDraggable) return;
        
        setIsDragging(true);
        e.dataTransfer.effectAllowed = 'move';
        
        if (onDragStart) {
            onDragStart();
        }
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        if (onDragEnd) {
            onDragEnd();
        }
    };

    return (
        <div 
            ref={blockRef}
            className={`editor-block ${isDragging ? 'is-dragging' : ''}`}
            draggable={false}
        >
            {isDraggable && (
                <div 
                    className="block-handle"
                    draggable
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                />
            )}
            {children}
        </div>
    );
} 