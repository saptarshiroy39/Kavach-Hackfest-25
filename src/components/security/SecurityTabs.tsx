import React, { useState } from 'react';
import { Shield, AlertTriangle, FileCheck, Code, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SecurityTabsProps {
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
  variant?: 'verification' | 'blockchain';
}

interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const SecurityTabs = ({ 
  defaultTab = 'protection', 
  onTabChange, 
  className,
  variant = 'verification'
}: SecurityTabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const verificationTabs: TabItem[] = [
    {
      id: 'protection',
      label: 'Protection Features',
      icon: <Shield className="h-4 w-4" />
    },
    {
      id: 'verification',
      label: 'Verification Status',
      icon: <FileCheck className="h-4 w-4" />
    }
  ];

  const blockchainTabs: TabItem[] = [
    {
      id: 'verify',
      label: 'Verify',
      icon: <FileCheck className="h-4 w-4" />
    },
    {
      id: 'events',
      label: 'Events',
      icon: <AlertTriangle className="h-4 w-4" />
    },
    {
      id: 'explorer',
      label: 'Explorer',
      icon: <Search className="h-4 w-4" />
    }
  ];

  const tabs = variant === 'verification' ? verificationTabs : blockchainTabs;
  const layoutId = variant === 'verification' ? 'security-tab-underline' : 'blockchain-tab-underline';

  return (
    <div className={cn("relative", className)}>
      <div className="flex overflow-x-auto hide-scrollbar border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.id 
                ? "text-security-primary" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-security-primary via-security-secondary to-security-primary"
                layoutId={layoutId}
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
    </div>
  );
};

interface SecurityTabContentProps {
  children: React.ReactNode;
  activeTab: string;
  className?: string;
}

export const SecurityTabContent = ({ children, activeTab, className }: SecurityTabContentProps) => {
  return (
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
        className={cn("pt-2", className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}; 