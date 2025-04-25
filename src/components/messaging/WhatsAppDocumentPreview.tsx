import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Star, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WhatsAppDocumentPreviewProps {
  fileName: string;
  fileSize: number;
  fileType?: string;
  fileUrl?: string;
  timestamp: string;
  onClick?: () => void;
  className?: string;
  isStarred?: boolean;
}

export function WhatsAppDocumentPreview({
  fileName,
  fileSize,
  fileType = 'PDF',
  fileUrl,
  timestamp,
  onClick,
  className,
  isStarred
}: WhatsAppDocumentPreviewProps) {
  // Determine icon color based on file type - using theme colors where possible
  const iconColor = fileType === 'PDF' ? 'text-red-500' : 
                    fileType === 'DOCX' || fileType === 'DOC' ? 'text-blue-500' : 
                    'text-primary'; // Default to primary theme color
  const iconBg = fileType === 'PDF' ? 'bg-red-100 dark:bg-red-900/30' : 
                 fileType === 'DOCX' || fileType === 'DOC' ? 'bg-blue-100 dark:bg-blue-900/30' : 
                 'bg-primary/10';

  return (
    <div 
      className={cn(
        "cursor-pointer relative overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm p-0", // Use card background and border
        className
      )}
      onClick={onClick}
    >
      {/* Document content */} 
      <div className="flex items-center p-3">
        <div className="flex-shrink-0 mr-3">
          <div className={cn("p-1.5 rounded-md", iconBg)}> 
            <FileText className={cn("h-5 w-5", iconColor)} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            {fileName}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round(fileSize / 1024)} KB, {fileType.toUpperCase()} Document
          </p>
        </div>
        {isStarred && (
          <Star className="h-4 w-4 ml-2 fill-yellow-400 text-yellow-500" />
        )}
      </div>
      
      {/* Action buttons - Use theme variants */} 
      <div className="grid grid-cols-2 gap-2 p-2 border-t border-border">
        <Button 
          variant="ghost" 
          className="text-sm h-9 rounded-md text-primary hover:bg-primary/10 justify-center"
          onClick={(e) => {
            e.stopPropagation();
            window.open(fileUrl, '_blank');
          }}
        >
          Open
        </Button>
        <Button 
          variant="ghost" 
          className="text-sm h-9 rounded-md text-primary hover:bg-primary/10 justify-center"
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
      
      {/* Time stamp with delivery indicator */}
      <div className="flex justify-end text-xs pr-3 pb-2 text-muted-foreground">
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