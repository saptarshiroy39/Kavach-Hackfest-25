import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import SecurityCard from '@/components/security/SecurityCard';
import SecurityBadge from '@/components/security/SecurityBadge';
import { mockApi, SecurityStatus, User, SecurityEvent } from '@/lib/mockDb';
import { 
  Shield, 
  Key, 
  AlertCircle, 
  CheckCircle2, 
  Bell, 
  ArrowRight, 
  ExternalLink,
  Lock,
  User as UserIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null);
  const [recentEvents, setRecentEvents] = useState<SecurityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [animateScore, setAnimateScore] = useState(0);
  const [animatePasswordHealth, setAnimatePasswordHealth] = useState(0);
  const scoreAnimationControls = useAnimation();
  const passwordHealthAnimationControls = useAnimation();
  const { toast } = useToast();
  const { t } = useLanguage();
  const scoreCircleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await mockApi.getCurrentUser();
        const statusData = await mockApi.getSecurityStatus();
        const eventsData = await mockApi.getSecurityEvents();
        
        setUser(userData);
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

  // Animate the security score and password health when data is loaded
  useEffect(() => {
    if (!securityStatus || isLoading) return;

    // Animate score from 0 to actual value
    const scoreAnimation = async () => {
      await scoreAnimationControls.start({
        strokeDasharray: [`0 283`, `${securityStatus.overallScore * 2.83} 283`],
        transition: { duration: 1.5, ease: "easeOut" }
      });
    };

    // Animate the score number
    const animateScoreNumber = () => {
      const duration = 1500;
      const frameDuration = 1000 / 60;
      const totalFrames = Math.round(duration / frameDuration);
      const finalValue = securityStatus.overallScore;
      
      let frame = 0;
      const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const currentValue = Math.round(progress * finalValue);
        
        setAnimateScore(currentValue);
        
        if (frame === totalFrames) {
          clearInterval(counter);
        }
      }, frameDuration);
    };

    // Animate password health from 0 to actual value
    const passwordHealthAnimation = async () => {
      const duration = 1500;
      const frameDuration = 1000 / 60;
      const totalFrames = Math.round(duration / frameDuration);
      const finalValue = securityStatus.passwordHealth || 0;
      
      let frame = 0;
      const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const currentValue = Math.round(progress * finalValue);
        
        setAnimatePasswordHealth(currentValue);
        
        if (frame === totalFrames) {
          clearInterval(counter);
        }
      }, frameDuration);
    };

    // Start animations
    scoreAnimation();
    animateScoreNumber();
    passwordHealthAnimation();
  }, [securityStatus, isLoading, scoreAnimationControls]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-16 h-16 border-t-4 border-security-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading your security dashboard...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Welcome section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t('welcomeBack')}, {user?.name}</h1>
            <p className="text-muted-foreground mt-1">
              {t('securityDashboard')} - {t('lastUpdated')} {formatDate(securityStatus?.lastScanDate || '')}
            </p>
          </div>
          <div className="flex mt-4 md:mt-0">
            <Button className="bg-security-primary hover:bg-security-primary/90">
              {t('runSecurityScan')}
            </Button>
          </div>
        </div>

        {/* Security score */}
        <SecurityCard
          className="mb-6"
          title={t('securityScore')}
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
                <span className="text-sm text-muted-foreground">{t('protected')}</span>
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
                  ref={scoreCircleRef}
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
                  strokeDasharray={`0 283`}
                  strokeLinecap="round"
                  animate={scoreAnimationControls}
                  initial={{ strokeDasharray: "0 283" }}
                />
              </svg>
            </div>
            
            <div className="flex-1 space-y-4 mt-4 md:mt-0">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{t('passwordHealth')}</span>
                  <span className="text-sm font-medium">{animatePasswordHealth}%</span>
                </div>
                <motion.div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-security-primary rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${animatePasswordHealth}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </motion.div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-security-danger/10 flex items-center justify-center mr-3">
                    <AlertCircle className="w-4 h-4 text-security-danger" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{securityStatus?.vulnerableAccounts || 0}</p>
                    <p className="text-xs text-muted-foreground">{t('vulnerableAccounts')}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-security-warning/10 flex items-center justify-center mr-3">
                    <Key className="w-4 h-4 text-security-warning" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{securityStatus?.reusedPasswords || 0}</p>
                    <p className="text-xs text-muted-foreground">{t('reusedPasswords')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SecurityCard>

        {/* Security overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SecurityCard
            title={t('authentication')}
            icon={<Lock className="w-5 h-5 text-security-primary" />}
            status={user?.hasTwoFactor ? 'secure' : 'warning'}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('twoFactor')}</span>
                <SecurityBadge 
                  status={user?.hasTwoFactor ? 'secure' : 'danger'} 
                  text={user?.hasTwoFactor ? t('enabled') : t('disabled')}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('biometric')}</span>
                <SecurityBadge 
                  status={user?.hasBiometrics ? 'secure' : 'warning'} 
                  text={user?.hasBiometrics ? t('enabled') : t('disabled')}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('blockchainVerify')}</span>
                <SecurityBadge 
                  status={user?.hasBlockchainVerification ? 'secure' : 'warning'} 
                  text={user?.hasBlockchainVerification ? t('enabled') : t('disabled')}
                />
              </div>
              <Button 
                className="w-full mt-2" 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/authentication')}
              >
                <span>{t('manage')}</span>
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </SecurityCard>

          <SecurityCard
            title={t('passwordVault')}
            icon={<Key className="w-5 h-5 text-security-primary" />}
            status={securityStatus?.passwordHealth && securityStatus.passwordHealth >= 80 ? 'secure' : 'warning'}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('totalPasswords')}</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('weakPasswords')}</span>
                <span className="text-security-danger font-medium">{securityStatus?.weakPasswords || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('passwordUpdated')}</span>
                <span className="text-xs text-muted-foreground">{formatDate(user?.passwordLastChanged || '')}</span>
              </div>
              <Button 
                className="w-full mt-2" 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/password-vault')}
              >
                <span>{t('openVault')}</span>
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </SecurityCard>

          <SecurityCard
            title={t('accountSettings')}
            icon={<UserIcon className="w-5 h-5 text-security-primary" />}
            status="secure"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('accountType')}</span>
                <span className="capitalize">{user?.subscriptionTier || 'Free'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('email')}</span>
                <span className="text-xs truncate max-w-[150px]">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('phone')}</span>
                <span className="text-xs">{user?.phone || t('notAdded')}</span>
              </div>
              <Button 
                className="w-full mt-2" 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/settings')}
              >
                <span>{t('accountSettings')}</span>
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </SecurityCard>
        </div>

        {/* Recent security events */}
        <SecurityCard
          title={t('recentSecurityEvents')}
          icon={<Bell className="w-5 h-5 text-security-primary" />}
          action={
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/notifications')}
            >
              <span>{t('viewAll')}</span>
              <ExternalLink className="ml-2 w-4 h-4" />
            </Button>
          }
        >
          <div className="space-y-4">
            {recentEvents.length > 0 ? (
              recentEvents.map((event) => (
                <div key={event.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    event.severity === 'high' 
                      ? 'bg-security-danger/10 text-security-danger' 
                      : event.severity === 'medium'
                      ? 'bg-security-warning/10 text-security-warning'
                      : 'bg-security-secondary/10 text-security-secondary'
                  }`}>
                    {event.severity === 'high' ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : event.severity === 'medium' ? (
                      <Bell className="w-5 h-5" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <span className="text-xs text-muted-foreground">{formatDate(event.date)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">{t('noRecentEvents')}</p>
              </div>
            )}
          </div>
        </SecurityCard>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
