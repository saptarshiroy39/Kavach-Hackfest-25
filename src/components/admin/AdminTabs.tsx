import React, { useState } from 'react';
import { LayoutDashboard, Users, Settings, ActivityIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AdminTabsProps {
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: {
    text: string;
    color: string;
  };
}

export const AdminTabs = ({ defaultTab = 'dashboard', onTabChange, className }: AdminTabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const tabs: TabItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />
    },
    {
      id: 'users',
      label: 'Users',
      icon: <Users className="h-4 w-4" />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      badge: {
        text: 'Admin',
        color: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400'
      }
    },
    {
      id: 'activity',
      label: 'Activity',
      icon: <ActivityIcon className="h-4 w-4" />
    }
  ];

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
            {tab.badge && (
              <span className={cn("inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium", tab.badge.color)}>
                {tab.badge.text}
              </span>
            )}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-security-primary via-security-secondary to-security-primary"
                layoutId="admin-tab-underline"
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

interface AdminTabContentProps {
  children: React.ReactNode;
  activeTab: string;
  className?: string;
}

export const AdminTabContent = ({ children, activeTab, className }: AdminTabContentProps) => {
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