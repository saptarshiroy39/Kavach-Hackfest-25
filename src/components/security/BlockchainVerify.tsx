import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, AlertCircle, ExternalLink, Shield, Lock } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BlockchainNetwork, NETWORK_CONFIG, BLOCKCHAIN_SETTINGS } from '@/lib/blockchain/config';
import { useBlockchain } from '@/context/BlockchainContext';
import { VerificationStatus as VerificationStatusType } from '@/lib/blockchain/contracts';

interface BlockchainVerifyProps {
  userId: string;
}

const BlockchainVerify: React.FC<BlockchainVerifyProps> = ({ userId }) => {
  const { 
    connection, 
    verificationStatus, 
    isLoading, 
    connectToWallet, 
    switchToNetwork,
    verifyIdentity,
    refreshVerificationStatus
  } = useBlockchain();
  
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [verifyStep, setVerifyStep] = useState<'info' | 'connecting' | 'signature' | 'verifying' | 'complete'>('info');
  const [isDialogLoading, setIsDialogLoading] = useState(false);
  
  // Generate a verification message for this user
  const generateVerificationMessage = (userId: string) => {
    return `Verify my identity for Kavach Security App\nUser ID: ${userId}\nTimestamp: ${Date.now()}`;
  };
  
  // Get user verification status
  useEffect(() => {
    if (connection.isConnected) {
      refreshVerificationStatus();
    }
  }, [connection.isConnected]);
  
  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp * 1000).toLocaleString();
  };
    // Handle verify button click
  const handleVerifyClick = () => {
    console.log('Verify button clicked');
    setShowVerifyDialog(true);
    setVerifyStep('info');
  };
  
  // Connect wallet
  const handleConnect = async () => {
    console.log('Connect button clicked');
    setIsDialogLoading(true);
    setVerifyStep('connecting');
    
    try {
      // Check if MetaMask is installed
      if (typeof window === 'undefined' || typeof window.ethereum === 'undefined') {
        console.warn('No wallet found');
        setVerifyStep('info');
        return;
      }
      
      console.log('Attempting to connect wallet...');
      const connected = await connectToWallet();
      console.log('Connection result:', connected);
      
      if (connected) {
        console.log('Wallet connected successfully');
        // Check if we're on the correct network
        const targetNetwork = BLOCKCHAIN_SETTINGS.useTestnet ? 
          NETWORK_CONFIG[connection.network].testnetChainId : 
          NETWORK_CONFIG[connection.network].chainId;
          
        console.log('Current chain ID:', connection.chainId, 'Target:', targetNetwork);
          
        if (connection.chainId !== targetNetwork) {
          console.log('Network mismatch, attempting to switch...');
          try {
            const networkSwitched = await switchToNetwork(connection.network);
            if (!networkSwitched) {
              console.warn('Network switch failed, continuing anyway');
            }
          } catch (switchError) {
            console.error('Network switching error:', switchError);
            // Continue anyway, we'll try to work with current network
          }
        }
        
        setVerifyStep('signature');
      } else {
        console.log('Connection failed');
        setVerifyStep('info');
      }
    } catch (error) {
      console.error('Connection error:', error);
      setVerifyStep('info');
    } finally {
      setIsDialogLoading(false);
    }
  };
    // Handle verification
  const handleVerification = async () => {
    console.log('Starting verification process...');
    setIsDialogLoading(true);
    setVerifyStep('verifying');
    
    try {
      // Generate verification message
      const message = generateVerificationMessage(userId);
      console.log('Generated message:', message);
      
      // Request signature from wallet
      const signer = connection.signer;
      if (!signer) {
        throw new Error('No signer available - wallet connection may have been lost');
      }
      
      console.log('Requesting signature...');
      const signature = await signer.signMessage(message);
      console.log('Signature received:', signature);
      
      // Hash the message for on-chain storage
      const messageHash = ethers.keccak256(ethers.toUtf8Bytes(message));
      console.log('Message hash:', messageHash);
      
      // Verify on blockchain
      console.log('Submitting to blockchain...');
      const success = await verifyIdentity(messageHash, signature);
      console.log('Blockchain verification result:', success);
      
      if (success) {
        console.log('Verification successful!');
        setVerifyStep('complete');
        // Refresh verification status after successful verification
        setTimeout(() => {
          refreshVerificationStatus();
        }, 2000);
      } else {
        console.log('Verification failed');
        setVerifyStep('signature');
      }
    } catch (error) {
      console.error('Verification error:', error);
      
      // Check if it's a user rejection
      if (error.code === 4001 || error.message?.includes('rejected')) {
        console.log('User rejected signature request');
        setVerifyStep('signature');
      } else {
        console.log('Technical error during verification');
        setVerifyStep('signature');
      }
    } finally {
      setIsDialogLoading(false);
    }
  };
    // Get status badge
  const getStatusBadge = () => {
    if (!verificationStatus) {
      return <Badge variant="outline" className="border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-400">Not Verified</Badge>;
    }
    
    if (verificationStatus.isVerified) {
      return <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600">Verified</Badge>;
    }
    
    switch (verificationStatus.status) {
      case 1:
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-amber-500">Pending</Badge>;
      case 3:
        return <Badge className="bg-red-600 hover:bg-red-700 text-white border-red-600">Revoked</Badge>;
      default:
        return <Badge variant="outline" className="border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-400">Not Verified</Badge>;
    }
  };
    return (
    <>
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <span>Blockchain Verification</span>
          </CardTitle>
          <CardDescription>
            Securely verify your identity on the blockchain for enhanced security
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-security-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Verification Status</span>
                {getStatusBadge()}
              </div>
              
              {verificationStatus?.isVerified && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Verified Since</span>
                    <span className="text-sm text-muted-foreground">{formatTimestamp(verificationStatus.timestamp)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Trust Score</span>
                    <span className="text-sm">{verificationStatus.trustScore}/100</span>
                  </div>
                    <Alert className="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <AlertTitle className="text-emerald-800 dark:text-emerald-200">Verified on Blockchain</AlertTitle>
                    <AlertDescription className="text-emerald-700 dark:text-emerald-300">
                      Your identity is securely verified on the blockchain, providing tamper-proof security.
                    </AlertDescription>
                  </Alert>
                </>
              )}
                {!verificationStatus?.isVerified && (
                <Alert className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <AlertTitle className="text-red-800 dark:text-red-200">Not Verified</AlertTitle>
                  <AlertDescription className="text-red-700 dark:text-red-300">
                    Your identity is not verified on the blockchain. Verify now for enhanced security.
                  </AlertDescription>
                </Alert>
              )}
                {connection.isConnected && (
                <div className="flex items-center justify-between p-3 border border-emerald-200 dark:border-emerald-800/50 rounded-md bg-emerald-50/50 dark:bg-emerald-950/20">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Wallet Connected</span>
                  </div>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                    {connection.account?.substring(0, 6)}...{connection.account?.substring(connection.account.length - 4)}
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>        <CardFooter className="pt-4">
          <Button 
            onClick={handleVerifyClick} 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isLoading}
          >
            {verificationStatus?.isVerified ? 'Update Verification' : 'Verify on Blockchain'}
          </Button>
        </CardFooter>
      </Card>
        {/* Verification Dialog */}
      <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <DialogContent className="sm:max-w-md dialog-content border-border/50 bg-card/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {verifyStep === 'info' && 'Blockchain Verification'}
              {verifyStep === 'connecting' && 'Connecting Wallet'}
              {verifyStep === 'signature' && 'Sign Verification Message'}
              {verifyStep === 'verifying' && 'Verifying Identity'}
              {verifyStep === 'complete' && 'Verification Complete'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {verifyStep === 'info' && 'Verify your identity securely on the blockchain'}
              {verifyStep === 'connecting' && 'Please approve the connection request in your wallet'}
              {verifyStep === 'signature' && 'Sign the message to verify your identity'}
              {verifyStep === 'verifying' && 'Submitting verification to the blockchain'}
              {verifyStep === 'complete' && 'Your identity has been verified on the blockchain'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">            {verifyStep === 'info' && (
              <div className="space-y-4">                <div className="flex flex-col items-center justify-center gap-2 p-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground">Blockchain Identity Verification</h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Lock className="h-4 w-4 mt-0.5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Secure & Immutable</p>
                      <p className="text-xs text-muted-foreground">Your identity is verified on the blockchain, making it impossible to tamper with.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Trusted Verification</p>
                      <p className="text-xs text-muted-foreground">Provides cryptographic proof of your identity for enhanced security.</p>
                    </div>
                  </div>
                </div>
                
                <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50">
                  <AlertTitle className="text-blue-800 dark:text-blue-200">You'll need a Web3 wallet</AlertTitle>
                  <AlertDescription className="text-blue-700 dark:text-blue-300">
                    This process requires MetaMask or another Web3 wallet. You'll be asked to connect your wallet and sign a message.
                  </AlertDescription>
                </Alert>
                  {/* Debug info */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Debug Information</span>
                    </div>
                    <div className="space-y-1 text-slate-600 dark:text-slate-400">
                      <div className="flex justify-between">
                        <span>Window.ethereum:</span>
                        <span className={`font-medium ${typeof window !== 'undefined' && window.ethereum ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                          {typeof window !== 'undefined' && window.ethereum ? 'Available' : 'Not available'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Connection status:</span>
                        <span className={`font-medium ${connection.isConnected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                          {connection.isConnected ? 'Connected' : 'Not connected'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Current network:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{connection.network}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Chain ID:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{connection.chainId || 'None'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Account:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300 font-mono text-[10px]">
                          {connection.account ? `${connection.account.substring(0, 8)}...${connection.account.substring(connection.account.length - 6)}` : 'None'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
              {verifyStep === 'connecting' && (
              <div className="flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-sm text-center text-muted-foreground">
                  Please check your wallet and approve the connection request
                </p>
              </div>
            )}
              {verifyStep === 'signature' && (
              <div className="space-y-4">
                <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50">
                  <AlertTitle className="text-blue-800 dark:text-blue-200">Sign the message in your wallet</AlertTitle>
                  <AlertDescription className="text-blue-700 dark:text-blue-300">
                    You'll be asked to sign a message that verifies your identity. This won't cost any gas fees.
                  </AlertDescription>
                </Alert>
                
                <div className="p-3 border border-border rounded-md bg-muted/30">
                  <p className="text-sm font-mono overflow-auto text-foreground">
                    {generateVerificationMessage(userId)}
                  </p>
                </div>
                
                {connection.isConnected && (
                  <div className="flex items-center justify-between p-3 border border-emerald-200 dark:border-emerald-800/50 rounded-md bg-emerald-50/50 dark:bg-emerald-950/20">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Connected to</span>
                    </div>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                      {connection.account?.substring(0, 6)}...{connection.account?.substring(connection.account.length - 4)}
                    </span>
                  </div>
                )}
              </div>
            )}
              {verifyStep === 'verifying' && (
              <div className="flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-sm text-center text-foreground">
                  Submitting your verification to the blockchain...
                </p>
                <p className="text-xs text-muted-foreground text-center">
                  This may take a few moments to complete.
                </p>
              </div>
            )}
              {verifyStep === 'complete' && (
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-medium text-foreground">Verification Successful!</h3>
                <p className="text-sm text-center text-muted-foreground">
                  Your identity has been verified on the blockchain. This provides cryptographic proof of your identity.
                </p>
                
                {connection.chainId && (
                  <a
                    href={`${BLOCKCHAIN_SETTINGS.useTestnet ? 
                      NETWORK_CONFIG[connection.network].testnetBlockExplorer : 
                      NETWORK_CONFIG[connection.network].blockExplorer}/tx/${verificationStatus?.timestamp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center text-sm text-primary hover:text-primary/80 gap-1"
                  >
                    <span>View on Blockchain</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}
          </div>
            <DialogFooter>
            {verifyStep === 'info' && (
              <>
                <Button variant="outline" onClick={() => setShowVerifyDialog(false)} className="border-border hover:bg-muted">Cancel</Button>
                <Button onClick={handleConnect} disabled={isDialogLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  {isDialogLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Connect Wallet
                </Button>
              </>
            )}
            
            {verifyStep === 'connecting' && (
              <Button variant="outline" onClick={() => setShowVerifyDialog(false)} disabled={isDialogLoading} className="border-border hover:bg-muted">
                Cancel
              </Button>
            )}
            
            {verifyStep === 'signature' && (
              <>
                <Button variant="outline" onClick={() => setShowVerifyDialog(false)} disabled={isDialogLoading} className="border-border hover:bg-muted">
                  Cancel
                </Button>
                <Button onClick={handleVerification} disabled={isDialogLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  {isDialogLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign & Verify
                </Button>
              </>
            )}
            
            {verifyStep === 'verifying' && (
              <Button variant="outline" onClick={() => setShowVerifyDialog(false)} disabled={isDialogLoading} className="border-border hover:bg-muted">
                Cancel
              </Button>
            )}
            
            {verifyStep === 'complete' && (
              <Button onClick={() => setShowVerifyDialog(false)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Done
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BlockchainVerify; 