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
      
      // Use requestAnimationFrame for smoother resizing
      requestAnimationFrame(() => {
        // Calculate the change in position and new width
        const deltaX = e.clientX - initialXRef.current;
        let newWidth = initialWidthRef.current + deltaX;
        
        // Apply constraints
        if (newWidth < minWidth) newWidth = minWidth;
        if (newWidth > maxWidth) newWidth = maxWidth;
        
        // Apply the width directly to the element for immediate feedback
        sidebarRef.current!.style.width = `${newWidth}px`;
      });
    },
    [isResizing, minWidth, maxWidth, sidebarRef]
  );

  // Handle resize end
  const stopResizing = useCallback(() => {
    if (!sidebarRef.current) return;
    
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
  }, [sidebarRef, storageKey]);

  // Set up event listeners for resize
  useEffect(() => {
    if (isResizing) {
      // Use window listeners to capture mouse movements outside the element
      window.addEventListener('mousemove', handleResize);
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
