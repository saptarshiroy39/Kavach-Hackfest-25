import React, { useState } from 'react';
import { LayoutDashboard, Users, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface DashboardTabsProps {
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
  isAdmin?: boolean;
}

interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
  badge?: string;
}

export const DashboardTabs = ({
  defaultTab = 'dashboard',
  onTabChange,
  className,
  isAdmin = false
}: DashboardTabsProps) => {
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
      icon: <Users className="h-4 w-4" />,
      adminOnly: true,
      badge: 'Admin'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      adminOnly: true,
      badge: 'Admin'
    }
  ];

  // Filter tabs based on admin status
  const filteredTabs = tabs.filter(tab => !tab.adminOnly || isAdmin);

  return (
    <div className={cn("relative", className)}>
      <div className="flex overflow-x-auto hide-scrollbar border-b">
        {filteredTabs.map((tab) => (
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
            {tab.badge && (
              <Badge variant="outline" className="ml-1 text-xs py-0 px-1">
                {tab.badge}
              </Badge>
            )}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary/80 to-primary"
                layoutId="dashboard-tab-underline"
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

interface DashboardContentProps {
  children: React.ReactNode;
  activeTab: string;
  className?: string;
}

export const DashboardContent = ({ 
  children, 
  activeTab, 
  className 
}: DashboardContentProps) => {
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