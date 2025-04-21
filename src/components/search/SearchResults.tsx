import React from 'react';
import { Link } from 'react-router-dom';
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
  PieChart
} from 'lucide-react';

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
      return <Settings className="h-4 w-4 text-gray-500" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

const SearchResults: React.FC<SearchResultsProps> = ({
  onResultClick,
}) => {
  const { searchResults, isSearching } = useSearchContext();

  if (isSearching) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50 p-2">
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
          <span className="ml-2 text-sm text-gray-500">Searching...</span>
        </div>
      </div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
        <p className="text-sm text-gray-500">No results found</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
      <ul className="py-2">
        {searchResults.map((result) => (
          <li key={result.id} className="px-3">
            <Link 
              to={result.url || '#'}
              className="flex items-start gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              onClick={onResultClick}
            >
              <div className="flex-shrink-0 mt-1">
                <ResultIcon type={result.type} />
              </div>
              <div>
                <h4 className="text-sm font-medium">{result.title}</h4>
                {result.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{result.description}</p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults; 