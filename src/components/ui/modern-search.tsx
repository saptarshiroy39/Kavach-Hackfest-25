import * as React from "react";
import { Search, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "./input";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command";
import { motion, AnimatePresence } from "framer-motion";

export interface SearchSuggestion {
  id: string;
  text: string;
  type?: string;
  icon?: React.ReactNode;
}

export interface ModernSearchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  wrapperClassName?: string;
  iconClassName?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  searching?: boolean;
  suggestions?: SearchSuggestion[];
  onSuggestionClick?: (suggestion: SearchSuggestion) => void;
  placeholder?: string;
  clearOnSearch?: boolean;
  mode?: 'default' | 'command' | 'inline';
  variant?: 'default' | 'condensed' | 'minimal';
}

export const ModernSearch = React.forwardRef<HTMLInputElement, ModernSearchProps>(
  ({ 
    className, 
    wrapperClassName, 
    iconClassName,
    value,
    onChange,
    onSearch,
    searching = false,
    suggestions = [],
    onSuggestionClick,
    placeholder = "Search...",
    clearOnSearch = false,
    mode = 'default',
    variant = 'default',
    ...props 
  }, ref) => {
    const [focused, setFocused] = React.useState(false);
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [commandOpen, setCommandOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
      if (e.target.value.length > 0 && suggestions.length > 0) {
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch(value);
        if (clearOnSearch) onChange('');
        setShowSuggestions(false);
      }
      if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    };

    // Keep handleClear function for internal use but won't display the button
    const handleClear = () => {
      onChange('');
      setShowSuggestions(false);
      if (ref && 'current' in ref && ref.current) {
        ref.current.focus();
      }
    };

    const handleSuggestionClick = (suggestion: SearchSuggestion) => {
      if (onSuggestionClick) {
        onSuggestionClick(suggestion);
      } else {
        onChange(suggestion.text);
        setShowSuggestions(false);
      }
    };

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setShowSuggestions(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    React.useEffect(() => {
      if (mode === 'command') {
        const down = (e: KeyboardEvent) => {
          if (e.key === '/' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            setCommandOpen(true);
          }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
      }
      return () => {};
    }, [mode]);

    // Handle Command+K or Ctrl+K for command mode
    React.useEffect(() => {
      if (mode === 'command') {
        const down = (e: KeyboardEvent) => {
          if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            setCommandOpen(true);
          }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
      }
      return () => {};
    }, [mode]);

    if (mode === 'command') {
      return (
        <>
          <Button
            variant="outline"
            onClick={() => setCommandOpen(true)}
            className={cn(
              "relative w-full justify-start text-sm text-muted-foreground",
              variant === 'condensed' && "h-9 px-3",
              variant === 'minimal' && "h-8 px-2 text-xs",
              wrapperClassName
            )}
          >
            <Search className="mr-2 h-4 w-4" />
            {placeholder}
            <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
          
          <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
            <CommandInput placeholder={placeholder} value={value} onValueChange={onChange} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {suggestions.length > 0 && (
                <CommandGroup heading="Suggestions">
                  {suggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion.id}
                      onSelect={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion.icon || <Search className="mr-2 h-4 w-4" />}
                      <span>{suggestion.text}</span>
                      {suggestion.type && (
                        <span className="ml-auto text-xs text-muted-foreground">{suggestion.type}</span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </CommandDialog>
        </>
      );
    }

    return (
      <div 
        ref={containerRef}
        className={cn(
          "relative transition-all duration-200",
          focused && "ring-2 ring-offset-1 ring-primary/30 rounded-md",
          wrapperClassName
        )}
      >
        <div className="relative">
          <Search 
            className={cn(
              "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10 transition-all",
              variant === 'condensed' && "w-4 h-4 left-2",
              variant === 'minimal' && "w-3 h-3 left-2",
              focused && "text-primary",
              searching && "opacity-0",
              iconClassName
            )} 
          />
          
          {searching && (
            <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 animate-spin text-primary z-10" 
              size={variant === 'minimal' ? 14 : variant === 'condensed' ? 16 : 20} 
            />
          )}
          
          <Input
            ref={ref}
            className={cn(
              "w-full pl-10 pr-10 transition-all duration-200",
              variant === 'condensed' && "h-9 px-8 text-sm rounded-md",
              variant === 'minimal' && "h-8 px-7 text-xs rounded-sm",
              focused && "border-primary/50 shadow-sm shadow-primary/10",
              onSearch ? "pr-8" : "pr-4", // Adjust right padding since we removed the X button
              className
            )}
            type="search"
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...props}
          />
          
          {onSearch && value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 rounded-full hover:bg-primary/10",
                variant === 'minimal' && "h-5 w-5 right-2"
              )}
              onClick={() => {
                onSearch(value);
                if (clearOnSearch) onChange('');
              }}
            >
              <ArrowRight className={cn(
                "text-primary h-4 w-4",
                variant === 'minimal' && "h-3 w-3"
              )} />
            </Button>
          )}
        </div>
        
        {/* Inline Suggestions */}
        {mode === 'inline' && showSuggestions && suggestions.length > 0 && (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                "absolute left-0 right-0 mt-1 z-50 bg-popover text-popover-foreground shadow-md rounded-md overflow-hidden border",
                variant === 'minimal' && "text-xs"
              )}
            >
              <ul className="py-1">
                {suggestions.map((suggestion) => (
                  <li 
                    key={suggestion.id}
                    className="px-3 py-2 hover:bg-muted cursor-pointer flex items-center justify-between"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex items-center">
                      {suggestion.icon || <Search className="mr-2 h-4 w-4 text-muted-foreground" />}
                      <span>{suggestion.text}</span>
                    </div>
                    {suggestion.type && (
                      <span className="text-xs text-muted-foreground">{suggestion.type}</span>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    );
  }
);

ModernSearch.displayName = "ModernSearch";