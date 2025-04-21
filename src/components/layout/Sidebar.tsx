import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Shield, 
  Home, 
  Settings, 
  Key, 
  UserCheck, 
  Bell, 
  CircleCheck, 
  Lock, 
  Menu, 
  X,
  Shield as ShieldIcon,
  LogOut,
  Fingerprint
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/hooks/use-language';

type SidebarItem = {
  titleKey: string;
  path: string;
  icon: React.ElementType;
};

const Sidebar = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);
  const navigate = useNavigate();

  const sidebarItems: SidebarItem[] = [
    { titleKey: 'dashboard', path: '/', icon: Home },
    { titleKey: 'passwordVault', path: '/password-vault', icon: Key },
    { titleKey: 'authentication', path: '/authentication', icon: UserCheck },
    { titleKey: 'securityStatus', path: '/security-status', icon: CircleCheck },
    { titleKey: 'blockchainVerify', path: '/blockchain-verify', icon: Shield },
    { titleKey: 'securityVerification', path: '/security-verification', icon: Fingerprint },
    { titleKey: 'notifications', path: '/notifications', icon: Bell },
    { titleKey: 'settings', path: '/settings', icon: Settings },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = () => {
    // Clear authentication data from localStorage
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-role');
    
    // Dispatch event to notify App component about auth state change
    window.dispatchEvent(new Event('auth-state-changed'));
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <>
      {isMobile && (
        <button 
          onClick={toggleSidebar} 
          className="fixed top-4 left-2 z-50 p-1 rounded-md bg-security-primary text-white flex items-center justify-center w-8 h-8"
        >
          {isOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      )}
      
      <aside
        className={cn(
          "flex flex-col h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300",
          isOpen ? "w-64" : isMobile ? "w-0" : "w-20",
          isMobile && !isOpen && "hidden"
        )}
      >
        <div className="flex items-center justify-center p-6">
          <div className={cn(
            "flex items-center",
            !isOpen && !isMobile && "justify-center"
          )}>
            <ShieldIcon className="text-security-primary w-8 h-8 animate-shield-glow" />
            {(isOpen || isMobile) && (
              <div className="ml-3">
                <h1 className="text-xl montserrat-semibold">Kavach</h1>
                <p className="text-xs text-sidebar-foreground/70 montserrat-light"></p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4 overflow-y-auto">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-4 py-3 rounded-lg transition-colors",
                location.pathname === item.path 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "hover:bg-sidebar-accent/50",
                !isOpen && !isMobile && "justify-center px-0"
              )}
            >
              <item.icon className={cn("w-5 h-5", location.pathname === item.path && "text-security-primary")} />
              {(isOpen || isMobile) && <span className="ml-3 normal-case">{t(item.titleKey)}</span>}
            </Link>
          ))}
        </nav>

        <div className="px-4 mb-4">
          <button
            onClick={handleSignOut}
            className={cn(
              "flex w-full items-center px-4 py-3 rounded-lg transition-colors text-red-500 hover:bg-sidebar-accent/50",
              !isOpen && !isMobile && "justify-center px-0"
            )}
          >
            <LogOut className="w-5 h-5" />
            {(isOpen || isMobile) && <span className="ml-3 normal-case">{t('signOut')}</span>}
          </button>
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <div className={cn(
            "flex items-center px-4 py-3",
            !isOpen && !isMobile && "justify-center px-0"
          )}>
            <Lock className="w-5 h-5 text-security-primary" />
            {(isOpen || isMobile) && (
              <div className="ml-3">
                <div className="text-sm font-medium normal-case">{t('protected')}</div>
                <div className="text-xs text-sidebar-foreground/70">{t('lastScan')}: 2h ago</div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
