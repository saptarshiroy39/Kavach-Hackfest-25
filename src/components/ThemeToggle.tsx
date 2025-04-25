import React from 'react';
import { Moon, Sun, Laptop } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from '@/hooks/use-theme';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Icons with motion effects
  const iconVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.8,
      rotate: -30 
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.4,
        ease: [0.34, 1.56, 0.64, 1]
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      rotate: 30,
      transition: {
        duration: 0.3,
        ease: [0.34, 1.56, 0.64, 1]
      }
    }
  };

  // Subtle background animation for the button
  const bgVariants = {
    light: {
      background: 'radial-gradient(circle at center, rgba(255, 220, 100, 0.15) 0%, rgba(255, 220, 100, 0) 70%)',
    },
    dark: {
      background: 'radial-gradient(circle at center, rgba(100, 120, 255, 0.15) 0%, rgba(100, 120, 255, 0) 70%)',
    },
    system: {
      background: 'radial-gradient(circle at center, rgba(200, 200, 200, 0.15) 0%, rgba(200, 200, 200, 0) 70%)',
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 rounded-md relative overflow-hidden hover:bg-primary/10 transition-colors duration-300"
        >
          <motion.div
            className="absolute inset-0"
            animate={theme}
            variants={bgVariants}
          />
          <div className="relative w-full h-full flex items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
              {theme === 'light' && (
                <motion.div
                  key="sun"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={iconVariants}
                  className="absolute"
                >
                  <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500" />
                </motion.div>
              )}
              
              {theme === 'dark' && (
                <motion.div
                  key="moon"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={iconVariants}
                  className="absolute"
                >
                  <Moon className="h-[1.2rem] w-[1.2rem] text-indigo-400" />
                </motion.div>
              )}
              
              {theme === 'system' && (
                <motion.div
                  key="system"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={iconVariants}
                  className="absolute"
                >
                  <Laptop className="h-[1.2rem] w-[1.2rem] text-primary" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="animate-zoom-in bg-glass-gradient dark:bg-dark-glass-gradient backdrop-blur-xl border border-white/20 dark:border-white/10">
        <DropdownMenuItem 
          onClick={() => setTheme("light")} 
          className="flex items-center gap-2 cursor-pointer hover:bg-white/30 dark:hover:bg-white/10 transition-colors duration-200"
        >
          <Sun className="h-4 w-4 text-amber-500" />
          <span>Light</span>
          {theme === 'light' && (
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-500"
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")} 
          className="flex items-center gap-2 cursor-pointer hover:bg-white/30 dark:hover:bg-white/10 transition-colors duration-200"
        >
          <Moon className="h-4 w-4 text-indigo-400" />
          <span>Dark</span>
          {theme === 'dark' && (
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400"
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")} 
          className="flex items-center gap-2 cursor-pointer hover:bg-white/30 dark:hover:bg-white/10 transition-colors duration-200"
        >
          <Laptop className="h-4 w-4 text-primary" />
          <span>System</span>
          {theme === 'system' && (
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
            />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ThemeToggle; 