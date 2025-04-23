import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Settings, 
  Key, 
  UserCheck, 
  Bell, 
  CircleCheck, 
  Lock, 
  Menu, 
  X,
  LogOut,
  Fingerprint,
  UserCog,
  Users,
  LayoutDashboard,
  ChevronsUpDown,
  Database,
  ServerCog,
  Sliders,
  Shield,
  MessageSquare
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/hooks/use-language';
import { useResizable } from '@/hooks/use-resizable';
import ResizeHandle from '@/components/ResizeHandle';

type SidebarItem = {
  titleKey: string;
  path: string;
  icon: React.ElementType;
  adminOnly?: boolean;
  isNew?: boolean;
};

const Sidebar = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLElement>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminExpanded, setAdminExpanded] = useState(false);
  
  // Initialize resizable functionality
  const { isResizing, startResizing } = useResizable({
    sidebarRef,
    minWidth: 200,
    maxWidth: 400,
    defaultWidth: 256,
    storageKey: 'kavach-sidebar-width'
  });
  
  // Add specific styles for resizing - debugging
  useEffect(() => {
    if (sidebarRef.current) {
      if (isResizing) {
        sidebarRef.current.style.transition = 'none';
        document.body.classList.add('resize-active');
      } else {
        sidebarRef.current.style.transition = 'width 0.2s ease-out';
        document.body.classList.remove('resize-active');
      }
    }
  }, [isResizing]);
  
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
    { titleKey: 'encryptedMessaging', path: '/encrypted-messaging', icon: MessageSquare },
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
        ref={sidebarRef}
        className={cn(
          "flex flex-col h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border",
          !isOpen && (isMobile ? "w-0" : "w-20"),
          isMobile && !isOpen && "hidden",
          isResizing && "select-none",
          !isResizing && "transition-[width] duration-200 ease-out",
          isOpen && isMobile && "w-64" // Only apply fixed width on mobile when open
        )}
        style={{ position: 'relative' }}
      >
        {/* Resizer handle - DIRECT IMPLEMENTATION */}
        {isOpen && !isMobile && (
          <div 
            className="absolute top-0 right-0 h-full w-4 z-50 cursor-col-resize"
            onMouseDown={(e) => {
              e.preventDefault();
              
              if (!sidebarRef.current) return;
              const startWidth = sidebarRef.current.getBoundingClientRect().width;
              const startX = e.clientX;
              
              const onMouseMove = (moveEvent: MouseEvent) => {
                if (!sidebarRef.current) return;
                
                // Calculate new width
                const newWidth = startWidth + (moveEvent.clientX - startX);
                
                // Apply constraints
                const constrainedWidth = Math.max(200, Math.min(400, newWidth));
                
                // Apply width directly
                sidebarRef.current.style.width = `${constrainedWidth}px`;
                document.body.classList.add('resize-active');
              };
              
              const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                document.body.classList.remove('resize-active');
                
                // Save to localStorage
                if (sidebarRef.current) {
                  localStorage.setItem('kavach-sidebar-width', sidebarRef.current.getBoundingClientRect().width.toString());
                }
              };
              
              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);
            }}
          >
            <div className="absolute right-0 top-0 h-full w-1 bg-transparent hover:bg-security-primary/30" />
          </div>
        )}
        <div className="flex items-center justify-center p-6">
          <div className={cn(
            "flex items-center",
            !isOpen && !isMobile && "justify-center"
          )}>
            <svg 
              className="w-8 h-8 text-security-primary animate-shield-glow"
              viewBox="0 0 24 24" 
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill-rule="evenodd" clip-rule="evenodd" d="M3.37752 5.08241C3 5.62028 3 7.21907 3 10.4167V11.9914C3 17.6294 7.23896 20.3655 9.89856 21.5273C10.62 21.8424 10.9807 22 12 22C13.0193 22 13.38 21.8424 14.1014 21.5273C16.761 20.3655 21 17.6294 21 11.9914V10.4167C21 7.21907 21 5.62028 20.6225 5.08241C20.245 4.54454 18.7417 4.02996 15.7351 3.00079L15.1623 2.80472C13.595 2.26824 12.8114 2 12 2C11.1886 2 10.405 2.26824 8.83772 2.80472L8.26491 3.00079C5.25832 4.02996 3.75503 4.54454 3.37752 5.08241ZM10.8613 8.36335L10.7302 8.59849C10.5862 8.85677 10.5142 8.98591 10.402 9.07112C10.2897 9.15633 10.1499 9.18796 9.87035 9.25122L9.61581 9.30881C8.63194 9.53142 8.14001 9.64273 8.02297 10.0191C7.90593 10.3955 8.2413 10.7876 8.91204 11.572L9.08557 11.7749C9.27617 11.9978 9.37147 12.1092 9.41435 12.2471C9.45722 12.385 9.44281 12.5336 9.41399 12.831L9.38776 13.1018C9.28635 14.1482 9.23565 14.6715 9.54206 14.9041C9.84847 15.1367 10.3091 14.9246 11.2303 14.5005L11.4686 14.3907C11.7304 14.2702 11.8613 14.2099 12 14.2099C12.1387 14.2099 12.2696 14.2702 12.5314 14.3907L12.7697 14.5005C13.6909 14.9246 14.1515 15.1367 14.4579 14.9041C14.7644 14.6715 14.7136 14.1482 14.6122 13.1018L14.586 12.831C14.5572 12.5337 14.5428 12.385 14.5857 12.2471C14.6285 12.1092 14.7238 11.9978 14.9144 11.7749L15.088 11.572C15.7587 10.7876 16.0941 10.3955 15.977 10.0191C15.86 9.64273 15.3681 9.53142 14.3842 9.30881L14.1296 9.25122C13.8501 9.18796 13.7103 9.15633 13.598 9.07112C13.4858 8.98592 13.4138 8.85678 13.2698 8.5985L13.1387 8.36335C12.6321 7.45445 12.3787 7 12 7C11.6213 7 11.3679 7.45445 10.8613 8.36335Z" />
            </svg>
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
                !isOpen && !isMobile && "justify-center px-0",
                // Standard styling for all items
              )}
            >
              <item.icon className={cn(
                "w-5 h-5", 
                location.pathname === item.path && "text-security-primary"
              )} />
              {(isOpen || isMobile) && (
                <div className="flex items-center">
                  <span className="ml-3 normal-case tracking-wide">
                    {t(item.titleKey)}
                  </span>
                </div>
              )}
            </Link>
          ))}
          
          {isAdmin && (
            <div className="mt-6">
              <Link
                to="/admin"
                className={cn(
                  "flex items-center px-4 py-3 rounded-lg transition-colors",
                  location.pathname.startsWith('/admin') 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "hover:bg-sidebar-accent/50",
                  !isOpen && !isMobile && "justify-center px-0"
                )}
              >
                <ServerCog className={cn(
                  "w-5 h-5", 
                  location.pathname.startsWith('/admin') && "text-security-primary"
                )} />
                {(isOpen || isMobile) && (
                  <div className="flex items-center justify-between w-full">
                    <span className="ml-3 normal-case font-semibold text-white uppercase tracking-wider">ADMIN</span>
                    <Badge className="bg-red-500 text-xs text-white">Admin</Badge>
                  </div>
                )}
              </Link>
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
