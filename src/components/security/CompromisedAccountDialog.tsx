import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Lock, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/use-language";

export interface CompromisedAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountDetails: {
    service: string;
    email: string;
    breachDate: string;
    compromisedData: string[];
  };
}

export function CompromisedAccountDialog({
  open,
  onOpenChange,
  accountDetails
}: CompromisedAccountDialogProps) {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);

  const handleResetPassword = async () => {
    if (!newPassword) {
      toast({
        title: t("Password required"),
        description: t("Please enter a new password."),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsPasswordChanged(true);
      toast({
        title: t("Password updated"),
        description: t("Your password has been successfully updated."),
      });
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.34, 1.56, 0.64, 1]
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-modern-card dark:bg-modern-card-dark backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-soft-lg">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <DialogHeader>
            <motion.div variants={itemVariants}>
              <DialogTitle className="text-xl font-semibold text-security-danger dark:text-security-danger flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                {t("Compromised Account Detected")}
              </DialogTitle>
            </motion.div>
            <motion.div variants={itemVariants}>
              <DialogDescription className="text-muted-foreground">
                {t("Your account information was found in a data breach. Please update your password immediately.")}
              </DialogDescription>
            </motion.div>
          </DialogHeader>
          
          <motion.div variants={itemVariants} className="py-4 space-y-4">
            <div className="rounded-lg bg-security-danger/10 border border-security-danger/20 p-4 text-sm">
              <h4 className="font-medium mb-2 text-security-danger">{t("Breach Details")}</h4>
              <ul className="space-y-2">
                <li><span className="font-medium">{t("Service")}:</span> {accountDetails.service}</li>
                <li><span className="font-medium">{t("Email")}:</span> {accountDetails.email}</li>
                <li><span className="font-medium">{t("Date")}:</span> {accountDetails.breachDate}</li>
                <li>
                  <span className="font-medium">{t("Compromised Data")}:</span>
                  <span className="ml-1">{accountDetails.compromisedData.join(", ")}</span>
                </li>
              </ul>
            </div>
            
            {!isPasswordChanged ? (
              <div className="space-y-3">
                <Label htmlFor="new-password">{t("New Password")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="new-password"
                    type="password"
                    className="pl-10"
                    placeholder={t("Enter a strong password")}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("Use a unique password with at least 12 characters including uppercase, lowercase, numbers, and symbols.")}
                </p>
              </div>
            ) : (
              <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                <p className="text-sm">{t("Your password has been successfully updated.")}</p>
              </div>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-200"
              >
                {isPasswordChanged ? t("Close") : t("Remind me later")}
              </Button>
              {!isPasswordChanged && (
                <Button
                  type="button"
                  onClick={handleResetPassword}
                  className="bg-security-primary hover:bg-security-primary/90 transition-all duration-300 hover:shadow-button-glow"
                  disabled={isLoading || !newPassword}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t("Updating...")}
                    </>
                  ) : t("Update Password")}
                </Button>
              )}
            </DialogFooter>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
} 