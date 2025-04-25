import React, { useState } from 'react';
import { Fingerprint, QrCode, Key, Check, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface AdvancedVerificationProps {
  className?: string;
  onVerificationComplete?: (method: string, success: boolean) => void;
}

export function AdvancedVerification({ className, onVerificationComplete }: AdvancedVerificationProps) {
  const [verificationStep, setVerificationStep] = useState<'initial' | 'in-progress' | 'success' | 'failure'>('initial');
  const [activeMethod, setActiveMethod] = useState<string>('qr-code');
  const [backupCode, setBackupCode] = useState<string>('');
  const { toast } = useToast();

  const handleBiometricVerification = async () => {
    setVerificationStep('in-progress');
    setActiveMethod('biometric');
    
    // Simulate biometric verification
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate for demo
      setVerificationStep(success ? 'success' : 'failure');
      
      if (onVerificationComplete) {
        onVerificationComplete('biometric', success);
      }
      
      toast({
        title: success ? "Biometric verification successful" : "Biometric verification failed",
        description: success 
          ? "Your identity has been verified via biometrics." 
          : "Please try again or use a different verification method.",
        variant: success ? "default" : "destructive",
      });
    }, 2000);
  };

  const handleQRCodeVerification = async () => {
    setVerificationStep('in-progress');
    setActiveMethod('qr-code');
    
    // Simulate QR code scanning
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate for demo
      setVerificationStep(success ? 'success' : 'failure');
      
      if (onVerificationComplete) {
        onVerificationComplete('qr-code', success);
      }
      
      toast({
        title: success ? "QR code verification successful" : "QR code verification failed",
        description: success 
          ? "Your identity has been verified via QR code." 
          : "Please ensure the QR code is valid and try again.",
        variant: success ? "default" : "destructive",
      });
    }, 2500);
  };

  const handleBackupCodeVerification = async () => {
    setVerificationStep('in-progress');
    setActiveMethod('backup-code');
    
    // Simulate backup code verification
    setTimeout(() => {
      // Simple validation - code must be 6+ characters
      const success = backupCode.length >= 6;
      setVerificationStep(success ? 'success' : 'failure');
      
      if (onVerificationComplete) {
        onVerificationComplete('backup-code', success);
      }
      
      toast({
        title: success ? "Backup code verification successful" : "Backup code verification failed",
        description: success 
          ? "Your identity has been verified via backup code." 
          : "Invalid backup code. Please check and try again.",
        variant: success ? "default" : "destructive",
      });
    }, 1500);
  };

  const resetVerification = () => {
    setVerificationStep('initial');
    setBackupCode('');
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fingerprint className="h-5 w-5 text-primary" /> 
          Advanced Security Verification
        </CardTitle>
        <CardDescription>
          Verify your identity using one of the following methods.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="qr-code" onValueChange={value => {
          setActiveMethod(value);
          resetVerification();
        }}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="qr-code" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" /> QR Code
            </TabsTrigger>
            <TabsTrigger value="biometric" className="flex items-center gap-2">
              <Fingerprint className="h-4 w-4" /> Biometric
            </TabsTrigger>
            <TabsTrigger value="backup-code" className="flex items-center gap-2">
              <Key className="h-4 w-4" /> Backup Code
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-4">
            <TabsContent value="qr-code" className="space-y-4">
              <div className="flex flex-col items-center justify-center p-6 border rounded-lg border-muted bg-muted/40">
                {verificationStep === 'initial' && (
                  <div className="text-center">
                    <div className="mb-4 mx-auto w-48 h-48 bg-white p-3 rounded-lg flex items-center justify-center">
                      <QrCode className="w-32 h-32 text-primary/80" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Scan this QR code with your Kavach mobile app to verify your identity.
                    </p>
                  </div>
                )}
                
                {verificationStep === 'in-progress' && activeMethod === 'qr-code' && (
                  <div className="text-center">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mb-4 flex justify-center"
                    >
                      <div className="animate-pulse">
                        <QrCode className="w-16 h-16 text-primary" />
                      </div>
                    </motion.div>
                    <p className="text-sm text-muted-foreground">
                      Scanning QR code...
                    </p>
                  </div>
                )}
                
                {verificationStep === 'success' && activeMethod === 'qr-code' && (
                  <div className="text-center">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mb-4 flex justify-center"
                    >
                      <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                        <Check className="w-10 h-10 text-green-600 dark:text-green-500" />
                      </div>
                    </motion.div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-500">
                      QR Code verification successful!
                    </p>
                  </div>
                )}
                
                {verificationStep === 'failure' && activeMethod === 'qr-code' && (
                  <div className="text-center">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mb-4 flex justify-center"
                    >
                      <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3">
                        <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-500" />
                      </div>
                    </motion.div>
                    <p className="text-sm font-medium text-red-600 dark:text-red-500">
                      QR Code verification failed!
                    </p>
                  </div>
                )}
              </div>
              
              {verificationStep === 'initial' && (
                <Button 
                  className="w-full" 
                  onClick={handleQRCodeVerification}
                >
                  Verify with QR Code
                </Button>
              )}
              
              {(verificationStep === 'success' || verificationStep === 'failure') && (
                <Button 
                  className="w-full" 
                  variant={verificationStep === 'failure' ? 'outline' : 'default'}
                  onClick={resetVerification}
                >
                  {verificationStep === 'failure' ? 'Try Again' : 'Done'}
                </Button>
              )}
            </TabsContent>
            
            <TabsContent value="biometric" className="space-y-4">
              <div className="flex flex-col items-center justify-center p-6 border rounded-lg border-muted bg-muted/40">
                {verificationStep === 'initial' && (
                  <div className="text-center">
                    <div className="mb-4 mx-auto flex justify-center">
                      <Fingerprint className="w-24 h-24 text-primary/80" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Use your device's biometric authentication to verify your identity.
                    </p>
                  </div>
                )}
                
                {verificationStep === 'in-progress' && activeMethod === 'biometric' && (
                  <div className="text-center">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mb-4 flex justify-center"
                    >
                      <div className="animate-pulse">
                        <Fingerprint className="w-16 h-16 text-primary" />
                      </div>
                    </motion.div>
                    <p className="text-sm text-muted-foreground">
                      Verifying biometrics...
                    </p>
                  </div>
                )}
                
                {verificationStep === 'success' && activeMethod === 'biometric' && (
                  <div className="text-center">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mb-4 flex justify-center"
                    >
                      <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                        <Check className="w-10 h-10 text-green-600 dark:text-green-500" />
                      </div>
                    </motion.div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-500">
                      Biometric verification successful!
                    </p>
                  </div>
                )}
                
                {verificationStep === 'failure' && activeMethod === 'biometric' && (
                  <div className="text-center">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mb-4 flex justify-center"
                    >
                      <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3">
                        <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-500" />
                      </div>
                    </motion.div>
                    <p className="text-sm font-medium text-red-600 dark:text-red-500">
                      Biometric verification failed!
                    </p>
                  </div>
                )}
              </div>
              
              {verificationStep === 'initial' && (
                <Button 
                  className="w-full" 
                  onClick={handleBiometricVerification}
                >
                  Verify with Biometrics
                </Button>
              )}
              
              {(verificationStep === 'success' || verificationStep === 'failure') && (
                <Button 
                  className="w-full" 
                  variant={verificationStep === 'failure' ? 'outline' : 'default'}
                  onClick={resetVerification}
                >
                  {verificationStep === 'failure' ? 'Try Again' : 'Done'}
                </Button>
              )}
            </TabsContent>
            
            <TabsContent value="backup-code" className="space-y-4">
              <div className="flex flex-col items-center justify-center p-6 border rounded-lg border-muted bg-muted/40">
                {verificationStep === 'initial' && (
                  <div className="text-center">
                    <div className="mb-4 mx-auto flex justify-center">
                      <Key className="w-16 h-16 text-primary/80" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Enter your backup verification code to confirm your identity.
                    </p>
                    <Input
                      type="text"
                      placeholder="Enter your backup code"
                      value={backupCode}
                      onChange={(e) => setBackupCode(e.target.value)}
                      className="w-full max-w-xs mx-auto"
                    />
                  </div>
                )}
                
                {verificationStep === 'in-progress' && activeMethod === 'backup-code' && (
                  <div className="text-center">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mb-4 flex justify-center"
                    >
                      <div className="animate-pulse">
                        <Key className="w-16 h-16 text-primary" />
                      </div>
                    </motion.div>
                    <p className="text-sm text-muted-foreground">
                      Verifying backup code...
                    </p>
                  </div>
                )}
                
                {verificationStep === 'success' && activeMethod === 'backup-code' && (
                  <div className="text-center">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mb-4 flex justify-center"
                    >
                      <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                        <Check className="w-10 h-10 text-green-600 dark:text-green-500" />
                      </div>
                    </motion.div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-500">
                      Backup code verification successful!
                    </p>
                  </div>
                )}
                
                {verificationStep === 'failure' && activeMethod === 'backup-code' && (
                  <div className="text-center">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mb-4 flex justify-center"
                    >
                      <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3">
                        <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-500" />
                      </div>
                    </motion.div>
                    <p className="text-sm font-medium text-red-600 dark:text-red-500">
                      Backup code verification failed!
                    </p>
                  </div>
                )}
              </div>
              
              {verificationStep === 'initial' && (
                <Button 
                  className="w-full" 
                  onClick={handleBackupCodeVerification}
                  disabled={backupCode.length < 6}
                >
                  Verify with Backup Code
                </Button>
              )}
              
              {(verificationStep === 'success' || verificationStep === 'failure') && (
                <Button 
                  className="w-full" 
                  variant={verificationStep === 'failure' ? 'outline' : 'default'}
                  onClick={resetVerification}
                >
                  {verificationStep === 'failure' ? 'Try Again' : 'Done'}
                </Button>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          Need help? <a href="#" className="text-primary underline-offset-4 hover:underline">Contact support</a>
        </p>
      </CardFooter>
    </Card>
  );
} 