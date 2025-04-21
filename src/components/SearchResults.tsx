import React from 'react';
import { useSearchContext } from '../context/SearchContext';
import { Button } from './ui/button';
import { X } from 'lucide-react';

export function SearchResults() {
  const { searchResults, isSearching, showResults, searchTerm, clearSearch, toggleResults } = useSearchContext();

  if (!showResults) {
    return null;
  }

  return (
    <div className="absolute top-14 right-0 z-50 w-full max-w-md bg-background border rounded-md shadow-lg p-4 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">
          {isSearching ? 'Searching...' : `Results for "${searchTerm}"`}
        </h3>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => toggleResults(false)}
          className="h-7 w-7"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {isSearching ? (
        <div className="flex justify-center p-4">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      ) : searchResults.length > 0 ? (
        <div className="space-y-4">
          {searchResults.map((result, index) => (
            <div key={index} className="p-3 border rounded-md hover:bg-accent transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-muted font-medium">
                    {result.type}
                  </span>
                  <h4 className="font-medium">{result.title}</h4>
                </div>
              </div>
              {result.description && (
                <p className="text-sm text-muted-foreground mt-1">{result.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          <p>No results found for "{searchTerm}"</p>
          <Button 
            variant="link" 
            onClick={clearSearch}
            className="mt-2"
          >
            Clear search
          </Button>
        </div>
      )}
    </div>
  );
} 