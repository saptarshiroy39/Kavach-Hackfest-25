import React, { useState } from 'react';
import { Shield, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AdvancedSecurityVerificationProps {
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const AdvancedSecurityVerification = ({
  defaultTab = 'protection',
  onTabChange,
  className
}: AdvancedSecurityVerificationProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const tabs: TabItem[] = [
    {
      id: 'protection',
      label: 'Protection Features',
      icon: <Shield className="h-4 w-4" />
    },
    {
      id: 'verification',
      label: 'Verification Status',
      icon: <CheckCircle className="h-4 w-4" />
    }
  ];

  return (
    <div className={cn("relative rounded-lg border bg-card", className)}>
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
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
                layoutId="security-verification-underline"
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
          {activeTab === 'protection' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Protection Features</h3>
              <p className="text-sm text-muted-foreground">
                View and configure advanced security features to protect your account.
              </p>
              {/* Protection features content would go here */}
            </div>
          )}
          {activeTab === 'verification' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Verification Status</h3>
              <p className="text-sm text-muted-foreground">
                Check the status of your security verification and last verified date.
              </p>
              {/* Verification status content would go here */}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}; 