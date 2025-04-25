import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { User, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SecurityVerificationTabs, SecurityVerificationContent } from '@/components/security/SecurityVerificationTabs';
import { getCurrentUser } from '@/lib/mockDb';

const AdvancedSecurityVerificationPage = () => {
  const user = getCurrentUser();
  const [activeTab, setActiveTab] = useState('protection');
  const [selectedUser, setSelectedUser] = useState(user);
  
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Advanced Security Verification</h1>
            <p className="text-muted-foreground mt-1">
              Protect your digital identity with blockchain-verified security
            </p>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4 md:mt-0 flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            <span>Select User</span>
          </Button>
        </div>
        
        <SecurityVerificationTabs 
          defaultTab="protection" 
          onTabChange={handleTabChange} 
          className="mb-6"
        />
        
        <SecurityVerificationContent activeTab={activeTab}>
          {activeTab === 'protection' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FeatureCard 
                  title="Biometric Authentication" 
                  description="Secure access with fingerprint or face recognition" 
                  status="enabled"
                  icon={<Shield className="h-6 w-6" />}
                />
                
                <FeatureCard 
                  title="Two-Factor Authentication" 
                  description="Add an extra layer of security to your account" 
                  status="enabled"
                  icon={<Shield className="h-6 w-6" />}
                />
                
                <FeatureCard 
                  title="Blockchain Verification" 
                  description="Cryptographically secure your identity" 
                  status="enabled"
                  icon={<Shield className="h-6 w-6" />}
                />
                
                <FeatureCard 
                  title="Encrypted Storage" 
                  description="Your data is encrypted and protected" 
                  status="enabled"
                  icon={<Shield className="h-6 w-6" />}
                />
                
                <FeatureCard 
                  title="Phishing Protection" 
                  description="Protection against deceptive websites" 
                  status="disabled"
                  icon={<Shield className="h-6 w-6" />}
                />
                
                <FeatureCard 
                  title="Dark Web Monitoring" 
                  description="Check if your data appears on the dark web" 
                  status="disabled"
                  icon={<Shield className="h-6 w-6" />}
                />
              </div>
            </div>
          )}
          
          {activeTab === 'verification' && (
            <div className="space-y-4">
              <div className="bg-card border p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Verification Status</h3>
                  <div className="flex items-center gap-2 text-security-secondary">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Verified</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Identity Verification</div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-security-secondary" />
                        <span>Verified on May 15, 2023</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Email Verification</div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-security-secondary" />
                        <span>Verified on May 12, 2023</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Phone Verification</div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-security-secondary" />
                        <span>Verified on May 14, 2023</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Blockchain Verification</div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-security-secondary" />
                        <span>Verified on May 16, 2023</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="text-sm text-muted-foreground mb-2">Verification History</div>
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between text-sm">
                        <span>Initial verification completed</span>
                        <span className="text-muted-foreground">May 12, 2023</span>
                      </li>
                      <li className="flex items-center justify-between text-sm">
                        <span>Phone number updated and verified</span>
                        <span className="text-muted-foreground">June 3, 2023</span>
                      </li>
                      <li className="flex items-center justify-between text-sm">
                        <span>Security questions updated</span>
                        <span className="text-muted-foreground">July 18, 2023</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/30 border p-4 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-security-warning" />
                  <span className="text-muted-foreground">Your verification will expire in 75 days. You will be notified when it's time to renew.</span>
                </div>
              </div>
            </div>
          )}
        </SecurityVerificationContent>
      </div>
    </MainLayout>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  status: 'enabled' | 'disabled';
  icon: React.ReactNode;
}

const FeatureCard = ({ title, description, status, icon }: FeatureCardProps) => {
  return (
    <div className="bg-card border rounded-lg p-5 transition-all duration-300 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-full ${status === 'enabled' ? 'bg-security-primary/10' : 'bg-muted'}`}>
          <div className={status === 'enabled' ? 'text-security-primary' : 'text-muted-foreground'}>
            {icon}
          </div>
        </div>
        
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{title}</h3>
            {status === 'enabled' ? (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-security-secondary/10 text-security-secondary">Enabled</span>
            ) : (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-muted text-muted-foreground">Disabled</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          
          {status === 'disabled' && (
            <Button variant="ghost" size="sm" className="mt-2 h-8 text-xs">
              Enable feature
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedSecurityVerificationPage; 