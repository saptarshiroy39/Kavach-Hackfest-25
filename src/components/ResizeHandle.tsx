import React from 'react';
import { cn } from '@/lib/utils';

interface ResizeHandleProps {
  onResize: (e: React.MouseEvent<HTMLDivElement>) => void;
  position?: 'right' | 'left';
  isResizing?: boolean;
  color?: string;
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({
  onResize,
  position = 'right',
  isResizing = false,
  color = 'bg-security-primary/30'
}) => {
  return (
    <div 
      className={cn(
        "absolute h-full w-4 top-0 z-50 opacity-0 hover:opacity-20 transition-opacity duration-200",
        isResizing && "opacity-10",
        position === 'right' ? "right-0" : "left-0"
      )}
      style={{
        cursor: 'col-resize',
        touchAction: 'none'
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onResize(e);
      }}
    >
      <div className={cn(
        "absolute h-full w-1 top-0", 
        position === 'right' ? "left-1/2" : "right-1/2",
        isResizing ? "bg-gray-400/30" : color
      )} />
    </div>
  );
};

export default ResizeHandle;
