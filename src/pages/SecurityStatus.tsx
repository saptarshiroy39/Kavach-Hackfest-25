
import React from 'react';
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
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { securityStatus } from '@/lib/mockDb';

const SecurityStatus = () => {
  const navigate = useNavigate();
  
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
                  <Button variant="outline" size="sm">
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
            </div>

            <div className="text-center mt-6">
              <Button className="bg-security-primary hover:bg-security-primary/90">
                <Shield className="mr-2 h-4 w-4" />
                <span>Run Full Security Scan</span>
              </Button>
            </div>
          </div>
        </SecurityCard>
      </div>
    </MainLayout>
  );
};

export default SecurityStatus;
