
import React from 'react';
import { cn } from '@/lib/utils';
import { CircleCheck, CircleAlert, AlertCircle } from 'lucide-react';

interface SecurityBadgeProps {
  status: 'secure' | 'warning' | 'danger';
  text?: string;
  showIcon?: boolean;
  className?: string;
}

const SecurityBadge: React.FC<SecurityBadgeProps> = ({
  status,
  text,
  showIcon = true,
  className,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'secure':
        return {
          bg: 'bg-security-secondary/10',
          border: 'border-security-secondary/20',
          text: 'text-security-secondary',
          icon: <CircleCheck className="w-4 h-4" />,
          defaultText: 'Secure',
        };
      case 'warning':
        return {
          bg: 'bg-security-warning/10',
          border: 'border-security-warning/20',
          text: 'text-security-warning',
          icon: <CircleAlert className="w-4 h-4" />,
          defaultText: 'Warning',
        };
      case 'danger':
        return {
          bg: 'bg-security-danger/10',
          border: 'border-security-danger/20',
          text: 'text-security-danger',
          icon: <AlertCircle className="w-4 h-4" />,
          defaultText: 'At Risk',
        };
      default:
        return {
          bg: 'bg-security-secondary/10',
          border: 'border-security-secondary/20',
          text: 'text-security-secondary',
          icon: <CircleCheck className="w-4 h-4" />,
          defaultText: 'Secure',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.bg,
        config.border,
        config.text,
        className
      )}
    >
      {showIcon && <span className="mr-1">{config.icon}</span>}
      <span>{text || config.defaultText}</span>
    </div>
  );
};

export default SecurityBadge;
