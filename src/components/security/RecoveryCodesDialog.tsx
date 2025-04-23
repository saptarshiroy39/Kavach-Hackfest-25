import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Key, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockApi } from '@/lib/mockDb';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';

interface RecoveryCodesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RecoveryCodesDialog: React.FC<RecoveryCodesDialogProps> = ({ open, onOpenChange }) => {
  const [codes, setCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();
  
  useEffect(() => {
    if (open) {
      loadRecoveryCodes();
    }
  }, [open]);
  
  const loadRecoveryCodes = async () => {
    setLoading(true);
    try {
      const result = await mockApi.getRecoveryCodes();
      if (result.success && result.codes) {
        setCodes(result.codes);
      } else {
        toast({
          title: t("Failed to load recovery codes"),
          description: t("Could not retrieve your recovery codes."),
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
  
  const copyAllCodes = () => {
    navigator.clipboard.writeText(codes.join('\n'))
      .then(() => {
        toast({
          title: t("Copied to clipboard"),
          description: t("All recovery codes have been copied to your clipboard."),
        });
      })
      .catch(() => {
        toast({
          title: t("Copy failed"),
          description: t("Could not copy to clipboard. Please try again."),
          variant: "destructive",
        });
      });
  };
  
  const downloadCodes = () => {
    const element = document.createElement("a");
    const file = new Blob([codes.join('\n')], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "kavach-recovery-codes.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: t("Download started"),
      description: t("Your recovery codes are being downloaded."),
    });
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-card dark:bg-background/80">
        <DialogHeader>
          <DialogTitle>{t("Recovery Codes")}</DialogTitle>
          <DialogDescription>
            {t("Keep these codes in a safe place. Each code can only be used once.")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-t-2 border-security-primary rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="flex justify-between mb-4">
                <p className="text-sm text-muted-foreground">{t("Save these recovery codes:")}</p>
                <div className="space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={copyAllCodes}
                    className="hover-scale"
                  >
                    <Copy className="h-4 w-4 mr-1" /> {t("Copy")}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={downloadCodes}
                    className="hover-scale"
                  >
                    <Download className="h-4 w-4 mr-1" /> {t("Download")}
                  </Button>
                </div>
              </div>
              
              <motion.div 
                className="grid grid-cols-2 gap-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {codes.map((code, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center p-2 border border-muted rounded-md"
                    variants={itemVariants}
                  >
                    <Key className="h-4 w-4 text-security-primary mr-2" />
                    <code className="font-mono text-sm">{code}</code>
                  </motion.div>
                ))}
              </motion.div>
              
              <div className="mt-4 p-3 bg-muted/30 rounded-md">
                <p className="text-sm text-muted-foreground">
                  <strong>{t("Important:")}</strong> {t("If you lose access to your authentication app and your recovery codes, you'll be locked out of your account.")}
                </p>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="hover-scale">
            {t("Close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecoveryCodesDialog;
