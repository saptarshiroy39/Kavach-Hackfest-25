import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

interface TabItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string | React.ReactNode;
  badgeColor?: string;
}

interface TabSwitcherProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'minimal' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  tabClassName?: string;
  layoutId?: string;
}

export function TabSwitcher({
  tabs,
  activeTab,
  onChange,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  tabClassName,
  layoutId = 'tab-indicator'
}: TabSwitcherProps) {
  const { resolvedTheme } = useTheme();
  const isLightTheme = resolvedTheme === 'light';
  
  // Get the active tab index for animation
  const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
  
  // Styles based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          container: 'bg-card/50 backdrop-blur-sm border rounded-lg',
          tabs: 'text-muted-foreground hover:text-foreground',
          active: 'bg-white dark:bg-slate-800 text-foreground',
          indicator: 'bg-primary'
        };
      case 'secondary':
        return {
          container: 'bg-transparent',
          tabs: 'text-muted-foreground hover:text-foreground',
          active: 'text-primary',
          indicator: 'bg-primary'
        };
      case 'outline':
        return {
          container: 'border',
          tabs: 'text-muted-foreground hover:text-foreground',
          active: 'border-b-2 border-primary text-foreground',
          indicator: 'bg-transparent'
        };
      case 'minimal':
        return {
          container: 'bg-transparent',
          tabs: 'text-muted-foreground hover:text-foreground',
          active: 'text-foreground',
          indicator: 'bg-primary'
        };
      case 'underline':
        return {
          container: 'bg-transparent border-b',
          tabs: 'text-muted-foreground hover:text-foreground',
          active: 'text-primary',
          indicator: 'bg-gradient-to-r from-primary via-primary/80 to-primary'
        };
      default:
        return {
          container: 'bg-card/50 backdrop-blur-sm border',
          tabs: 'text-muted-foreground hover:text-foreground',
          active: 'bg-white dark:bg-slate-800 text-foreground',
          indicator: 'bg-primary'
        };
    }
  };
  
  // Styles based on size
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-xs py-1 px-3';
      case 'md':
        return 'text-sm py-2 px-4';
      case 'lg':
        return 'text-base py-3 px-6';
      default:
        return 'text-sm py-2 px-4';
    }
  };
  
  const styles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  
  return (
    <div 
      className={cn(
        'relative overflow-hidden flex', 
        styles.container,
        fullWidth ? 'w-full' : 'inline-flex',
        className
      )}
    >
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'relative flex items-center justify-center gap-2 transition-all duration-300',
            styles.tabs,
            tab.id === activeTab && styles.active,
            sizeStyles,
            fullWidth ? 'flex-1' : '',
            tabClassName
          )}
        >
          {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
          <span>{tab.label}</span>
          
          {tab.badge && (
            typeof tab.badge === 'string' ? (
              <span className={cn(
                'ml-1.5 px-1.5 py-0.5 text-xs font-medium rounded-full',
                tab.badgeColor || 'bg-red-500 text-white'
              )}>
                {tab.badge}
              </span>
            ) : tab.badge
          )}
          
          {tab.id === activeTab && (variant === 'underline' || variant === 'secondary' || variant === 'minimal') && (
            <motion.div
              className={cn("absolute bottom-0 left-0 right-0 h-0.5", styles.indicator)}
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
      
      {/* Animated background for active tab */}
      {variant === 'primary' && (
        <motion.div
          className={`absolute top-0 bottom-0 rounded-md transition-colors ${isLightTheme ? 'bg-white' : 'bg-slate-800'}`}
          initial={false}
          animate={{
            x: activeIndex * (100 / tabs.length) + '%',
            width: 100 / tabs.length + '%'
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </div>
  );
}

// Example component showing how to create a tabbed interface with content
export function TabbedContent({
  tabs,
  defaultTab,
  variant,
  size,
  children,
  className,
  layoutId
}: {
  tabs: TabItem[];
  defaultTab: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'minimal' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  layoutId?: string;
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  return (
    <div className={cn("space-y-4", className)}>
      <TabSwitcher
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant={variant}
        size={size}
        fullWidth
        layoutId={layoutId}
      />
      
      <div className="relative overflow-hidden">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
} 