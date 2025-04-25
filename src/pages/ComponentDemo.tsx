import React, { useState } from 'react';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { SecurityNav } from '@/components/security/SecurityNav';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { BlockchainVerification } from '@/components/blockchain/BlockchainVerification';
import { AdvancedVerification } from '@/components/security/AdvancedVerification';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';

export default function ComponentDemo() {
  const [isAdmin, setIsAdmin] = useState(true);
  const { toast } = useToast();
  
  const handleVerificationComplete = (method: string, success: boolean) => {
    if (success) {
      toast({
        title: 'Verification Callback Triggered',
        description: `${method} verification was successful.`,
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Component Demo</h1>
        <ThemeToggle />
      </div>
      
      <p className="text-lg text-muted-foreground">
        Showcasing the components built for the Kavach Security Platform
      </p>
      
      <div className="space-y-12">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Dashboard Navigation</h2>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input 
                  type="checkbox" 
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="rounded border-gray-300"
                />
                Admin Mode
              </label>
            </div>
          </div>
          <div className="border rounded-xl p-4 bg-background">
            <DashboardNav 
              isAdmin={isAdmin}
              onTabChange={(tab) => {
                toast({
                  title: "Tab Changed",
                  description: `Navigated to ${tab} tab`,
                });
              }}
            />
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Security Navigation</h2>
          <div className="border rounded-xl p-4 bg-background">
            <SecurityNav 
              onTabChange={(tab) => {
                toast({
                  title: "Security Tab Changed",
                  description: `Navigated to ${tab} security tab`,
                });
              }}
            />
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Blockchain Verification</h2>
          <div className="border rounded-xl p-4 bg-background">
            <BlockchainVerification 
              onTabChange={(tab) => {
                toast({
                  title: "Blockchain Tab Changed",
                  description: `Navigated to ${tab} verification tab`,
                });
              }}
            />
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Advanced Security Verification</h2>
          <div className="border rounded-xl p-4 bg-background">
            <div className="max-w-2xl mx-auto">
              <AdvancedVerification onVerificationComplete={handleVerificationComplete} />
            </div>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Theme Toggle Variants</h2>
          <div className="border rounded-xl p-6 bg-background">
            <div className="flex flex-wrap gap-8 items-center">
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium">Default</span>
                <ThemeToggle variant="default" />
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium">Outline</span>
                <ThemeToggle variant="outline" />
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium">Ghost</span>
                <ThemeToggle variant="ghost" />
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium">Small</span>
                <ThemeToggle size="sm" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 