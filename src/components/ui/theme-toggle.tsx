import React from 'react';
import { useTheme } from '@/context/ThemeProvider';
import { cn } from '@/lib/utils';
import { Moon, Sun, Monitor } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const toggleOptions: { value: Theme; icon: React.ReactNode; label: string }[] = [
    {
      value: 'system',
      icon: <Monitor size={16} />,
      label: 'System',
    },
    {
      value: 'light',
      icon: <Sun size={16} />,
      label: 'Light',
    },
    {
      value: 'dark',
      icon: <Moon size={16} />,
      label: 'Dark',
    },
  ];

  return (
    <div
      className={cn(
        "flex h-8 items-center gap-1 rounded-md border bg-background/80 p-1 shadow-sm backdrop-blur-sm",
        className
      )}
    >
      {toggleOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => setTheme(option.value)}
          className={cn(
            "inline-flex h-6 w-6 items-center justify-center rounded transition-colors",
            theme === option.value 
              ? "bg-white text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-200" 
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          )}
          title={option.label}
          aria-label={`Switch to ${option.label} theme`}
        >
          {option.icon}
          <span className="sr-only">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
