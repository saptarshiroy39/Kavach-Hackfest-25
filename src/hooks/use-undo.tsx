
import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

type UndoItem<T> = {
  id: string;
  item: T;
  timestamp: number;
  expireTimeout: NodeJS.Timeout;
};

export function useUndo<T>(
  expireTimeMs: number = 5000
) {
  const [deletedItems, setDeletedItems] = useState<UndoItem<T>[]>([]);
  const { toast } = useToast();

  // Clear expired items
  useEffect(() => {
    return () => {
      // Clear any remaining timeouts when component unmounts
      deletedItems.forEach(item => clearTimeout(item.expireTimeout));
    };
  }, [deletedItems]);

  const deleteItem = (id: string, item: T) => {
    // Create a timeout to automatically remove the undo option after expireTimeMs
    const expireTimeout = setTimeout(() => {
      setDeletedItems(prev => prev.filter(item => item.id !== id));
    }, expireTimeMs);

    // Add to deleted items
    setDeletedItems(prev => [
      ...prev,
      { id, item, timestamp: Date.now(), expireTimeout }
    ]);

    // Show toast with undo option
    toast({
      title: "Item deleted",
      description: "The item has been deleted. Click undo to restore it.",
      action: (
        <button
          onClick={() => undoDelete(id)}
          className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md"
        >
          Undo
        </button>
      ),
      duration: expireTimeMs,
    });

    return true;
  };

  const undoDelete = (id: string) => {
    const itemToRestore = deletedItems.find(item => item.id === id);
    
    if (itemToRestore) {
      // Clear the expire timeout
      clearTimeout(itemToRestore.expireTimeout);
      
      // Remove from deleted items
      setDeletedItems(prev => prev.filter(item => item.id !== id));
      
      // Show toast
      toast({
        title: "Item restored",
        description: "The deleted item has been restored.",
      });
      
      return itemToRestore.item;
    }
    
    return null;
  };

  const isDeleted = (id: string) => {
    return deletedItems.some(item => item.id === id);
  };

  // Get all deleted items that haven't expired
  const getDeletedItems = () => {
    return deletedItems.map(item => item.item);
  };

  return {
    deleteItem,
    undoDelete,
    isDeleted,
    getDeletedItems
  };
}
