/**
 * Context Index
 * Central export point for all context providers
 */

// Export all contexts and providers
export { default as AuthContext, AuthProvider, useAuth } from './AuthContext';
export { default as SecurityContext, SecurityProvider, useSecurity } from './SecurityContext';
export { ThemeProvider, useTheme } from './ThemeProvider';
export { SearchProvider, useSearchContext as useSearch } from './SearchContext';
export { BlockchainProvider, useBlockchain } from './BlockchainContext';

// Root provider component that wraps all providers
import React, { ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { AuthProvider } from './AuthContext';
import { SecurityProvider } from './SecurityContext';
import { SearchProvider } from './SearchContext';
import { BlockchainProvider } from './BlockchainContext';
import { LanguageProvider } from '@/hooks/use-language';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a fresh query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export interface AppProvidersProps {
  children: ReactNode;
}

/**
 * AppProviders component that wraps all context providers in the correct order
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="kavach-theme">
      <LanguageProvider>        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <SecurityProvider>
              <BlockchainProvider>
                <SearchProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    {children}
                  </TooltipProvider>
                </SearchProvider>
              </BlockchainProvider>
            </SecurityProvider>
          </AuthProvider>
        </QueryClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}; 