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
    setShowVerifyDialog(true);
    setVerifyStep('info');
  };
  
  // Connect wallet
  const handleConnect = async () => {
    setIsDialogLoading(true);
    setVerifyStep('connecting');
    
    try {
      // Check if MetaMask is installed
      if (typeof window === 'undefined' || typeof window.ethereum === 'undefined') {
        setVerifyStep('info');
        // Add link to MetaMask installation
        const dialogContent = document.querySelector('.dialog-content');
        if (dialogContent) {
          const errorEl = document.createElement('div');
          errorEl.className = 'mt-4 p-3 border rounded-md border-security-danger/50 bg-security-danger/10';
          errorEl.innerHTML = `
            <p class="text-sm font-medium text-security-danger">No wallet browser extension found</p>
            <p class="text-xs mt-1">Please install MetaMask or another web3 wallet to continue.</p>
            <a href="https://metamask.io/download/" target="_blank" rel="noreferrer"
              class="text-xs mt-2 flex items-center text-security-primary hover:underline">
              <span>Install MetaMask</span>
              <ExternalLink class="ml-1 h-3 w-3" />
            </a>
          `;
          dialogContent.appendChild(errorEl);
        }
        return;
      }
      
      const connected = await connectToWallet();
      if (connected) {
        // Check if we're on the correct network
        const targetNetwork = BLOCKCHAIN_SETTINGS.useTestnet ? 
          NETWORK_CONFIG[connection.network].testnetChainId : 
          NETWORK_CONFIG[connection.network].chainId;
          
        if (connection.chainId !== targetNetwork) {
          try {
            const networkSwitched = await switchToNetwork(connection.network);
            if (!networkSwitched) {
              throw new Error('Could not switch to the required network');
            }
          } catch (switchError) {
            console.error('Network switching error:', switchError);
            // Continue anyway, we'll try to work with current network
          }
        }
        
        setVerifyStep('signature');
      } else {
        // Connection failed, show appropriate message
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
    setIsDialogLoading(true);
    setVerifyStep('verifying');
    
    try {
      // Generate verification message
      const message = generateVerificationMessage(userId);
      
      // Request signature from wallet
      const signer = connection.signer;
      if (!signer) throw new Error('No signer available');
      
      const signature = await signer.signMessage(message);
      
      // Hash the message for on-chain storage
      const messageHash = ethers.keccak256(ethers.toUtf8Bytes(message));
      
      // Verify on blockchain
      const success = await verifyIdentity(messageHash, signature);
      
      if (success) {
        setVerifyStep('complete');
      } else {
        setVerifyStep('signature');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerifyStep('signature');
    } finally {
      setIsDialogLoading(false);
    }
  };
  
  // Get status badge
  const getStatusBadge = () => {
    if (!verificationStatus) {
      return <Badge variant="outline">Not Verified</Badge>;
    }
    
    if (verificationStatus.isVerified) {
      return <Badge className="bg-security-success text-white">Verified</Badge>;
    }
    
    switch (verificationStatus.status) {
      case 1:
        return <Badge className="bg-security-warning text-white">Pending</Badge>;
      case 3:
        return <Badge className="bg-security-danger text-white">Revoked</Badge>;
      default:
        return <Badge variant="outline">Not Verified</Badge>;
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-security-primary" />
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
                  
                  <Alert className="bg-security-success/10 text-security-success">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Verified on Blockchain</AlertTitle>
                    <AlertDescription>
                      Your identity is securely verified on the blockchain, providing tamper-proof security.
                    </AlertDescription>
                  </Alert>
                </>
              )}
              
              {!verificationStatus?.isVerified && (
                <Alert variant="destructive" className="bg-security-danger/10">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Not Verified</AlertTitle>
                  <AlertDescription>
                    Your identity is not verified on the blockchain. Verify now for enhanced security.
                  </AlertDescription>
                </Alert>
              )}
              
              {connection.isConnected && (
                <div className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Wallet Connected</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {connection.account?.substring(0, 6)}...{connection.account?.substring(connection.account.length - 4)}
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleVerifyClick} 
            className="w-full"
            disabled={isLoading}
          >
            {verificationStatus?.isVerified ? 'Update Verification' : 'Verify on Blockchain'}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Verification Dialog */}
      <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <DialogContent className="sm:max-w-md dialog-content">
          <DialogHeader>
            <DialogTitle>
              {verifyStep === 'info' && 'Blockchain Verification'}
              {verifyStep === 'connecting' && 'Connecting Wallet'}
              {verifyStep === 'signature' && 'Sign Verification Message'}
              {verifyStep === 'verifying' && 'Verifying Identity'}
              {verifyStep === 'complete' && 'Verification Complete'}
            </DialogTitle>
            <DialogDescription>
              {verifyStep === 'info' && 'Verify your identity securely on the blockchain'}
              {verifyStep === 'connecting' && 'Please approve the connection request in your wallet'}
              {verifyStep === 'signature' && 'Sign the message to verify your identity'}
              {verifyStep === 'verifying' && 'Submitting verification to the blockchain'}
              {verifyStep === 'complete' && 'Your identity has been verified on the blockchain'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {verifyStep === 'info' && (
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center gap-2 p-4">
                  <div className="p-3 rounded-full bg-security-primary/10">
                    <Shield className="h-6 w-6 text-security-primary" />
                  </div>
                  <h3 className="text-lg font-medium">Blockchain Identity Verification</h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Lock className="h-4 w-4 mt-0.5 text-security-primary" />
                    <div>
                      <p className="text-sm font-medium">Secure & Immutable</p>
                      <p className="text-xs text-muted-foreground">Your identity is verified on the blockchain, making it impossible to tamper with.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-security-primary" />
                    <div>
                      <p className="text-sm font-medium">Trusted Verification</p>
                      <p className="text-xs text-muted-foreground">Provides cryptographic proof of your identity for enhanced security.</p>
                    </div>
                  </div>
                </div>
                
                <Alert className="bg-muted text-foreground">
                  <AlertTitle>You'll need a Web3 wallet</AlertTitle>
                  <AlertDescription>
                    This process requires MetaMask or another Web3 wallet. You'll be asked to connect your wallet and sign a message.
                  </AlertDescription>
                </Alert>
              </div>
            )}
            
            {verifyStep === 'connecting' && (
              <div className="flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-security-primary" />
                <p className="text-sm text-center">
                  Please check your wallet and approve the connection request
                </p>
              </div>
            )}
            
            {verifyStep === 'signature' && (
              <div className="space-y-4">
                <Alert className="bg-muted text-foreground border-security-primary">
                  <AlertTitle>Sign the message in your wallet</AlertTitle>
                  <AlertDescription>
                    You'll be asked to sign a message that verifies your identity. This won't cost any gas fees.
                  </AlertDescription>
                </Alert>
                
                <div className="p-3 border rounded-md">
                  <p className="text-sm font-mono overflow-auto">
                    {generateVerificationMessage(userId)}
                  </p>
                </div>
                
                {connection.isConnected && (
                  <div className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Connected to</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {connection.account?.substring(0, 6)}...{connection.account?.substring(connection.account.length - 4)}
                    </span>
                  </div>
                )}
              </div>
            )}
            
            {verifyStep === 'verifying' && (
              <div className="flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-security-primary" />
                <p className="text-sm text-center">
                  Submitting your verification to the blockchain...
                </p>
                <p className="text-xs text-muted-foreground">
                  This may take a few moments to complete.
                </p>
              </div>
            )}
            
            {verifyStep === 'complete' && (
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="p-3 rounded-full bg-security-success/20">
                  <CheckCircle2 className="h-8 w-8 text-security-success" />
                </div>
                <h3 className="text-lg font-medium">Verification Successful!</h3>
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
                    className="flex items-center text-sm text-security-primary gap-1"
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
                <Button variant="outline" onClick={() => setShowVerifyDialog(false)}>Cancel</Button>
                <Button onClick={handleConnect} disabled={isDialogLoading}>
                  {isDialogLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Connect Wallet
                </Button>
              </>
            )}
            
            {verifyStep === 'connecting' && (
              <Button variant="outline" onClick={() => setShowVerifyDialog(false)} disabled={isDialogLoading}>
                Cancel
              </Button>
            )}
            
            {verifyStep === 'signature' && (
              <>
                <Button variant="outline" onClick={() => setShowVerifyDialog(false)} disabled={isDialogLoading}>
                  Cancel
                </Button>
                <Button onClick={handleVerification} disabled={isDialogLoading}>
                  {isDialogLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign & Verify
                </Button>
              </>
            )}
            
            {verifyStep === 'verifying' && (
              <Button variant="outline" onClick={() => setShowVerifyDialog(false)} disabled={isDialogLoading}>
                Cancel
              </Button>
            )}
            
            {verifyStep === 'complete' && (
              <Button onClick={() => setShowVerifyDialog(false)}>
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