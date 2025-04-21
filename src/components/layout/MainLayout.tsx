import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  // Add scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex h-screen bg-background/10 backdrop-blur-sm dark:bg-background/20 overflow-hidden">
      <Sidebar />
      <motion.div 
        className="flex flex-col flex-1 overflow-hidden"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
      >
        <Header />
        <AnimatePresence mode="wait">
          <motion.main 
            className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-br from-background/50 to-background/30 backdrop-blur-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, type: "spring", bounce: 0.3 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="glass-card rounded-xl p-4 md:p-6"
            >
              {children}
            </motion.div>
          </motion.main>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MainLayout;
