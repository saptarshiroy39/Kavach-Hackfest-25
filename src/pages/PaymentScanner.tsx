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
import { useLanguage } from '@/hooks/use-language';

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
  const { t } = useLanguage();

  const handleUPIAnalysis = async () => {
    if (!upiId.trim()) {
      toast({
        title: t("upiIdRequired"),
        description: t("pleaseEnterUpiId"),
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
          isValidFormat ? t("upiIdFormatValid") : t("upiIdFormatInvalid"),
          isKnownProvider ? t("recognizedPaymentProvider") : t("unrecognizedPaymentProvider"),
          t("blockchainVerificationComplete"),
          isSecure ? t("noReportedFrauds") : t("potentialSecurityConcerns")
        ],
        recommendation: isSecure 
          ? t("upiIdLegitimateRecommendation")
          : t("upiIdSuspiciousRecommendation")
      });
      
      toast({
        title: isSecure ? t("verificationSuccessful") : t("warningPotentialRisk"),
        description: isSecure 
          ? t("upiIdLegitimate") 
          : t("upiIdFraudulent"),
        variant: isSecure ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: t("verificationFailed"),
        description: t("couldNotCompleteUpiVerification"),
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getProviderInfo = (provider: string) => {
    const providers: {[key: string]: string} = {
      'okicici': t("iciciBank"),
      'okhdfcbank': t("hdfcBank"),
      'oksbi': t("sbiBank"),
      'okaxis': t("axisBank"),
      'ybl': t("phonePe"),
      'paytm': t("paytm"),
      'gpay': t("googlePay")
    };
    
    for (const [key, value] of Object.entries(providers)) {
      if (provider.includes(key)) return value;
    }
    
    return t("unknownProvider");
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
        title: t("qrCodeRequired"),
        description: t("pleaseUploadQrCode"),
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
        providerInfo: isSecure ? t("googlePay") : undefined,
        details: isSecure 
          ? [
              t("qrCodeVerifiedBlockchain"),
              t("paymentProviderLegitimate"),
              t("noSuspiciousRedirects"),
              t("merchantIdentityConfirmed")
            ] 
          : [
              t("qrCodeIntegrityIssues"),
              t("suspiciousPaymentDestination"),
              t("possiblePaymentRedirect"),
              t("merchantIdentityUnverified")
            ],
        recommendation: isSecure 
          ? t("qrCodeLegitimateRecommendation")
          : t("qrCodeSuspiciousRecommendation")
      });
      
      toast({
        title: isSecure ? t("qrCodeVerified") : t("suspiciousQrCode"),
        description: isSecure 
          ? t("qrCodeLegitimate") 
          : t("qrCodeFraudulent"),
        variant: isSecure ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: t("analysisFailed"),
        description: t("couldNotCompleteQrCodeAnalysis"),
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
        title: t("cameraAccessError"),
        description: t("couldNotAccessCamera"),
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
          <h1 className="text-3xl font-bold">{t("paymentSecurity")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("verifyPaymentMethodsDescription")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <SecurityCard
            className="mb-6"
            title={t("paymentVerification")}
            icon={<CreditCard className="w-5 h-5 text-security-primary" />}
            subtitle={t("verifyUpiAndQrDescription")}
          >
            <Tabs defaultValue="upi" className="w-full">
              <TabsList className="grid w-full md:w-auto grid-cols-2 mb-4">
                <TabsTrigger value="upi" className="flex items-center">
                  <Wallet className="w-4 h-4 mr-2" />
                  <span>{t("upiVerification")}</span>
                </TabsTrigger>
                <TabsTrigger value="qrcode" className="flex items-center">
                  <QrCode className="w-4 h-4 mr-2" />
                  <span>{t("qrCodeScanner")}</span>
                </TabsTrigger>
              </TabsList>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-4">
                <div className="lg:col-span-3 space-y-4">
                  <TabsContent value="upi" className="space-y-4 mt-0">
                    <div className="glass-card p-4 rounded-lg">
                      <h3 className="font-medium mb-2 flex items-center">
                        <Wallet className="w-5 h-5 mr-2 text-security-primary" />
                        {t("upiIdVerification")}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t("enterUpiIdToVerify")}
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
                                {t("verifying")}
                              </>
                            ) : (
                              <>{t("verifyUpi")}</>
                            )}
                          </Button>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <h4 className="text-sm font-medium mb-2">{t("commonUpiProviders")}:</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-xs flex items-center">
                              <span className="w-2 h-2 bg-security-primary rounded-full mr-2"></span>
                              @okicici - {t("iciciBank")}
                            </div>
                            <div className="text-xs flex items-center">
                              <span className="w-2 h-2 bg-security-primary rounded-full mr-2"></span>
                              @oksbi - {t("sbiBank")}
                            </div>
                            <div className="text-xs flex items-center">
                              <span className="w-2 h-2 bg-security-primary rounded-full mr-2"></span>
                              @okhdfcbank - {t("hdfcBank")}
                            </div>
                            <div className="text-xs flex items-center">
                              <span className="w-2 h-2 bg-security-primary rounded-full mr-2"></span>
                              @okaxis - {t("axisBank")}
                            </div>
                            <div className="text-xs flex items-center">
                              <span className="w-2 h-2 bg-security-primary rounded-full mr-2"></span>
                              @ybl - {t("phonePe")}
                            </div>
                            <div className="text-xs flex items-center">
                              <span className="w-2 h-2 bg-security-primary rounded-full mr-2"></span>
                              @paytm - {t("paytm")}
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
                        {t("paymentQrCodeScanner")}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t("scanQrCodeToVerify")}
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
                                  alt={t("qrCodePreviewAlt")} 
                                  className="max-h-40 object-contain mb-3"
                                />
                                <p className="text-sm text-muted-foreground">{t("clickToChangeQrCode")}</p>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center cursor-pointer">
                                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                                <p className="font-medium">{t("uploadQrCode")}</p>
                                <p className="text-sm text-muted-foreground mt-1">{t("clickToBrowseOrDragDrop")}</p>
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
                              {t("scanWithCamera")}
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              onClick={stopCamera}
                              className="bounce-hover"
                            >
                              {t("stopCamera")}
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
                                {t("analyzing")}
                              </>
                            ) : (
                              <>{t("verifyQrCode")}</>
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
                      <h3 className="font-medium mb-4">{t("verificationResults")}</h3>
                      
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{t("securityScore")}</span>
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
                            <span className="font-medium">{t("verifiedSecure")}</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-security-danger">
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            <span className="font-medium">{t("potentialScamDetected")}</span>
                          </div>
                        )}
                      </div>
                      
                      {analysisResult.providerInfo && (
                        <div className="bg-muted/50 rounded-lg p-3 mb-4">
                          <p className="text-sm">
                            <span className="font-medium">{t("provider")}:</span> {analysisResult.providerInfo}
                          </p>
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">{t("verificationDetails")}:</h4>
                          <ul className="space-y-2">
                            {analysisResult.details.map((detail, index) => (
                              <li key={index} className="text-sm flex items-start">
                                <span className="flex-shrink-0 mt-0.5 mr-2">
                                  {detail.includes(t("legitimate")) || detail.includes(t("valid")) || detail.includes(t("confirmed")) || detail.includes(t("verified")) ? (
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
                          <h4 className="text-sm font-medium mb-2">{t("recommendation")}:</h4>
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
                              {t("reportScam")}
                            </Button>
                          )}
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className={`flex-1 ${analysisResult.isSecure ? 'text-security-secondary border-security-secondary/30' : 'text-muted-foreground'}`}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            {t("copyResults")}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {!analysisResult && (
                    <div className="glass-card rounded-lg p-4 h-full flex flex-col items-center justify-center text-center">
                      <ShieldCheck className="h-12 w-12 text-security-primary mb-4 animate-bob" />
                      <h3 className="font-medium mb-2">{t("paymentSecurity")}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t("verifyPaymentMethodsBeforeTransaction")}
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <span>{t("learnMore")}</span>
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
