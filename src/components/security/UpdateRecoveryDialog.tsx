import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Phone, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface UpdateRecoveryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValue?: string;
  type?: 'email' | 'phone';
}

export function UpdateRecoveryDialog({
  open,
  onOpenChange,
  initialValue = '',
  type = 'email',
}: UpdateRecoveryDialogProps) {
  const { toast } = useToast();
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(type);

  const handleUpdateRecovery = async () => {
    if (!value) {
      toast({
        title: "Validation Error",
        description: `Please enter a valid ${activeTab === 'email' ? 'email address' : 'phone number'}.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Recovery Info Updated",
        description: `Your recovery ${activeTab === 'email' ? 'email' : 'phone'} has been updated successfully.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was an error updating your recovery information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone: string) => {
    return /^\+?[1-9]\d{9,14}$/.test(phone);
  };

  const validateInput = () => {
    if (activeTab === 'email') {
      return isValidEmail(value);
    } else {
      return isValidPhone(value);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.34, 1.56, 0.64, 1],
        staggerChildren: 0.1
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

  const isValid = validateInput();
  const validationIcon = value ? (
    isValid ? (
      <CheckCircle2 className="h-4 w-4 text-security-secondary" />
    ) : (
      <AlertCircle className="h-4 w-4 text-security-danger" />
    )
  ) : null;

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
              <DialogTitle className="text-xl font-semibold text-security-primary dark:text-security-primary">
                Update Recovery Information
              </DialogTitle>
            </motion.div>
            <motion.div variants={itemVariants}>
              <DialogDescription className="text-muted-foreground">
                This information will be used to recover your account if you lose access to it.
              </DialogDescription>
            </motion.div>
          </DialogHeader>
          
          <motion.div variants={itemVariants}>
            <Tabs 
              defaultValue={type} 
              className="w-full mt-4" 
              value={activeTab} 
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-2 bg-muted/50 backdrop-blur-sm">
                <TabsTrigger value="email" className="flex items-center gap-2 data-[state=active]:bg-security-primary/10 data-[state=active]:text-security-primary transition-all duration-300">
                  <Mail className="h-4 w-4" /> Email
                </TabsTrigger>
                <TabsTrigger value="phone" className="flex items-center gap-2 data-[state=active]:bg-security-primary/10 data-[state=active]:text-security-primary transition-all duration-300">
                  <Phone className="h-4 w-4" /> Phone
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="email" className="mt-4 animate-slide-up-fade">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Recovery Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="your-backup@example.com"
                      className="pl-9 pr-9 backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 transition-all duration-200 focus:border-primary/50"
                    />
                    <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {validationIcon}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We'll send a verification code to this email address.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="phone" className="mt-4 animate-slide-up-fade">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Recovery Phone</Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      type="tel"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="+1234567890"
                      className="pl-9 pr-9 backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 transition-all duration-200 focus:border-primary/50"
                    />
                    <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {validationIcon}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We'll send a verification SMS to this phone number.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          <motion.div variants={itemVariants}>
            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-200"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleUpdateRecovery}
                className={`bg-security-primary hover:bg-security-primary/90 transition-all duration-300 ${isValid ? 'hover:shadow-button-glow' : ''}`}
                disabled={isLoading || !isValid}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : "Update"}
              </Button>
            </DialogFooter>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateRecoveryDialog;
