import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockApi } from '@/lib/mockDb';
import { useLanguage } from '@/hooks/use-language';

interface UpdateRecoveryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'email' | 'phone';
  currentValue?: string;
}

const UpdateRecoveryDialog: React.FC<UpdateRecoveryDialogProps> = ({ 
  open, 
  onOpenChange, 
  type, 
  currentValue 
}) => {
  const [value, setValue] = useState(currentValue || '');
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const handleUpdate = async () => {
    if (!value) {
      toast({
        title: t(`${type === 'email' ? 'Email' : 'Phone number'} required`),
        description: t(`Please enter a valid ${type === 'email' ? 'email address' : 'phone number'}.`),
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const result = type === 'email' 
        ? await mockApi.updateRecoveryEmail(value)
        : await mockApi.updateRecoveryPhone(value);
      
      if (result.success) {
        toast({
          title: t("Update successful"),
          description: t(`Your recovery ${type} has been updated.`),
        });
        onOpenChange(false);
      } else {
        toast({
          title: t("Update failed"),
          description: t(result.error || `Failed to update your recovery ${type}.`),
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
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-card dark:bg-background/80">
        <DialogHeader>
          <DialogTitle>
            {t(`Update Recovery ${type === 'email' ? 'Email' : 'Phone'}`)}
          </DialogTitle>
          <DialogDescription>
            {type === 'email' 
              ? t('This email will be used to recover your account if you lose access.')
              : t('This phone number will be used to verify your identity during account recovery.')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="recovery-value">
              {t(`${type === 'email' ? 'Recovery Email' : 'Recovery Phone'}`)}
            </Label>
            <div className="relative">
              {type === 'email' ? (
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              ) : (
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              )}
              <Input
                id="recovery-value"
                type={type === 'email' ? 'email' : 'tel'}
                className="pl-10"
                placeholder={type === 'email' ? 'example@domain.com' : '+1 (555) 123-4567'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            {type === 'email' && (
              <p className="text-xs text-muted-foreground">
                {t('Make sure you have access to this email address.')}
              </p>
            )}
            {type === 'phone' && (
              <p className="text-xs text-muted-foreground">
                {t('Enter your full phone number with country code.')}
              </p>
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
            onClick={handleUpdate} 
            disabled={loading}
            className="bg-security-primary hover:bg-security-primary/90 hover-scale"
          >
            {loading ? t('Updating...') : t('Update')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateRecoveryDialog;
