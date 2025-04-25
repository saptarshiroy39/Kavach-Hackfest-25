import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, ImageIcon, Video, AudioLines, Play, Download, Star, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WhatsAppMediaPreviewProps {
  fileName: string;
  fileSize: number;
  fileType: 'image' | 'video' | 'audio' | 'document';
  fileUrl?: string;
  timestamp: string;
  onClick?: () => void;
  className?: string;
  isStarred?: boolean;
}

export function WhatsAppMediaPreview({
  fileName,
  fileSize,
  fileType,
  fileUrl,
  timestamp,
  onClick,
  className,
  isStarred
}: WhatsAppMediaPreviewProps) {
  return (
    <div 
      className={cn(
        "cursor-pointer relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-md",
        className
      )}
      onClick={onClick}
    >
      {/* File header with file name and time */}
      <div className="flex items-center p-4 border-b border-zinc-100 dark:border-zinc-700">
        <div className="flex-shrink-0 mr-4">
          <div className={cn(
            "p-1 rounded-sm text-white",
            fileType === 'document' ? "bg-red-500" : 
            fileType === 'image' ? "bg-blue-500" : 
            fileType === 'video' ? "bg-purple-500" : 
            "bg-green-500"
          )}>
            {fileType === 'document' && <FileText className="h-5 w-5" />}
            {fileType === 'image' && <ImageIcon className="h-5 w-5" />}
            {fileType === 'video' && <Video className="h-5 w-5" />}
            {fileType === 'audio' && <AudioLines className="h-5 w-5" />}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            {fileName}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {Math.round(fileSize / 1024)} KB, {fileType.charAt(0).toUpperCase() + fileType.slice(1)}
          </p>
        </div>
        {isStarred && (
          <Star className="h-4 w-4 ml-2 fill-yellow-500 text-yellow-500" />
        )}
      </div>
      
      {/* Content preview based on file type */}
      {fileType === 'image' && fileUrl && (
        <div className="p-2 flex items-center justify-center bg-black/5">
          <img 
            src={fileUrl} 
            alt={fileName} 
            className="max-h-48 object-contain rounded"
          />
        </div>
      )}
      
      {fileType === 'video' && fileUrl && (
        <div className="p-2 relative">
          <div className="relative bg-black rounded overflow-hidden">
            <video 
              src={fileUrl}
              className="w-full max-h-48 object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <Play className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {fileType === 'audio' && (
        <div className="p-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Play className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="h-1 bg-gray-300/30 dark:bg-gray-600/30 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-primary/70 rounded-full"></div>
              </div>
            </div>
            <span className="text-xs text-zinc-500">0:42</span>
          </div>
        </div>
      )}
      
      {/* Timestamp with clock icon */}
      <div className="flex justify-end pr-3 pt-1 pb-1">
        <span className="flex items-center text-xs text-zinc-500 dark:text-zinc-400">
          <Clock className="h-3 w-3 mr-1" />
          {timestamp}
        </span>
      </div>
      
      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2 p-2 border-t border-zinc-100 dark:border-zinc-700">
        <Button 
          variant="outline" 
          className="text-sm h-9 rounded-md"
          onClick={(e) => {
            e.stopPropagation();
            window.open(fileUrl, '_blank');
          }}
        >
          Open
        </Button>
        <Button 
          variant="outline" 
          className="text-sm h-9 rounded-md"
          onClick={(e) => {
            e.stopPropagation();
            if (fileUrl) {
              const a = document.createElement('a');
              a.href = fileUrl;
              a.download = fileName;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }
          }}
        >
          Save as...
        </Button>
      </div>
      
      {/* Time stamp with delivery indicator - second display */}
      <div className="flex justify-end text-xs pr-3 pb-2 text-zinc-500 dark:text-zinc-400">
        <span className="flex items-center">
          {timestamp} 
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-3 w-3">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
      </div>
    </div>
  );
} 