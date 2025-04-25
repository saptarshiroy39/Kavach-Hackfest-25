import React, { useState } from 'react';
import { Shield, KeyRound, Cloud, Eye, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SecurityNavProps {
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const SecurityNav = ({
  defaultTab = 'overview',
  onTabChange,
  className
}: SecurityNavProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const tabs: TabItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <Shield className="h-4 w-4" />
    },
    {
      id: 'password-health',
      label: 'Password Health',
      icon: <KeyRound className="h-4 w-4" />
    },
    {
      id: 'dark-web',
      label: 'Dark Web',
      icon: <Cloud className="h-4 w-4" />
    },
    {
      id: 'privacy-report',
      label: 'Privacy Report',
      icon: <Eye className="h-4 w-4" />
    },
    {
      id: 'encrypted-messaging',
      label: 'Encrypted Messaging',
      icon: <MessageSquare className="h-4 w-4" />
    }
  ];

  return (
    <div className={cn("relative rounded-lg border bg-card", className)}>
      <div className="flex flex-wrap border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "relative flex items-center gap-2 px-3 py-3 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary/80 to-primary"
                layoutId="security-nav-underline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  duration: 0.3
                }}
              />
            )}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1]
          }}
          className="p-4"
        >
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Security Overview</h3>
              <p className="text-sm text-muted-foreground">
                View your overall security status and key metrics.
              </p>
              {/* Overview content would go here */}
            </div>
          )}
          {activeTab === 'password-health' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Password Health</h3>
              <p className="text-sm text-muted-foreground">
                Check the strength and security of your saved passwords.
              </p>
              {/* Password Health content would go here */}
            </div>
          )}
          {activeTab === 'dark-web' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dark Web Monitoring</h3>
              <p className="text-sm text-muted-foreground">
                Monitor if your personal information has been exposed on the dark web.
              </p>
              {/* Dark Web content would go here */}
            </div>
          )}
          {activeTab === 'privacy-report' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Privacy Report</h3>
              <p className="text-sm text-muted-foreground">
                Review your privacy settings and potential vulnerabilities.
              </p>
              {/* Privacy Report content would go here */}
            </div>
          )}
          {activeTab === 'encrypted-messaging' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Encrypted Messaging</h3>
              <p className="text-sm text-muted-foreground">
                Send and receive secure, end-to-end encrypted messages.
              </p>
              {/* Encrypted Messaging content would go here */}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}; 