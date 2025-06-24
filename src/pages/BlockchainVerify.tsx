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
import WalletConnectionTester from '@/components/blockchain/WalletConnectionTester';
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
      <div className="space-y-6">        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Blockchain Verification</h1>
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
        
        <BlockchainTabContent activeTab={activeTab}>          {activeTab === 'verify' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <BlockchainVerifyComponent userId={user.id} />
                  {/* Temporary debug component */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="border border-amber-200 dark:border-amber-800/50 rounded-lg p-4 bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-1.5 rounded-full bg-amber-500/20">
                        <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                        Debug: Wallet Connection Tester
                      </h3>
                    </div>
                    <WalletConnectionTester />
                  </div>
                )}
              </div>
                <div className="space-y-6">
                <div className="border border-border/50 rounded-lg p-6 bg-card/80 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-blue-500/10">
                      <LockKeyhole className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-medium text-foreground">About Blockchain Verification</h3>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <p className="text-muted-foreground">
                      Blockchain verification provides a secure and immutable way to verify your identity and security events.
                    </p>
                    
                    <div className="py-2">
                      <h4 className="font-medium mb-1 text-foreground">Benefits:</h4>
                      <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                        <li>Tamper-proof security records</li>
                        <li>Decentralized identity verification</li>
                        <li>Cryptographic proof of security events</li>
                        <li>Enhanced protection against fraud</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="border border-border/50 rounded-lg p-6 bg-card/80 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-emerald-500/10">
                      <BarChart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="font-medium text-foreground">Trust Score</h3>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <p className="text-muted-foreground">
                      Your blockchain trust score is calculated based on your verification status and security events.
                    </p>
                    
                    <div className="py-2">
                      <h4 className="font-medium mb-1 text-foreground">Factors:</h4>
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
            <div className="border border-border/50 rounded-lg p-6 bg-card/80 backdrop-blur-sm">
              <h3 className="font-medium mb-4 text-foreground">Security Events on Blockchain</h3>
              <p className="text-muted-foreground">
                No security events have been recorded on the blockchain yet. Verify your identity first.
              </p>
            </div>
          )}
          
          {activeTab === 'explorer' && (
            <div className="border border-border/50 rounded-lg p-6 bg-card/80 backdrop-blur-sm">
              <h3 className="font-medium mb-4 text-foreground">Blockchain Explorer</h3>
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
