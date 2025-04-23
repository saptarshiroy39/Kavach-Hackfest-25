import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, Sliders } from 'lucide-react';
import Sidebar from '../Sidebar';
import Header from '../Header';
import { useLanguage } from '@/hooks/use-language';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();

  // Admin navigation items
  const adminNavItems = [
    { path: '/admin', title: t('dashboard'), icon: LayoutDashboard },
    { path: '/admin/users', title: t('adminUsers'), icon: Users },
    { path: '/admin/settings', title: t('settings'), icon: Sliders },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        {/* Top Navigation */}
        <div className="bg-card dark:bg-slate-800 border-b border-border">
          <div className="flex items-center px-6 py-2">
            {adminNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center mr-4 py-3 px-4 rounded-lg transition-colors",
                  location.pathname === item.path 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.title}</span>
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">{t('admin')}</span>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-background dark:bg-slate-900">
          <div className="bg-card dark:bg-slate-800 border border-border rounded-xl p-6 shadow-lg">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;