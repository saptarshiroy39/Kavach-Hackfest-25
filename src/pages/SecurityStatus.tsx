import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import SecurityCard from '@/components/security/SecurityCard';
import { 
  Shield, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  FileText,
  Lock,
  ArrowRight,
  Loader2,
  Clock,
  AlertTriangle,
  Key,
  Wifi,
  Globe,
  ShieldAlert,
  FileBarChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { securityStatus } from '@/lib/mockDb';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { motion } from 'framer-motion';

// Define threat types
interface Threat {
  id: string;
  type: 'password' | 'network' | 'data' | 'account';
  description: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: Date;
}

const SecurityStatus = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStage, setScanStage] = useState('initializing');
  const [isScanDialogOpen, setIsScanDialogOpen] = useState(false);
  const [detectedThreats, setDetectedThreats] = useState<Threat[]>([]);
  const [latestThreat, setLatestThreat] = useState<Threat | null>(null);
  const [isDetailedReportOpen, setIsDetailedReportOpen] = useState(false);
  const { toast } = useToast();
  
  // Mock threat data to be "discovered" during scan
  const potentialThreats: Threat[] = [
    {
      id: 't1',
      type: 'password',
      description: 'Weak password found for Online Banking',
      severity: 'high',
      timestamp: new Date()
    },
    {
      id: 't2',
      type: 'password',
      description: 'Password reused across multiple sites',
      severity: 'medium',
      timestamp: new Date()
    },
    {
      id: 't3',
      type: 'network',
      description: 'Insecure WiFi connection detected',
      severity: 'medium',
      timestamp: new Date()
    },
    {
      id: 't4',
      type: 'data',
      description: 'Email found in data breach',
      severity: 'high',
      timestamp: new Date()
    },
    {
      id: 't5',
      type: 'account',
      description: '2FA not enabled on sensitive account',
      severity: 'high',
      timestamp: new Date()
    },
    {
      id: 't6',
      type: 'network',
      description: 'Unsecured browser connection',
      severity: 'low',
      timestamp: new Date()
    },
    {
      id: 't7',
      type: 'data',
      description: 'Excessive app permissions granted',
      severity: 'medium',
      timestamp: new Date()
    }
  ];
  
  // Helper to get threat icon based on type
  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'password':
        return <Key className="h-4 w-4" />;
      case 'network':
        return <Wifi className="h-4 w-4" />;
      case 'data':
        return <Globe className="h-4 w-4" />;
      case 'account':
        return <ShieldAlert className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };
  
  // Helper to get color based on severity
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-security-danger';
      case 'medium':
        return 'text-security-warning';
      case 'low':
        return 'text-yellow-500';
      default:
        return 'text-muted-foreground';
    }
  };
  
  const runSecurityScan = () => {
    setIsScanning(true);
    setIsScanDialogOpen(true);
    setScanProgress(0);
    setScanStage('initializing');
    setDetectedThreats([]);
    setLatestThreat(null);
    
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
        
        // "Discover" password threats around 30% progress
        if (currentProgress >= 30 && detectedThreats.length === 0) {
          const newThreats = [potentialThreats[0], potentialThreats[1]];
          const latestDiscovered = potentialThreats[0];
          latestDiscovered.timestamp = new Date(); // Update timestamp
          setDetectedThreats(newThreats);
          setLatestThreat(latestDiscovered);
        }
      } else if (currentProgress > 40 && currentProgress <= 60) {
        setScanStage('checking vulnerabilities');
        
        // "Discover" network threats around 50% progress
        if (currentProgress >= 50 && detectedThreats.length === 2) {
          const newThreats = [...detectedThreats, potentialThreats[2], potentialThreats[5]];
          const latestDiscovered = potentialThreats[2];
          latestDiscovered.timestamp = new Date(); // Update timestamp
          setDetectedThreats(newThreats);
          setLatestThreat(latestDiscovered);
        }
      } else if (currentProgress > 60 && currentProgress <= 80) {
        setScanStage('analyzing security status');
        
        // "Discover" data threats around 70% progress
        if (currentProgress >= 70 && detectedThreats.length === 4) {
          const newThreats = [...detectedThreats, potentialThreats[3], potentialThreats[6]];
          const latestDiscovered = potentialThreats[3];
          latestDiscovered.timestamp = new Date(); // Update timestamp
          setDetectedThreats(newThreats);
          setLatestThreat(latestDiscovered);
        }
      } else if (currentProgress > 80) {
        setScanStage('finalizing');
        
        // "Discover" account threats around 90% progress
        if (currentProgress >= 90 && detectedThreats.length === 6) {
          const newThreats = [...detectedThreats, potentialThreats[4]];
          const latestDiscovered = potentialThreats[4];
          latestDiscovered.timestamp = new Date(); // Update timestamp
          setDetectedThreats(newThreats);
          setLatestThreat(latestDiscovered);
        }
      }
      
      if (currentProgress >= 100) {
        clearInterval(intervalId);
        currentProgress = 100;
        setTimeout(() => {
          setIsScanning(false);
          setIsScanDialogOpen(false);
          toast({
            title: "Scan Complete",
            description: `Scan completed with ${detectedThreats.length} potential threats detected.`,
          });
        }, 500);
      }
      
      setScanProgress(Math.min(Math.round(currentProgress), 100));
    }, progressInterval);
  };
  
  // Handle detailed report view
  const handleViewDetailedReport = () => {
    setIsDetailedReportOpen(true);
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Security Status</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive overview of your security posture
          </p>
        </div>

        <SecurityCard
          className="mb-6"
          title="Security Overview"
          icon={<Shield className="w-5 h-5 text-security-primary" />}
          status={
            securityStatus.overallScore >= 80
              ? 'secure'
              : securityStatus.overallScore >= 60
              ? 'warning'
              : 'danger'
          }
        >
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-4xl font-bold">{securityStatus.overallScore}%</span>
                  <span className="text-sm text-muted-foreground">Overall Score</span>
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
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={securityStatus.overallScore >= 80 
                      ? '#30d158' 
                      : securityStatus.overallScore >= 60 
                      ? '#ff9f0a' 
                      : '#ff453a'}
                    strokeWidth="8"
                    strokeDasharray={`${securityStatus.overallScore * 2.83} 283`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="flex-1 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your security score is calculated based on password strength, authentication methods, 
                  and overall account protection. Improve your score by addressing the issues below.
                </p>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Password Health</span>
                    <span className="text-sm font-medium">{securityStatus.passwordHealth}%</span>
                  </div>
                  <Progress 
                    value={securityStatus.passwordHealth} 
                    className="h-2"
                    color={securityStatus.passwordHealth >= 80 
                      ? 'bg-security-secondary' 
                      : securityStatus.passwordHealth >= 60 
                      ? 'bg-security-warning' 
                      : 'bg-security-danger'}
                  />
                </div>
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleViewDetailedReport}
                  >
                    View Detailed Report
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col p-4 bg-muted/40 rounded-lg">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-security-danger/10 flex items-center justify-center mr-3">
                    <AlertCircle className="w-5 h-5 text-security-danger" />
                  </div>
                  <div>
                    <h3 className="font-medium">Security Vulnerabilities</h3>
                    <p className="text-2xl font-bold mt-2 mb-1">{securityStatus.vulnerableAccounts}</p>
                    <p className="text-sm text-muted-foreground">Vulnerable accounts</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col p-4 bg-muted/40 rounded-lg">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-security-warning/10 flex items-center justify-center mr-3">
                    <Info className="w-5 h-5 text-security-warning" />
                  </div>
                  <div>
                    <h3 className="font-medium">Dark Web Exposures</h3>
                    <p className="text-2xl font-bold mt-2 mb-1">{securityStatus.darkWebExposures}</p>
                    <p className="text-sm text-muted-foreground">Found in data breaches</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col p-4 bg-muted/40 rounded-lg">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-security-secondary/10 flex items-center justify-center mr-3">
                    <Lock className="w-5 h-5 text-security-secondary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Password Strength</h3>
                    <p className="text-2xl font-bold mt-2 mb-1">{securityStatus.weakPasswords}</p>
                    <p className="text-sm text-muted-foreground">Weak passwords</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SecurityCard>

        <SecurityCard 
          title="Security Recommendations" 
          icon={<CheckCircle2 className="w-5 h-5 text-security-primary" />}
        >
          <div className="space-y-4">
            <div className="p-4 border border-security-danger/30 bg-security-danger/5 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-security-danger mr-3 mt-0.5" />
                <div>                  <h3 className="font-medium">Enable Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your account will be more secure with an additional verification step.
                  </p>                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => navigate('/authentication')}
                  >
                    Enable 2FA Now
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 border border-security-warning/30 bg-security-warning/5 rounded-lg">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-security-warning mr-3 mt-0.5" />
                <div>                  <h3 className="font-medium">Update Weak Passwords</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    2 of your passwords are weak and should be updated for better security.
                  </p>                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => navigate('/password-vault')}
                  >
                    Fix Now
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 border border-security-warning/30 bg-security-warning/5 rounded-lg">
              <div className="flex items-start">
                <FileText className="w-5 h-5 text-security-warning mr-3 mt-0.5" />
                <div>                  <h3 className="font-medium">Complete Security Checklist</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You've completed 7 out of 10 security steps for full protection.
                  </p>                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => navigate('/security-verification')}
                  >
                    Continue Checklist
                  </Button>
                </div>
              </div>
            </div>            <div className="text-center mt-6">
              <Button 
                className="bg-security-primary hover:bg-security-primary/90" 
                onClick={runSecurityScan}
                disabled={isScanning}
              >
                {isScanning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Scanning...</span>
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Run Full Security Scan</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </SecurityCard>      </div>
      
      {/* Security scan dialog */}
      <Dialog open={isScanDialogOpen} onOpenChange={setIsScanDialogOpen}>
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
            
            {/* Threat Detection Visualization */}
            <div className="mb-6 border rounded-lg p-4 bg-black/5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-security-warning" />
                  Threat Detection
                </h3>
                <div className="flex items-center bg-background px-2 py-1 rounded text-sm">
                  <span className="font-bold">{detectedThreats.length}</span>
                  <span className="ml-1 text-muted-foreground">threats detected</span>
                </div>
              </div>
              
              {/* Latest threat animation */}
              {latestThreat && (
                <motion.div 
                  className="bg-background rounded-md p-3 mb-3 border border-muted"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start">
                    <div className={`p-2 rounded-full bg-background border ${
                      latestThreat.severity === 'high' ? 'border-security-danger' : 
                      latestThreat.severity === 'medium' ? 'border-security-warning' : 
                      'border-yellow-500'
                    } mr-3`}>
                      {getThreatIcon(latestThreat.type)}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className={`text-xs font-medium uppercase px-2 py-0.5 rounded-full ${
                          latestThreat.severity === 'high' ? 'bg-security-danger/10 text-security-danger' : 
                          latestThreat.severity === 'medium' ? 'bg-security-warning/10 text-security-warning' : 
                          'bg-yellow-500/10 text-yellow-500'
                        } mr-2`}>
                          {latestThreat.severity}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Just detected
                        </span>
                      </div>
                      <p className="font-medium mt-1">{latestThreat.description}</p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Threat summary by severity */}
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="bg-security-danger/5 rounded p-2 text-center">
                  <p className="text-xs text-muted-foreground">High</p>
                  <p className="font-bold text-security-danger">
                    {detectedThreats.filter(t => t.severity === 'high').length}
                  </p>
                </div>
                <div className="bg-security-warning/5 rounded p-2 text-center">
                  <p className="text-xs text-muted-foreground">Medium</p>
                  <p className="font-bold text-security-warning">
                    {detectedThreats.filter(t => t.severity === 'medium').length}
                  </p>
                </div>
                <div className="bg-yellow-500/5 rounded p-2 text-center">
                  <p className="text-xs text-muted-foreground">Low</p>
                  <p className="font-bold text-yellow-500">
                    {detectedThreats.filter(t => t.severity === 'low').length}
                  </p>
                </div>
              </div>
              
              {/* Small threat list */}
              <div className="text-xs text-muted-foreground">
                {detectedThreats.length === 0 ? (
                  <p className="text-center py-2">No threats detected yet...</p>
                ) : (
                  <div className="max-h-20 overflow-y-auto">
                    {detectedThreats.map((threat, index) => (
                      <div key={threat.id} className="flex items-center py-1">
                        <div className={`mr-2 ${getSeverityColor(threat.severity)}`}>
                          {getThreatIcon(threat.type)}
                        </div>
                        <span className="truncate">{threat.description}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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

      {/* Detailed Security Report Dialog */}
      <Dialog open={isDetailedReportOpen} onOpenChange={setIsDetailedReportOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] w-[90vw] overflow-hidden flex flex-col">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="flex items-center">
              <FileBarChart className="h-5 w-5 mr-2 text-security-primary" />
              Detailed Security Report
            </DialogTitle>
            <DialogDescription>
              Comprehensive analysis of your security status across multiple categories
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto px-6 py-4 space-y-6 flex-grow">
            {/* Overall Security Score */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-2">Overall Security Score</h3>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{securityStatus.overallScore}%</span>
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
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={securityStatus.overallScore >= 80 
                        ? '#30d158' 
                        : securityStatus.overallScore >= 60 
                        ? '#ff9f0a' 
                        : '#ff453a'}
                      strokeWidth="8"
                      strokeDasharray={`${securityStatus.overallScore * 2.83} 283`}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-muted-foreground mb-2">
                    Your security score is {securityStatus.overallScore}%, which is considered
                    {securityStatus.overallScore >= 80 
                      ? ' excellent. Keep up the good security practices.' 
                      : securityStatus.overallScore >= 60 
                      ? ' good, but there\'s room for improvement.' 
                      : ' concerning. Please address the critical issues immediately.'}
                  </p>
                  <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            {/* Security Categories Breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Security Categories</h3>
              
              {/* Password Health */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-security-primary/10 flex items-center justify-center mr-3">
                      <Key className="w-4 h-4 text-security-primary" />
                    </div>
                    <h4 className="font-medium">Password Health</h4>
                  </div>
                  <span className={`text-sm font-medium ${
                    securityStatus.passwordHealth >= 80 
                      ? 'text-green-500' 
                      : securityStatus.passwordHealth >= 60 
                      ? 'text-yellow-500' 
                      : 'text-red-500'
                  }`}>
                    {securityStatus.passwordHealth}%
                  </span>
                </div>
                <Progress 
                  value={securityStatus.passwordHealth} 
                  className="h-2 mb-4"
                />
                <div className="text-sm space-y-2">
                  <p className="text-muted-foreground">
                    You have {securityStatus.weakPasswords} weak passwords and {securityStatus.reusedPasswords} reused passwords.
                  </p>
                  <p className="flex items-center text-security-warning">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span>Update weak passwords to improve your security score.</span>
                  </p>
                </div>
              </div>
              
              {/* Account Security */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-security-primary/10 flex items-center justify-center mr-3">
                      <Lock className="w-4 h-4 text-security-primary" />
                    </div>
                    <h4 className="font-medium">Account Security</h4>
                  </div>
                  <span className="text-sm font-medium text-red-500">
                    65%
                  </span>
                </div>
                <Progress 
                  value={65} 
                  className="h-2 mb-4"
                />
                <div className="text-sm space-y-2">
                  <p className="text-muted-foreground">
                    2FA is not enabled on your primary account, which presents a significant security risk.
                  </p>
                  <p className="flex items-center text-security-danger">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span>Enable two-factor authentication immediately.</span>
                  </p>
                </div>
              </div>
              
              {/* Data Protection */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-security-primary/10 flex items-center justify-center mr-3">
                      <Globe className="w-4 h-4 text-security-primary" />
                    </div>
                    <h4 className="font-medium">Data Protection</h4>
                  </div>
                  <span className="text-sm font-medium text-green-500">
                    85%
                  </span>
                </div>
                <Progress 
                  value={85} 
                  className="h-2 mb-4"
                />
                <div className="text-sm space-y-2">
                  <p className="text-muted-foreground">
                    Your data protection practices are strong, with {securityStatus.darkWebExposures} data breach exposures found.
                  </p>
                  <p className="flex items-center text-green-500">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    <span>Continue monitoring for data breaches regularly.</span>
                  </p>
                </div>
              </div>
              
              {/* Connection Security */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-security-primary/10 flex items-center justify-center mr-3">
                      <Wifi className="w-4 h-4 text-security-primary" />
                    </div>
                    <h4 className="font-medium">Connection Security</h4>
                  </div>
                  <span className="text-sm font-medium text-yellow-500">
                    75%
                  </span>
                </div>
                <Progress 
                  value={75} 
                  className="h-2 mb-4"
                />
                <div className="text-sm space-y-2">
                  <p className="text-muted-foreground">
                    Your network security is generally good, but some connections may be vulnerable.
                  </p>
                  <p className="flex items-center text-security-warning">
                    <Info className="h-4 w-4 mr-1" />
                    <span>Avoid using public WiFi networks for sensitive transactions.</span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Recommendations */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Recommended Actions</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="min-w-4 mt-0.5 mr-2 text-security-danger">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <span>Enable two-factor authentication on all accounts</span>
                </li>
                <li className="flex items-start">
                  <div className="min-w-4 mt-0.5 mr-2 text-security-warning">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <span>Update the {securityStatus.weakPasswords} weak passwords identified in your password vault</span>
                </li>
                <li className="flex items-start">
                  <div className="min-w-4 mt-0.5 mr-2 text-security-warning">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <span>Complete your security checklist (7/10 complete)</span>
                </li>
                <li className="flex items-start">
                  <div className="min-w-4 mt-0.5 mr-2 text-security-primary">
                    <Info className="h-4 w-4" />
                  </div>
                  <span>Review app permissions on your connected accounts</span>
                </li>
              </ul>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between items-center border-t p-4 mt-2">
            <Button
              variant="outline"
              onClick={() => setIsDetailedReportOpen(false)}
            >
              Close
            </Button>
            <Button 
              className="bg-security-primary hover:bg-security-primary/90"
              onClick={() => {
                setIsDetailedReportOpen(false);
                navigate('/security-verification');
              }}
            >
              Fix Security Issues
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default SecurityStatus;
