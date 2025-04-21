
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SecurityCard from '@/components/security/SecurityCard';
import { 
  Shield, 
  Link, 
  CheckCircle2, 
  Wallet, 
  Lock,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockApi } from '@/lib/mockDb';
import { useToast } from '@/hooks/use-toast';

const BlockchainVerify = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const handleVerify = async () => {
    if (!walletAddress || !walletAddress.startsWith('0x')) {
      toast({
        title: "Invalid wallet address",
        description: "Please enter a valid Ethereum wallet address starting with 0x",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      const result = await mockApi.verifyBlockchain(walletAddress);
      if (result.success) {
        setIsConnected(true);
        toast({
          title: "Wallet connected successfully",
          description: "Your blockchain wallet is now linked to your account",
        });
      } else {
        toast({
          title: "Connection failed",
          description: result.error || "Failed to connect your wallet. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Blockchain Verification</h1>
          <p className="text-muted-foreground mt-1">
            Connect your wallet for enhanced security and verification
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SecurityCard
              className="mb-6"
              title="Connect Blockchain Wallet"
              icon={<Wallet className="w-5 h-5 text-security-primary" />}
              status={isConnected ? 'secure' : undefined}
            >
              <div className="space-y-6">
                {!isConnected ? (
                  <>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm">
                        Connect your blockchain wallet to enable additional security features:
                      </p>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                        <li>Decentralized identity verification</li>
                        <li>Enhanced authentication security</li>
                        <li>Transaction signing for critical security changes</li>
                        <li>Non-custodial backup options</li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="wallet-address">Wallet Address</Label>
                      <Input
                        id="wallet-address"
                        placeholder="0x..."
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter your Ethereum wallet address starting with 0x
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-4">
                      <Button variant="outline">
                        Scan QR Code
                      </Button>
                      <Button 
                        className="bg-security-primary hover:bg-security-primary/90"
                        onClick={handleVerify}
                        disabled={isConnecting}
                      >
                        {isConnecting ? (
                          <>
                            <div className="w-4 h-4 border-t-2 border-security-primary-foreground rounded-full animate-spin mr-2"></div>
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Link className="mr-2 h-4 w-4" />
                            Connect Wallet
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-security-secondary/10 p-4 rounded-lg flex items-center">
                      <CheckCircle2 className="w-6 h-6 text-security-secondary mr-3" />
                      <div>
                        <h3 className="font-medium">Wallet Connected Successfully</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Your blockchain wallet is now linked to your account for enhanced security.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Wallet Address</span>
                        <span className="text-sm font-mono">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Network</span>
                        <span className="text-sm">Ethereum</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Connection Status</span>
                        <span className="text-sm text-security-secondary">Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Last Verified</span>
                        <span className="text-sm">Just now</span>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                      <Button variant="outline" size="sm">
                        <Settings className="mr-2 h-4 w-4" />
                        Manage
                      </Button>
                      <Button variant="outline" size="sm" className="text-security-danger">
                        Disconnect
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </SecurityCard>
          </div>

          <div className="space-y-6">
            <SecurityCard
              title="Why Use Blockchain Verification?"
              icon={<Shield className="w-5 h-5 text-security-primary" />}
            >
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-security-primary/10 flex items-center justify-center mr-3">
                    <Lock className="w-5 h-5 text-security-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Enhanced Security</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Blockchain provides cryptographic security that's virtually impossible to breach.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-security-secondary/10 flex items-center justify-center mr-3">
                    <Link className="w-5 h-5 text-security-secondary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Decentralized Identity</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your identity is verified without relying on central authorities.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-security-warning/10 flex items-center justify-center mr-3">
                    <Wallet className="w-5 h-5 text-security-warning" />
                  </div>
                  <div>
                    <h3 className="font-medium">Self-Sovereign Control</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      You maintain full control over your identity and verification.
                    </p>
                  </div>
                </div>

                <a href="#" className="block text-security-primary text-sm mt-4 hover:underline">
                  Learn more about blockchain security →
                </a>
              </div>
            </SecurityCard>

            <SecurityCard
              title="Compatible Wallets"
              icon={<Wallet className="w-5 h-5 text-security-primary" />}
            >
              <div className="space-y-4">
                <div className="p-3 border border-muted rounded-lg flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full mr-3 flex items-center justify-center text-white font-bold">
                    M
                  </div>
                  <span className="font-medium">MetaMask</span>
                </div>
                <div className="p-3 border border-muted rounded-lg flex items-center">
                  <div className="w-8 h-8 bg-gray-700 rounded-full mr-3 flex items-center justify-center text-white font-bold">
                    L
                  </div>
                  <span className="font-medium">Ledger</span>
                </div>
                <div className="p-3 border border-muted rounded-lg flex items-center">
                  <div className="w-8 h-8 bg-purple-600 rounded-full mr-3 flex items-center justify-center text-white font-bold">
                    T
                  </div>
                  <span className="font-medium">Trezor</span>
                </div>
                <div className="p-3 border border-muted rounded-lg flex items-center">
                  <div className="w-8 h-8 bg-blue-700 rounded-full mr-3 flex items-center justify-center text-white font-bold">
                    C
                  </div>
                  <span className="font-medium">Coinbase Wallet</span>
                </div>
              </div>
            </SecurityCard>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BlockchainVerify;
