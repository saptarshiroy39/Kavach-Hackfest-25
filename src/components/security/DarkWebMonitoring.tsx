import { Button } from "../ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../ui/card";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Loader2, Shield, AlertTriangle, Scan, Mail, Plus, Clock, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "../../hooks/use-toast";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";
import { Progress } from "../ui/progress";
import { motion } from "framer-motion";

export function DarkWebMonitoring() {
  const { toast } = useToast();
  const { resolvedTheme } = useTheme();
  const [monitoredEmails, setMonitoredEmails] = useState([
    "user@example.com",
    "personal@example.org"
  ]);
  const [breachedEmails, setBreachedEmails] = useState([
    { email: "user@example.com", breaches: 2, lastBreached: "2023-11-15" }
  ]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStage, setScanStage] = useState('initializing');
  const [scanTimeRemaining, setScanTimeRemaining] = useState(3);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [addEmailDialogOpen, setAddEmailDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  
  const handleAddEmail = () => {
    if (!newEmail || !newEmail.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    if (monitoredEmails.includes(newEmail)) {
      toast({
        title: "Email already monitored",
        description: "This email is already being monitored.",
        variant: "destructive"
      });
      return;
    }
    
    setActionInProgress(true);
    
    // Simulate API call
    setTimeout(() => {
      setMonitoredEmails([...monitoredEmails, newEmail]);
      setNewEmail("");
      setActionInProgress(false);
      setAddEmailDialogOpen(false);
      
      toast({
        title: "Email Added",
        description: "Your email has been added to monitoring.",
        variant: "default"
      });
    }, 1500);
  };
  
  const handleScanNow = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanStage('initializing');
    setScanTimeRemaining(3);
    
    // Simulate scanning progress
    const totalDuration = 3000; // 3 seconds total
    const progressInterval = 50; // Update every 50ms
    const steps = totalDuration / progressInterval;
    const increment = 100 / steps;

    let currentProgress = 0;
    let intervalId = null;

    // Update time remaining
    const timeIntervalId = setInterval(() => {
      setScanTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timeIntervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start progress animation
    intervalId = setInterval(() => {
      currentProgress += increment;
      
      // Update scan stage based on progress
      if (currentProgress <= 20) {
        setScanStage('initializing');
      } else if (currentProgress > 20 && currentProgress <= 60) {
        setScanStage('checking databases');
      } else if (currentProgress > 60 && currentProgress <= 80) {
        setScanStage('analyzing exposure');
      } else if (currentProgress > 80) {
        setScanStage('finalizing');
      }
      
      if (currentProgress >= 100) {
        clearInterval(intervalId);
        clearInterval(timeIntervalId); // Clear time interval too
        currentProgress = 100;
        
        setTimeout(() => {
          setIsScanning(false); // Close dialog
          setScanProgress(0); // Reset progress for next time

          // Simulating finding a new breach
          const randomFind = Math.random() > 0.7;
          
          if (randomFind && monitoredEmails.length > 0) {
            const randomEmail = monitoredEmails[Math.floor(Math.random() * monitoredEmails.length)];
            const alreadyBreached = breachedEmails.some(b => b.email === randomEmail);
            
            if (!alreadyBreached) {
              setBreachedEmails([
                ...breachedEmails,
                { 
                  email: randomEmail, 
                  breaches: 1, 
                  lastBreached: new Date().toISOString().split('T')[0]
                }
              ]);
              
              toast({
                title: "New Breach Detected!",
                description: `We found a breach containing ${randomEmail}`,
                variant: "destructive"
              });
            } else {
              toast({
                title: "Scan Complete",
                description: "No new breaches were detected for your monitored emails.",
                variant: "default"
              });
            }
          } else {
            toast({
              title: "Scan Complete",
              description: "No new breaches were detected for your monitored emails.",
              variant: "default"
            });
          }
        }, 500); // Delay before closing and showing toast
      }
      
      setScanProgress(Math.min(Math.round(currentProgress), 100));
    }, progressInterval);
  };

  const handleRemoveEmail = (email) => {
    setMonitoredEmails(monitoredEmails.filter(e => e !== email));
    toast({
      title: "Email Removed",
      description: "Email has been removed from monitoring.",
      variant: "default"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Dark Web Monitoring
        </CardTitle>
        <CardDescription>
          Monitor the dark web for your personal information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Separator />
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Monitored Emails
            </h3>
            <ul className="space-y-2 mt-2">
              {monitoredEmails.map(email => (
                <li key={email} className="flex justify-between items-center py-2 px-3 bg-muted/60 border border-muted rounded-md">
                  <span className="font-medium">{email}</span>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveEmail(email)} className="text-muted-foreground hover:text-destructive transition-colors">
                    Remove
                  </Button>
                </li>
              ))}
              {monitoredEmails.length === 0 && (
                <li className="text-center py-4 px-3 border border-dashed border-muted rounded-md text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground/70" />
                    <span>No emails being monitored</span>
                  </div>
                </li>
              )}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold">Breached Emails</h3>
            <ul className="space-y-2 mt-2">
              {breachedEmails.map(({ email, breaches, lastBreached }) => (
                <li key={email} className="flex justify-between items-center py-2 px-3 bg-muted/60 border border-red-200 dark:border-red-900/30 rounded-md">
                  <span className="font-medium">{email}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-red-500 dark:text-red-400 flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1 animate-subtle-shake" />
                      {breaches} {breaches === 1 ? 'breach' : 'breaches'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Last breached: {lastBreached}
                    </span>
                  </div>
                </li>
              ))}
              {breachedEmails.length === 0 && (
                <li className="text-center py-4 px-3 border border-dashed border-muted rounded-md text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span>No breaches detected</span>
                  </div>
                </li>
              )}
            </ul>
          </div>
          
          <Button 
            onClick={handleScanNow} 
            disabled={isScanning}
            className={cn(
              "relative w-full",
              isScanning && "bg-blue-400 hover:bg-blue-400 text-white px-6"
            )}
          >
            <div className="flex items-center justify-center">
              {isScanning ? (
                <>
                  <div className="mr-2 h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Running Check...</span>
                </>
              ) : (
                <>
                  <Scan className="mr-2 h-4 w-4" />
                  <span>Scan Now</span>
                </>
              )}
            </div>
          </Button>
          
          <Button variant="outline" onClick={() => setAddEmailDialogOpen(true)} className="group flex items-center gap-2 w-full">
            <Plus className="h-4 w-4 group-hover:text-primary transition-colors" />
            Add Email to Monitor
          </Button>
        </div>
      </CardContent>

      <Dialog open={addEmailDialogOpen} onOpenChange={setAddEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Email to Monitor</DialogTitle>
            <DialogDescription>
              Enter an email address to monitor for breaches on the dark web.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEmail} disabled={actionInProgress}>
              {actionInProgress ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : "Add Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isScanning} onOpenChange={(open) => {
        if (!open) setIsScanning(false);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scanning Dark Web...</DialogTitle>
            <DialogDescription>
              Please wait while we check known data breaches for your information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-8">
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-24 h-24 mb-4">
                <motion.div 
                  className="absolute inset-0 rounded-full bg-primary/10 dark:bg-primary/20"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 0.2, 0.7]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ 
                      opacity: [0.5, 1, 0.5],
                      scale: [0.9, 1, 0.9]
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Scan className="w-6 h-6 text-primary" />
                  </motion.div>
                </div>
              </div>
              
              <motion.div
                className="text-sm font-medium text-center mb-2"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                key={scanStage}
              >
                {scanStage === 'initializing' && "Initializing dark web scan..."}
                {scanStage === 'checking databases' && "Checking known breach databases..."}
                {scanStage === 'analyzing exposure' && "Analyzing email exposure..."}
                {scanStage === 'finalizing' && "Finalizing results..."}
              </motion.div>
            </div>
            
            <div className="relative h-3 w-full bg-muted rounded-full overflow-hidden mb-2">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 via-primary to-indigo-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${scanProgress}%` }}
                transition={{ ease: "linear", duration: 0.05 }}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <motion.div 
                className="text-xs text-muted-foreground"
                animate={{ opacity: scanProgress < 10 ? 0 : 1 }}
              >
                <Clock className="inline w-3 h-3 mr-1" />
                <span>Estimated time: {scanTimeRemaining} sec</span>
              </motion.div>
              <p className="text-right text-sm font-medium">
                {scanProgress}% complete
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
