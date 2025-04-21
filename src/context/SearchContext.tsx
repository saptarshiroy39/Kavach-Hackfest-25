import React, { createContext, useContext } from 'react';
import { useSearch, SearchResult } from '../hooks/use-search';

interface SearchContextType {
  searchTerm: string;
  searchResults: SearchResult[];
  isSearching: boolean;
  showResults: boolean;
  handleSearchChange: (term: string) => void;
  clearSearch: () => void;
  toggleResults: (show: boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const searchData = useSearch();

  return (
    <SearchContext.Provider value={searchData}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
}; 