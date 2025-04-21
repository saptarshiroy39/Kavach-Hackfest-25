import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  isSearching: boolean;
  clearSearch: () => void;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'alert' | 'device' | 'threat' | 'user' | 'policy';
  url: string;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // Mock search function - in a real app, this would query your data source
  const performSearch = useCallback((query: string) => {
    setIsSearching(true);
    
    // Simulate API delay
    setTimeout(() => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      
      // Example mock results based on query
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: 'Suspicious Login Alert',
          description: 'Unusual login detected from new location',
          type: 'alert',
          url: '/alerts/1',
        },
        {
          id: '2',
          title: 'IoT Device Vulnerability',
          description: 'Security patch required for connected devices',
          type: 'device',
          url: '/devices/2',
        },
        {
          id: '3',
          title: 'Malware Detection',
          description: 'Potential malware detected on network',
          type: 'threat',
          url: '/threats/3',
        },
        {
          id: '4',
          title: 'Password Policy',
          description: 'Organization password requirements',
          type: 'policy',
          url: '/policies/4',
        },
      ].filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) || 
        result.description.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 300);
  }, []);
  
  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
    performSearch(query);
  }, [performSearch]);
  
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, []);
  
  const value = {
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    searchResults,
    isSearching,
    clearSearch,
  };
  
  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}; 