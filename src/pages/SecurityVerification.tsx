import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SecurityCard from '@/components/security/SecurityCard';
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  Globe, 
  Fingerprint, 
  ShieldCheck, 
  AlertTriangle,
  CheckCircle2,
  RotateCw,
  Lock,
  Zap,
  Shield,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/hooks/use-language';

// Mock blockchain verification result
interface VerificationResult {
  status: 'verified' | 'suspicious' | 'pending';
  timestamp: string;
  blockchainId?: string;
  details?: string;
}

const SecurityVerification = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // States for different protections
  const [emailProtection, setEmailProtection] = useState(true);
  const [phoneProtection, setPhoneProtection] = useState(false);
  const [smsProtection, setSmsProtection] = useState(false);
  const [socialMediaProtection, setSocialMediaProtection] = useState(false);
  const [biometricVerification, setBiometricVerification] = useState(false);
  
  // Mock verification results
  const [emailVerification, setEmailVerification] = useState<VerificationResult>({
    status: 'verified',
    timestamp: '2023-06-22T14:30:00Z',
    blockchainId: '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3',
    details: 'Last scan: 23 minutes ago'
  });
  
  const [phoneVerification, setPhoneVerification] = useState<VerificationResult>({
    status: 'pending',
    timestamp: '',
    details: 'Not yet verified'
  });
  
  const [smsVerification, setSmsVerification] = useState<VerificationResult>({
    status: 'pending',
    timestamp: '',
    details: 'Not yet verified'
  });
  
  const [socialMediaVerification, setSocialMediaVerification] = useState<VerificationResult>({
    status: 'suspicious',
    timestamp: '2023-06-21T09:15:00Z',
    blockchainId: '0x3f4e5d6c7b8a9f0e1d2c3b4a5d6e7f8',
    details: 'Potential impersonation detected'
  });
  
  const [biometricStatus, setBiometricStatus] = useState<VerificationResult>({
    status: 'pending',
    timestamp: '',
    details: 'No biometric data registered'
  });
  
  // Mock scan function
  const performScan = (type: string) => {
    toast({
      title: `${type} scan initiated`,
      description: "Blockchain verification in progress...",
    });
    
    // Simulate scanning process
    setTimeout(() => {
      switch(type) {
        case 'Email':
          setEmailVerification({
            status: 'verified',
            timestamp: new Date().toISOString(),
            blockchainId: `0x${Math.random().toString(16).substring(2, 34)}`,
            details: 'No threats detected'
          });
          break;
        case 'Phone':
          setPhoneVerification({
            status: Math.random() > 0.8 ? 'suspicious' : 'verified',
            timestamp: new Date().toISOString(),
            blockchainId: `0x${Math.random().toString(16).substring(2, 34)}`,
            details: Math.random() > 0.8 ? 'Potential spam calls detected' : 'No threats detected'
          });
          break;
        case 'SMS':
          setSmsVerification({
            status: Math.random() > 0.7 ? 'suspicious' : 'verified',
            timestamp: new Date().toISOString(),
            blockchainId: `0x${Math.random().toString(16).substring(2, 34)}`,
            details: Math.random() > 0.7 ? 'Suspicious SMS links detected' : 'No threats detected'
          });
          break;
        case 'Social Media':
          setSocialMediaVerification({
            status: Math.random() > 0.6 ? 'suspicious' : 'verified',
            timestamp: new Date().toISOString(),
            blockchainId: `0x${Math.random().toString(16).substring(2, 34)}`,
            details: Math.random() > 0.6 ? 'Potential account impersonation detected' : 'No threats detected'
          });
          break;
      }
      
      toast({
        title: `${type} scan complete`,
        description: "Results verified on blockchain.",
        variant: "success"
      });
    }, 3000);
  };
  
  // Register biometric data
  const registerBiometric = () => {
    toast({
      title: "Biometric registration",
      description: "Please scan your fingerprint on your device...",
    });
    
    // Simulate biometric registration process
    setTimeout(() => {
      setBiometricStatus({
        status: 'verified',
        timestamp: new Date().toISOString(),
        blockchainId: `0x${Math.random().toString(16).substring(2, 34)}`,
        details: 'Fingerprint registered and verified on blockchain'
      });
      
      setBiometricVerification(true);
      
      toast({
        title: "Biometric registered",
        description: "Your biometric data has been securely hashed and stored with 12-bit salting.",
        variant: "success"
      });
    }, 4000);
  };
  
  const StatusIndicator = ({ status }: { status: string }) => {
    switch(status) {
      case 'verified':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'suspicious':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'pending':
        return <RotateCw className="w-5 h-5 text-gray-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: "spring",
        bounce: 0.4
      }
    })
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold">Advanced Security Verification</h1>
          <p className="text-muted-foreground mt-1">
            Protect your digital identity with blockchain-verified security
          </p>
        </motion.div>
        
        <Tabs defaultValue="protection" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="protection">Protection Features</TabsTrigger>
            <TabsTrigger value="verification">Verification Status</TabsTrigger>
          </TabsList>
          
          <TabsContent value="protection" className="space-y-6">
            {/* Email Phishing Protection */}
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <SecurityCard
                title="Email Phishing Protection"
                icon={<Mail className="w-5 h-5 text-security-primary" />}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Scanning & Protection</p>
                      <p className="text-sm text-muted-foreground">
                        AI-powered phishing detection with blockchain verification
                      </p>
                    </div>
                    <Switch 
                      checked={emailProtection} 
                      onCheckedChange={setEmailProtection}
                    />
                  </div>
                  
                  <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <StatusIndicator status={emailVerification.status} />
                      <span className="ml-2 text-sm">{emailVerification.details}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => performScan('Email')}
                      disabled={!emailProtection}
                    >
                      Scan Now
                    </Button>
                  </div>
                  
                  {emailVerification.blockchainId && (
                    <div className="text-xs text-muted-foreground border-t pt-2">
                      Blockchain verification ID: {emailVerification.blockchainId}
                    </div>
                  )}
                </div>
              </SecurityCard>
            </motion.div>
            
            {/* Phone Number Fraud Protection */}
            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <SecurityCard
                title="Phone Number Fraud Protection"
                icon={<Phone className="w-5 h-5 text-security-primary" />}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Phone Number Verification</p>
                      <p className="text-sm text-muted-foreground">
                        Protects against SIM swapping & call spoofing
                      </p>
                    </div>
                    <Switch 
                      checked={phoneProtection} 
                      onCheckedChange={setPhoneProtection}
                    />
                  </div>
                  
                  <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <StatusIndicator status={phoneVerification.status} />
                      <span className="ml-2 text-sm">{phoneVerification.details}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => performScan('Phone')}
                      disabled={!phoneProtection}
                    >
                      Verify Number
                    </Button>
                  </div>
                  
                  {phoneVerification.blockchainId && (
                    <div className="text-xs text-muted-foreground border-t pt-2">
                      Blockchain verification ID: {phoneVerification.blockchainId}
                    </div>
                  )}
                </div>
              </SecurityCard>
            </motion.div>
            
            {/* SMS Protection */}
            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <SecurityCard
                title="SMS Fraud Detection"
                icon={<MessageSquare className="w-5 h-5 text-security-primary" />}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Link & Content Analysis</p>
                      <p className="text-sm text-muted-foreground">
                        Detects smishing attempts and malicious links
                      </p>
                    </div>
                    <Switch 
                      checked={smsProtection} 
                      onCheckedChange={setSmsProtection}
                    />
                  </div>
                  
                  <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <StatusIndicator status={smsVerification.status} />
                      <span className="ml-2 text-sm">{smsVerification.details}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => performScan('SMS')}
                      disabled={!smsProtection}
                    >
                      Scan Messages
                    </Button>
                  </div>
                  
                  {smsVerification.blockchainId && (
                    <div className="text-xs text-muted-foreground border-t pt-2">
                      Blockchain verification ID: {smsVerification.blockchainId}
                    </div>
                  )}
                </div>
              </SecurityCard>
            </motion.div>
            
            {/* Social Media Protection */}
            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <SecurityCard
                title="Social Media Protection"
                icon={<Globe className="w-5 h-5 text-security-primary" />}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Social Media Identity Monitoring</p>
                      <p className="text-sm text-muted-foreground">
                        Detects account impersonation and fraudulent profiles
                      </p>
                    </div>
                    <Switch 
                      checked={socialMediaProtection} 
                      onCheckedChange={setSocialMediaProtection}
                    />
                  </div>
                  
                  <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <StatusIndicator status={socialMediaVerification.status} />
                      <span className="ml-2 text-sm">{socialMediaVerification.details}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => performScan('Social Media')}
                      disabled={!socialMediaProtection}
                    >
                      Scan Accounts
                    </Button>
                  </div>
                  
                  {socialMediaVerification.blockchainId && (
                    <div className="text-xs text-muted-foreground border-t pt-2">
                      Blockchain verification ID: {socialMediaVerification.blockchainId}
                    </div>
                  )}
                </div>
              </SecurityCard>
            </motion.div>
            
            {/* Biometric Verification */}
            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <SecurityCard
                title="Blockchain Biometric Verification"
                icon={<Fingerprint className="w-5 h-5 text-security-primary" />}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Biometric Identity Verification</p>
                      <p className="text-sm text-muted-foreground">
                        Fingerprint verification with 12-bit salted blockchain storage
                      </p>
                    </div>
                    <Switch 
                      checked={biometricVerification} 
                      onCheckedChange={setBiometricVerification}
                    />
                  </div>
                  
                  <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <StatusIndicator status={biometricStatus.status} />
                      <span className="ml-2 text-sm">{biometricStatus.details}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={registerBiometric}
                      disabled={biometricVerification}
                    >
                      Register Biometric
                    </Button>
                  </div>
                  
                  {biometricStatus.blockchainId && (
                    <div className="text-xs text-muted-foreground border-t pt-2">
                      Blockchain verification ID: {biometricStatus.blockchainId}
                    </div>
                  )}
                  
                  <div className="bg-security-primary/10 p-3 rounded-lg">
                    <p className="text-sm font-medium flex items-center">
                      <Lock className="w-4 h-4 mr-2 text-security-primary" />
                      Enhanced security with Solidity smart contracts
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your biometric data is hashed and verified through a blockchain-based system with 12-bit salting for maximum security.
                    </p>
                  </div>
                </div>
              </SecurityCard>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="verification" className="space-y-6">
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <SecurityCard
                title="Security Status Overview"
                icon={<ShieldCheck className="w-5 h-5 text-security-primary" />}
              >
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1 p-4 border rounded-lg">
                      <h3 className="text-sm font-medium">Protection Score</h3>
                      <div className="mt-2 flex items-center gap-2">
                        <Progress value={
                          (emailProtection ? 20 : 0) + 
                          (phoneProtection ? 20 : 0) + 
                          (smsProtection ? 20 : 0) + 
                          (socialMediaProtection ? 20 : 0) + 
                          (biometricVerification ? 20 : 0)
                        } className="h-2" />
                        <span className="text-sm">
                          {(emailProtection ? 20 : 0) + 
                           (phoneProtection ? 20 : 0) + 
                           (smsProtection ? 20 : 0) + 
                           (socialMediaProtection ? 20 : 0) + 
                           (biometricVerification ? 20 : 0)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 p-4 border rounded-lg">
                      <h3 className="text-sm font-medium">Blockchain Verifications</h3>
                      <p className="text-3xl font-bold mt-2">
                        {(emailVerification.blockchainId ? 1 : 0) + 
                         (phoneVerification.blockchainId ? 1 : 0) + 
                         (smsVerification.blockchainId ? 1 : 0) + 
                         (socialMediaVerification.blockchainId ? 1 : 0) + 
                         (biometricStatus.blockchainId ? 1 : 0)}
                        <span className="text-sm font-normal text-muted-foreground ml-1">/ 5</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Security Verification Status</h3>
                    
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between p-2 bg-muted/40 rounded">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-security-primary" />
                          <span className="text-sm">Email Protection</span>
                        </div>
                        <StatusIndicator status={emailVerification.status} />
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-muted/40 rounded">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-security-primary" />
                          <span className="text-sm">Phone Protection</span>
                        </div>
                        <StatusIndicator status={phoneVerification.status} />
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-muted/40 rounded">
                        <div className="flex items-center">
                          <MessageSquare className="w-4 h-4 mr-2 text-security-primary" />
                          <span className="text-sm">SMS Protection</span>
                        </div>
                        <StatusIndicator status={smsVerification.status} />
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-muted/40 rounded">
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-2 text-security-primary" />
                          <span className="text-sm">Social Media Protection</span>
                        </div>
                        <StatusIndicator status={socialMediaVerification.status} />
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-muted/40 rounded">
                        <div className="flex items-center">
                          <Fingerprint className="w-4 h-4 mr-2 text-security-primary" />
                          <span className="text-sm">Biometric Verification</span>
                        </div>
                        <StatusIndicator status={biometricStatus.status} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-security-primary/10 p-4 rounded-lg">
                    <div className="flex items-start">
                      <Shield className="w-5 h-5 text-security-primary mt-0.5 mr-3" />
                      <div>
                        <p className="font-medium">Blockchain Security Framework</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          All verifications are stored on a secure blockchain using Solidity smart contracts with 12-bit salting for enhanced security and immutability.
                        </p>
                        <div className="mt-3 text-xs text-muted-foreground border-t border-security-primary/20 pt-2">
                          <div className="flex items-center">
                            <Zap className="w-3 h-3 mr-1" />
                            Last blockchain sync: {new Date().toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SecurityCard>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default SecurityVerification; 