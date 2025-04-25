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

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, Suspense, lazy } from "react";
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { AppProviders } from '@/context';
import { APP_CONFIG } from '@/config';

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
import ComponentDemo from "./pages/ComponentDemo";

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';

// Lazy-loaded pages
const SignUp = lazy(() => import('./pages/SignUp'));
const PhishingDetection = lazy(() => import('./pages/PhishingDetection'));
const PaymentScanner = lazy(() => import('./pages/PaymentScanner'));
const EncryptedMessaging = lazy(() => import('./pages/EncryptedMessaging'));

/**
 * App Routes Component - Separated from main App component for cleaner structure
 */
const AppRoutes = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  
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
              <Route path={APP_CONFIG.routes.dashboard} element={<Dashboard />} />
              <Route path={APP_CONFIG.routes.passwordVault} element={<PasswordVault />} />
              <Route path={APP_CONFIG.routes.authentication} element={<Authentication />} />
              <Route path={APP_CONFIG.routes.securityStatus} element={<SecurityStatus />} />
              <Route path={APP_CONFIG.routes.blockchainVerify} element={<BlockchainVerify />} />
              <Route path="/security-verification" element={<SecurityVerification />} />
              <Route path={APP_CONFIG.routes.encryptedMessaging} element={<EncryptedMessaging />} />
              <Route path={APP_CONFIG.routes.notifications} element={<Notifications />} />
              <Route path={APP_CONFIG.routes.settings} element={<Settings />} />
              <Route path="/phishing-detection" element={<PhishingDetection />} />
              <Route path="/payment-scanner" element={<PaymentScanner />} />
              <Route path="/security-scanner" element={<SecurityScanner />} />
              <Route path="/component-demo" element={<ComponentDemo />} />
              
              {/* Admin routes with nested structure and top navigation */}
              {isAdmin && (
                <Route path={APP_CONFIG.routes.admin.root} element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              )}
              
              <Route path={APP_CONFIG.routes.login} element={<Navigate to={APP_CONFIG.routes.dashboard} replace />} />
              <Route path={APP_CONFIG.routes.signup} element={<SignUp />} />
              <Route path="*" element={<NotFound />} />
            </>
          ) : (
            <>
              <Route path={APP_CONFIG.routes.login} element={<Login />} />
              <Route path={APP_CONFIG.routes.signup} element={<SignUp />} />
              <Route path="/component-demo" element={<ComponentDemo />} />
              <Route path="*" element={<Login />} />
            </>
          )}
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

/**
 * Main App Component
 */
const App = () => {
  return (
    <ErrorBoundary>
      <AppProviders>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProviders>
    </ErrorBoundary>
  );
};

export default App;
