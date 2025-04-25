import React, { useState } from 'react';
import { Lock, ShieldCheck, Fingerprint, Key, Smartphone, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import SecurityCard from './SecurityCard';
import UpdateRecoveryDialog from './UpdateRecoveryDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

interface SecuritySettingsProps {
  currentUser?: {
    hasTwoFactor: boolean;
    hasBiometrics: boolean;
    passwordLastChanged: string;
    recoveryEmail?: string;
    recoveryPhone?: string;
  };
  loading?: boolean;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ 
  currentUser,
  loading = false
}) => {
  const { toast } = useToast();
  const [showUpdateEmailDialog, setShowUpdateEmailDialog] = useState(false);
  const [showUpdatePhoneDialog, setShowUpdatePhoneDialog] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(currentUser?.hasTwoFactor || false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(currentUser?.hasBiometrics || false);
  const [autoLockTime, setAutoLockTime] = useState("5");

  const handleToggleTwoFactor = (checked: boolean) => {
    setTwoFactorEnabled(checked);
    toast({
      title: checked ? "2FA Enabled" : "2FA Disabled",
      description: checked 
        ? "Two-factor authentication has been enabled for your account." 
        : "Two-factor authentication has been disabled for your account.",
      variant: checked ? "default" : "destructive",
    });
  };

  const handleToggleBiometrics = (checked: boolean) => {
    setBiometricsEnabled(checked);
    toast({
      title: checked ? "Biometrics Enabled" : "Biometrics Disabled",
      description: checked 
        ? "Biometric authentication has been enabled for your account." 
        : "Biometric authentication has been disabled for your account.",
      variant: checked ? "default" : "destructive",
    });
  };

  const handleAutoLockChange = (value: string) => {
    setAutoLockTime(value);
    toast({
      title: "Auto-Lock Updated",
      description: value === "0" 
        ? "Auto-lock has been disabled."
        : `Auto-lock set to ${value} minutes of inactivity.`,
    });
  };

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: index => ({ 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.34, 1.56, 0.64, 1]
      }
    })
  };

  if (loading) {
    return (
      <SecurityCard
        title="Security Settings"
        icon={<Lock className="w-5 h-5 text-security-primary" />}
      >
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-6 w-14" />
            </div>
          ))}
        </div>
      </SecurityCard>
    );
  }

  const settingsItems = [
    {
      id: 'password',
      title: 'Change Password',
      subtitle: `Last Changed: ${currentUser?.passwordLastChanged 
        ? new Date(currentUser.passwordLastChanged).toLocaleDateString() 
        : "Never"}`,
      action: (
        <Button 
          variant="outline" 
          className="glass-effect dark:bg-sidebar-accent/30 hover:shadow-button-glow transition-all duration-300"
          onClick={() => setShowChangePasswordDialog(true)}
        >
          Update
        </Button>
      )
    },
    {
      id: 'email',
      title: 'Recovery Email',
      subtitle: (
        <span className="flex items-center">
          {currentUser?.recoveryEmail || "Not set"} 
          {currentUser?.recoveryEmail && <ArrowRight className="h-3 w-3 ml-1" />}
        </span>
      ),
      action: (
        <Button 
          variant="outline" 
          className="glass-effect dark:bg-sidebar-accent/30 hover:shadow-button-glow transition-all duration-300"
          onClick={() => setShowUpdateEmailDialog(true)}
        >
          {currentUser?.recoveryEmail ? "Change" : "Add"}
        </Button>
      )
    },
    {
      id: 'phone',
      title: 'Recovery Phone',
      subtitle: (
        <span className="flex items-center">
          {currentUser?.recoveryPhone || "Not set"}
          {currentUser?.recoveryPhone && <ArrowRight className="h-3 w-3 ml-1" />}
        </span>
      ),
      action: (
        <Button 
          variant="outline" 
          className="glass-effect dark:bg-sidebar-accent/30 hover:shadow-button-glow transition-all duration-300"
          onClick={() => setShowUpdatePhoneDialog(true)}
        >
          {currentUser?.recoveryPhone ? "Change" : "Add"}
        </Button>
      )
    },
    {
      id: '2fa',
      title: '2FA',
      subtitle: '2-Factor Authentication',
      icon: <ShieldCheck className="h-4 w-4 text-security-primary" />,
      action: (
        <Switch 
          checked={twoFactorEnabled} 
          onCheckedChange={handleToggleTwoFactor}
          className="data-[state=checked]:bg-security-primary"
        />
      )
    },
    {
      id: 'biometric',
      title: 'Biometric',
      subtitle: 'Fingerprint is Added',
      icon: <Fingerprint className="h-4 w-4 text-security-primary" />,
      action: (
        <Switch 
          checked={biometricsEnabled} 
          onCheckedChange={handleToggleBiometrics} 
          className="data-[state=checked]:bg-security-primary"
        />
      )
    },
    {
      id: 'autolock',
      title: 'Auto-Lock',
      subtitle: 'Lock app after inactivity',
      icon: <Key className="h-4 w-4 text-security-primary" />,
      action: (
        <Select value={autoLockTime} onValueChange={handleAutoLockChange}>
          <SelectTrigger className="w-[120px] glass-effect dark:bg-sidebar-accent/30">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent className="glass-effect dark:bg-sidebar-accent/80 border-white/10 z-50 bg-blur-background dark:bg-blur-background-dark backdrop-blur-xl animate-slide-up-fade">
            <SelectItem value="1">1 minute</SelectItem>
            <SelectItem value="5">5 minutes</SelectItem>
            <SelectItem value="15">15 minutes</SelectItem>
            <SelectItem value="30">30 minutes</SelectItem>
            <SelectItem value="0">Never</SelectItem>
          </SelectContent>
        </Select>
      )
    },
    {
      id: 'login-alerts',
      title: 'Login Alerts',
      subtitle: 'Get notified about new sign-ins',
      icon: <Smartphone className="h-4 w-4 text-security-primary" />,
      action: (
        <Switch defaultChecked className="data-[state=checked]:bg-security-primary" />
      )
    }
  ];

  return (
    <>
      <SecurityCard
        title="Security Settings"
        icon={<Lock className="w-5 h-5 text-security-primary" />}
      >
        <div className="space-y-4">
          {settingsItems.map((item, index) => (
            <motion.div 
              key={item.id}
              className="flex items-center justify-between px-2 py-3 hover:bg-white/20 dark:hover:bg-white/5 rounded-md transition-colors duration-200"
              custom={index}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              <div className={`flex ${item.icon ? 'items-center gap-2' : ''}`}>
                {item.icon}
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                </div>
              </div>
              {item.action}
            </motion.div>
          ))}
        </div>
      </SecurityCard>

      {/* Recovery Email Dialog */}
      <UpdateRecoveryDialog
        open={showUpdateEmailDialog}
        onOpenChange={setShowUpdateEmailDialog}
        type="email"
        initialValue={currentUser?.recoveryEmail || ""}
      />

      {/* Recovery Phone Dialog */}
      <UpdateRecoveryDialog
        open={showUpdatePhoneDialog}
        onOpenChange={setShowUpdatePhoneDialog}
        type="phone"
        initialValue={currentUser?.recoveryPhone || ""}
      />
    </>
  );
};

export default SecuritySettings; 