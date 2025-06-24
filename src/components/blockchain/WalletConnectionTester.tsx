import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, AlertCircle, Wallet } from "lucide-react";

const WalletConnectionTester: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    isConnected: boolean;
    account?: string;
    chainId?: string;
    error?: string;
  }>({ isConnected: false });
  const [walletInfo, setWalletInfo] = useState<{
    hasEthereum: boolean;
    provider?: string;
  }>({ hasEthereum: false });

  useEffect(() => {
    // Check wallet availability
    const checkWallet = () => {
      if (typeof window !== 'undefined') {
        const hasEthereum = typeof window.ethereum !== 'undefined';
        let provider = 'None';
        
        if (hasEthereum) {
          if (window.ethereum.isMetaMask) {
            provider = 'MetaMask';
          } else if (window.ethereum.isTrust) {
            provider = 'Trust Wallet';
          } else if (window.ethereum.isCoinbaseWallet) {
            provider = 'Coinbase Wallet';
          } else {
            provider = 'Unknown Wallet';
          }
        }
        
        setWalletInfo({ hasEthereum, provider });
      }
    };

    checkWallet();
  }, []);

  const testConnection = async () => {
    setIsConnecting(true);
    setConnectionStatus({ isConnected: false });

    try {
      if (typeof window === 'undefined' || typeof window.ethereum === 'undefined') {
        throw new Error('No wallet found. Please install MetaMask or another Web3 wallet.');
      }

      console.log('Requesting accounts...');
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from wallet');
      }

      console.log('Getting chain ID...');
      const chainId = await window.ethereum.request({
        method: 'eth_chainId'
      });

      console.log('Connection successful!');
      setConnectionStatus({
        isConnected: true,
        account: accounts[0],
        chainId: chainId
      });

    } catch (error: any) {
      console.error('Connection failed:', error);
      let errorMessage = 'Unknown error occurred';
      
      if (error.code === 4001) {
        errorMessage = 'User rejected the connection request';
      } else if (error.code === -32002) {
        errorMessage = 'Connection request already pending';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setConnectionStatus({
        isConnected: false,
        error: errorMessage
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setConnectionStatus({ isConnected: false });
  };
  return (
    <Card className="w-full max-w-lg border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <div className="p-2 rounded-full bg-primary/10">
            <Wallet className="h-4 w-4 text-primary" />
          </div>
          Wallet Connection Tester
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Test your Web3 wallet connection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Wallet Info */}
        <div className="p-3 bg-muted/30 border border-border/50 rounded-lg">
          <h4 className="text-sm font-medium mb-2 text-foreground">Wallet Detection</h4>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Ethereum Provider:</span>
              <span className={`font-medium ${walletInfo.hasEthereum ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {walletInfo.hasEthereum ? '✓ Available' : '✗ Not Available'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Detected Wallet:</span>
              <span className="font-medium text-foreground">{walletInfo.provider}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Window.ethereum:</span>
              <span className={`font-medium ${typeof window !== 'undefined' && window.ethereum ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {typeof window !== 'undefined' && window.ethereum ? 'Present' : 'Missing'}
              </span>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        {connectionStatus.isConnected ? (
          <Alert className="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <AlertDescription className="text-emerald-800 dark:text-emerald-200">
              <div className="space-y-1">
                <p className="font-medium">Wallet Connected!</p>
                <p className="text-xs opacity-80">Account: {connectionStatus.account?.substring(0, 6)}...{connectionStatus.account?.substring(connectionStatus.account.length - 4)}</p>
                <p className="text-xs opacity-80">Chain ID: {connectionStatus.chainId}</p>
              </div>
            </AlertDescription>
          </Alert>
        ) : connectionStatus.error ? (
          <Alert className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              <div className="space-y-1">
                <p className="font-medium">Connection Failed</p>
                <p className="text-xs opacity-80">{connectionStatus.error}</p>
              </div>
            </AlertDescription>
          </Alert>
        ) : null}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={testConnection} 
            disabled={isConnecting || !walletInfo.hasEthereum}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isConnecting ? 'Connecting...' : 'Test Connection'}
          </Button>
          
          {connectionStatus.isConnected && (
            <Button 
              variant="outline" 
              onClick={disconnectWallet}
              className="border-border hover:bg-muted"
            >
              Disconnect
            </Button>
          )}
        </div>

        {!walletInfo.hasEthereum && (
          <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50">
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <div className="space-y-2">
                <p className="font-medium">No wallet detected</p>
                <p className="text-xs opacity-80">Install MetaMask or another Web3 wallet to test the connection.</p>
                <a 
                  href="https://metamask.io/download/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-xs font-medium inline-flex items-center gap-1"
                >
                  Download MetaMask →
                </a>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletConnectionTester;
