// Add ErrorBoundary at the top of your App component to catch rendering errors
import { Component, ErrorInfo, ReactNode } from 'react';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("React Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full bg-card p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-destructive mb-4">Something went wrong</h2>
            <p className="text-card-foreground mb-4">
              An error occurred while rendering the application.
            </p>
            <pre className="bg-muted p-2 rounded text-sm overflow-auto mb-4">
              {this.state.error?.message || 'Unknown error'}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, Suspense, lazy } from "react";
import { ThemeProvider } from '@/context/ThemeProvider';
import { SearchProvider } from '@/context/SearchContext';
import { LanguageProvider } from '@/hooks/use-language';
import { AnimatePresence } from 'framer-motion';

// Layouts
import AdminLayout from './components/layout/admin/AdminLayout';

// Pages
import Dashboard from "./pages/Dashboard";
import PasswordVault from "./pages/PasswordVault";
import Authentication from "./pages/Authentication";
import SecurityStatus from "./pages/SecurityStatus";
import BlockchainVerify from "./pages/BlockchainVerify";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import SecurityScanner from "./pages/SecurityScanner";
import SecurityVerification from "./pages/SecurityVerification";

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';

// Lazy-loaded pages
const SignUp = lazy(() => import('./pages/SignUp'));
const PhishingDetection = lazy(() => import('./pages/PhishingDetection'));
const PaymentScanner = lazy(() => import('./pages/PaymentScanner'));
const EncryptedMessaging = lazy(() => import('./pages/EncryptedMessaging'));

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Auth check
  useEffect(() => {
    const checkAuth = () => {
      // In a real app, this would check for a valid token
      const token = localStorage.getItem('auth-token');
      const userRole = localStorage.getItem('user-role');
      
      console.log('Auth check:', { token, userRole });
      
      if (token) {
        setIsAuthenticated(true);
        setIsAdmin(userRole === 'admin');
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      setIsLoading(false);
    };
    
    checkAuth();
    
    // Add an event listener for storage changes to detect login/logout in other tabs
    window.addEventListener('storage', checkAuth);
    
    // Add custom event listener for immediate auth updates
    window.addEventListener('auth-state-changed', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-state-changed', checkAuth);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading Kavach...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system">
        <LanguageProvider>
          <QueryClientProvider client={queryClient}>
            <SearchProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AnimatePresence mode="wait">
                    <Suspense fallback={
                      <div className="min-h-screen flex items-center justify-center bg-background">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 border-t-4 border-primary rounded-full animate-spin"></div>
                          <p className="mt-4 text-muted-foreground">Loading...</p>
                        </div>
                      </div>
                    }>
                      <Routes>
                        {isAuthenticated ? (
                          <>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/password-vault" element={<PasswordVault />} />
                            <Route path="/authentication" element={<Authentication />} />
                            <Route path="/security-status" element={<SecurityStatus />} />
                            <Route path="/blockchain-verify" element={<BlockchainVerify />} />
                            <Route path="/security-verification" element={<SecurityVerification />} />
                            <Route path="/encrypted-messaging" element={<EncryptedMessaging />} />
                            <Route path="/notifications" element={<Notifications />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/phishing-detection" element={<PhishingDetection />} />
                            <Route path="/payment-scanner" element={<PaymentScanner />} />
                            <Route path="/security-scanner" element={<SecurityScanner />} />
                            
                            {/* Admin routes with nested structure and top navigation */}
                            {isAdmin && (
                              <Route path="/admin" element={<AdminLayout />}>
                                <Route index element={<AdminDashboard />} />
                                <Route path="users" element={<AdminUsers />} />
                                <Route path="settings" element={<AdminSettings />} />
                              </Route>
                            )}
                            
                            <Route path="/login" element={<Navigate to="/" replace />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="*" element={<NotFound />} />
                          </>
                        ) : (
                          <>
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="*" element={<Login />} />
                          </>
                        )}
                      </Routes>
                    </Suspense>
                  </AnimatePresence>
                </BrowserRouter>
              </TooltipProvider>
            </SearchProvider>
          </QueryClientProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
