import React, { useState } from 'react';
import { Shield, History, FileText } from 'lucide-react';
import { TabSwitcher } from '@/components/ui/tab-switcher';
import { motion, AnimatePresence } from 'framer-motion';

interface BlockchainTabsProps {
  defaultTab?: string;
  onTabChange?: (tab: string) => void;
  className?: string;
}

export function BlockchainTabs({ 
  defaultTab = 'verify',
  onTabChange,
  className 
}: BlockchainTabsProps) {
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
      icon: <Shield className="h-4 w-4" />
    },
    {
      id: 'events',
      label: 'Events',
      icon: <History className="h-4 w-4" />
    },
    {
      id: 'explorer',
      label: 'Explorer',
      icon: <FileText className="h-4 w-4" />
    }
  ];
  
  return (
    <TabSwitcher
      tabs={tabs}
      activeTab={activeTab}
      onChange={handleTabChange}
      variant="outline"
      size="md"
      fullWidth
      className={className}
    />
  );
}

export function BlockchainTabContent({ 
  activeTab, 
  children 
}: { 
  activeTab: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
} 