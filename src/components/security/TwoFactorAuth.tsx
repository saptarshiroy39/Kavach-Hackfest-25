import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertCircle, Check, Mail, MessageSquare, Smartphone, Lock, ShieldCheck, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { twoFactorMock as mockApi } from '@/lib/securityFeaturesMock';
import { Badge } from '@/components/ui/badge';

// Main component - This is the card that appears on the Security Status page
const TwoFactorAuth = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [recoveryDialogOpen, setRecoveryDialogOpen] = useState(false);
  const { toast } = useToast();

  // Simulated user ID (in a real app, this would come from authentication context)
  const userId = "user-123";

  const toggleTwoFactor = () => {
    if (is2FAEnabled) {
      // If 2FA is enabled, show confirmation dialog before disabling
      if (confirm("Are you sure you want to disable two-factor authentication? This will make your account less secure.")) {
        setIs2FAEnabled(false);
        toast({
          title: "Two-factor authentication disabled",
          description: "Your account is now less secure. We recommend enabling 2FA for better protection.",
        });
      }
    } else {
      // If 2FA is disabled, open setup dialog
      setDialogOpen(true);
    }
  };

  // Handler for when 2FA setup is completed
  const handleSetupComplete = (success: boolean) => {
    setDialogOpen(false);
    if (success) {
      setIs2FAEnabled(true);
    }
  };

  // More compact card layout that matches the screenshot
  return (
    <>
      <Card className="border border-gray-200 shadow-sm">
        <div className="p-4 md:p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <div>
                <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
            </div>
            <Badge variant={is2FAEnabled ? "default" : "outline"} className={is2FAEnabled ? "bg-green-500 hover:bg-green-600" : ""}>
              {is2FAEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
          
          <div className="mt-3 text-sm text-gray-500">
            {is2FAEnabled ? (
              <p>
                Your account is protected with two-factor authentication. 
                You will need to enter a verification code when signing in from a new device.
              </p>
            ) : (
              <p>
                Two-factor authentication adds an additional layer of security to your account by requiring
                a verification code in addition to your password when you sign in.
              </p>
            )}
          </div>
          
          <div className="mt-4 flex justify-end">
            {is2FAEnabled && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setRecoveryDialogOpen(true)}
                className="mr-2"
              >
                View Recovery Codes
              </Button>
            )}
            <Button 
              variant={is2FAEnabled ? "outline" : "default"}
              onClick={toggleTwoFactor}
            >
              {is2FAEnabled ? "Disable 2FA" : "Enable 2FA"}
            </Button>
          </div>
        </div>
      </Card>

      {/* 2FA Setup Dialog */}
      <TwoFactorAuthDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        userId={userId}
        onComplete={handleSetupComplete}
      />

      {/* Recovery Codes Dialog */}
      <RecoveryCodesDialog
        open={recoveryDialogOpen}
        onOpenChange={setRecoveryDialogOpen}
        userId={userId}
      />
    </>
  );
};

// Dialog component for 2FA setup
interface TwoFactorAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  initialTab?: 'authenticator' | 'sms' | 'email';
  onComplete: (success: boolean) => void;
}

