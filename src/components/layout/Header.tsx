import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Search, User, X, Settings, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from "@/components/ui/theme-toggle";
import SearchResults from '@/components/search/SearchResults';
import { useSearchContext } from '@/context/SearchContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { currentUser } from '@/lib/mockDb';
import { useLanguage } from '@/hooks/use-language';
import md5 from 'md5';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ModernSearch } from '@/components/ui/modern-search';

const Header = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const searchRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const { 
    searchTerm, 
    showResults, 
    handleSearchChange: onSearchChange, 
    clearSearch, 
    toggleResults 
  } = useSearchContext();

  // Handle clicks outside the search area
  useEffect(() => {
    if (!showResults) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        toggleResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showResults, toggleResults]);

  // Generate search suggestions based on search term
  const getSearchSuggestions = () => {
    if (!searchTerm) return [];
    
    // Mock suggestions - in a real app, these could come from an API
    const suggestions = [
      { id: '1', text: 'Security Status', type: 'Page' },
      { id: '2', text: 'Password Vault', type: 'Page' },
      { id: '3', text: 'Encrypted Messaging', type: 'Page' },
      { id: '4', text: 'Two Factor Authentication', type: 'Setting' },
      { id: '5', text: 'Dark Web Monitoring', type: 'Feature' },
    ].filter(suggestion => 
      suggestion.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return suggestions;
  };

  const handleSearch = (term: string) => {
    setIsSearching(true);
    // Simulate a search delay
    setTimeout(() => {
      toggleResults(term.length > 0);
      setIsSearching(false);
    }, 300);
  };

  const handleSuggestionClick = (suggestion: any) => {
    switch(suggestion.text) {
      case 'Security Status':
        navigate('/security-status');
        break;
      case 'Password Vault':
        navigate('/password-vault');
        break;
      case 'Encrypted Messaging':
        navigate('/messaging');
        break;
      default:
        // For demonstration, we're just setting the search term
        onSearchChange(suggestion.text);
        toggleResults(true);
    }
    
    if (isMobile) {
      setMobileSearchOpen(false);
    }
  };

  // Generate Gravatar URL from email
  const gravatarUrl = currentUser.email 
    ? `https://www.gravatar.com/avatar/${md5(currentUser.email.toLowerCase().trim())}?d=identicon&s=100`
    : undefined;

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-background border-b border-border">
      {!isMobile && (
        <div className="relative w-72" ref={searchRef}>
          <ModernSearch
            mode="inline"
            placeholder={t('Search Kavach...')}
            value={searchTerm}
            onChange={onSearchChange}
            onSearch={handleSearch}
            searching={isSearching}
            suggestions={getSearchSuggestions()}
            onSuggestionClick={handleSuggestionClick}
            clearOnSearch={false}
            wrapperClassName="w-72"
          />
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-1 z-50">
              <SearchResults onResultClick={() => toggleResults(false)} />
            </div>
          )}
        </div>
      )}

      <div className={`flex-1 ${!isMobile ? 'text-center' : 'ml-8'}`}>
        {isMobile && <h1 className="text-xl montserrat-bold truncate">Kavach</h1>}
      </div>

      <div className="flex items-center space-x-4">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setMobileSearchOpen(true)}>
            <Search className="w-5 h-5" />
          </Button>
        )}
        <ThemeToggle />
        <Link to="/notifications" className="relative p-2 rounded-full hover:bg-muted transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-security-danger rounded-full"></span>
        </Link>
        <div className="flex items-center space-x-3">
          <div className="hidden md:block text-right">
            <div className="text-sm font-medium">{currentUser.name}</div>
            <div className="text-xs text-muted-foreground capitalize">{currentUser.subscriptionTier}</div>
          </div>
          <Link to="/settings" aria-label={t('profileSettings')}>
            <Avatar className="cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-security-primary transition-all">
              <AvatarImage src={gravatarUrl} alt={currentUser.name} />
              <AvatarFallback className="bg-security-primary text-white">
                {currentUser.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>

      {/* Mobile Search Dialog */}
      {isMobile && (
        <Dialog open={mobileSearchOpen} onOpenChange={setMobileSearchOpen}>
          <DialogContent className="p-0 gap-0 sm:max-w-lg max-h-[80vh]">
            <div className="p-4 border-b">
              <ModernSearch
                mode="inline"
                autoFocus
                placeholder={t('Search Kavach...')}
                value={searchTerm}
                onChange={onSearchChange}
                onSearch={handleSearch}
                searching={isSearching}
                suggestions={getSearchSuggestions()}
                onSuggestionClick={handleSuggestionClick}
                clearOnSearch={false}
                wrapperClassName="w-full"
                variant="default"
              />
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {searchTerm ? (
                <SearchResults onResultClick={() => {
                  setMobileSearchOpen(false);
                  clearSearch();
                }} />
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  <p>Enter search terms to find content</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </header>
  );
};

export default Header;
