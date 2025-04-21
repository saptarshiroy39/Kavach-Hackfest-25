
import React from 'react';
import { cn } from '@/lib/utils';

interface SecurityCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  status?: 'secure' | 'warning' | 'danger';
  action?: React.ReactNode;
}

const SecurityCard: React.FC<SecurityCardProps> = ({
  title,
  subtitle,
  icon,
  status,
  action,
  className,
  children,
  ...props
}) => {
  const statusClasses = {
    secure: 'border-l-security-secondary',
    warning: 'border-l-security-warning',
    danger: 'border-l-security-danger',
  };

  return (
    <div 
      className={cn(
        "security-card",
        status && `border-l-4 ${statusClasses[status]}`,
        className
      )}
      {...props}
    >
      {(title || subtitle || icon || action) && (
        <div className="flex items-center justify-between p-4 border-b border-muted">
          <div className="flex items-center">
            {icon && <div className="mr-3">{icon}</div>}
            <div>
              {title && <h3 className="font-medium">{title}</h3>}
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
};

export default SecurityCard;
