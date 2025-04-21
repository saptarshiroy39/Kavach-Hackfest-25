import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    return <Button variant="outline" size="icon" className="h-10 w-10 rounded-full glass-effect" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-10 w-10 rounded-full glass-effect border-white/20 dark:border-white/10 hover:scale-105 transition-transform relative"
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: resolvedTheme === 'light' ? 0 : 180 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
            className="relative flex items-center justify-center w-full h-full"
          >
            <Sun className="absolute h-5 w-5 transition-all dark:opacity-0" />
            <Moon className="absolute h-5 w-5 transition-all opacity-0 dark:opacity-100" />
          </motion.div>
          <span className="sr-only">Toggle theme</span>
        </Button>
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
