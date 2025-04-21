import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SecurityCard from '@/components/security/SecurityCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  Mail, 
  Smartphone, 
  Phone, 
  QrCode, 
  CreditCard, 
  UploadCloud, 
  File,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockApi } from '@/lib/mockDb';
import { motion } from 'framer-motion';

const SecurityScanner = () => {
  const [scanTab, setScanTab] = useState('email');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  
  const [emailContent, setEmailContent] = useState('');
  
  const [smsContent, setSmsContent] = useState('');
  
  const [callNumber, setCallNumber] = useState('');
  const [callDuration, setCallDuration] = useState('');
  
  const [qrCodeImage, setQrCodeImage] = useState('');
  
  const { toast } = useToast();
  
  const handleEmailScan = async () => {
    if (!emailContent.trim()) {
      toast({
        title: "Email content required",
        description: "Please enter the email content to scan.",
        variant: "destructive",
      });
      return;
    }
    
    setIsScanning(true);
    setScanResult(null);
    
    try {
      const result = await mockApi.detectPhishingEmail(emailContent);
      setScanResult(result);
      
      toast({
        title: result.isPhishing ? "Phishing detected!" : "Email appears legitimate",
        description: result.isPhishing 
          ? "This email contains potential phishing indicators." 
          : "No suspicious elements detected in this email.",
        variant: result.isPhishing ? "destructive" : "default",
      });
    } catch (error) {
      toast({
        title: "Scan failed",
        description: "Could not complete the email scan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };
  
  const handleSmsScan = async () => {
    if (!smsContent.trim()) {
      toast({
        title: "SMS content required",
        description: "Please enter the SMS content to scan.",
        variant: "destructive",
      });
      return;
    }
    
    setIsScanning(true);
    setScanResult(null);
    
    try {
      const result = await mockApi.detectSmsScam(smsContent);
      setScanResult(result);
      
      toast({
        title: result.isScam ? "SMS scam detected!" : "SMS appears legitimate",
        description: result.isScam 
          ? "This SMS contains potential scam indicators." 
          : "No suspicious elements detected in this SMS.",
        variant: result.isScam ? "destructive" : "default",
      });
    } catch (error) {
      toast({
        title: "Scan failed",
        description: "Could not complete the SMS scan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };
  
  const handleVoipScan = async () => {
    if (!callNumber.trim()) {
      toast({
        title: "Phone number required",
        description: "Please enter the phone number to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    setIsScanning(true);
    setScanResult(null);
    
    try {
      const duration = parseInt(callDuration) || 0;
      const result = await mockApi.detectVoipScam({ number: callNumber, duration });
      setScanResult(result);
      
      toast({
        title: result.isScam ? "Suspicious call detected!" : "Call appears legitimate",
        description: result.isScam 
          ? "This call matches patterns of known scam calls." 
          : "No suspicious patterns detected for this call.",
        variant: result.isScam ? "destructive" : "default",
      });
    } catch (error) {
      toast({
        title: "Scan failed",
        description: "Could not complete the call analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };
  
  const handleQrScan = async () => {
    if (!qrCodeImage.trim()) {
      toast({
        title: "QR code required",
        description: "Please upload or enter the QR code URL to scan.",
        variant: "destructive",
      });
      return;
    }
    
    setIsScanning(true);
    setScanResult(null);
    
    try {
      const result = await mockApi.verifyQrCode(qrCodeImage);
      setScanResult(result);
      
      toast({
        title: result.isValid ? "QR code appears safe" : "Suspicious QR code detected!",
        description: result.isValid 
          ? "This QR code doesn't show any suspicious patterns." 
          : "This QR code has suspicious characteristics and may not be safe.",
        variant: result.isValid ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Scan failed",
        description: "Could not complete the QR code analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };
  
  const renderScanResults = () => {
    if (!scanResult) return null;
    
    let statusIcon;
    let statusText;
    let statusColor;
    
    if (scanTab === 'email' || scanTab === 'sms') {
      const isThreatenening = scanTab === 'email' ? scanResult.isPhishing : scanResult.isScam;
      
      statusIcon = isThreatenening ? (
        <XCircle className="w-10 h-10 text-security-danger" />
      ) : (
        <CheckCircle className="w-10 h-10 text-security-secondary" />
      );
      
      statusText = isThreatenening 
        ? (scanTab === 'email' ? 'Potential phishing detected' : 'Potential scam detected') 
        : 'Appears legitimate';
      
      statusColor = isThreatenening ? 'text-security-danger' : 'text-security-secondary';
    } else if (scanTab === 'voip') {
      statusIcon = scanResult.isScam ? (
        <XCircle className="w-10 h-10 text-security-danger" />
      ) : (
        <CheckCircle className="w-10 h-10 text-security-secondary" />
      );
      
      statusText = scanResult.isScam ? 'Suspicious call detected' : 'Call appears legitimate';
      statusColor = scanResult.isScam ? 'text-security-danger' : 'text-security-secondary';
    } else if (scanTab === 'qr') {
      statusIcon = scanResult.isValid ? (
        <CheckCircle className="w-10 h-10 text-security-secondary" />
      ) : (
        <XCircle className="w-10 h-10 text-security-danger" />
      );
      
      statusText = scanResult.isValid ? 'QR code appears safe' : 'Suspicious QR code detected';
      statusColor = scanResult.isValid ? 'text-security-secondary' : 'text-security-danger';
    }
    
    return (
      <motion.div 
        className="mt-6 p-4 border border-white/10 rounded-lg glass-effect"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center mb-4">
          {statusIcon}
          <h3 className={`text-xl font-bold ml-2 ${statusColor}`}>{statusText}</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-1">Confidence score:</p>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${scanResult.confidence > 70 ? 'bg-security-danger' : 
                  scanResult.confidence > 40 ? 'bg-security-warning' : 'bg-security-secondary'}`}
                initial={{ width: 0 }}
                animate={{ width: `${scanResult.confidence}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Safe (0%)</span>
              <span>{Math.round(scanResult.confidence)}%</span>
              <span>Threat (100%)</span>
            </div>
          </div>
          
          {scanResult.reasons && (
            <div>
              <p className="text-sm font-medium mb-2">Analysis:</p>
              <ul className="space-y-2">
                {scanResult.reasons.map((reason: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-security-warning mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="pt-2">
            <p className="text-sm text-muted-foreground">
              This is an AI-powered analysis and should be used as a guide only. Always use your best judgment.
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <MainLayout>
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-3xl font-bold">Security Scanner</h1>
          <p className="text-muted-foreground mt-1">
            Scan for phishing, scams, and other security threats
          </p>
        </div>
        
        <SecurityCard
          title="AI-Powered Threat Detection"
          icon={<Shield className="w-5 h-5 text-security-primary" />}
          subtitle="Detect various types of security threats using advanced AI"
          className="glass-card hover-scale-slight"
        >
          <Tabs 
            defaultValue="email" 
            value={scanTab} 
            onValueChange={setScanTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="email" className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Email</span>
              </TabsTrigger>
              <TabsTrigger value="sms" className="flex items-center">
                <Smartphone className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">SMS</span>
              </TabsTrigger>
              <TabsTrigger value="voip" className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Call</span>
              </TabsTrigger>
              <TabsTrigger value="qr" className="flex items-center">
                <QrCode className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">QR Code</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="email" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Phishing Email Scanner</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Paste the suspicious email content below to check for phishing attempts.
                </p>
                
                <Textarea
                  placeholder="Paste email content here..."
                  className="min-h-[200px]"
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                />
                
                <Button 
                  onClick={handleEmailScan} 
                  className="mt-4 bg-security-primary hover:bg-security-primary/90 bounce-hover"
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <>
                      <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                      Scanning...
                    </>
                  ) : (
                    <>
                      <File className="w-5 h-5 mr-2" />
                      Analyze Email
                    </>
                  )}
                </Button>
              </div>
              
              {renderScanResults()}
            </TabsContent>
            
            <TabsContent value="sms" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">SMS Scam Detector</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Paste the suspicious SMS content below to check for SMS-based scams.
                </p>
                
                <Textarea
                  placeholder="Paste SMS content here..."
                  className="min-h-[150px]"
                  value={smsContent}
                  onChange={(e) => setSmsContent(e.target.value)}
                />
                
                <Button 
                  onClick={handleSmsScan} 
                  className="mt-4 bg-security-primary hover:bg-security-primary/90 bounce-hover"
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <>
                      <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                      Scanning...
                    </>
                  ) : (
                    <>
                      <File className="w-5 h-5 mr-2" />
                      Analyze SMS
                    </>
                  )}
                </Button>
              </div>
              
              {renderScanResults()}
            </TabsContent>
            
            <TabsContent value="voip" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Suspicious Call Analyzer</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Enter details about a suspicious call to check if it matches known scam patterns.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <Input
                      placeholder="+1 (555) 123-4567"
                      value={callNumber}
                      onChange={(e) => setCallNumber(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Call Duration (seconds)</label>
                    <Input
                      type="number"
                      placeholder="120"
                      value={callDuration}
                      onChange={(e) => setCallDuration(e.target.value)}
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleVoipScan} 
                  className="mt-4 bg-security-primary hover:bg-security-primary/90 bounce-hover"
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <>
                      <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <File className="w-5 h-5 mr-2" />
                      Analyze Call
                    </>
                  )}
                </Button>
              </div>
              
              {renderScanResults()}
            </TabsContent>
            
            <TabsContent value="qr" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">QR Code Validator</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload or provide a link to a QR code to verify if it's legitimate or potentially malicious.
                </p>
                
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center flex flex-col items-center">
                    <UploadCloud className="w-12 h-12 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag & drop a QR code image here, or click to browse
                    </p>
                    <Button variant="outline" className="hover-scale">Upload QR Code</Button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Or enter QR code URL</label>
                    <Input
                      placeholder="https://example.com/qrcode.png"
                      value={qrCodeImage}
                      onChange={(e) => setQrCodeImage(e.target.value)}
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleQrScan} 
                  className="mt-4 bg-security-primary hover:bg-security-primary/90 bounce-hover"
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <>
                      <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                      Scanning...
                    </>
                  ) : (
                    <>
                      <File className="w-5 h-5 mr-2" />
                      Validate QR Code
                    </>
                  )}
                </Button>
              </div>
              
              {renderScanResults()}
            </TabsContent>
          </Tabs>
        </SecurityCard>
      </motion.div>
    </MainLayout>
  );
};

export default SecurityScanner;
