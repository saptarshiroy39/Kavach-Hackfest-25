import React, { useState, useEffect } from 'react';
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
  Fingerprint,
  UserCog,
  Users,
  LayoutDashboard,
  ChevronsUpDown,
  Database,
  ServerCog,
  Sliders
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/hooks/use-language';

type SidebarItem = {
  titleKey: string;
  path: string;
  icon: React.ElementType;
  adminOnly?: boolean;
};

const Sidebar = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminExpanded, setAdminExpanded] = useState(false);
  
  useEffect(() => {
    // Check if the user is an admin
    const userRole = localStorage.getItem('user-role');
    setIsAdmin(userRole === 'admin');
    
    // Listen for auth state changes
    const handleAuthChange = () => {
      const newUserRole = localStorage.getItem('user-role');
      setIsAdmin(newUserRole === 'admin');
    };
    
    window.addEventListener('auth-state-changed', handleAuthChange);
    return () => window.removeEventListener('auth-state-changed', handleAuthChange);
  }, []);

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
  
  const adminItems: SidebarItem[] = [
    { titleKey: 'adminDashboard', path: '/admin', icon: LayoutDashboard, adminOnly: true },
    { titleKey: 'adminUsers', path: '/admin/users', icon: Users, adminOnly: true },
    { titleKey: 'adminSettings', path: '/admin/settings', icon: Sliders, adminOnly: true },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  const toggleAdminMenu = () => {
    setAdminExpanded(!adminExpanded);
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
                "flex items-center px-4 py-3 rounded-lg transition-colors relative",
                location.pathname === item.path 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "hover:bg-sidebar-accent/50",
                !isOpen && !isMobile && "justify-center px-0"
              )}
            >
              <item.icon className={cn("w-5 h-5", location.pathname === item.path && "text-security-primary")} />
              {(isOpen || isMobile) && (
                <span className="ml-3 normal-case font-medium tracking-wide">{t(item.titleKey)}</span>
              )}
            </Link>
          ))}
          
          {isAdmin && (
            <div className="mt-6">
              <div 
                className={cn(
                  "flex items-center px-4 py-2 mb-2",
                  !isOpen && !isMobile && "justify-center"
                )}
              >
                {(isOpen || isMobile) ? (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <ServerCog className="w-5 h-5 text-security-primary" />
                      <span className="ml-3 text-sm font-semibold uppercase tracking-wider text-security-primary">
                        Admin
                      </span>
                    </div>
                    <button onClick={toggleAdminMenu} className="p-1 rounded hover:bg-sidebar-accent">
                      <ChevronsUpDown className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform", 
                        adminExpanded && "transform rotate-180"
                      )} />
                    </button>
                  </div>
                ) : (
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-security-primary text-xs font-bold text-white">
                    A
                  </span>
                )}
              </div>
              
              <div className={cn(
                "space-y-1",
                !adminExpanded && !isOpen && "hidden",
                !adminExpanded && isOpen && "hidden"
              )}>
                {adminItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-lg transition-colors",
                      location.pathname === item.path 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                        : "hover:bg-sidebar-accent/50",
                      !isOpen && !isMobile && "justify-center px-0",
                      "ml-2"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", location.pathname === item.path && "text-security-primary")} />
                    {(isOpen || isMobile) && (
                      <div className="flex items-center justify-between w-full">
                        <span className="ml-3 normal-case font-medium tracking-wide">{t(item.titleKey)}</span>
                        <span className="ml-auto px-1.5 py-0.5 text-[10px] bg-security-primary text-white rounded font-medium">
                          Admin
                        </span>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
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
            {(isOpen || isMobile) && <span className="ml-3 normal-case tracking-wide">{t('signOut')}</span>}
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
                <div className="text-sm font-medium normal-case tracking-wide">{t('protected')}</div>
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
