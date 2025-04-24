import { useState, useEffect, useCallback, useRef, RefObject } from 'react';

interface UseResizableProps {
  sidebarRef: RefObject<HTMLElement>;
  minWidth?: number;
  maxWidth?: number;
  defaultWidth?: number;
  storageKey?: string;
}

export function useResizable({
  sidebarRef,
  minWidth = 180,
  maxWidth = 480,
  defaultWidth = 256,
  storageKey
}: UseResizableProps) {
  // Initialize width from localStorage or use default
  const [width, setWidth] = useState<number>(() => {
    if (storageKey && typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      return saved ? parseInt(saved, 10) : defaultWidth;
    }
    return defaultWidth;
  });
  
  const [isResizing, setIsResizing] = useState(false);
  const initialXRef = useRef(0);
  const initialWidthRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef(0);

  // Handle resize start
  const startResizing = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!sidebarRef.current) return;
    
    // Store initial mouse x position and sidebar width
    initialXRef.current = e.clientX;
    initialWidthRef.current = sidebarRef.current.getBoundingClientRect().width;
    
    setIsResizing(true);
    
    // Add temporary cursor styling to entire document during resize
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.body.classList.add('resize-active');
  }, [sidebarRef]);

  // Handle resize with requestAnimationFrame for smoother performance
  const handleResize = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !sidebarRef.current) return;
      
      const now = Date.now();
      // Throttle updates to prevent excessive rendering
      // Only update every 16ms (roughly 60fps)
      if (now - lastUpdateTimeRef.current < 16) return;
      
      // Cancel any existing animation frame to prevent queuing
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      
      // Use requestAnimationFrame for smoother resizing
      rafIdRef.current = requestAnimationFrame(() => {
        // Calculate the change in position and new width
        const deltaX = e.clientX - initialXRef.current;
        let newWidth = initialWidthRef.current + deltaX;
        
        // Apply constraints
        if (newWidth < minWidth) newWidth = minWidth;
        if (newWidth > maxWidth) newWidth = maxWidth;
        
        // Apply the width directly to the element for immediate feedback
        sidebarRef.current!.style.width = `${newWidth}px`;
        lastUpdateTimeRef.current = now;
      });
    },
    [isResizing, minWidth, maxWidth, sidebarRef]
  );

  // Handle resize end
  const stopResizing = useCallback(() => {
    if (!isResizing || !sidebarRef.current) return;
    
    // Clean up any pending animation frames
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    
    // Update the final width state
    const finalWidth = sidebarRef.current.getBoundingClientRect().width;
    setWidth(finalWidth);
    setIsResizing(false);
    
    // Reset cursor styling
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    document.body.classList.remove('resize-active');
    
    // Save to localStorage if a storage key is provided
    if (storageKey && typeof window !== 'undefined') {
      localStorage.setItem(storageKey, finalWidth.toString());
    }
  }, [isResizing, sidebarRef, storageKey]);

  // Set up event listeners for resize
  useEffect(() => {
    if (isResizing) {
      // Use passive event listeners to improve performance
      window.addEventListener('mousemove', handleResize, { passive: true });
      window.addEventListener('mouseup', stopResizing);
      
      // Prevent user selection during resize
      document.body.classList.add('resize-active');
    } else {
      document.body.classList.remove('resize-active');
    }

    return () => {
      window.removeEventListener('mousemove', handleResize);
      window.removeEventListener('mouseup', stopResizing);
      document.body.classList.remove('resize-active');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      
      // Clean up any pending animation frames
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isResizing, handleResize, stopResizing]);

  // Apply initial width to sidebar only once or when width state changes
  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.style.width = `${width}px`;
    }
  }, [sidebarRef, width]);

  return {
    width,
    isResizing,
    startResizing
  };
}
