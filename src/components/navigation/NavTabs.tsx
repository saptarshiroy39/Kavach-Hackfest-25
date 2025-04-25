import React, { useState } from 'react';
import { Shield, KeyRound, Globe, FileText, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TabSwitcher } from '@/components/ui/tab-switcher';

interface NavTabsProps {
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const NavTabs = ({ 
  defaultTab = 'overview', 
  onTabChange, 
  className
}: NavTabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const tabs = [
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
      icon: <Globe className="h-4 w-4" />
    },
    {
      id: 'privacy-report',
      label: 'Privacy Report',
      icon: <FileText className="h-4 w-4" />
    },
    {
      id: 'encrypted-messaging',
      label: 'Encrypted Messaging',
      icon: <MessageCircle className="h-4 w-4" />
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
        layoutId="nav-tab-underline"
      />
    </div>
  );
};

interface NavTabContentProps {
  children: React.ReactNode;
  activeTab: string;
  className?: string;
}

export const NavTabContent = ({ children, activeTab, className }: NavTabContentProps) => {
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