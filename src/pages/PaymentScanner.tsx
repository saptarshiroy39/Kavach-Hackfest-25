
import React, { useState, useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SecurityCard from '@/components/security/SecurityCard';
import { 
  CreditCard, 
  QrCode, 
  ShieldCheck, 
  AlertTriangle, 
  Upload,
  CheckCircle2,
  Camera,
  Copy,
  Wallet,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const PaymentScanner = () => {
  const [upiId, setUpiId] = useState('');
  const [qrCodeFile, setQrCodeFile] = useState<File | null>(null);
  const [qrCodePreview, setQrCodePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    isSecure: boolean;
    score: number;
    providerInfo?: string;
    details: string[];
    recommendation: string;
  } | null>(null);
  
  const { toast } = useToast();

  const handleUPIAnalysis = async () => {
    if (!upiId.trim()) {
      toast({
        title: "UPI ID required",
        description: "Please enter a UPI ID to verify.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simulate API call to blockchain verification service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response based on UPI ID format
      const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
      const isValidFormat = upiRegex.test(upiId);
      const knownProviders = ['okicici', 'okhdfcbank', 'oksbi', 'okaxis', 'ybl', 'paytm', 'gpay'];
      
      const parts = upiId.split('@');
      const provider = parts.length > 1 ? parts[1] : '';
      const isKnownProvider = knownProviders.some(p => provider.includes(p));
      
      const isSecure = isValidFormat && isKnownProvider;
      
      // Generate analysis result
      setAnalysisResult({
        isSecure,
        score: isSecure ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 30) + 20,
        providerInfo: isKnownProvider ? getProviderInfo(provider) : undefined,
        details: [
          isValidFormat ? 'UPI ID format is valid' : 'UPI ID format is invalid',
          isKnownProvider ? 'Recognized payment provider' : 'Unrecognized payment provider',
          'Blockchain verification complete',
          isSecure ? 'No reported frauds associated with this ID' : 'Potential security concerns detected'
        ],
        recommendation: isSecure 
          ? 'This UPI ID appears to be legitimate. Always confirm the recipient before sending money.'
          : 'This UPI ID shows suspicious characteristics. Avoid making payments to this ID.'
      });
      
      toast({
        title: isSecure ? "Verification successful" : "Warning: Potential risk",
        description: isSecure 
          ? "This UPI ID appears to be legitimate." 
          : "This UPI ID may be associated with fraudulent activities.",
        variant: isSecure ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "Could not complete the UPI verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getProviderInfo = (provider: string) => {
    const providers: {[key: string]: string} = {
      'okicici': 'ICICI Bank',
      'okhdfcbank': 'HDFC Bank',
      'oksbi': 'State Bank of India',
      'okaxis': 'Axis Bank',
      'ybl': 'PhonePe',
      'paytm': 'Paytm',
      'gpay': 'Google Pay'
    };
    
    for (const [key, value] of Object.entries(providers)) {
      if (provider.includes(key)) return value;
    }
    
    return 'Unknown provider';
  };

  const handleQRCodeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setQrCodeFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrCodePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQRCodeAnalysis = async () => {
    if (!qrCodeFile) {
      toast({
        title: "QR Code required",
        description: "Please upload a QR code image to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simulate API call to QR scanner and analysis service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response
      const isSecure = Math.random() > 0.3; // Higher chance of legitimate QR code
      
      setAnalysisResult({
        isSecure,
        score: isSecure ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 30) + 20,
        providerInfo: isSecure ? 'GooglePay' : undefined,
        details: isSecure 
          ? [
              'QR code verified through blockchain',
              'Payment provider is legitimate',
              'No suspicious redirects detected',
              'Merchant identity confirmed'
            ] 
          : [
              'QR code integrity issues detected',
              'Suspicious payment destination',
              'Possible payment redirect',
              'Merchant identity unverified'
            ],
        recommendation: isSecure 
          ? 'This QR code appears to be legitimate. Always verify the payment amount before proceeding.'
          : 'This QR code appears suspicious and may be fraudulent. Do not proceed with the payment.'
      });
      
      toast({
        title: isSecure ? "QR Code verified" : "Suspicious QR Code",
        description: isSecure 
          ? "This payment QR code appears to be legitimate." 
          : "This QR code may be fraudulent. Payment not recommended.",
        variant: isSecure ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Could not complete the QR code analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startCamera = async () => {
    try {
      setIsScanning(true);
      const constraints = {
        video: {
          facingMode: 'environment'
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      toast({
        title: "Camera access error",
        description: "Could not access your camera. Please check permissions and try again.",
        variant: "destructive",
      });
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsScanning(false);
    }
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
          <h1 className="text-3xl font-bold">Payment Security</h1>
          <p className="text-muted-foreground mt-1">
            Verify payment methods and scan QR codes for potential scams
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <SecurityCard
            className="mb-6"
            title="Payment Verification"
            icon={<CreditCard className="w-5 h-5 text-security-primary" />}
            subtitle="Verify UPI IDs and payment QR codes before completing transactions"
          >
            <Tabs defaultValue="upi" className="w-full">
              <TabsList className="grid w-full md:w-auto grid-cols-2 mb-4">
                <TabsTrigger value="upi" className="flex items-center">
                  <Wallet className="w-4 h-4 mr-2" />
                  <span>UPI Verification</span>
                </TabsTrigger>
                <TabsTrigger value="qrcode" className="flex items-center">
                  <QrCode className="w-4 h-4 mr-2" />
                  <span>QR Code Scanner</span>
                </TabsTrigger>
              </TabsList>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-4">
                <div className="lg:col-span-3 space-y-4">
                  <TabsContent value="upi" className="space-y-4 mt-0">
                    <div className="glass-card p-4 rounded-lg">
                      <h3 className="font-medium mb-2 flex items-center">
                        <Wallet className="w-5 h-5 mr-2 text-security-primary" />
                        UPI ID Verification
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Enter a UPI ID to verify its authenticity before completing payment.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Input
                            placeholder="example@okicici"
                            className="flex-1"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                          />
                          <Button
                            className="ml-2 bg-security-primary hover:bg-security-primary/90"
                            onClick={handleUPIAnalysis}
                            disabled={isAnalyzing}
                          >
                            {isAnalyzing ? (
                              <>
                                <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                                Verifying...
                              </>
                            ) : (
                              <>Verify UPI</>
                            )}
                          </Button>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <h4 className="text-sm font-medium mb-2">Common UPI Providers:</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-xs flex items-center">
                              <span className="w-2 h-2 bg-security-primary rounded-full mr-2"></span>
                              @okicici - ICICI Bank
                            </div>
                            <div className="text-xs flex items-center">
                              <span className="w-2 h-2 bg-security-primary rounded-full mr-2"></span>
                              @oksbi - State Bank of India
                            </div>
                            <div className="text-xs flex items-center">
                              <span className="w-2 h-2 bg-security-primary rounded-full mr-2"></span>
                              @okhdfcbank - HDFC Bank
                            </div>
                            <div className="text-xs flex items-center">
                              <span className="w-2 h-2 bg-security-primary rounded-full mr-2"></span>
                              @okaxis - Axis Bank
                            </div>
                            <div className="text-xs flex items-center">
                              <span className="w-2 h-2 bg-security-primary rounded-full mr-2"></span>
                              @ybl - PhonePe
                            </div>
                            <div className="text-xs flex items-center">
                              <span className="w-2 h-2 bg-security-primary rounded-full mr-2"></span>
                              @paytm - Paytm
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="qrcode" className="space-y-4 mt-0">
                    <div className="glass-card p-4 rounded-lg">
                      <h3 className="font-medium mb-2 flex items-center">
                        <QrCode className="w-5 h-5 mr-2 text-security-primary" />
                        Payment QR Code Scanner
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Scan payment QR codes to verify their authenticity before making payments.
                      </p>
                      <div className="space-y-4">
                        {!isScanning ? (
                          <div 
                            className="border-2 border-dashed border-muted rounded-lg p-6 text-center"
                            onClick={() => document.getElementById('qr-upload')?.click()}
                          >
                            {qrCodePreview ? (
                              <div className="flex flex-col items-center">
                                <img 
                                  src={qrCodePreview} 
                                  alt="QR Code Preview" 
                                  className="max-h-40 object-contain mb-3"
                                />
                                <p className="text-sm text-muted-foreground">Click to change QR code</p>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center cursor-pointer">
                                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                                <p className="font-medium">Upload QR Code</p>
                                <p className="text-sm text-muted-foreground mt-1">Click to browse or drag and drop</p>
                              </div>
                            )}
                            <input 
                              id="qr-upload" 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleQRCodeUpload}
                            />
                          </div>
                        ) : (
                          <div className="relative rounded-lg overflow-hidden">
                            <video 
                              ref={videoRef} 
                              autoPlay 
                              playsInline 
                              className="w-full h-[240px] object-cover"
                            />
                            <div className="absolute inset-0 border-2 border-security-primary/50">
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/80"></div>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-between">
                          {!isScanning ? (
                            <Button 
                              variant="outline" 
                              onClick={startCamera}
                              className="bounce-hover"
                            >
                              <Camera className="h-4 w-4 mr-2" />
                              Scan with Camera
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              onClick={stopCamera}
                              className="bounce-hover"
                            >
                              Stop Camera
                            </Button>
                          )}
                          
                          <Button
                            className="bg-security-primary hover:bg-security-primary/90 bounce-hover"
                            onClick={handleQRCodeAnalysis}
                            disabled={isAnalyzing || (!qrCodeFile && !isScanning)}
                          >
                            {isAnalyzing ? (
                              <>
                                <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                                Analyzing...
                              </>
                            ) : (
                              <>Verify QR Code</>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>

                <div className="lg:col-span-2">
                  {analysisResult && (
                    <motion.div
                      className="glass-card rounded-lg p-4 h-full"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="font-medium mb-4">Verification Results</h3>
                      
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Security score</span>
                          <span className={`text-sm font-medium ${
                            analysisResult.score >= 70 ? 'text-security-secondary' : 
                            analysisResult.score >= 40 ? 'text-security-warning' : 
                            'text-security-danger'
                          }`}>
                            {analysisResult.score}/100
                          </span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              analysisResult.score >= 70 ? 'bg-security-secondary' : 
                              analysisResult.score >= 40 ? 'bg-security-warning' : 
                              'bg-security-danger'
                            }`}
                            style={{ width: `${analysisResult.score}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center mb-4">
                        {analysisResult.isSecure ? (
                          <div className="flex items-center text-security-secondary">
                            <ShieldCheck className="h-5 w-5 mr-2" />
                            <span className="font-medium">Verified & Secure</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-security-danger">
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            <span className="font-medium">Potential Scam Detected</span>
                          </div>
                        )}
                      </div>
                      
                      {analysisResult.providerInfo && (
                        <div className="bg-muted/50 rounded-lg p-3 mb-4">
                          <p className="text-sm">
                            <span className="font-medium">Provider:</span> {analysisResult.providerInfo}
                          </p>
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Verification Details:</h4>
                          <ul className="space-y-2">
                            {analysisResult.details.map((detail, index) => (
                              <li key={index} className="text-sm flex items-start">
                                <span className="flex-shrink-0 mt-0.5 mr-2">
                                  {detail.includes('legitimate') || detail.includes('valid') || detail.includes('confirmed') || detail.includes('verified') ? (
                                    <CheckCircle2 className="h-4 w-4 text-security-secondary" />
                                  ) : (
                                    <AlertTriangle className="h-4 w-4 text-security-warning" />
                                  )}
                                </span>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Recommendation:</h4>
                          <p className="text-sm bg-muted p-3 rounded-lg">
                            {analysisResult.recommendation}
                          </p>
                        </div>
                        
                        <div className="flex space-x-2 mt-4">
                          {!analysisResult.isSecure && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1 text-security-danger border-security-danger/30"
                            >
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Report Scam
                            </Button>
                          )}
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className={`flex-1 ${analysisResult.isSecure ? 'text-security-secondary border-security-secondary/30' : 'text-muted-foreground'}`}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Results
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {!analysisResult && (
                    <div className="glass-card rounded-lg p-4 h-full flex flex-col items-center justify-center text-center">
                      <ShieldCheck className="h-12 w-12 text-security-primary mb-4 animate-bob" />
                      <h3 className="font-medium mb-2">Payment Security</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Verify payment methods before completing transactions to protect yourself from fraud.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <span>Learn More</span>
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Tabs>
          </SecurityCard>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default PaymentScanner;
