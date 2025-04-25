import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Shield, 
  LockKeyhole, 
  BarChart, 
  History,
  FileText
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BlockchainVerifyComponent from '@/components/security/BlockchainVerify';
import { getCurrentUser } from '@/lib/mockDb';
import { BlockchainTabs, BlockchainTabContent } from '@/components/security/BlockchainTabs';

const BlockchainVerifyPage = () => {
  const user = getCurrentUser();
  const [activeTab, setActiveTab] = useState('verify');
  
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Blockchain Verification</h1>
            <p className="text-muted-foreground mt-1">
              Securely verify your identity and security events on the blockchain
            </p>
          </div>
        </div>
        
        <BlockchainTabs 
          defaultTab="verify" 
          onTabChange={handleTabChange}
          className="max-w-md mb-6"
        />
        
        <BlockchainTabContent activeTab={activeTab}>
          {activeTab === 'verify' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <BlockchainVerifyComponent userId={user.id} />
              </div>
              
              <div className="space-y-6">
                <div className="border rounded-lg p-6 bg-card">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-security-primary/10">
                      <LockKeyhole className="h-5 w-5 text-security-primary" />
                    </div>
                    <h3 className="font-medium">About Blockchain Verification</h3>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <p className="text-muted-foreground">
                      Blockchain verification provides a secure and immutable way to verify your identity and security events.
                    </p>
                    
                    <div className="py-2">
                      <h4 className="font-medium mb-1">Benefits:</h4>
                      <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                        <li>Tamper-proof security records</li>
                        <li>Decentralized identity verification</li>
                        <li>Cryptographic proof of security events</li>
                        <li>Enhanced protection against fraud</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-6 bg-card">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-security-primary/10">
                      <BarChart className="h-5 w-5 text-security-primary" />
                    </div>
                    <h3 className="font-medium">Trust Score</h3>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <p className="text-muted-foreground">
                      Your blockchain trust score is calculated based on your verification status and security events.
                    </p>
                    
                    <div className="py-2">
                      <h4 className="font-medium mb-1">Factors:</h4>
                      <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                        <li>Identity verification</li>
                        <li>Account age</li>
                        <li>Security incident history</li>
                        <li>Authentication methods</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'events' && (
            <div className="border rounded-lg p-6">
              <h3 className="font-medium mb-4">Security Events on Blockchain</h3>
              <p className="text-muted-foreground">
                No security events have been recorded on the blockchain yet. Verify your identity first.
              </p>
            </div>
          )}
          
          {activeTab === 'explorer' && (
            <div className="border rounded-lg p-6">
              <h3 className="font-medium mb-4">Blockchain Explorer</h3>
              <p className="text-muted-foreground">
                Connect your wallet to view your blockchain transactions.
              </p>
            </div>
          )}
        </BlockchainTabContent>
      </div>
    </MainLayout>
  );
};

export default BlockchainVerifyPage;
