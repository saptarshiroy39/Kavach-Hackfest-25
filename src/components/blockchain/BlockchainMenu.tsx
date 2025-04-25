import React, { useState } from 'react';
import { CheckCircle, Activity, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BlockchainMenuProps {
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const BlockchainMenu = ({
  defaultTab = 'verify',
  onTabChange,
  className
}: BlockchainMenuProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const tabs: TabItem[] = [
    {
      id: 'verify',
      label: 'Verify',
      icon: <CheckCircle className="h-4 w-4" />
    },
    {
      id: 'events',
      label: 'Events',
      icon: <Activity className="h-4 w-4" />
    },
    {
      id: 'explorer',
      label: 'Explorer',
      icon: <Compass className="h-4 w-4" />
    }
  ];

  return (
    <div className={cn("relative", className)}>
      <div className="flex flex-wrap overflow-x-auto hide-scrollbar border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
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
                layoutId="blockchain-tab-underline"
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

interface BlockchainContentProps {
  children: React.ReactNode;
  activeTab: string;
  className?: string;
}

export const BlockchainContent = ({ 
  children, 
  activeTab, 
  className 
}: BlockchainContentProps) => {
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
        className={cn("pt-4", className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}; 