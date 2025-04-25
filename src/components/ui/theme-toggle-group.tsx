import React from 'react';
import { useTheme } from '@/hooks/use-theme';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Sun, Moon, Laptop } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleGroupProps {
  className?: string;
}

export function ThemeToggleGroup({ className }: ThemeToggleGroupProps) {
  const { theme, setTheme } = useTheme();

  return (
    <ToggleGroup
      type="single"
      value={theme}
      onValueChange={(value) => {
        if (value) setTheme(value as 'light' | 'dark' | 'system');
      }}
      className={cn("justify-start", className)}
    >
      <ToggleGroupItem value="light" aria-label="Light theme" className="flex gap-2 items-center">
        <Sun className="h-4 w-4 text-amber-500" />
        <span>Light</span>
      </ToggleGroupItem>
      
      <ToggleGroupItem value="dark" aria-label="Dark theme" className="flex gap-2 items-center">
        <Moon className="h-4 w-4 text-indigo-400" />
        <span>Dark</span>
      </ToggleGroupItem>
      
      <ToggleGroupItem value="system" aria-label="System theme" className="flex gap-2 items-center">
        <Laptop className="h-4 w-4" />
        <span>System</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
} 