import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockApi } from '@/lib/mockDb';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({ open, onOpenChange }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleChangePassword = async () => {
    if (!currentPassword) {
      toast({
        title: t("Current password required"),
        description: t("Please enter your current password."),
        variant: "destructive",
      });
      return;
    }
    
    if (!newPassword) {
      toast({
        title: t("New password required"),
        description: t("Please enter a new password."),
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: t("Passwords don't match"),
        description: t("New password and confirmation must match."),
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await mockApi.changePassword(currentPassword, newPassword);
      
      if (result.success) {
        toast({
          title: t("Password changed"),
          description: t("Your password has been successfully updated."),
        });
        onOpenChange(false);
        
        // Clear the form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast({
          title: t("Failed to change password"),
          description: t(result.error || "An error occurred when changing your password."),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t("Error"),
        description: t("An unexpected error occurred. Please try again later."),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const passwordStrength = (password: string) => {
    if (!password) return 0;
    if (password.length < 8) return 25;
    if (password.length < 12) return 50;
    if (password.length < 16) return 75;
    return 100;
  };
  
  const getStrengthLabel = (strength: number) => {
    if (strength === 0) return t('Enter a password');
    if (strength <= 25) return t('Weak');
    if (strength <= 50) return t('Fair');
    if (strength <= 75) return t('Good');
    return t('Strong');
  };
  
  const getStrengthColor = (strength: number) => {
    if (strength === 0) return 'bg-gray-200';
    if (strength <= 25) return 'bg-security-danger';
    if (strength <= 50) return 'bg-security-warning';
    if (strength <= 75) return 'bg-security-secondary';
    return 'bg-security-primary';
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-card dark:bg-background/80">
        <DialogHeader>
          <DialogTitle>{t("Change Password")}</DialogTitle>
          <DialogDescription>
            {t("Update your password to keep your account secure.")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">{t("Current Password")}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                id="current-password"
                type={showPassword ? 'text' : 'password'}
                className="pl-10"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-password">{t("New Password")}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                className="pl-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-1">
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${getStrengthColor(passwordStrength(newPassword))}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${passwordStrength(newPassword)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {getStrengthLabel(passwordStrength(newPassword))}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password">{t("Confirm New Password")}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                id="confirm-password"
                type={showPassword ? 'text' : 'password'}
                className="pl-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-security-danger">{t("Passwords don't match")}</p>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            disabled={loading}
            className="hover-scale"
          >
            {t("Cancel")}
          </Button>
          <Button 
            onClick={handleChangePassword} 
            disabled={loading}
            className="bg-security-primary hover:bg-security-primary/90 hover-scale"
          >
            {loading ? t('Updating...') : t('Update Password')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
