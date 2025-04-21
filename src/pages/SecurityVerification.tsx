import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  Plus,
  X,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  UserPlus,
  Users,
  UserCog,
  User,
  ArrowRight,
  Save,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/hooks/use-language';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockApi, users, User as UserType } from '@/lib/mockDb';

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
  
  // Check if user is admin (in a real app, this would be from auth context)
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [nonAdminUsers, setNonAdminUsers] = useState<UserType[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showAdminNotification, setShowAdminNotification] = useState(false);
  const [showUserSelector, setShowUserSelector] = useState(false);
  
  // States for different protections
  const [emailProtection, setEmailProtection] = useState(true);
  const [phoneProtection, setPhoneProtection] = useState(false);
  const [smsProtection, setSmsProtection] = useState(false);
  const [socialMediaProtection, setSocialMediaProtection] = useState(false);
  const [biometricVerification, setBiometricVerification] = useState(false);
  
  // Fetch user data on component mount
  useEffect(() => {
    // Simulate fetching current user from localStorage/auth context
    const userRole = localStorage.getItem('user-role');
    const isUserAdmin = userRole === 'admin';
    setIsAdmin(isUserAdmin);
    
    // In a real app, you would fetch this from an API
    if (isUserAdmin) {
      // Get admin user and non-admin users
      const adminUser = users.find(user => user.role === 'admin');
      const regularUsers = users.filter(user => user.role === 'user');
      
      setCurrentUser(adminUser || null);
      setNonAdminUsers(regularUsers);
    } else {
      // Get regular user
      const regularUser = users.find(user => user.role === 'user');
      setCurrentUser(regularUser || null);
    }
  }, []);
  
  // Added protected items
  const [protectedEmails, setProtectedEmails] = useState<string[]>(['user@example.com', 'work@company.com']);
  const [protectedPhones, setProtectedPhones] = useState<string[]>(['+1 (555) 123-4567']);
  const [protectedSocialAccounts, setProtectedSocialAccounts] = useState<{platform: string, username: string}[]>([
    { platform: 'Twitter', username: '@user123' },
    { platform: 'LinkedIn', username: 'username' }
  ]);
  
  // Dialog states
  const [showAddEmailDialog, setShowAddEmailDialog] = useState(false);
  const [showAddPhoneDialog, setShowAddPhoneDialog] = useState(false);
  const [showAddSocialDialog, setShowAddSocialDialog] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newSocialPlatform, setNewSocialPlatform] = useState('Twitter');
  const [newSocialUsername, setNewSocialUsername] = useState('');
  
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
        description: "Results verified on blockchain."
      });
    }, 3000);
  };
  
  // Handle adding a new protected email
  const handleAddEmail = () => {
    if (!newEmail || !newEmail.includes('@')) {
      toast({
        title: "Invalid email address",
        description: "Please enter a valid email address"
      });
      return;
    }
    
    setProtectedEmails([...protectedEmails, newEmail]);
    setNewEmail('');
    setShowAddEmailDialog(false);
    
    toast({
      title: "Email added for protection",
      description: "The email address will now be monitored for phishing attempts"
    });
  };
  
  // Handle adding a new protected phone number
  const handleAddPhone = () => {
    if (!newPhone || newPhone.length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number"
      });
      return;
    }
    
    setProtectedPhones([...protectedPhones, newPhone]);
    setNewPhone('');
    setShowAddPhoneDialog(false);
    
    toast({
      title: "Phone number added for protection",
      description: "The phone number will now be monitored for fraud attempts"
    });
  };
  
  // Handle adding a new protected social media account
  const handleAddSocialAccount = () => {
    if (!newSocialUsername) {
      toast({
        title: "Invalid username",
        description: "Please enter a valid username for the selected platform"
      });
      return;
    }
    
    setProtectedSocialAccounts([...protectedSocialAccounts, {
      platform: newSocialPlatform,
      username: newSocialUsername.startsWith('@') ? newSocialUsername : `@${newSocialUsername}`
    }]);
    setNewSocialPlatform('Twitter');
    setNewSocialUsername('');
    setShowAddSocialDialog(false);
    
    toast({
      title: "Social media account added for protection",
      description: "The account will now be monitored for impersonation"
    });
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
        description: "Your biometric data has been securely hashed and stored with 12-bit salting."
      });
      
      // Show admin notification if an admin is modifying user data
      if (isAdmin && selectedUserId) {
        showAdminModificationNotification();
      }
    }, 4000);
  };
  
  // Function to handle when an admin user modifies a non-admin user's data
  const showAdminModificationNotification = () => {
    setShowAdminNotification(true);
    
    toast({
      title: "User has been notified",
      description: "The user has been notified of changes to their security settings.",
    });
    
    // Hide the notification after 5 seconds
    setTimeout(() => {
      setShowAdminNotification(false);
    }, 5000);
  };
  
  // Function to switch between users (admin only)
  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId);
    
    // Find the selected user
    const selectedUser = nonAdminUsers.find(user => user.id === userId);
    
    if (selectedUser) {
      toast({
        title: `Viewing ${selectedUser.name}'s settings`,
        description: "You can now view and modify this user's security verification settings."
      });
      
      // Reset states when switching users
      setEmailProtection(Math.random() > 0.5);
      setPhoneProtection(Math.random() > 0.5);
      setSmsProtection(Math.random() > 0.5);
      setSocialMediaProtection(Math.random() > 0.5);
      setBiometricVerification(Math.random() > 0.5);
      
      // Set random verification statuses
      setEmailVerification({
        status: Math.random() > 0.7 ? 'verified' : (Math.random() > 0.5 ? 'suspicious' : 'pending'),
        timestamp: new Date().toISOString(),
        blockchainId: Math.random() > 0.5 ? `0x${Math.random().toString(16).substring(2, 34)}` : undefined,
        details: 'User data loaded'
      });
      
      setPhoneVerification({
        status: Math.random() > 0.7 ? 'verified' : (Math.random() > 0.5 ? 'suspicious' : 'pending'),
        timestamp: Math.random() > 0.5 ? new Date().toISOString() : '',
        blockchainId: Math.random() > 0.5 ? `0x${Math.random().toString(16).substring(2, 34)}` : undefined,
        details: Math.random() > 0.5 ? 'No threats detected' : 'Not yet verified'
      });
      
      setSmsVerification({
        status: Math.random() > 0.7 ? 'verified' : (Math.random() > 0.5 ? 'suspicious' : 'pending'),
        timestamp: Math.random() > 0.5 ? new Date().toISOString() : '',
        blockchainId: Math.random() > 0.5 ? `0x${Math.random().toString(16).substring(2, 34)}` : undefined,
        details: Math.random() > 0.5 ? 'No threats detected' : 'Not yet verified'
      });
      
      setSocialMediaVerification({
        status: Math.random() > 0.7 ? 'verified' : (Math.random() > 0.5 ? 'suspicious' : 'pending'),
        timestamp: Math.random() > 0.5 ? new Date().toISOString() : '',
        blockchainId: Math.random() > 0.5 ? `0x${Math.random().toString(16).substring(2, 34)}` : undefined,
        details: Math.random() > 0.5 ? 'No threats detected' : 'Not yet verified'
      });
      
      setBiometricStatus({
        status: Math.random() > 0.7 ? 'verified' : (Math.random() > 0.5 ? 'suspicious' : 'pending'),
        timestamp: Math.random() > 0.5 ? new Date().toISOString() : '',
        blockchainId: Math.random() > 0.5 ? `0x${Math.random().toString(16).substring(2, 34)}` : undefined,
        details: Math.random() > 0.5 ? 'Fingerprint registered' : 'Not yet registered'
      });
    }
  };
  
  // Function to save admin changes to user settings
  const saveUserSettings = () => {
    if (isAdmin && selectedUserId) {
      toast({
        title: "Settings saved",
        description: "User's security settings have been updated."
      });
      
      showAdminModificationNotification();
    }
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Advanced Security Verification</h1>
              <p className="text-muted-foreground mt-1">
                Protect your digital identity with blockchain-verified security
              </p>
            </div>
            
            {/* Admin User Selection Controls */}
            {isAdmin && (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={() => setShowUserSelector(true)}
                >
                  <Users className="w-4 h-4" />
                  {selectedUserId ? nonAdminUsers.find(u => u.id === selectedUserId)?.name || 'Select User' : 'Select User'}
                </Button>
                
                {selectedUserId && (
                  <Button 
                    className="bg-security-primary hover:bg-security-primary/90 h-9"
                    size="sm"
                    onClick={saveUserSettings}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                )}
              </div>
            )}
          </div>
          
          {/* Admin Notification Banner */}
          {isAdmin && showAdminNotification && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-3 bg-security-primary/20 border border-security-primary rounded-md flex items-center justify-between"
            >
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-security-primary mr-2" />
                <span>The user has been notified of changes to their security settings.</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0" 
                onClick={() => setShowAdminNotification(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
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
                  
                  {/* Added section to show protected email addresses */}
                  <div className="mt-4 border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium">Protected Email Addresses</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowAddEmailDialog(true)}
                        className="flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Email
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {protectedEmails.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No email addresses added for protection.</p>
                      ) : (
                        protectedEmails.map((email, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-2 text-security-primary" />
                              <span className="text-sm">{email}</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 w-7 p-0"
                              onClick={() => {
                                const newEmails = [...protectedEmails];
                                newEmails.splice(index, 1);
                                setProtectedEmails(newEmails);
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
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
                  
                  {/* Added section to show protected phone numbers */}
                  <div className="mt-4 border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium">Protected Phone Numbers</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowAddPhoneDialog(true)}
                        className="flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Phone
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {protectedPhones.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No phone numbers added for protection.</p>
                      ) : (
                        protectedPhones.map((phone, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2 text-security-primary" />
                              <span className="text-sm">{phone}</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 w-7 p-0"
                              onClick={() => {
                                const newPhones = [...protectedPhones];
                                newPhones.splice(index, 1);
                                setProtectedPhones(newPhones);
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
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
                  
                  {/* Added section to show protected social media accounts */}
                  <div className="mt-4 border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium">Protected Social Media Accounts</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowAddSocialDialog(true)}
                        className="flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Account
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {protectedSocialAccounts.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No social media accounts added for protection.</p>
                      ) : (
                        protectedSocialAccounts.map((account, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <div className="flex items-center">
                              {account.platform === 'Twitter' && <Twitter className="w-4 h-4 mr-2 text-blue-400" />}
                              {account.platform === 'LinkedIn' && <Linkedin className="w-4 h-4 mr-2 text-blue-600" />}
                              {account.platform === 'Facebook' && <Facebook className="w-4 h-4 mr-2 text-blue-500" />}
                              {account.platform === 'Instagram' && <Instagram className="w-4 h-4 mr-2 text-pink-500" />}
                              {!['Twitter', 'LinkedIn', 'Facebook', 'Instagram'].includes(account.platform) && 
                                <Globe className="w-4 h-4 mr-2 text-security-primary" />}
                              <div>
                                <span className="text-sm">{account.username}</span>
                                <p className="text-xs text-muted-foreground">{account.platform}</p>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 w-7 p-0"
                              onClick={() => {
                                const newAccounts = [...protectedSocialAccounts];
                                newAccounts.splice(index, 1);
                                setProtectedSocialAccounts(newAccounts);
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
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
          </TabsContent>        </Tabs>
      </div>

      {/* Add Email Dialog */}
      <Dialog open={showAddEmailDialog} onOpenChange={setShowAddEmailDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Email Address for Protection</DialogTitle>
            <DialogDescription>
              Enter an email address you want to monitor for phishing attempts
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Input
                placeholder="Enter email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                We'll scan this email address for phishing attempts and notify you of any threats
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddEmailDialog(false)}>Cancel</Button>
            <Button onClick={handleAddEmail} className="bg-security-primary hover:bg-security-primary/90">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Phone Dialog */}
      <Dialog open={showAddPhoneDialog} onOpenChange={setShowAddPhoneDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Phone Number for Protection</DialogTitle>
            <DialogDescription>
              Enter a phone number you want to monitor for fraud attempts
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Input
                placeholder="Enter phone number"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                We'll monitor this phone number for SIM swapping, spoofing, and other fraud attempts
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPhoneDialog(false)}>Cancel</Button>
            <Button onClick={handleAddPhone} className="bg-security-primary hover:bg-security-primary/90">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Phone Number
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Social Media Account Dialog */}
      <Dialog open={showAddSocialDialog} onOpenChange={setShowAddSocialDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Social Media Account</DialogTitle>
            <DialogDescription>
              Select a platform and enter your username to monitor for impersonation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Select value={newSocialPlatform} onValueChange={setNewSocialPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Twitter">Twitter</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="Other">Other Platform</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Enter username (e.g. @username)"
                value={newSocialUsername}
                onChange={(e) => setNewSocialUsername(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                We'll monitor for impersonation attempts and fraudulent profiles using your identity
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddSocialDialog(false)}>Cancel</Button>
            <Button onClick={handleAddSocialAccount} className="bg-security-primary hover:bg-security-primary/90">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admin User Selection Dialog */}
      {isAdmin && (
        <Dialog open={showUserSelector} onOpenChange={setShowUserSelector}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Select User to Manage</DialogTitle>
              <DialogDescription>
                Choose a user to view and modify their security verification settings
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2 max-h-[50vh] overflow-auto">
              {nonAdminUsers.map(user => (
                <div 
                  key={user.id} 
                  className={`p-3 flex items-center justify-between rounded-md cursor-pointer hover:bg-muted/50 transition-colors ${selectedUserId === user.id ? 'bg-security-primary/10 border border-security-primary/30' : 'border'}`}
                  onClick={() => {
                    handleUserChange(user.id);
                    setShowUserSelector(false);
                  }}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-3">
                      <User className="w-5 h-5 text-security-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <ArrowRight className={`w-5 h-5 ${selectedUserId === user.id ? 'text-security-primary' : 'text-muted-foreground'}`} />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUserSelector(false)}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  );
};

export default SecurityVerification;