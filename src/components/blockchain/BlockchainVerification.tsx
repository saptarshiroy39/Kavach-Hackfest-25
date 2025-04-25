import React, { useState } from 'react';
import { Shield, Clock, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LogicGateDisplay } from './LogicGateDisplay';

interface BlockchainVerificationProps {
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const BlockchainVerification = ({
  defaultTab = 'verify',
  onTabChange,
  className
}: BlockchainVerificationProps) => {
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
      icon: <Shield className="h-4 w-4" />
    },
    {
      id: 'events',
      label: 'Events',
      icon: <Clock className="h-4 w-4" />
    },
    {
      id: 'explorer',
      label: 'Explorer',
      icon: <Search className="h-4 w-4" />
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
                layoutId="blockchain-verification-underline"
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
          {activeTab === 'verify' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Verify Blockchain Data</h3>
              <p className="text-sm text-muted-foreground">
                Verify the integrity of your data against blockchain records.
              </p>
              
              {/* Use the new LogicGateDisplay component */}
              <LogicGateDisplay 
                userName="Tarasankar Kundu"
                userId="23112000041433"
              />
            </div>
          )}
          {activeTab === 'events' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Blockchain Events</h3>
              <p className="text-sm text-muted-foreground">
                View a history of blockchain events related to your account.
              </p>
              {/* Events content would go here */}
            </div>
          )}
          {activeTab === 'explorer' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Blockchain Explorer</h3>
              <p className="text-sm text-muted-foreground">
                Explore blockchain records and transactions.
              </p>
              {/* Explorer content would go here */}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}; 