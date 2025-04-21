
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SecurityCard from '@/components/security/SecurityCard';
import { 
  Shield, 
  Fingerprint, 
  Smartphone, 
  Mail, 
  Key,
  QrCode, 
  Scan, 
  Wallet,
  ChevronRight, 
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { mockApi, currentUser } from '@/lib/mockDb';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import ChangePasswordDialog from '@/components/security/ChangePasswordDialog';
import RecoveryCodesDialog from '@/components/security/RecoveryCodesDialog';
import UpdateRecoveryDialog from '@/components/security/UpdateRecoveryDialog';

const Authentication = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(currentUser.hasTwoFactor);
  const [biometricsEnabled, setBiometricsEnabled] = useState(currentUser.hasBiometrics);
  const [blockchainEnabled, setBlockchainEnabled] = useState(currentUser.hasBlockchainVerification);
  
  const [showTwoFactorDialog, setShowTwoFactorDialog] = useState(false);
  const [showBiometricDialog, setShowBiometricDialog] = useState(false);
  const [showBlockchainDialog, setShowBlockchainDialog] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [showRecoveryCodesDialog, setShowRecoveryCodesDialog] = useState(false);
  const [showUpdateEmailDialog, setShowUpdateEmailDialog] = useState(false);
  const [showUpdatePhoneDialog, setShowUpdatePhoneDialog] = useState(false);
  
  const [verificationCode, setVerificationCode] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();

  const handleTwoFactorToggle = () => {
    if (!twoFactorEnabled) {
      setShowTwoFactorDialog(true);
    } else {
      setTwoFactorEnabled(false);
      toast({
        title: "Two-factor authentication disabled",
        description: "Your account is now less secure. We recommend enabling 2FA for better protection.",
        variant: "destructive",
      });
    }
  };

  const handleBiometricToggle = () => {
    if (!biometricsEnabled) {
      setShowBiometricDialog(true);
    } else {
      setBiometricsEnabled(false);
      toast({
        title: "Biometric authentication disabled",
        description: "Biometric verification has been removed from your account.",
      });
    }
  };

  const handleBlockchainToggle = () => {
    if (!blockchainEnabled) {
      setShowBlockchainDialog(true);
    } else {
      setBlockchainEnabled(false);
      toast({
        title: "Blockchain verification disabled",
        description: "Blockchain verification has been removed from your account.",
      });
    }
  };

  const verifyTwoFactor = async () => {
    if (!verificationCode) {
      toast({
        title: "Verification failed",
        description: "Please enter a verification code.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await mockApi.verifyTwoFactor(verificationCode);
      if (result.success) {
        setTwoFactorEnabled(true);
        setShowTwoFactorDialog(false);
        toast({
          title: "Two-factor authentication enabled",
          description: "Your account is now more secure with 2FA protection.",
        });
      } else {
        toast({
          title: "Verification failed",
          description: result.error || "Invalid verification code. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setVerificationCode('');
    }
  };

  const verifyBiometric = async () => {
    setLoading(true);
    try {
      const result = await mockApi.verifyBiometric();
      if (result.success) {
        setBiometricsEnabled(true);
        setShowBiometricDialog(false);
        toast({
          title: "Biometric authentication enabled",
          description: "Your account now supports biometric verification.",
        });
      } else {
        toast({
          title: "Verification failed",
          description: result.error || "Biometric verification failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyBlockchain = async () => {
    if (!walletAddress) {
      toast({
        title: "Verification failed",
        description: "Please enter a wallet address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await mockApi.verifyBlockchain(walletAddress);
      if (result.success) {
        setBlockchainEnabled(true);
        setShowBlockchainDialog(false);
        toast({
          title: "Blockchain verification enabled",
          description: "Your account is now linked to your blockchain wallet.",
        });
      } else {
        toast({
          title: "Verification failed",
          description: result.error || "Invalid wallet address. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setWalletAddress('');
    }
  };
  
  // Animation variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <MainLayout>
      <motion.div 
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold">Authentication Methods</h1>
          <p className="text-muted-foreground mt-1">
            Manage how you sign in to your account
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <SecurityCard
            className="mb-6 glass-card hover-scale-slight"
            title="Authentication Security"
            icon={<Shield className="w-5 h-5 text-security-primary" />}
            subtitle="Enable multiple authentication methods for enhanced security"
          >
            <div className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="security-card glass-effect">
                  <div className="p-4 border-b border-white/10 dark:border-white/5">
                    <div className="flex items-center">
                      <Key className="w-5 h-5 text-security-primary mr-2" />
                      <h3 className="font-medium">Password</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      Your primary authentication method. Use a strong, unique password.
                    </p>
                    <Button 
                      className="w-full bounce-hover" 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowChangePasswordDialog(true)}
                    >
                      <span>Change Password</span>
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="security-card glass-effect">
                  <div className="p-4 border-b border-white/10 dark:border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Smartphone className="w-5 h-5 text-security-primary mr-2" />
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                      </div>
                      <Switch 
                        checked={twoFactorEnabled} 
                        onCheckedChange={handleTwoFactorToggle} 
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      Add an extra layer of security by requiring a verification code.
                    </p>
                    <Button 
                      className="w-full bounce-hover" 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowTwoFactorDialog(true)}
                      disabled={!twoFactorEnabled}
                    >
                      <span>Configure 2FA</span>
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="security-card glass-effect">
                  <div className="p-4 border-b border-white/10 dark:border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Fingerprint className="w-5 h-5 text-security-primary mr-2" />
                        <h3 className="font-medium">Biometric Authentication</h3>
                      </div>
                      <Switch 
                        checked={biometricsEnabled} 
                        onCheckedChange={handleBiometricToggle} 
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      Use your fingerprint, face recognition, or other biometric data.
                    </p>
                    <Button 
                      className="w-full bounce-hover" 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowBiometricDialog(true)}
                      disabled={!biometricsEnabled}
                    >
                      <span>Configure Biometrics</span>
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="security-card glass-effect">
                  <div className="p-4 border-b border-white/10 dark:border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Wallet className="w-5 h-5 text-security-primary mr-2" />
                        <h3 className="font-medium">Blockchain Verification</h3>
                      </div>
                      <Switch 
                        checked={blockchainEnabled} 
                        onCheckedChange={handleBlockchainToggle} 
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      Connect your blockchain wallet for an additional verification method.
                    </p>
                    <Button 
                      className="w-full bounce-hover" 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowBlockchainDialog(true)}
                      disabled={!blockchainEnabled}
                    >
                      <span>Configure Blockchain</span>
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SecurityCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <SecurityCard
            title="Recovery Options"
            icon={<Lock className="w-5 h-5 text-security-primary" />}
            subtitle="Set up methods to recover your account if you lose access"
            className="glass-card hover-scale-slight"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-white/10 dark:border-white/5 rounded-lg glass-effect">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-security-primary mr-3" />
                  <div>
                    <p className="font-medium">Recovery Email</p>
                    <p className="text-sm text-muted-foreground">{currentUser.recoveryEmail || 'Not set'}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowUpdateEmailDialog(true)}
                  className="bounce-hover"
                >
                  Update
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-white/10 dark:border-white/5 rounded-lg glass-effect">
                <div className="flex items-center">
                  <Smartphone className="w-5 h-5 text-security-primary mr-3" />
                  <div>
                    <p className="font-medium">Recovery Phone</p>
                    <p className="text-sm text-muted-foreground">{currentUser.phone || 'Not set'}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowUpdatePhoneDialog(true)}
                  className="bounce-hover"
                >
                  Update
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-white/10 dark:border-white/5 rounded-lg glass-effect">
                <div className="flex items-center">
                  <QrCode className="w-5 h-5 text-security-primary mr-3" />
                  <div>
                    <p className="font-medium">Recovery Codes</p>
                    <p className="text-sm text-muted-foreground">
                      {currentUser.recoveryCodes ? `${currentUser.recoveryCodes.length} codes available` : 'No codes generated'}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowRecoveryCodesDialog(true)}
                  className="bounce-hover"
                >
                  View Codes
                </Button>
              </div>
            </div>
          </SecurityCard>
        </motion.div>
      </motion.div>

      {/* Two-Factor Authentication Dialog */}
      <Dialog open={showTwoFactorDialog} onOpenChange={setShowTwoFactorDialog}>
        <DialogContent className="sm:max-w-md glass-card dark:bg-background/80">
          <DialogHeader>
            <DialogTitle>Set up Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Scan this QR code with your authenticator app or enter the code manually.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white p-3 rounded-lg">
              <QrCode className="w-48 h-48 text-security-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Or enter this code in your app:</p>
              <p className="font-mono text-lg mt-1">WXYZ-ABCD-1234-5678</p>
            </div>
            <div className="w-full space-y-2">
              <Label htmlFor="verification-code">Enter the 6-digit code from your app</Label>
              <Input 
                id="verification-code" 
                placeholder="000000" 
                maxLength={6} 
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowTwoFactorDialog(false)} 
              disabled={loading}
              className="hover-scale"
            >
              Cancel
            </Button>
            <Button 
              onClick={verifyTwoFactor} 
              disabled={loading}
              className="bg-security-primary hover:bg-security-primary/90 hover-scale"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Biometric Authentication Dialog */}
      <Dialog open={showBiometricDialog} onOpenChange={setShowBiometricDialog}>
        <DialogContent className="sm:max-w-md glass-card dark:bg-background/80">
          <DialogHeader>
            <DialogTitle>Set up Biometric Authentication</DialogTitle>
            <DialogDescription>
              Use your device's biometric features for faster and more secure sign-in.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-6 py-4">
            <motion.div 
              animate={{ scale: loading ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 2, repeat: loading ? Infinity : 0, ease: "easeInOut" }}
            >
              <Fingerprint className="w-24 h-24 text-security-primary" />
            </motion.div>
            <p className="text-center">
              {loading 
                ? "Processing your biometric data..." 
                : "Place your finger on the sensor or use your device's biometric scanner"}
            </p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowBiometricDialog(false)} 
              disabled={loading}
              className="hover-scale"
            >
              Cancel
            </Button>
            <Button 
              onClick={verifyBiometric} 
              disabled={loading}
              className="bg-security-primary hover:bg-security-primary/90 hover-scale"
            >
              {loading ? 'Scanning...' : 'Scan Fingerprint'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Blockchain Verification Dialog */}
      <Dialog open={showBlockchainDialog} onOpenChange={setShowBlockchainDialog}>
        <DialogContent className="sm:max-w-md glass-card dark:bg-background/80">
          <DialogHeader>
            <DialogTitle>Set up Blockchain Verification</DialogTitle>
            <DialogDescription>
              Link your blockchain wallet for enhanced security verification.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="wallet-address">Your Wallet Address</Label>
              <Input 
                id="wallet-address" 
                placeholder="0x..." 
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter your Ethereum wallet address starting with 0x
              </p>
            </div>
            <div className="flex items-center p-3 bg-muted/50 rounded-lg">
              <Scan className="w-5 h-5 text-security-primary mr-3" />
              <span className="text-sm">Alternatively, scan your wallet QR code</span>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowBlockchainDialog(false)} 
              disabled={loading}
              className="hover-scale"
            >
              Cancel
            </Button>
            <Button 
              onClick={verifyBlockchain} 
              disabled={loading}
              className="bg-security-primary hover:bg-security-primary/90 hover-scale"
            >
              {loading ? 'Verifying...' : 'Connect Wallet'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={showChangePasswordDialog}
        onOpenChange={setShowChangePasswordDialog}
      />
      
      {/* Recovery Codes Dialog */}
      <RecoveryCodesDialog
        open={showRecoveryCodesDialog}
        onOpenChange={setShowRecoveryCodesDialog}
      />
      
      {/* Update Recovery Email Dialog */}
      <UpdateRecoveryDialog
        open={showUpdateEmailDialog}
        onOpenChange={setShowUpdateEmailDialog}
        type="email"
        currentValue={currentUser.recoveryEmail}
      />
      
      {/* Update Recovery Phone Dialog */}
      <UpdateRecoveryDialog
        open={showUpdatePhoneDialog}
        onOpenChange={setShowUpdatePhoneDialog}
        type="phone"
        currentValue={currentUser.phone}
      />
    </MainLayout>
  );
};

export default Authentication;
