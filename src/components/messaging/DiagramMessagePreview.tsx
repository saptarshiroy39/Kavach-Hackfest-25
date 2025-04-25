import React from 'react';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface DiagramMessagePreviewProps {
  imgSrc: string;
  fileName: string;
  fileSize: number;
  onClick?: () => void;
  userId?: string;
  className?: string;
  timestamp?: string;
}

export function DiagramMessagePreview({
  imgSrc,
  fileName,
  fileSize,
  onClick,
  userId,
  className,
  timestamp
}: DiagramMessagePreviewProps) {
  return (
    <div 
      className={cn(
        "cursor-pointer relative overflow-hidden rounded-xl bg-white dark:bg-zinc-800 shadow-md border-2 border-zinc-200 dark:border-zinc-700",
        className
      )}
      onClick={onClick}
    >
      {/* Diagram header with padding - top left right p-2 */}
      <div className="px-2 pt-2 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 flex justify-between items-center">
        <div className="text-sm font-medium truncate">{fileName}</div>
        {timestamp && (
          <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400">
            <Clock className="h-3 w-3 mr-1" />
            {timestamp}
          </div>
        )}
      </div>
      
      {/* Diagram container with padding - sides p-2 */}
      <div className="px-2 pt-2">
        <div className="relative w-full rounded-md overflow-hidden bg-white dark:bg-zinc-800 flex items-center justify-center">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <img 
            src={imgSrc} 
            alt={fileName} 
            className="object-contain w-full h-full max-h-[300px] p-2"
          />
        </div>
      </div>
      
      {/* Footer with bottom padding p-3 */}
      <div className="px-2 pb-3 pt-2 bg-zinc-100 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-700 flex justify-between items-center">
        <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[70%]">
          {userId ? `Shared by: ${userId}` : 'Circuit Diagram'}
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          {(fileSize / 1024).toFixed(1)} KB
        </div>
      </div>
    </div>
  );
} 