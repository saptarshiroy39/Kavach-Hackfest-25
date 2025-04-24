import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import SecurityCard from '@/components/security/SecurityCard';
import SecurityBadge from '@/components/security/SecurityBadge';
import PasswordHealthAnalysis from '@/components/security/PasswordHealthAnalysis';
import { DarkWebMonitoring } from '@/components/security/DarkWebMonitoring';
import PrivacyReport from '@/components/security/PrivacyReport';
import EncryptedMessaging from '@/components/messaging/EncryptedMessaging';
import { 
  Shield, 
  Key, 
  AlertCircle, 
  CheckCircle2, 
  Bell, 
  ArrowRight, 
  ExternalLink,
  Lock,
  User as UserIcon,
  Scan,
  Loader2,
  Eye,
  MessageSquare,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';
import { mockApi } from '@/lib/mockDb';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import TwoFactorAuth, { TwoFactorAuthDialog } from '@/components/security/TwoFactorAuth';

// Simple fallback components to avoid crashes
const ErrorBoundary = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const handleError = (error) => {
      console.error("Component error caught:", error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return hasError ? fallback : children;
};

// Simple Tabs Implementation
const SimpleTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="border-b mb-6">
      <div className="flex overflow-x-auto space-x-2">
        {tabs.map((tab) => (
          <button 
            key={tab.value}
            className={`px-6 py-3 font-medium text-sm whitespace-nowrap rounded-t-lg transition-colors ${
              activeTab === tab.value 
                ? 'border-b-2 border-security-primary text-security-primary bg-muted/50' 
                : 'text-muted-foreground hover:bg-muted/30'
            }`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [securityStatus, setSecurityStatus] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [animateScore, setAnimateScore] = useState(0);
  const [animatePasswordHealth, setAnimatePasswordHealth] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [isScanningDialogOpen, setIsScanningDialogOpen] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStage, setScanStage] = useState('initializing');
  const [showTwoFactorAuthDialog, setShowTwoFactorAuthDialog] = useState(false);
  const [showTwoFactorSetupDialog, setShowTwoFactorSetupDialog] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState('authenticator');
  const [user, setUser] = useState({ id: 'user-123' }); // Mock user data
  const { toast } = useToast();
  const languageHook = useLanguage();
  // Safe access to t function with a fallback
  const t = (key: string) => {
    try {
      return languageHook?.t ? languageHook.t(key) : key;
    } catch (error) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Add error logging
        console.log("Fetching security status...");
        const statusData = await mockApi.getSecurityStatus();
        console.log("Fetched security status:", statusData);
        
        console.log("Fetching security events...");
        const eventsData = await mockApi.getSecurityEvents();
        console.log("Fetched security events:", eventsData);
        
        setSecurityStatus(statusData);
        setRecentEvents(eventsData.slice(0, 3));
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);
  useEffect(() => {
    if (!securityStatus || isLoading) return;

    // Animate the score number
    const duration = 1500;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    // Make sure the score is between 0-100
    const finalValue = Math.min(Math.max(securityStatus.overallScore || 0, 0), 100);
    
    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentValue = Math.round(progress * finalValue);
      
      setAnimateScore(currentValue);
      
      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, frameDuration);    // Also animate password health score
    let passwordFrame = 0;
    const passwordValue = Math.min(Math.max(securityStatus.passwordHealth || 0, 0), 100);
    const passwordCounter = setInterval(() => {
      passwordFrame++;
      const progress = passwordFrame / totalFrames;
      const currentValue = Math.round(progress * passwordValue);
      
      setAnimatePasswordHealth(currentValue);
      
      if (passwordFrame === totalFrames) {
        clearInterval(passwordCounter);
      }
    }, frameDuration);

    return () => {
      clearInterval(counter);
      clearInterval(passwordCounter);
    };
  }, [securityStatus, isLoading]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Convert snake_case to Title Case
  const formatEventType = (eventType) => {
    if (!eventType) return '';
    return eventType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleRunScan = () => {
    setIsScanningDialogOpen(true);
    setScanProgress(0);
    setScanStage('initializing');
    
    // Simulate scan progress
    const totalDuration = 3000; // 3 seconds total
    const progressInterval = 50; // Update every 50ms
    const steps = totalDuration / progressInterval;
    const increment = 100 / steps;
    
    let currentProgress = 0;
    let intervalId = null;
    
    // Start progress animation
    intervalId = setInterval(() => {
      currentProgress += increment;
      
      // Update scan stage based on progress
      if (currentProgress > 20 && currentProgress <= 40) {
        setScanStage('scanning passwords');
      } else if (currentProgress > 40 && currentProgress <= 60) {
        setScanStage('checking vulnerabilities');
      } else if (currentProgress > 60 && currentProgress <= 80) {
        setScanStage('analyzing security status');
      } else if (currentProgress > 80) {
        setScanStage('finalizing');
      }
      
      if (currentProgress >= 100) {
        clearInterval(intervalId);
        currentProgress = 100;
        setTimeout(() => {
          setIsScanningDialogOpen(false);
          toast({
            title: "Scan Complete",
            description: "Your security status has been updated.",
          });
        }, 500);
      }
      
      setScanProgress(Math.min(Math.round(currentProgress), 100));
    }, progressInterval);
  };

  const handleTwoFactorSetup = (method) => {
    setTwoFactorMethod(method);
    setShowTwoFactorAuthDialog(false);
    setShowTwoFactorSetupDialog(true);
  };

  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'password-health', label: 'Password Health' },
    { value: 'dark-web', label: 'Dark Web' },
    { value: 'privacy', label: 'Privacy Report' },
    { value: 'messaging', label: 'Encrypted Messaging' }
  ];

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="w-16 h-16 border-t-4 border-security-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading your security dashboard...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <ErrorBoundary
      fallback={
        <MainLayout>
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">We encountered an error while loading the dashboard.</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-security-primary hover:bg-security-primary/90"
            >
              Refresh Page
            </Button>
          </div>
        </MainLayout>
      }
    >
      <MainLayout>
        <div className="space-y-6">
          {/* Welcome section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">{t('Welcome Back')}, User</h1>
              <p className="text-muted-foreground mt-1">
                Security Dashboard - Last updated: {formatDate(securityStatus?.lastScanDate)}
              </p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button 
                variant="outline"
                onClick={() => setShowTwoFactorAuthDialog(true)}
              >
                Enable 2FA
              </Button>
              <Button 
                className="bg-security-primary hover:bg-security-primary/90"
                onClick={handleRunScan}
              >
                Run Security Scan
              </Button>
            </div>
          </div>

          {/* Security score */}
          <SecurityCard
            className="mb-6"
            title="Security Score"
            icon={<Shield className="w-5 h-5 text-security-primary" />}
            status={
              securityStatus?.overallScore && securityStatus.overallScore >= 80
                ? 'secure'
                : securityStatus?.overallScore && securityStatus.overallScore >= 60
                ? 'warning'
                : 'danger'
            }
          >
            <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
              <div className="relative w-36 h-36 mx-auto md:mx-0">
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-4xl font-bold">{animateScore}%</span>
                  <span className="text-sm text-muted-foreground">Protected</span>
                </div>
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={securityStatus?.overallScore && securityStatus.overallScore >= 80 
                      ? '#30d158' 
                      : securityStatus?.overallScore && securityStatus.overallScore >= 60 
                      ? '#ff9f0a' 
                      : '#ff453a'}
                    strokeWidth="8"
                    strokeDasharray={`${securityStatus?.overallScore ? securityStatus.overallScore * 2.83 : 0} 283`}
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 283" }}
                    animate={{ strokeDasharray: `${securityStatus?.overallScore ? securityStatus.overallScore * 2.83 : 0} 283` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
              </div>
              
              <div className="flex-1 space-y-4 mt-4 md:mt-0">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Password Health</span>
                    <span className="text-sm font-medium">{animatePasswordHealth}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-security-primary rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${animatePasswordHealth}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-security-danger/10 flex items-center justify-center mr-3">
                      <AlertCircle className="w-4 h-4 text-security-danger" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{securityStatus?.vulnerableAccounts || 0}</p>
                      <p className="text-xs text-muted-foreground">Vulnerable Accounts</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-security-warning/10 flex items-center justify-center mr-3">
                      <Key className="w-4 h-4 text-security-warning" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{securityStatus?.reusedPasswords || 0}</p>
                      <p className="text-xs text-muted-foreground">Reused Passwords</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SecurityCard>

          {/* Tabs for Security Features */}
          <div className="mb-4 border p-2 rounded-lg bg-background shadow-sm">
            <SimpleTabs 
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Security overview cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <SecurityCard
                    title="Authentication"
                    icon={<Lock className="w-5 h-5 text-security-primary" />}
                    status="warning"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Two-Factor Auth</span>
                        <SecurityBadge 
                          status="danger" 
                          text="Disabled"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Biometric</span>
                        <SecurityBadge 
                          status="warning" 
                          text="Disabled"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Blockchain Verify</span>
                        <SecurityBadge 
                          status="warning" 
                          text="Disabled"
                        />
                      </div>
                      <Button 
                        className="w-full mt-2" 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate('/authentication')}
                      >
                        <span>Manage</span>
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </SecurityCard>

                  <SecurityCard
                    title="Password Vault"
                    icon={<Key className="w-5 h-5 text-security-primary" />}
                    status={securityStatus?.passwordHealth && securityStatus.passwordHealth >= 80 ? 'secure' : 'warning'}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Passwords</span>
                        <span className="font-medium">5</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Weak Passwords</span>
                        <span className="text-security-danger font-medium">{securityStatus?.weakPasswords || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Last Updated</span>
                        <span className="text-xs text-muted-foreground">2 days ago</span>
                      </div>
                      <Button 
                        className="w-full mt-2" 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate('/password-vault')}
                      >
                        <span>Open Vault</span>
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </SecurityCard>

                  <SecurityCard
                    title="Account Settings"
                    icon={<UserIcon className="w-5 h-5 text-security-primary" />}
                    status="secure"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email Verification</span>
                        <SecurityBadge 
                          status="secure" 
                          text="Verified"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Recovery Email</span>
                        <SecurityBadge 
                          status="secure" 
                          text="Set"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Account Activity</span>
                        <span className="text-xs text-muted-foreground">Normal</span>
                      </div>
                      <Button 
                        className="w-full mt-2" 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate('/settings')}
                      >
                        <span>Manage Settings</span>
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </SecurityCard>
                </div>

                <SecurityCard 
                  title="Recent Events"
                  icon={<Bell className="w-5 h-5 text-security-primary" />}
                  status="secure"
                >
                  <div className="space-y-4">
                    {recentEvents.map((event, index) => (
                      <div key={index} className="flex items-start">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          event.severity === 'medium' 
                            ? 'bg-security-warning/10' 
                            : event.severity === 'high' 
                            ? 'bg-security-danger/10' 
                            : 'bg-security-success/10'
                        }`}>
                          {event.severity === 'medium' ? (
                            <AlertCircle className="w-4 h-4 text-security-warning" />
                          ) : event.severity === 'high' ? (
                            <AlertCircle className="w-4 h-4 text-security-danger" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-security-success" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{formatEventType(event.type)}</p>
                          <p className="text-xs text-muted-foreground">{event.description}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-muted-foreground">{formatDate(event.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button 
                      className="w-full mt-2" 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/notifications')}
                    >
                      <span>View All Events</span>
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </SecurityCard>
              </div>
            )}
            
            {activeTab === 'password-health' && (
              <PasswordHealthAnalysis />
            )}

            {activeTab === 'dark-web' && (
              <DarkWebMonitoring />
            )}

            {activeTab === 'privacy' && (
              <PrivacyReport />
            )}

            {activeTab === 'messaging' && (
              <ErrorBoundary
                fallback={
                  <div className="p-6 text-center">
                    <h2 className="text-xl font-medium mb-4">Encrypted Messaging</h2>
                    <p className="text-muted-foreground mb-4">This feature is currently unavailable.</p>
                  </div>
                }
              >
                <EncryptedMessaging />
              </ErrorBoundary>
            )}
          </div>
        </div>

        {/* Security scan dialog */}
        <Dialog open={isScanningDialogOpen} onOpenChange={setIsScanningDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Running Security Scan...</DialogTitle>
              <DialogDescription>
                Please wait while we analyze your security status and check for vulnerabilities.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-8">
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-24 h-24 mb-4">
                  {/* Outer pulsing circle */}
                  <motion.div 
                    className="absolute inset-0 rounded-full bg-security-primary/10"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 0.2, 0.7]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Inner spinner */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-security-primary/30 border-t-security-primary rounded-full animate-spin" />
                  </div>
                  
                  {/* Center icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ 
                        opacity: [0.5, 1, 0.5],
                        scale: [0.9, 1, 0.9]
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Shield className="w-6 h-6 text-security-primary" />
                    </motion.div>
                  </div>
                </div>
                
                {/* Scan status text */}
                <motion.div
                  className="text-sm font-medium text-center mb-2"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {scanStage === 'initializing' && "Initializing scan..."}
                  {scanStage === 'scanning passwords' && "Scanning passwords..."}
                  {scanStage === 'checking vulnerabilities' && "Checking for vulnerabilities..."}
                  {scanStage === 'analyzing security status' && "Analyzing security status..."}
                  {scanStage === 'finalizing' && "Finalizing results..."}
                </motion.div>
              </div>
              
              {/* Progress bar with gradient */}
              <div className="relative h-3 w-full bg-muted rounded-full overflow-hidden mb-2">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 via-security-primary to-green-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${scanProgress}%` }}
                  transition={{ ease: "easeInOut" }}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <motion.div 
                  className="text-xs text-muted-foreground"
                  animate={{ opacity: scanProgress < 10 ? 0 : 1 }}
                >
                  <Clock className="inline w-3 h-3 mr-1" />
                  <span>Estimated time: {Math.max(3 - (scanProgress/33), 0).toFixed(0)} sec</span>
                </motion.div>
                <p className="text-right text-sm font-medium">
                  {scanProgress}% complete
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Basic 2FA Dialog */}
        <Dialog open={showTwoFactorAuthDialog} onOpenChange={setShowTwoFactorAuthDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
              <DialogDescription>
                Enhance your account security by enabling two-factor authentication.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="space-y-4">
                <div className="flex items-center p-3 border rounded-md">
                  <div className="mr-3 bg-blue-100 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Authenticator App</h4>
                    <p className="text-sm text-muted-foreground">Use Google Authenticator or similar apps</p>
                  </div>
                  <Button 
                    className="ml-auto" 
                    variant="outline"
                    onClick={() => handleTwoFactorSetup('authenticator')}
                  >
                    Set up
                  </Button>
                </div>
                
                <div className="flex items-center p-3 border rounded-md">
                  <div className="mr-3 bg-green-100 p-2 rounded-full">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">SMS Verification</h4>
                    <p className="text-sm text-muted-foreground">Receive codes via text message</p>
                  </div>
                  <Button 
                    className="ml-auto" 
                    variant="outline"
                    onClick={() => handleTwoFactorSetup('sms')}
                  >
                    Set up
                  </Button>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTwoFactorAuthDialog(false)}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Detailed 2FA Setup Dialog */}
        <TwoFactorAuthDialog 
          open={showTwoFactorSetupDialog} 
          onOpenChange={setShowTwoFactorSetupDialog}
          userId={user?.id || 'default-user-id'}
          initialTab={twoFactorMethod as 'authenticator' | 'sms' | 'email'}
          onComplete={(success) => {
            if (success) {
              toast({
                title: "Two-factor authentication enabled",
                description: "Your account is now more secure.",
              });
            }
          }}
        />
      </MainLayout>
    </ErrorBoundary>
  );
};

export default Dashboard;
