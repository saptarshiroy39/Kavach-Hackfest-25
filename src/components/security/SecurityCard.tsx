import React from 'react';
import { cn } from '@/lib/utils';
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface SecurityCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  status?: 'secure' | 'warning' | 'danger';
  action?: React.ReactNode;
  enabled?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
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
  ...props
}) => {
  const statusClasses = {
    secure: 'border-l-green-500',
    warning: 'border-l-amber-500',
    danger: 'border-l-red-500',
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

  return (
    <div 
      className={cn(
        "security-card bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer",
        status && `border-l-4 ${statusClasses[status]}`,
        className
      )}
      onClick={handleCardClick}
      {...props}
    >
      <div className="flex items-center justify-between p-4 border-b border-muted">
        <div className="flex items-center">
          {icon && <div className="mr-3 text-primary">{icon}</div>}
          <div>
            {title && <h3 className="font-medium">{title}</h3>}
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        {typeof enabled !== 'undefined' && onToggle && (
          <div className="security-card-toggle" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <Badge variant={enabled ? "default" : "outline"} className={enabled ? "bg-primary text-white" : ""}>
                {enabled ? 'Enabled' : 'Disabled'}
              </Badge>
              <Switch 
                checked={enabled} 
                onCheckedChange={onToggle} 
              />
            </div>
          </div>
        )}
        {action && <div>{action}</div>}
      </div>
      <div className="p-4">
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        {children}
      </div>
    </div>
  );
};

export default SecurityCard;
