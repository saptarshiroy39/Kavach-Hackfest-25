import React, { useState } from 'react';
import { LayoutDashboard, Users, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { TabSwitcher } from '@/components/ui/tab-switcher';

interface AdminMenuProps {
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
}

export const AdminMenu = ({
  defaultTab = 'dashboard',
  onTabChange,
  className
}: AdminMenuProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />,
      badge: <Badge variant="outline" className="ml-2 bg-red-500 text-white text-xs">Admin</Badge>
    },
    {
      id: 'users',
      label: 'Users',
      icon: <Users className="h-4 w-4" />,
      badge: <Badge variant="outline" className="ml-2 bg-red-500 text-white text-xs">Admin</Badge>
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      badge: <Badge variant="outline" className="ml-2 bg-red-500 text-white text-xs">Admin</Badge>
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
        layoutId="admin-tab-underline"
      />
    </div>
  );
};

interface AdminContentProps {
  children: React.ReactNode;
  activeTab: string;
  className?: string;
}

export const AdminContent = ({ 
  children, 
  activeTab, 
  className 
}: AdminContentProps) => {
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