import React, { useState } from 'react';
import { CheckSquare, Calendar, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TabSwitcher } from '@/components/ui/tab-switcher';

interface BlockchainVerificationTabsProps {
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const BlockchainVerificationTabs = ({
  defaultTab = 'verify',
  onTabChange,
  className
}: BlockchainVerificationTabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const tabs = [
    {
      id: 'verify',
      label: 'Verify',
      icon: <CheckSquare className="h-4 w-4" />
    },
    {
      id: 'events',
      label: 'Events',
      icon: <Calendar className="h-4 w-4" />
    },
    {
      id: 'explorer',
      label: 'Explorer',
      icon: <Compass className="h-4 w-4" />
    }
  ];

  return (
    <div className={cn("relative", className)}>
      <TabSwitcher
        tabs={tabs}
        activeTab={activeTab}
        onChange={handleTabChange}
        variant="underline"
        size="md"
        fullWidth
        layoutId="blockchain-tab-underline"
      />
    </div>
  );
};

interface BlockchainVerificationContentProps {
  children: React.ReactNode;
  activeTab: string;
  className?: string;
}

export const BlockchainVerificationContent = ({ 
  children, 
  activeTab, 
  className 
}: BlockchainVerificationContentProps) => {
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