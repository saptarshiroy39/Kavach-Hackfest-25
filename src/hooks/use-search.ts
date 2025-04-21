import { useState, useCallback, useEffect } from 'react';

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: 'threat' | 'incident' | 'vulnerability' | 'policy' | 'control' | 'dashboard' | 'setting';
  url?: string;
}

// Mock data for demonstration
const mockData: SearchResult[] = [
  {
    id: '1',
    title: 'Ransomware Attack',
    description: 'Recent ransomware attack affecting multiple systems',
    type: 'threat',
    url: '/security-status'
  },
  {
    id: '2',
    title: 'Data Breach Incident #2023-01',
    description: 'Customer data exposure from cloud misconfiguration',
    type: 'incident',
    url: '/security-status'
  },
  {
    id: '3',
    title: 'SQL Injection Vulnerability',
    description: 'Critical vulnerability in login form',
    type: 'vulnerability',
    url: '/security-status'
  },
  {
    id: '4',
    title: 'Remote Access Policy',
    description: 'Guidelines for secure remote access to company resources',
    type: 'policy',
    url: '/authentication'
  },
  {
    id: '5',
    title: 'Password Rotation Control',
    description: 'Enforcement of quarterly password changes',
    type: 'control',
    url: '/password-vault'
  },
  {
    id: '6',
    title: 'Security Operations Dashboard',
    description: 'Real-time monitoring of security events',
    type: 'dashboard',
    url: '/'
  },
  // Added settings-related items
  {
    id: '7',
    title: 'Theme Settings',
    description: 'Change between light, dark and system theme modes',
    type: 'setting',
    url: '/settings'
  },
  {
    id: '8',
    title: 'Account Settings',
    description: 'Manage your account profile and preferences',
    type: 'setting',
    url: '/settings'
  },
  {
    id: '9',
    title: 'Security Settings',
    description: 'Configure two-factor authentication and password options',
    type: 'setting',
    url: '/settings'
  },
  {
    id: '10',
    title: 'Notification Settings',
    description: 'Configure alert and notification preferences',
    type: 'setting',
    url: '/settings'
  },
  {
    id: '11',
    title: 'Dark Mode',
    description: 'Switch to dark theme for low-light environments',
    type: 'setting',
    url: '/settings'
  },
  {
    id: '12',
    title: 'Light Mode',
    description: 'Switch to light theme for bright environments',
    type: 'setting',
    url: '/settings'
  },
  {
    id: '13',
    title: 'Language Settings',
    description: 'Change the application language',
    type: 'setting',
    url: '/settings'
  },
  {
    id: '14',
    title: 'Sign Out',
    description: 'Log out from your account',
    type: 'setting',
    url: '/settings'
  }
];

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Simulating search with a delay to mimic API call
  const performSearch = useCallback(async (term: string) => {
    setIsSearching(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!term) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    // Filter mock data based on search term with improved matching
    const results = mockData.filter(item => 
      item.title.toLowerCase().includes(term.toLowerCase()) || 
      (item.description && item.description.toLowerCase().includes(term.toLowerCase())) ||
      item.type.toLowerCase().includes(term.toLowerCase())
    );
    
    setSearchResults(results);
    setIsSearching(false);
  }, []);

  // Debounce search to avoid too many searches while typing
  useEffect(() => {
    if (searchTerm) {
      const handler = setTimeout(() => {
        performSearch(searchTerm);
      }, 300);

      return () => {
        clearTimeout(handler);
      };
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchTerm, performSearch]);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    if (term.length > 0) {
      setShowResults(true);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);
  }, []);

  const toggleResults = useCallback((show: boolean) => {
    setShowResults(show);
  }, []);

  return {
    searchTerm,
    searchResults,
    isSearching,
    showResults,
    handleSearchChange,
    clearSearch,
    toggleResults
  };
} 