import { useState, useCallback, useEffect } from 'react';
import { passwordEntries, securityEvents, securityStatus, users } from '@/lib/mockDb';

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: 'threat' | 'incident' | 'vulnerability' | 'policy' | 'control' | 'dashboard' | 'setting' | 'password' | 'event' | 'user' | 'security';
  url?: string;
}

// Comprehensive project data for search
const mockData: SearchResult[] = [
  // Original entries
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
  },
  
  // Pages
  {
    id: 'page_1',
    title: 'Dashboard',
    description: 'Main dashboard with security overview',
    type: 'dashboard',
    url: '/'
  },
  {
    id: 'page_2',
    title: 'Login',
    description: 'User authentication page',
    type: 'setting',
    url: '/login'
  },
  {
    id: 'page_3',
    title: 'Security Verification',
    description: 'Verify your identity with multiple factors',
    type: 'security',
    url: '/security-verification'
  },
  {
    id: 'page_4',
    title: 'Security Status',
    description: 'Overview of your current security posture',
    type: 'security',
    url: '/security-status'
  },
  {
    id: 'page_5',
    title: 'Sign Up',
    description: 'Create a new account',
    type: 'setting',
    url: '/signup'
  },
  {
    id: 'page_6',
    title: 'Settings',
    description: 'Configure application settings',
    type: 'setting',
    url: '/settings'
  },
  {
    id: 'page_7',
    title: 'Security Scanner',
    description: 'Scan for security vulnerabilities',
    type: 'security',
    url: '/security-scanner'
  },
  {
    id: 'page_8',
    title: 'Payment Scanner',
    description: 'Detect payment fraud and security issues',
    type: 'security',
    url: '/payment-scanner'
  },
  {
    id: 'page_9',
    title: 'Phishing Detection',
    description: 'Detect and prevent phishing attempts',
    type: 'security',
    url: '/phishing-detection'
  },
  {
    id: 'page_10',
    title: 'Notifications',
    description: 'Security alerts and notifications',
    type: 'setting',
    url: '/notifications'
  },
  {
    id: 'page_11',
    title: 'Password Vault',
    description: 'Securely store and manage passwords',
    type: 'password',
    url: '/password-vault'
  },
  {
    id: 'page_12',
    title: 'Blockchain Verification',
    description: 'Verify identity using blockchain',
    type: 'security',
    url: '/blockchain-verify'
  },
  {
    id: 'page_13',
    title: 'Authentication',
    description: 'Multi-factor authentication settings',
    type: 'security',
    url: '/authentication'
  }
];

// Add dynamic data from mockDb
function getDynamicSearchData(): SearchResult[] {
  const results: SearchResult[] = [];
  
  // Add password entries
  passwordEntries.forEach(entry => {
    results.push({
      id: `pwd_${entry.id}`,
      title: entry.title,
      description: `${entry.username} - ${entry.url || 'No URL'}`,
      type: 'password',
      url: '/password-vault'
    });
  });
  
  // Add security events
  securityEvents.forEach(event => {
    results.push({
      id: `evt_${event.id}`,
      title: event.description,
      description: `${event.timestamp} - ${event.severity} severity`,
      type: 'event',
      url: '/notifications'
    });
  });
  
  // Add users
  users.forEach(user => {
    results.push({
      id: `usr_${user.id}`,
      title: user.name,
      description: `${user.email} - ${user.role}`,
      type: 'user',
      url: '/settings'
    });
  });
  
  return results;
}

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Simulating search with a delay to mimic API call
  const performSearch = useCallback(async (term: string) => {
    setIsSearching(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!term) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    // Combine static and dynamic data
    const allSearchData = [...mockData, ...getDynamicSearchData()];
    
    // Filter combined data with improved matching
    const results = allSearchData.filter(item => {
      const searchLower = term.toLowerCase();
      const titleMatch = item.title.toLowerCase().includes(searchLower);
      const descMatch = item.description?.toLowerCase().includes(searchLower) || false;
      const typeMatch = item.type.toLowerCase().includes(searchLower);
      
      return titleMatch || descMatch || typeMatch;
    });
    
    // Sort by relevance - title matches first
    results.sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(term.toLowerCase());
      const bTitle = b.title.toLowerCase().includes(term.toLowerCase());
      
      if (aTitle && !bTitle) return -1;
      if (!aTitle && bTitle) return 1;
      return 0;
    });
    
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