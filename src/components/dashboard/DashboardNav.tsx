import React, { useState } from 'react';
import { LayoutDashboard, Users, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface DashboardNavProps {
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  isAdmin?: boolean;
  className?: string;
}

interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

export const DashboardNav = ({
  defaultTab = 'dashboard',
  onTabChange,
  isAdmin = false,
  className
}: DashboardNavProps) => {
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
      adminOnly: true
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4" />
    }
  ];

  // Filter tabs based on admin status
  const visibleTabs = tabs.filter(tab => !tab.adminOnly || isAdmin);

  return (
    <div className={cn("relative rounded-lg border bg-card", className)}>
      <div className="flex border-b">
        {visibleTabs.map((tab) => (
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
            {tab.adminOnly && (
              <Badge variant="outline" className="ml-1 bg-primary/10 text-primary text-[10px] px-1.5 py-0 h-4">
                Admin
              </Badge>
            )}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary/80 to-primary"
                layoutId="dashboard-nav-underline"
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
          {activeTab === 'dashboard' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dashboard Overview</h3>
              <p className="text-sm text-muted-foreground">
                View key metrics and platform statistics.
              </p>
              {/* Dashboard content would go here */}
            </div>
          )}
          {activeTab === 'users' && isAdmin && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">User Management</h3>
              <p className="text-sm text-muted-foreground">
                Manage users, permissions, and access control.
              </p>
              {/* Users content would go here */}
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Platform Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure platform settings and preferences.
              </p>
              {/* Settings content would go here */}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}; 