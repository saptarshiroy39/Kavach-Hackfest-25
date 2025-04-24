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
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Loader2, Shield, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useToast } from "../../hooks/use-toast";

export function DarkWebMonitoring() {
  const { toast } = useToast();
  const [monitoredEmails, setMonitoredEmails] = useState([
    "user@example.com",
    "personal@example.org"
  ]);
  const [breachedEmails, setBreachedEmails] = useState([
    { email: "user@example.com", breaches: 2, lastBreached: "2023-11-15" }
  ]);
  const [isScanning, setIsScanning] = useState(false);
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
    
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      
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
            title: "No New Breaches",
            description: "No new breaches were detected for your emails.",
            variant: "default"
          });
        }
      } else {
        toast({
          title: "Scan Complete",
          description: "No new breaches were detected for your emails.",
          variant: "default"
        });
      }
    }, 3000);
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
            <h3 className="font-semibold">Monitored Emails</h3>
            <ul>
              {monitoredEmails.map(email => (
                <li key={email} className="flex justify-between">
                  <span>{email}</span>
                  <Button variant="link" onClick={() => handleRemoveEmail(email)}>Remove</Button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Breached Emails</h3>
            <ul>
              {breachedEmails.map(({ email, breaches, lastBreached }) => (
                <li key={email} className="flex justify-between">
                  <span>{email}</span>
                  <span>{breaches} breaches</span>
                  <span>Last breached: {lastBreached}</span>
                </li>
              ))}
            </ul>
          </div>
          <Button onClick={handleScanNow} disabled={isScanning}>
            {isScanning ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Scan Now
          </Button>
          <Button variant="outline" onClick={() => setAddEmailDialogOpen(true)}>
            Add Email to Monitor
          </Button>
        </div>
      </CardContent>

      {/* Add Email Dialog */}
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
    </Card>
  );
}
