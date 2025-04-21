import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, Suspense, lazy } from "react";
import { ThemeProvider } from '@/hooks/use-theme';
import { SearchProvider } from '@/context/SearchContext';
import { LanguageProvider } from '@/hooks/use-language';
import { AnimatePresence } from 'framer-motion';

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

// Lazy-loaded pages
const SignUp = lazy(() => import('./pages/SignUp'));
const PhishingDetection = lazy(() => import('./pages/PhishingDetection'));
const PaymentScanner = lazy(() => import('./pages/PaymentScanner'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

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
          <div className="w-16 h-16 border-t-4 border-security-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading Kavach...</p>
        </div>
      </div>
    );
  }

  return (
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
                        <div className="w-16 h-16 border-t-4 border-security-primary rounded-full animate-spin"></div>
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
                          <Route path="/notifications" element={<Notifications />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/phishing-detection" element={<PhishingDetection />} />
                          <Route path="/payment-scanner" element={<PaymentScanner />} />
                          <Route path="/security-scanner" element={<SecurityScanner />} />
                          {isAdmin && (
                            <Route path="/admin/*" element={<AdminDashboard />} />
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
  );
};

export default App;