export const TwoFactorAuthDialog: React.FC<TwoFactorAuthDialogProps> = ({ 
  open, 
  onOpenChange, 
  userId, 
  initialTab = 'authenticator',
  onComplete
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [step, setStep] = useState<'setup' | 'verify' | 'complete'>('setup');
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const { toast } = useToast();

  // Reset states when component opens or initialTab changes
  useEffect(() => {
    if (open) {
      setActiveTab(initialTab);
      setStep('setup');
      setVerificationCode('');
      setQrCode('');
      setSecretKey('');
    }
  }, [open, initialTab]);

  // Simulating API calls for 2FA setup
  const setupAuthenticator = async () => {
    // In a real app, this would call your backend API
    try {
      // Mock API call to generate QR code and secret key
      const response = await mockApi.generate2FASecret(userId);
      setQrCode(response.qrCode);
      setSecretKey(response.secretKey);
      setStep('verify');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to set up authenticator app.',
        variant: 'destructive',
      });
    }
  };

  const setupSMS = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: 'Invalid phone number',
        description: 'Please enter a valid phone number.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Mock API call to send verification code
      await mockApi.send2FACode(userId, phoneNumber, 'sms');
      setStep('verify');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send verification code.',
        variant: 'destructive',
      });
    }
  };

  const setupEmail = async () => {
    try {
      // Mock API call to send verification code via email
      await mockApi.send2FACode(userId, '', 'email');
      setStep('verify');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send verification code.',
        variant: 'destructive',
      });
    }
  };

  const verifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: 'Invalid code',
        description: 'Please enter a valid 6-digit code.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Mock API call to verify code
      await mockApi.verify2FACode(userId, verificationCode);
      setIsEnabled(true);
      setStep('complete');
    } catch (error) {
      toast({
        title: 'Invalid code',
        description: 'The verification code is incorrect or has expired.',
        variant: 'destructive',
      });
    }
  };

  const handleSetup = () => {
    switch (activeTab) {
      case 'authenticator':
        setupAuthenticator();
        break;
      case 'sms':
        setupSMS();
        break;
      case 'email':
        setupEmail();
        break;
      default:
        break;
    }
  };

  const handleComplete = () => {
    toast({
      title: 'Two-factor authentication enabled',
      description: 'Your account is now more secure.',
    });
    onComplete(true);
    onOpenChange(false);
  };

  // Handle dialog close
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      // If user is closing dialog during setup
      if (step !== 'complete') {
        onComplete(false);
      }
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Two-Factor Authentication (2FA)</DialogTitle>
          <DialogDescription>
            Add an extra layer of security to your account by enabling two-factor authentication.
          </DialogDescription>
        </DialogHeader>

        {step === 'setup' && (
          <>
            <Tabs defaultValue="authenticator" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="authenticator">Authenticator App</TabsTrigger>
                <TabsTrigger value="sms">SMS</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
              </TabsList>
              <TabsContent value="authenticator">
                <Card>
                  <CardHeader>
                    <CardTitle>Authenticator App</CardTitle>
                    <CardDescription>
                      Use an authenticator app like Google Authenticator, Microsoft Authenticator, or Authy.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Authenticator apps generate time-based one-time passwords that provide an additional layer of security.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSetup}>Set up authenticator</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="sms">
                <Card>
                  <CardHeader>
                    <CardTitle>SMS Authentication</CardTitle>
                    <CardDescription>
                      Receive a verification code via SMS message.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="flex gap-2">
                          <Input 
                            id="phone" 
                            placeholder="+1 (555) 123-4567" 
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSetup}>Send verification code</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="email">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Authentication</CardTitle>
                    <CardDescription>
                      Receive a verification code via email.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      We'll send a verification code to your registered email address.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSetup}>Send verification code</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}

        {step === 'verify' && (
          <>
            <div className="space-y-4">
              {activeTab === 'authenticator' && (
                <>
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="border p-4 rounded-md bg-muted">
                      {/* In a real app, this would be a QR code image */}
                      <div className="w-48 h-48 bg-white flex items-center justify-center">
                        <p className="text-sm text-center text-muted-foreground">QR Code Placeholder</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">Secret key:</p>
                      <p className="text-sm font-mono bg-muted p-2 rounded mt-1">{secretKey || 'ABCD-EFGH-IJKL-MNOP'}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        If you can't scan the QR code, enter this key manually in your authenticator app
                      </p>
                    </div>
                  </div>
                </>
              )}

              {(activeTab === 'sms' || activeTab === 'email') && (
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    {activeTab === 'sms' ? <Smartphone className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
                    <p className="text-sm">
                      {activeTab === 'sms' 
                        ? `We've sent a 6-digit code to ${phoneNumber}` 
                        : "We've sent a 6-digit code to your email"}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="code">Enter verification code</Label>
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={verificationCode} onChange={setVerificationCode}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('setup')}>Back</Button>
              <Button onClick={verifyCode}>Verify code</Button>
            </DialogFooter>
          </>
        )}

        {step === 'complete' && (
          <>
            <div className="flex flex-col items-center justify-center space-y-4 py-4">
              <div className="rounded-full bg-green-100 p-3">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium">Two-factor authentication enabled</h3>
              <p className="text-center text-muted-foreground">
                Your account is now protected with an additional layer of security.
                You will be asked for a verification code when signing in.
              </p>

              <div className="w-full border rounded-lg p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 p-1.5">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Two-factor authentication</p>
                    <p className="text-xs text-muted-foreground">Using {activeTab === 'authenticator' ? 'authenticator app' : activeTab === 'sms' ? 'SMS' : 'email'}</p>
                  </div>
                </div>
                <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleComplete}>Done</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Recovery Codes Dialog
interface RecoveryCodesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export const RecoveryCodesDialog: React.FC<RecoveryCodesDialogProps> = ({ 
  open, 
  onOpenChange,
  userId
}) => {
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const { toast } = useToast();

  // Load recovery codes when dialog opens
  useEffect(() => {
    if (open) {
      // In a real app, fetch from API
      const codes = [
        "ABCD-1234-EFGH",
        "IJKL-5678-MNOP",
        "QRST-9012-UVWX",
        "YZAB-3456-CDEF",
        "GHIJ-7890-KLMN",
      ];
      setRecoveryCodes(codes);
    }
  }, [open, userId]);

  // Generate new recovery codes
  const handleGenerateNewCodes = () => {
    // In a real app, call API to generate new codes
    toast({
      title: "New recovery codes generated",
      description: "Your old recovery codes are now invalid.",
    });
    
    // Mock new codes
    const newCodes = [
      "ZYXW-9876-VUTSRQ",
      "PONM-5432-LKJIHG",
      "FEDC-1098-BABYZ",
      "XWVU-7654-TSRQ",
      "POML-3210-KJIH",
    ];
    setRecoveryCodes(newCodes);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Recovery Codes
          </DialogTitle>
          <DialogDescription>
            Keep these backup codes in a safe place. You can use them to access your account if you lose your two-factor authentication device.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-md">
            <div className="grid grid-cols-1 gap-2">
              {recoveryCodes.map((code, index) => (
                <div 
                  key={index} 
                  className="font-mono text-sm p-2 bg-background border rounded-sm flex items-center justify-between"
                >
                  {code}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0" 
                    onClick={() => {
                      navigator.clipboard.writeText(code);
                      toast({ description: "Code copied to clipboard" });
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 2V1H10V2H5ZM4.75 0C4.33579 0 4 0.335786 4 0.75V1H3.5C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V2.5C13 1.67157 12.3284 1 11.5 1H11V0.75C11 0.335786 10.6642 0 10.25 0H4.75ZM11 2V2.5C11 2.77614 10.7761 3 10.5 3H4.5C4.22386 3 4 2.77614 4 2.5V2H3.5C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V2.5C12 2.22386 11.7761 2 11.5 2H11Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                    </svg>
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• Each code can only be used once.</p>
            <p>• Treat these codes like your password.</p>
            <p>• Save them in a secure password manager or print them.</p>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={handleGenerateNewCodes}
          >
            Generate New Codes
          </Button>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TwoFactorAuth;
