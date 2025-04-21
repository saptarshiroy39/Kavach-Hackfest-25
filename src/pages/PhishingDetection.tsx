import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SecurityCard from '@/components/security/SecurityCard';
import { 
  Mail, 
  Phone,
  ShieldAlert,
  QrCode,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Upload,
  Copy,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const PhishingDetection = () => {
  const [emailContent, setEmailContent] = useState('');
  const [smsContent, setSmsContent] = useState('');
  const [urlToCheck, setUrlToCheck] = useState('');
  const [qrCodeFile, setQrCodeFile] = useState<File | null>(null);
  const [qrCodePreview, setQrCodePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    isThreat: boolean;
    score: number;
    reasons: string[];
    recommendation: string;
  } | null>(null);
  
  const { toast } = useToast();

  const handleEmailAnalysis = async () => {
    if (!emailContent.trim()) {
      toast({
        title: "Content required",
        description: "Please paste the email content to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simulate API call to AI analysis service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response based on content
      const isSuspicious = emailContent.toLowerCase().includes('urgent') || 
                           emailContent.toLowerCase().includes('password') ||
                           emailContent.toLowerCase().includes('verify') ||
                           emailContent.toLowerCase().includes('click here');
      
      const reasons = [];
      if (emailContent.toLowerCase().includes('urgent')) reasons.push('Contains urgency triggers');
      if (emailContent.toLowerCase().includes('password')) reasons.push('Asks for password or sensitive information');
      if (emailContent.toLowerCase().includes('verify')) reasons.push('Requests account verification');
      if (emailContent.toLowerCase().includes('click here')) reasons.push('Contains suspicious link patterns');
      
      setAnalysisResult({
        isThreat: isSuspicious,
        score: isSuspicious ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 30) + 10,
        reasons: reasons.length ? reasons : ['No suspicious patterns detected'],
        recommendation: isSuspicious 
          ? 'This email shows signs of phishing. Do not click on any links or provide personal information.'
          : 'This email appears to be legitimate, but always remain cautious.'
      });
      
      toast({
        title: isSuspicious ? "Phishing detected!" : "Analysis complete",
        description: isSuspicious 
          ? "This email contains suspicious elements." 
          : "No immediate threats detected in this email.",
        variant: isSuspicious ? "destructive" : "default",
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Could not complete the analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSMSAnalysis = async () => {
    if (!smsContent.trim()) {
      toast({
        title: "Content required",
        description: "Please paste the SMS content to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock response
      const isSuspicious = smsContent.toLowerCase().includes('click') || 
                           smsContent.toLowerCase().includes('prize') ||
                           smsContent.toLowerCase().includes('won') ||
                           smsContent.toLowerCase().includes('urgent');
      
      const reasons = [];
      if (smsContent.toLowerCase().includes('click')) reasons.push('Contains suspicious link invitation');
      if (smsContent.toLowerCase().includes('prize')) reasons.push('Mentions prizes (common in scams)');
      if (smsContent.toLowerCase().includes('won')) reasons.push('Claims you have won something unexpectedly');
      if (smsContent.toLowerCase().includes('urgent')) reasons.push('Creates false urgency');
      
      setAnalysisResult({
        isThreat: isSuspicious,
        score: isSuspicious ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 30) + 10,
        reasons: reasons.length ? reasons : ['No suspicious patterns detected'],
        recommendation: isSuspicious 
          ? 'This SMS shows signs of smishing (SMS phishing). Do not click on any links or respond.'
          : 'This SMS appears to be legitimate, but always remain cautious.'
      });
      
      toast({
        title: isSuspicious ? "Smishing detected!" : "Analysis complete",
        description: isSuspicious 
          ? "This SMS contains suspicious elements." 
          : "No immediate threats detected in this SMS.",
        variant: isSuspicious ? "destructive" : "default",
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Could not complete the analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleURLAnalysis = async () => {
    if (!urlToCheck.trim()) {
      toast({
        title: "URL required",
        description: "Please enter a URL to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response
      const suspiciousDomains = ['bit.ly', 'goo.gl', 'tinyurl', 'amaz0n', 'g00gle', 'paypa1', 'facebo0k'];
      const isSuspicious = suspiciousDomains.some(domain => urlToCheck.toLowerCase().includes(domain));
      
      const reasons = [];
      if (suspiciousDomains.some(domain => urlToCheck.toLowerCase().includes(domain))) {
        reasons.push('Uses suspicious domain or URL shortener');
      }
      if (!urlToCheck.toLowerCase().startsWith('https://')) {
        reasons.push('Does not use secure HTTPS connection');
      }
      if (urlToCheck.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
        reasons.push('Uses IP address instead of domain name');
      }
      
      setAnalysisResult({
        isThreat: isSuspicious || reasons.length > 0,
        score: (isSuspicious || reasons.length > 0) ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 30) + 10,
        reasons: reasons.length ? reasons : ['No suspicious patterns detected'],
        recommendation: (isSuspicious || reasons.length > 0)
          ? 'This URL shows signs of being malicious. Do not visit this website.'
          : 'This URL appears to be legitimate, but always remain cautious when sharing personal information.'
      });
      
      toast({
        title: (isSuspicious || reasons.length > 0) ? "Suspicious URL detected!" : "Analysis complete",
        description: (isSuspicious || reasons.length > 0)
          ? "This URL may lead to a phishing website." 
          : "No immediate threats detected in this URL.",
        variant: (isSuspicious || reasons.length > 0) ? "destructive" : "default",
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Could not complete the analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
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
      const isSuspicious = Math.random() > 0.5; // Random result for demo
      
      setAnalysisResult({
        isThreat: isSuspicious,
        score: isSuspicious ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 30) + 10,
        reasons: isSuspicious 
          ? ['QR code leads to suspicious domain', 'Contains obfuscated redirect links'] 
          : ['QR code leads to legitimate domain'],
        recommendation: isSuspicious 
          ? 'This QR code may lead to malicious content. Do not follow the link or provide any information.'
          : 'This QR code appears to be legitimate, but always verify the destination before providing personal information.'
      });
      
      toast({
        title: isSuspicious ? "Suspicious QR Code detected!" : "Analysis complete",
        description: isSuspicious 
          ? "This QR code may lead to malicious content." 
          : "No immediate threats detected in this QR code.",
        variant: isSuspicious ? "destructive" : "default",
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

  return (
    <MainLayout>
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-3xl font-bold">Threat Detection</h1>
          <p className="text-muted-foreground mt-1">
            Scan emails, SMS, URLs, and QR codes for potential security threats
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <SecurityCard
            className="mb-6"
            title="AI-Powered Threat Detection"
            icon={<ShieldAlert className="w-5 h-5 text-security-primary" />}
            subtitle="Our advanced AI scans for phishing, smishing, and malicious content patterns"
          >
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4 mb-4">
                <TabsTrigger value="email" className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>Email</span>
                </TabsTrigger>
                <TabsTrigger value="sms" className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>SMS</span>
                </TabsTrigger>
                <TabsTrigger value="url" className="flex items-center">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <span>URL</span>
                </TabsTrigger>
                <TabsTrigger value="qrcode" className="flex items-center">
                  <QrCode className="w-4 h-4 mr-2" />
                  <span>QR Code</span>
                </TabsTrigger>
              </TabsList>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-4">
                <div className="lg:col-span-3 space-y-4">
                  <TabsContent value="email" className="space-y-4 mt-0">
                    <div className="glass-card p-4 rounded-lg">
                      <h3 className="font-medium mb-2 flex items-center">
                        <Mail className="w-5 h-5 mr-2 text-security-primary" />
                        Email Phishing Detection
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Paste the suspicious email content below to check for phishing attempts.
                      </p>
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Paste email content here..."
                          className="min-h-[180px]"
                          value={emailContent}
                          onChange={(e) => setEmailContent(e.target.value)}
                        />
                        <div className="flex justify-end">
                          <Button
                            className="bg-security-primary hover:bg-security-primary/90"
                            onClick={handleEmailAnalysis}
                            disabled={isAnalyzing}
                          >
                            {isAnalyzing ? (
                              <>
                                <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                                Analyzing...
                              </>
                            ) : (
                              <>Analyze Email</>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="sms" className="space-y-4 mt-0">
                    <div className="glass-card p-4 rounded-lg">
                      <h3 className="font-medium mb-2 flex items-center">
                        <Smartphone className="w-5 h-5 mr-2 text-security-primary" />
                        SMS Smishing Detection
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Paste the suspicious SMS content below to check for smishing attempts.
                      </p>
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Paste SMS content here..."
                          className="min-h-[180px]"
                          value={smsContent}
                          onChange={(e) => setSmsContent(e.target.value)}
                        />
                        <div className="flex justify-end">
                          <Button
                            className="bg-security-primary hover:bg-security-primary/90"
                            onClick={handleSMSAnalysis}
                            disabled={isAnalyzing}
                          >
                            {isAnalyzing ? (
                              <>
                                <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                                Analyzing...
                              </>
                            ) : (
                              <>Analyze SMS</>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="url" className="space-y-4 mt-0">
                    <div className="glass-card p-4 rounded-lg">
                      <h3 className="font-medium mb-2 flex items-center">
                        <ExternalLink className="w-5 h-5 mr-2 text-security-primary" />
                        URL Safety Check
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Enter a URL to check if it's safe to visit.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Input
                            placeholder="https://example.com"
                            className="flex-1"
                            value={urlToCheck}
                            onChange={(e) => setUrlToCheck(e.target.value)}
                          />
                          <Button
                            className="ml-2 bg-security-primary hover:bg-security-primary/90"
                            onClick={handleURLAnalysis}
                            disabled={isAnalyzing}
                          >
                            {isAnalyzing ? (
                              <>
                                <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                                Checking...
                              </>
                            ) : (
                              <>Check URL</>
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          We'll analyze the URL for malicious content, redirects, and phishing indicators.
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="qrcode" className="space-y-4 mt-0">
                    <div className="glass-card p-4 rounded-lg">
                      <h3 className="font-medium mb-2 flex items-center">
                        <QrCode className="w-5 h-5 mr-2 text-security-primary" />
                        QR Code Scanner
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload a QR code image to scan and verify its safety.
                      </p>
                      <div className="space-y-4">
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
                        <div className="flex justify-end">
                          <Button
                            className="bg-security-primary hover:bg-security-primary/90"
                            onClick={handleQRCodeAnalysis}
                            disabled={isAnalyzing || !qrCodeFile}
                          >
                            {isAnalyzing ? (
                              <>
                                <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                                Scanning...
                              </>
                            ) : (
                              <>Scan QR Code</>
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
                      <h3 className="font-medium mb-4">Analysis Results</h3>
                      
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Threat score</span>
                          <span className={`text-sm font-medium ${
                            analysisResult.score >= 70 ? 'text-security-danger' : 
                            analysisResult.score >= 40 ? 'text-security-warning' : 
                            'text-security-secondary'
                          }`}>
                            {analysisResult.score}/100
                          </span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              analysisResult.score >= 70 ? 'bg-security-danger' : 
                              analysisResult.score >= 40 ? 'bg-security-warning' : 
                              'bg-security-secondary'
                            }`}
                            style={{ width: `${analysisResult.score}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center mb-4">
                        {analysisResult.isThreat ? (
                          <div className="flex items-center text-security-danger">
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            <span className="font-medium">Potential Threat Detected</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-security-secondary">
                            <CheckCircle2 className="h-5 w-5 mr-2" />
                            <span className="font-medium">No Immediate Threat</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Analysis Findings:</h4>
                          <ul className="space-y-2">
                            {analysisResult.reasons.map((reason, index) => (
                              <li key={index} className="text-sm flex items-start">
                                <span className="flex-shrink-0 mt-0.5 mr-2">•</span>
                                <span>{reason}</span>
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
                        
                        {analysisResult.isThreat && (
                          <div className="mt-4">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-security-primary border-security-primary/30"
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Report to Kavach Database
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                  
                  {!analysisResult && (
                    <div className="glass-card rounded-lg p-4 h-full flex flex-col items-center justify-center text-center">
                      <ShieldAlert className="h-12 w-12 text-security-primary mb-4 animate-bob" />
                      <h3 className="font-medium mb-2">Threat Detection</h3>
                      <p className="text-sm text-muted-foreground">
                        Choose content to analyze and our AI will scan for potential security threats.
                      </p>
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

export default PhishingDetection;
