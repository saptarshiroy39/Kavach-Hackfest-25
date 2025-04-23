import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();
  
  // Only show the toggle component after mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    toast({
      title: `Theme Changed`,
      description: `Theme switched to ${newTheme} mode`,
      duration: 2000,
    });
  };

  if (!mounted) {
    // Return a placeholder with the same dimensions to prevent layout shift
    return <div className="p-2 rounded-full w-10 h-10" />;
  }

  // Use resolvedTheme for both the icon and animation for consistency
  const isDark = resolvedTheme === 'dark';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-muted transition-colors overflow-hidden w-10 h-10 flex items-center justify-center">
          <motion.div
            initial={false}
            className="flex items-center justify-center relative w-5 h-5"
          >
            <motion.div
              animate={{ 
                opacity: isDark ? 0 : 1,
                scale: isDark ? 0.5 : 1,
                y: isDark ? -20 : 0
              }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sun className="w-5 h-5" />
            </motion.div>
            
            <motion.div
              animate={{ 
                opacity: isDark ? 1 : 0,
                scale: isDark ? 1 : 0.5,
                y: isDark ? 0 : 20
              }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Moon className="w-5 h-5" />
            </motion.div>
          </motion.div>
          <span className="sr-only">Toggle theme</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-effect dark:bg-sidebar/80 backdrop-blur-xl border-white/10 z-50">
        <DropdownMenuItem 
          onClick={() => handleThemeChange("light")} 
          className="cursor-pointer hover:bg-white/10"
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
          {theme === 'light' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange("dark")} 
          className="cursor-pointer hover:bg-white/10"
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
          {theme === 'dark' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange("system")} 
          className="cursor-pointer hover:bg-white/10"
        >
          <span className="mr-2 h-4 w-4">💻</span>
          <span>System</span>
          {theme === 'system' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
