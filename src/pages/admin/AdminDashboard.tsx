import React, { useEffect } from 'react';
import { Users, ShieldCheck, Server, BellRing } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { cn } from '@/lib/utils';

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  
  useEffect(() => {
    console.log('AdminDashboard component mounted');
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">{t('Admin Dashboard')}</h1>
        <div className="text-sm text-muted-foreground">{t('Last Updated')}: {t('Today at')} 14:30</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card dark:bg-slate-700 border border-border p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="text-lg font-medium text-foreground">{t('Total Users')}</div>
            <Users className="h-6 w-6 text-blue-500 dark:text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-foreground">1,283</div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">{`+5% ${t('From Last Month')}`}</p>
        </div>
        
        <div className="bg-card dark:bg-slate-700 border border-border p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="text-lg font-medium text-foreground">{t('Security Score')}</div>
            <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-3xl font-bold text-foreground">94%</div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">{`+2% ${t('From Last Week')}`}</p>
        </div>
        
        <div className="bg-card dark:bg-slate-700 border border-border p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="text-lg font-medium text-foreground">{t('System Status')}</div>
            <Server className="h-6 w-6 text-blue-500 dark:text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-foreground">{t('Healthy')}</div>
          <p className="text-xs text-muted-foreground mt-1">{t('All Systems Operational')}</p>
        </div>
        
        <div className="bg-card dark:bg-slate-700 border border-border p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="text-lg font-medium text-foreground">{t('Active Alerts')}</div>
            <BellRing className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-foreground">3</div>
          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">{t('Requires Attention')}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
