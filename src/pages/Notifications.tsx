
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SecurityCard from '@/components/security/SecurityCard';
import SecurityBadge from '@/components/security/SecurityBadge';
import { mockApi, SecurityEvent } from '@/lib/mockDb';
import { 
  Bell, 
  AlertCircle, 
  CheckCircle2, 
  Settings, 
  Trash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<SecurityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 'security-alerts',
      title: 'Security Alerts',
      description: 'Critical security notifications',
      enabled: true
    },
    {
      id: 'login-attempts',
      title: 'Login Attempts',
      description: 'Notify on successful and failed logins',
      enabled: true
    },
    {
      id: 'password-changes',
      title: 'Password Changes',
      description: 'Notify when passwords are updated',
      enabled: true
    },
    {
      id: 'device-sync',
      title: 'Device Sync',
      description: 'Notify when a new device is added',
      enabled: true
    },
    {
      id: 'marketing-updates',
      title: 'Marketing Updates',
      description: 'News and feature announcements',
      enabled: false
    }
  ]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const events = await mockApi.getSecurityEvents();
        setNotifications(events);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        toast({
          title: "Error",
          description: "Failed to load notifications. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [toast]);

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notif => ({
      ...notif,
      isRead: true,
    }));
    setNotifications(updatedNotifications);
    toast({
      title: "Notifications updated",
      description: "All notifications marked as read",
    });
  };
  const clearAllNotifications = () => {
    setNotifications([]);
    toast({
      title: "Notifications cleared",
      description: "All notifications have been removed",
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({
      title: "Notification removed",
      description: "The notification has been deleted",
    });
  };
  
  const toggleNotificationSetting = (settingId: string) => {
    setNotificationSettings(prev => 
      prev.map(setting => 
        setting.id === settingId 
          ? { ...setting, enabled: !setting.enabled } 
          : setting
      )
    );
    
    // Find the setting that was toggled
    const setting = notificationSettings.find(s => s.id === settingId);
    if (setting) {
      const newStatus = !setting.enabled ? 'Enabled' : 'Disabled';
      toast({
        title: `${setting.title} ${newStatus}`,
        description: `Notification setting has been ${newStatus.toLowerCase()}`,
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-16 h-16 border-t-4 border-security-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading your notifications...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Stay informed about security events and alerts
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCircle2 className="mr-2 h-4 w-4" /> Mark all as read
            </Button>
            <Button variant="outline" onClick={clearAllNotifications}>
              <Trash className="mr-2 h-4 w-4" /> Clear all
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Button>
          </div>
        </div>

        <SecurityCard
          title="Recent Notifications"
          icon={<Bell className="w-5 h-5 text-security-primary" />}
          subtitle={`${notifications.length} notifications`}
        >
          {notifications.length > 0 ? (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div key={notification.id} className={`py-4 first:pt-0 last:pb-0 ${!notification.isRead ? 'bg-muted/30' : ''}`}>
                  <div className="flex items-start">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      notification.severity === 'high' 
                        ? 'bg-security-danger/10 text-security-danger' 
                        : notification.severity === 'medium'
                        ? 'bg-security-warning/10 text-security-warning'
                        : 'bg-security-secondary/10 text-security-secondary'
                    }`}>
                      {notification.severity === 'high' ? (
                        <AlertCircle className="w-5 h-5" />
                      ) : notification.severity === 'medium' ? (
                        <Bell className="w-5 h-5" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5" />
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{notification.description}</p>
                        <SecurityBadge 
                          status={
                            notification.severity === 'high' 
                              ? 'danger' 
                              : notification.severity === 'medium' 
                              ? 'warning' 
                              : 'secure'
                          }
                          text={notification.severity}
                          className="capitalize"
                        />
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                          <span>{notification.device}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{notification.location}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{new Date(notification.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex mt-3 space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">No notifications</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                You're all caught up! We'll notify you when there's a security event.
              </p>
            </div>
          )}
        </SecurityCard>        <SecurityCard
          title="Notification Settings"
          icon={<Settings className="w-5 h-5 text-security-primary" />}
        >
          <div className="space-y-4">
            {notificationSettings.map(setting => (
              <div 
                key={setting.id} 
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  setting.enabled 
                    ? 'border-muted'
                    : 'border-muted bg-muted/20'
                }`}
              >
                <div>
                  <p className="font-medium">{setting.title}</p>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>                <Button 
                  variant={setting.enabled ? "outline" : "outline"} 
                  size="sm"
                  onClick={() => toggleNotificationSetting(setting.id)}
                  className={setting.enabled 
                    ? "bg-green-500/10 text-green-500 border-green-500/50 hover:bg-green-500/20 hover:text-green-600" 
                    : "bg-red-500/10 text-red-500 border-red-500/50 hover:bg-red-500/20 hover:text-red-600"}
                >
                  {setting.enabled ? "Enabled" : "Disabled"}
                </Button>
              </div>
            ))}
          </div>
        </SecurityCard>
      </div>
    </MainLayout>
  );
};

export default Notifications;
