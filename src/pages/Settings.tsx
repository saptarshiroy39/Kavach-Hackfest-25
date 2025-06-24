import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import SecurityCard from '@/components/security/SecurityCard';
import { 
  Settings as SettingsIcon,
  User,
  Lock,
  Bell,
  Database,
  Monitor,
  Download,
  Smartphone,
  Globe,
  Moon,
  LogOut,
  Shield,
  Save,
  Plus,
  Laptop
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { currentUser } from '@/lib/mockDb';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { ThemeToggleGroup } from '@/components/ui/theme-toggle-group';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage, Language, languageNames } from '@/hooks/use-language';

const Settings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([
    { id: 1, name: 'Windows PC', type: 'desktop', status: 'active', lastActive: 'current' },
    { id: 2, name: 'iPhone 13', type: 'mobile', status: 'inactive', lastActive: '1 hour ago' },
    { id: 3, name: 'MacBook Pro', type: 'laptop', status: 'inactive', lastActive: '3 days ago' }
  ]);

  const handleExportUserData = () => {
    const userData = {
      profile: {
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
        createdAt: currentUser.createdAt,
        lastLogin: currentUser.lastLogin,
        role: currentUser.role,
        subscriptionTier: currentUser.subscriptionTier,
      },
      security: {
        hasTwoFactor: currentUser.hasTwoFactor,
        hasBiometrics: currentUser.hasBiometrics,
        passwordLastChanged: currentUser.passwordLastChanged,
        securityScore: 87,
        recentActivities: [
          { type: "login", device: "Windows PC", ip: "192.168.1.1", timestamp: new Date().toISOString() },
          { type: "password_change", device: "iPhone 13", ip: "192.168.1.2", timestamp: new Date(Date.now() - 86400000).toISOString() }
        ]
      },
      devices: connectedDevices,
      settings: {
        language: language,
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
        notifications: true,
        autoLock: "5"
      }
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kavach_user_data_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: t("Data Export Successful"),
      description: t("Your data has been downloaded to your device."),
    });
  };

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully",
    });
    setIsEditingProfile(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-role');
    window.dispatchEvent(new Event('auth-state-changed'));
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    setShowDeleteDialog(false);
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-role');
    window.dispatchEvent(new Event('auth-state-changed'));
    toast({
      title: "Account deleted",
      description: "Your account has been deleted successfully",
      variant: "destructive"
    });
    navigate('/login');
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value as Language);
    toast({
      title: "Language changed",
      description: `Language has been changed to ${languageNames[value as Language]}`,
    });
  };

  const handleRemoveDevice = (deviceId) => {
    setConnectedDevices(prevDevices => prevDevices.filter(device => device.id !== deviceId));
    toast({
      title: "Device removed",
      description: "The device has been removed from your account successfully",
    });
  };

  const handleAddDevice = () => {
    const newDevice = {
      id: Date.now(),
      name: 'New Device',
      type: 'laptop',
      status: 'inactive',
      lastActive: 'just added'
    };
    setConnectedDevices(prev => [...prev, newDevice]);
    toast({
      title: "Device added",
      description: "A new device has been added to your account",
      variant: "default"
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: "spring",
        bounce: 0.4
      }
    })
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold">{t('Settings')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('User settings and preferences')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <SecurityCard
                title={t('Account Settings')}
                icon={<User className="w-5 h-5 text-security-primary" />}
              >
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-security-primary text-white flex items-center justify-center text-4xl font-bold">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">{currentUser.name}</h3>
                      <p className="text-muted-foreground">{currentUser.email}</p>
                      <p className="text-sm">
                        <span className="inline-block px-2 py-1 bg-security-primary/10 text-security-primary rounded text-xs font-medium">
                          {currentUser.subscriptionTier.charAt(0).toUpperCase() + currentUser.subscriptionTier.slice(1)} Plan
                        </span>
                      </p>
                      <div className="pt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="glass-effect dark:bg-sidebar-accent/30"
                        >
                          {t('Change Profile Picture')}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 pt-4">
                    <div className="grid gap-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        {t('name')}
                      </label>
                      <input
                        id="name"
                        type="text"
                        className="security-input"
                        defaultValue={currentUser.name}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        {t('email')}
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="security-input"
                        defaultValue={currentUser.email}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        {t('phone')}
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        className="security-input"
                        defaultValue={currentUser.phone}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSave} className="bg-security-primary hover:bg-security-primary/90">
                      <Save className="mr-2 h-4 w-4" />
                      {t('Save Changes')}
                    </Button>
                  </div>
                </div>
              </SecurityCard>
            </motion.div>

            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <SecurityCard
                title={t('Security Settings')}
                icon={<Lock className="w-5 h-5 text-security-primary" />}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t('Change Password')}</p>
                      <p className="text-sm text-muted-foreground">{t('Last Changed')}: {new Date(currentUser.passwordLastChanged).toLocaleDateString()}</p>
                    </div>
                    <Button variant="outline" className="glass-effect dark:bg-sidebar-accent/30">
                      {t('update')}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t('2FA')}</p>
                      <p className="text-sm text-muted-foreground">{t('2-Factor Authentication')}</p>
                    </div>
                    <Switch checked={currentUser.hasTwoFactor} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t('Biometric')}</p>
                      <p className="text-sm text-muted-foreground">{t('Fingerprint is Added')}</p>
                    </div>
                    <Switch checked={currentUser.hasBiometrics} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t('autoLock')}</p>
                      <p className="text-sm text-muted-foreground">{t('autoLockDesc')}</p>
                    </div>
                    <Select defaultValue="5">
                      <SelectTrigger className="w-[120px] glass-effect dark:bg-sidebar-accent/30">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="glass-effect dark:bg-sidebar-accent/80 border-white/10 z-50">
                        <SelectItem value="1">1 {t('minute')}</SelectItem>
                        <SelectItem value="5">5 {t('minutes')}</SelectItem>
                        <SelectItem value="15">15 {t('minutes')}</SelectItem>
                        <SelectItem value="30">30 {t('minutes')}</SelectItem>
                        <SelectItem value="0">{t('never')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t('loginAlerts')}</p>
                      <p className="text-sm text-muted-foreground">{t('loginAlertsDesc')}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </SecurityCard>
            </motion.div>

            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <SecurityCard
                title={t('dataManagement')}
                icon={<Database className="w-5 h-5 text-security-primary" />}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t('exportData')}</p>
                      <p className="text-sm text-muted-foreground">{t('exportDesc')}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="glass-effect dark:bg-sidebar-accent/30"
                      onClick={handleExportUserData}
                    >
                      <Download className="mr-2 h-4 w-4" /> {t('export')}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t('syncFrequency')}</p>
                      <p className="text-sm text-muted-foreground">{t('syncDesc')}</p>
                    </div>
                    <Select defaultValue="auto">
                      <SelectTrigger className="w-[120px] glass-effect dark:bg-sidebar-accent/30">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="glass-effect dark:bg-sidebar-accent/80 border-white/10 z-50">
                        <SelectItem value="auto">{t('automatic')}</SelectItem>
                        <SelectItem value="15">{t('every')} 15m</SelectItem>
                        <SelectItem value="30">{t('every')} 30m</SelectItem>
                        <SelectItem value="60">{t('every')} {t('hour')}</SelectItem>
                        <SelectItem value="manual">{t('manual')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t('clearData')}</p>
                      <p className="text-sm text-muted-foreground">{t('clearDataDesc')}</p>
                    </div>
                    <Button variant="outline" className="text-security-danger glass-effect dark:bg-sidebar-accent/30">
                      {t('clearData')}
                    </Button>
                  </div>
                </div>
              </SecurityCard>
            </motion.div>
          </div>          <div className="grid grid-rows-3 gap-6 h-fit">
            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="h-full"
            >
              <SecurityCard
                title={t('Application Settings')}
                icon={<SettingsIcon className="w-5 h-5 text-security-primary" />}
                className="h-full"
              >
                <div className="space-y-4 h-full flex flex-col">
                  <div className="flex flex-col space-y-2">
                    <h4 className="font-medium mb-1">{t('Theme Mode')}</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      {t('Choose your preferred theme for the application')}
                    </p>
                    <div className="flex items-center">
                      <ThemeToggleGroup />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center">
                      <Bell className="w-4 h-4 mr-2" />
                      <span>{t('notifications')}</span>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      <span>{t('Language')}</span>
                    </div>
                    <Select 
                      value={language} 
                      onValueChange={handleLanguageChange}
                    >
                      <SelectTrigger className="w-[110px] glass-effect dark:bg-sidebar-accent/30">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="glass-effect dark:bg-sidebar-accent/80 border-white/10 z-50">
                        <SelectItem value="en">{languageNames.en}</SelectItem>
                        <SelectItem value="es">{languageNames.es}</SelectItem>
                        <SelectItem value="fr">{languageNames.fr}</SelectItem>
                        <SelectItem value="de">{languageNames.de}</SelectItem>
                        <SelectItem value="ja">{languageNames.ja}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SecurityCard>
            </motion.div>

            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="h-full"
            >
              <SecurityCard
                title={t('Connected Devices')}
                icon={<Smartphone className="w-5 h-5 text-security-primary" />}
                className="h-full"
              >
                <div className="space-y-4 h-full flex flex-col">
                  <div className="flex-1 space-y-4">
                    {connectedDevices.map(device => (
                      <motion.div 
                        key={device.id}
                        className="p-3 border border-muted rounded-lg glass-effect dark:bg-sidebar-accent/10"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {device.type === 'desktop' ? (
                              <Monitor className="w-5 h-5 text-security-primary mr-2" />
                            ) : device.type === 'laptop' ? (
                              <Laptop className="w-5 h-5 text-security-primary mr-2" />
                            ) : (
                              <Smartphone className="w-5 h-5 text-security-primary mr-2" />
                            )}
                            <div>
                              <p className="text-sm font-medium">{device.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {device.lastActive === 'current' ? t('currentDevice') : `Last active: ${device.lastActive}`}
                              </p>
                            </div>
                          </div>
                          {device.lastActive === 'current' ? (
                            <Button variant="outline" size="sm" disabled className="glass-effect dark:bg-sidebar-accent/30">
                              {t('active')}
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="glass-effect dark:bg-sidebar-accent/30"
                              onClick={() => handleRemoveDevice(device.id)}
                            >
                              {t('remove')}
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-auto glass-effect dark:bg-sidebar-accent/30"
                    onClick={handleAddDevice}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Device
                  </Button>
                </div>
              </SecurityCard>
            </motion.div>

            <motion.div
              custom={5}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="h-full"
            >
              <SecurityCard
                title={t('accountManagement')}
                icon={<User className="w-5 h-5 text-security-primary" />}
                className="h-full"
              >
                <div className="space-y-4 h-full flex flex-col">
                  <motion.div 
                    className="p-3 border border-security-secondary/20 bg-security-secondary/5 rounded-lg glass-effect dark:bg-sidebar-accent/10 flex-1"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className="flex items-start h-full">
                      <Shield className="w-5 h-5 text-security-secondary mt-0.5 mr-3" />
                      <div className="flex flex-col h-full">
                        <p className="font-medium">{t('premiumPlan')}</p>
                        <p className="text-sm text-muted-foreground mb-auto">{t('planRenews')}</p>
                        <Button variant="outline" size="sm" className="mt-2 glass-effect dark:bg-sidebar-accent/30">
                          {t('manageSubscription')}
                        </Button>
                      </div>
                    </div>
                  </motion.div>

                  <div className="space-y-2">
                    <Button 
                      className="w-full glass-effect dark:bg-sidebar-accent/30" 
                      variant="outline"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {t('signOut')}
                    </Button>

                    <Button 
                      className="w-full text-security-danger glass-effect dark:bg-sidebar-accent/30" 
                      variant="outline"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      {t('deleteAccount')}
                    </Button>
                  </div>
                </div>
              </SecurityCard>
            </motion.div>
          </div>
        </div>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md glass-effect dark:bg-sidebar/90">
          <DialogHeader>
            <DialogTitle>{t('deleteAccount')}</DialogTitle>
            <DialogDescription>
              {t('deleteConfirm')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              {t('cancel')}
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              className="bg-security-danger hover:bg-security-danger/90"
            >
              {t('deleteAccount')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Settings;
