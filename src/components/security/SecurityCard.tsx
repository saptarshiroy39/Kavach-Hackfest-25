import React from 'react';
import { cn } from '@/lib/utils';
import { CircleCheck, CircleAlert, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface SecurityCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  status?: 'secure' | 'warning' | 'danger';
  action?: React.ReactNode;
  enabled?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
  className?: string;
  animate?: boolean;
  delay?: number;
}

const SecurityCard: React.FC<SecurityCardProps> = ({
  title,
  subtitle,
  description,
  icon,
  status,
  action,
  enabled,
  onToggle,
  onClick,
  className,
  children,
  animate = true,
  delay = 0,
  ...props
}) => {
  const statusClasses = {
    secure: 'border-l-security-secondary',
    warning: 'border-l-security-warning',
    danger: 'border-l-security-danger',
  };

  // Handle card click, but don't trigger when clicking the toggle switch
  const handleCardClick = (e: React.MouseEvent) => {
    // Only trigger the click handler if it's not a click on the toggle switch
    if (
      onClick && 
      !(e.target as HTMLElement).closest('.security-card-toggle')
    ) {
      onClick();
    }
  };

  const cardContent = (
    <div 
      className={cn(
        "security-card relative bg-modern-card dark:bg-modern-card-dark backdrop-blur-xl",
        "rounded-xl shadow-soft hover:shadow-soft-lg",
        "overflow-hidden border border-white/20 dark:border-white/5",
        "transition-all duration-300 ease-in-out",
        "hover:translate-y-[-5px]",
        onClick && "cursor-pointer",
        status && `border-l-4 ${statusClasses[status]}`,
        className
      )}
      onClick={handleCardClick}
      {...props}
    >
      <div className="absolute inset-0 bg-subtle-pattern dark:bg-subtle-pattern-dark opacity-30 pointer-events-none"></div>
      <div className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {icon && (
              <div className="mr-3 text-security-primary dark:text-security-primary">
                {icon}
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold">{title}</h3>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
          {action && (
            <div className="security-card-toggle">
              {action}
            </div>
          )}
          {status && !action && (
            <div className="security-card-status">
              {status === 'secure' && <CircleCheck className="w-5 h-5 text-security-secondary" />}
              {status === 'warning' && <CircleAlert className="w-5 h-5 text-security-warning" />}
              {status === 'danger' && <AlertCircle className="w-5 h-5 text-security-danger" />}
            </div>
          )}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
        )}
        {children}
      </div>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.4,
          delay: delay * 0.1,
          ease: [0.34, 1.56, 0.64, 1]
        }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
};

export default SecurityCard;
