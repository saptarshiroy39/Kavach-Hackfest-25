import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchContext } from '@/context/SearchContext';
import { 
  AlertCircle, 
  HardDrive, 
  Shield, 
  User, 
  FileText, 
  Loader2, 
  Settings,
  Bell,
  Clock,
  PieChart,
  Lock,
  Check,
  Scan,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchResultsProps {
  onResultClick: () => void;
}

const ResultIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'alert':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'device':
      return <HardDrive className="h-4 w-4 text-blue-500" />;
    case 'threat':
      return <Shield className="h-4 w-4 text-orange-500" />;
    case 'user':
      return <User className="h-4 w-4 text-green-500" />;
    case 'policy':
      return <FileText className="h-4 w-4 text-purple-500" />;
    case 'incident':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'vulnerability':
      return <Shield className="h-4 w-4 text-red-500" />;
    case 'control':
      return <Clock className="h-4 w-4 text-blue-500" />;
    case 'dashboard':
      return <PieChart className="h-4 w-4 text-indigo-500" />;
    case 'setting':
      return <Settings className="h-4 w-4 text-security-primary" />;
    case 'password':
      return <Lock className="h-4 w-4 text-yellow-500" />;
    case 'event':
      return <Bell className="h-4 w-4 text-purple-500" />;
    case 'security':
      return <Scan className="h-4 w-4 text-security-primary" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

const SearchResults: React.FC<SearchResultsProps> = ({
  onResultClick,
}) => {
  const { searchResults, isSearching, clearSearch, searchTerm } = useSearchContext();
  const navigate = useNavigate();

  if (isSearching) {
    return (
      <div className="bg-sidebar rounded-md shadow-lg border border-sidebar-border p-6 text-center">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-security-primary" />
        <p className="text-sm text-sidebar-foreground">Searching...</p>
      </div>
    );
  }

  if (searchResults.length === 0 && searchTerm) {
    return (
      <div className="bg-sidebar rounded-md shadow-lg border border-sidebar-border p-6 text-center">
        <p className="text-sidebar-foreground mb-2">No results found for "{searchTerm}"</p>
        <button 
          onClick={clearSearch}
          className="text-sm text-security-primary hover:underline"
        >
          Clear search
        </button>
      </div>
    );
  }

  const handleResultClick = (url: string) => {
    onResultClick();
    clearSearch();
    navigate(url);
  };

  return (
    <div className="bg-sidebar rounded-md shadow-lg border border-sidebar-border overflow-hidden">
      <div className="px-4 py-3 border-b border-sidebar-border">
        <p className="text-sm font-medium text-sidebar-foreground">
          {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <ul className="divide-y divide-sidebar-border max-h-[60vh] overflow-y-auto scrollbar-hide">
        {searchResults.map((result, index) => (
          <motion.li 
            key={result.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
          >
            <button 
              onClick={() => handleResultClick(result.url || '/')}
              className="w-full flex items-center gap-3 p-4 hover:bg-sidebar-accent transition-colors text-left"
            >
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center">
                <ResultIcon type={result.type} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate text-sidebar-foreground">{result.title}</h4>
                {result.description && (
                  <p className="text-xs text-sidebar-foreground/70 mt-0.5 truncate">{result.description}</p>
                )}
                <div className="flex items-center mt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-security-primary/20 text-security-primary uppercase font-semibold tracking-wider">
                    {result.type}
                  </span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-security-primary" />
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults; 