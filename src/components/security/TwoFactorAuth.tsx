import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertCircle, Check, Mail, MessageSquare, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { twoFactorMock as mockApi } from '@/lib/securityFeaturesMock';

interface TwoFactorAuthProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({ open, onOpenChange, userId }) => {
  const [activeTab, setActiveTab] = useState<string>('authenticator');
  const [step, setStep] = useState<'setup' | 'verify' | 'complete'>('setup');
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const { toast } = useToast();

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
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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

export default TwoFactorAuth;
