import React from 'react';
import { cn } from '@/lib/utils';

interface LogicGateDisplayProps {
  imageUrl?: string;
  userName?: string;
  userId?: string;
  className?: string;
}

export function LogicGateDisplay({
  imageUrl,
  userName = "User Data",
  userId = "23112000041433",
  className
}: LogicGateDisplayProps) {
  return (
    <div className={cn("border border-border rounded-lg overflow-hidden bg-card shadow-sm", className)}>
      <div className="p-4">
        <div className="relative w-full aspect-[16/9] bg-muted/30 rounded-lg overflow-hidden">
          {/* Logic gate diagram */}
          <div className="absolute inset-0 flex items-center justify-center">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt="Logic Gate Diagram" 
                className="object-contain max-w-full max-h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full">
                <svg 
                  width="240" 
                  height="120" 
                  viewBox="0 0 240 120" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-primary"
                >
                  {/* Default logic gate diagram */}
                  <rect x="20" y="30" width="40" height="30" stroke="currentColor" strokeWidth="2" fill="none" />
                  <rect x="20" y="70" width="40" height="30" stroke="currentColor" strokeWidth="2" fill="none" />
                  <text x="15" y="45" fill="currentColor" fontSize="14">A</text>
                  <text x="15" y="85" fill="currentColor" fontSize="14">B</text>
                  
                  {/* NAND Gate */}
                  <path d="M100 40 L120 40 A30 30 0 0 1 120 80 L100 80 Z" stroke="currentColor" strokeWidth="2" fill="none" />
                  <circle cx="130" cy="60" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                  
                  {/* NOT Gate */}
                  <path d="M180 50 L200 60 L180 70 Z" stroke="currentColor" strokeWidth="2" fill="none" />
                  <circle cx="205" cy="60" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
                  
                  {/* Wires */}
                  <line x1="60" y1="45" x2="100" y2="45" stroke="currentColor" strokeWidth="2" />
                  <line x1="60" y1="85" x2="80" y2="85" stroke="currentColor" strokeWidth="2" />
                  <line x1="80" y1="85" x2="80" y2="75" stroke="currentColor" strokeWidth="2" />
                  <line x1="80" y1="75" x2="100" y2="75" stroke="currentColor" strokeWidth="2" />
                  <line x1="140" y1="60" x2="180" y2="60" stroke="currentColor" strokeWidth="2" />
                  <line x1="210" y1="60" x2="220" y2="60" stroke="currentColor" strokeWidth="2" />
                  
                  {/* Output */}
                  <circle cx="225" cy="60" r="5" stroke="currentColor" strokeWidth="2" fill="currentColor" />
                  <text x="230" y="65" fill="currentColor" fontSize="14">Y</text>
                </svg>
              </div>
            )}
          </div>
          
          {/* Metadata overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-[1px] text-white text-xs py-2">
            <div className="flex justify-between px-4 items-center">
              <div>
                <span className="mr-1 opacity-70">Name:</span>
                <span className="font-medium">{userName}</span>
              </div>
              <div>
                <span className="mr-1 opacity-70">ID:</span>
                <span className="font-medium">{userId}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 