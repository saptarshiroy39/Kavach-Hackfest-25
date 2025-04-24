import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import TwoFactorAuth from '@/components/security/TwoFactorAuth';
import PasswordHealthAnalysis from '@/components/security/PasswordHealthAnalysis';
import { DarkWebMonitoring } from '@/components/security/DarkWebMonitoring';
import PrivacyReport from '@/components/security/PrivacyReport';
import DigitalFootprintTracker from '@/components/security/DigitalFootprintTracker';
import SecurityCard from '@/components/security/SecurityCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { Shield, Fingerprint, Lock, AlertTriangle, Eye, Loader2, RefreshCw, Clock, Search, Filter, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function SecurityStatus() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRunningCheck, setIsRunningCheck] = useState(false);
  const [securityCheckProgress, setSecurityCheckProgress] = useState(0);
  const [showSecurityCheckDialog, setShowSecurityCheckDialog] = useState(false);
  const [securityFeatures, setSecurityFeatures] = useState({
    biometric: false,
    passwordManager: true,
    privacyMonitoring: true
  });

  // Password update state
  const [isUpdatingPasswords, setIsUpdatingPasswords] = useState(false);
  const [passwordUpdateDialogOpen, setPasswordUpdateDialogOpen] = useState(false);
  const [passwordUpdateProgress, setPasswordUpdateProgress] = useState(0);
  const [currentPasswordSite, setCurrentPasswordSite] = useState("");
  const [updatedPasswordInfo, setUpdatedPasswordInfo] = useState({
    site: "",
    newPasswordStrength: ""
  });
  const [hasUpdatedPasswords, setHasUpdatedPasswords] = useState(false);

  const [isScanningDialogOpen, setIsScanningDialogOpen] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStage, setScanStage] = useState('initializing');

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    weak: true,
    reused: true,
    strong: true
  });

  // Password inventory data
  const [passwordInventory, setPasswordInventory] = useState([
    { 
      site: "example.com", 
      username: "user@example.com", 
      lastUpdated: "1/5/2025", 
      strength: "Strong" 
    },
    { 
      site: "social-media.com", 
      username: "user123", 
      lastUpdated: "9/20/2024", 
      strength: "Reused" 
    },
    { 
      site: "shopping-site.com", 
      username: "shopper_user", 
      lastUpdated: "6/10/2023", 
      strength: "Weak" 
    },
    { 
      site: "bank.com", 
      username: "user@example.com", 
      lastUpdated: "2/2/2025", 
      strength: "Strong" 
    }
  ]);

  // Handle running a full security check
  const handleRunSecurityCheck = () => {
    setIsRunningCheck(true);
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
          setShowSecurityCheckDialog(true);
          toast({
            title: "Scan Complete",
            description: "Your security status has been updated.",
          });
        }, 500);
      }
      
      setScanProgress(Math.min(Math.round(currentProgress), 100));
    }, progressInterval);
  };

  // Handle updating weak passwords
  const handleUpdateWeakPasswords = () => {
    setPasswordUpdateDialogOpen(true);
    setPasswordUpdateProgress(0);
    setCurrentPasswordSite("shopping-site.com");
    setIsUpdatingPasswords(true);
    
    // Simulate password update process
    const totalDuration = 3000; // 3 seconds total
    const progressInterval = 100; // Update every 100ms
    let currentProgress = 0;
    
    const intervalId = setInterval(() => {
      currentProgress += 100/30; // Increment to reach 100% in 3 seconds
      
      if (currentProgress >= 50) {
        setCurrentPasswordSite("social-media.com");
      }
      
      if (currentProgress >= 100) {
        clearInterval(intervalId);
        currentProgress = 100;
        setTimeout(() => {
          setIsUpdatingPasswords(false);
          setUpdatedPasswordInfo({
            site: "shopping-site.com, social-media.com",
            newPasswordStrength: "Strong"
          });
          setHasUpdatedPasswords(true);
          
          toast({
            title: "Passwords Updated",
            description: "Your weak passwords have been updated successfully.",
          });
        }, 500);
      }
      
      setPasswordUpdateProgress(Math.min(Math.round(currentProgress), 100));
    }, progressInterval);
  };

  // Handle closing password update dialog
  const handleClosePasswordUpdateDialog = () => {
    setPasswordUpdateDialogOpen(false);
    // Reset state for next time
    if (hasUpdatedPasswords) {
      setHasUpdatedPasswords(false);
      setPasswordUpdateProgress(0);
      setUpdatedPasswordInfo({ site: "", newPasswordStrength: "" });
    }
  };

  // Handle toggling individual security features
  const toggleSecurityFeature = (feature: 'biometric' | 'passwordManager' | 'privacyMonitoring') => {
    setSecurityFeatures(prev => {
      const newState = { ...prev, [feature]: !prev[feature] };
      
      // Show toast message for the action
      toast({
        title: newState[feature] ? `${getFeatureTitle(feature)} Enabled` : `${getFeatureTitle(feature)} Disabled`,
        description: newState[feature] 
          ? `You have enabled ${getFeatureTitle(feature).toLowerCase()}.`
          : `You have disabled ${getFeatureTitle(feature).toLowerCase()}.`,
        duration: 3000,
      });
      
      return newState;
    });
  };

  // Handle clicking a security card to navigate or open relevant dialogs
  const handleSecurityCardClick = (feature: 'biometric' | 'passwordManager' | 'privacyMonitoring') => {
    // Navigate to appropriate pages based on the feature
    switch(feature) {
      case 'biometric':
        // For biometric, we might show a setup dialog or navigate to settings
        navigate('/settings?setup=biometric');
        break;
      case 'passwordManager':
        // Navigate to password vault
        navigate('/password-vault');
        break;
      case 'privacyMonitoring':
        // Could navigate to a more detailed privacy page
        navigate('/security-scanner');
        break;
    }
  };

  // Helper to get proper title for each feature
  const getFeatureTitle = (feature: string): string => {
    switch(feature) {
      case 'biometric': return 'Biometric Authentication';
      case 'passwordManager': return 'Password Manager';
      case 'privacyMonitoring': return 'Privacy Monitoring';
      default: return 'Feature';
    }
  };

  // Filter passwords based on search query and active filters
  const filteredPasswords = passwordInventory.filter(password => {
    // Apply search filter
    const matchesSearch = 
      searchQuery === "" || 
      password.site.toLowerCase().includes(searchQuery.toLowerCase()) ||
      password.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply strength filters
    const matchesStrengthFilter = 
      (password.strength === "Weak" && activeFilters.weak) ||
      (password.strength === "Reused" && activeFilters.reused) ||
      (password.strength === "Strong" && activeFilters.strong);
    
    return matchesSearch && matchesStrengthFilter;
  });

  // Clear search query
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Security Status</h1>
            <p className="text-muted-foreground mt-1">Monitor and improve your security posture</p>
          </div>
          <Button 
            className="mt-4 md:mt-0 bg-security-primary hover:bg-security-primary/90"
            onClick={handleRunSecurityCheck} 
            disabled={isRunningCheck}
          >
            {isRunningCheck ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Running Check...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" /> Run Security Check
              </>
            )}
          </Button>
        </div>

        {/* Security Cards */}
        <div className="space-y-6">
          {/* Password Health Analysis */}
          <SecurityCard
            title="Password Health Analysis"
            icon={<Lock className="w-5 h-5 text-security-primary" />}
            className="mb-6"
          >
            <div className="mt-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div>
                  <h3 className="font-medium">Overall Health Score</h3>
                  <p className="text-xs text-muted-foreground">Based on strength, uniqueness, and age</p>
                </div>
                <div className="text-4xl sm:text-5xl font-bold text-amber-500 mt-2 sm:mt-0">
                  75 <span className="text-sm text-muted-foreground">/100</span>
                </div>
              </div>
              
              <div className="mt-2">
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-security-primary rounded-full" style={{width: '75%'}}></div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-6">
              <div className="bg-muted/50 rounded-lg p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-semibold">1</div>
                <div className="text-xs text-muted-foreground mt-1">Weak<br/>Passwords</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-semibold">1</div>
                <div className="text-xs text-muted-foreground mt-1">Reused<br/>Passwords</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-semibold">0</div>
                <div className="text-xs text-muted-foreground mt-1">Compromised</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-semibold">0</div>
                <div className="text-xs text-muted-foreground mt-1">Outdated</div>
              </div>
            </div>
            
            <div className="mt-6 bg-amber-50/80 dark:bg-amber-900/20 border border-amber-100 rounded-lg p-3 sm:p-4">
              <h4 className="font-medium flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>Recommendations</span>
              </h4>
              <ul className="list-disc list-outside ml-6 text-sm space-y-1 mt-2">
                <li>Update your weak password for shopping-site.com</li>
                <li>Change your reused password on social-media.com</li>
                <li>Enable 2FA on accounts with weak passwords</li>
              </ul>
            </div>
            
            <div className="mt-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h4 className="font-medium mb-3 sm:mb-0">Password Inventory</h4>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search passwords..."
                      className="w-full pl-8 pr-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button 
                        className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
                        onClick={handleClearSearch}
                        aria-label="Clear search"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Filter className="h-4 w-4" />
                        <span>Filter</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuCheckboxItem
                        checked={activeFilters.weak}
                        onCheckedChange={(checked) => 
                          setActiveFilters(prev => ({ ...prev, weak: checked }))
                        }
                      >
                        Weak Passwords
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={activeFilters.reused}
                        onCheckedChange={(checked) => 
                          setActiveFilters(prev => ({ ...prev, reused: checked }))
                        }
                      >
                        Reused Passwords
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={activeFilters.strong}
                        onCheckedChange={(checked) => 
                          setActiveFilters(prev => ({ ...prev, strong: checked }))
                        }
                      >
                        Strong Passwords
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="overflow-x-auto">
                {filteredPasswords.length > 0 ? (
                  <div className="min-w-full">
                    {filteredPasswords.map((password, index) => {
                      // Add checks for potentially undefined properties
                      const site = password?.site ?? 'Unknown Site';
                      const username = password?.username ?? 'Unknown User';
                      const lastUpdated = password?.lastUpdated ?? 'N/A';
                      const strength = password?.strength ?? 'Unknown';

                      return (
                        <div key={`${site}-${index}`} className="flex justify-between items-center py-3 border-b">
                          <div>
                            <div className="font-medium">{site}</div>
                            <div className="text-sm text-muted-foreground">{username}</div>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                            <div className="text-sm text-muted-foreground">{lastUpdated}</div>
                            <Badge
                              variant={strength === "Weak" ? "destructive" : "outline"}
                              className={`whitespace-nowrap ${
                                strength === "Strong"
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : strength === "Reused"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                  : ""
                              }`}
                            >
                              {strength}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">No passwords match your filters</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        setSearchQuery("");
                        setActiveFilters({weak: true, reused: true, strong: true});
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between mt-6">
              <Button variant="outline" className="sm:w-auto" onClick={() => navigate('/password-vault')}>
                View All Passwords
              </Button>
              <Button 
                className="bg-security-primary hover:bg-security-primary/90 text-white mt-2 sm:mt-0"
                onClick={handleUpdateWeakPasswords}
              >
                Update Weak Passwords
              </Button>
            </div>
          </SecurityCard>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" /> Privacy & Data Monitoring
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <DarkWebMonitoring />
            <DigitalFootprintTracker />
            <PrivacyReport />
          </div>
        </div>
      </div>

      {/* Security scan animation dialog */}
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
                  <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
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
                    <Shield className="w-6 h-6 text-primary" />
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
                className="h-full bg-gradient-to-r from-blue-500 via-primary to-green-500 rounded-full"
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

      {/* Security Check Progress Dialog */}
      <Dialog open={showSecurityCheckDialog} onOpenChange={setShowSecurityCheckDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-primary" />
              Security Check {securityCheckProgress === 100 ? 'Complete' : 'In Progress'}
            </DialogTitle>
            <DialogDescription>
              {securityCheckProgress < 100 
                ? 'Scanning your security settings and checking for vulnerabilities...' 
                : 'Your security scan is complete. See the results below.'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Progress value={securityCheckProgress} className="h-2 mb-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Checking security features...</span>
              <span>{securityCheckProgress}%</span>
            </div>

            {securityCheckProgress === 100 && (
              <div className="mt-4 space-y-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm">Security Score: 78/100</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your security posture has improved by 5 points since last check.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Recommendations:</h4>
                  <ul className="text-xs space-y-1 list-disc pl-4">
                    <li>Enable biometric authentication</li>
                    <li>Update 3 passwords that haven't been changed in over a year</li>
                    <li>Review apps with data access permissions</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowSecurityCheckDialog(false)}
              disabled={securityCheckProgress < 100 && isRunningCheck}
            >
              {securityCheckProgress < 100 ? 'Close' : 'Done'}
            </Button>
            {securityCheckProgress === 100 && (
              <Button onClick={() => navigate('/security-verification')}>
                View Detailed Report
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Update Dialog */}
      <Dialog open={passwordUpdateDialogOpen} onOpenChange={handleClosePasswordUpdateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Lock className="mr-2 h-5 w-5 text-primary" />
              {hasUpdatedPasswords ? "Passwords Updated" : "Updating Weak Passwords"}
            </DialogTitle>
            <DialogDescription>
              {hasUpdatedPasswords 
                ? 'Your weak passwords have been updated with strong alternatives.' 
                : 'Please wait while we update your weak passwords with strong alternatives.'}
            </DialogDescription>
          </DialogHeader>
          
          {!hasUpdatedPasswords ? (
            <div className="py-8">
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-24 h-24 mb-4">
                  {/* Spinner */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                  </div>
                  
                  {/* Center icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                </div>
                
                {/* Status text */}
                <div className="text-sm font-medium text-center mb-2">
                  Updating password for {currentPasswordSite}...
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="relative h-3 w-full bg-muted rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${passwordUpdateProgress}%` }}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                  <Shield className="inline w-3 h-3 mr-1" />
                  <span>Generating secure passwords</span>
                </div>
                <p className="text-right text-sm font-medium">
                  {passwordUpdateProgress}% complete
                </p>
              </div>
            </div>
          ) : (
            <div className="py-4 space-y-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 rounded-lg">
                <h4 className="font-medium text-sm flex items-center">
                  <Shield className="h-4 w-4 text-green-600 mr-2" />
                  Password Update Complete
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Your passwords have been updated and stored securely.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Updated Passwords:</h4>
                <div className="space-y-2">
                  <div className="p-2 border rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">shopping-site.com</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Strong</Badge>
                    </div>
                  </div>
                  <div className="p-2 border rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">social-media.com</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Strong</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 rounded-lg">
                <h4 className="font-medium text-sm">Security Score Improved</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Your password health score has increased by 15 points.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            {!hasUpdatedPasswords ? (
              <Button 
                variant="outline" 
                onClick={handleClosePasswordUpdateDialog}
                disabled={isUpdatingPasswords}
              >
                Cancel
              </Button>
            ) : (
              <Button 
                onClick={handleClosePasswordUpdateDialog}
                className="bg-security-primary hover:bg-security-primary/90"
              >
                Done
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
