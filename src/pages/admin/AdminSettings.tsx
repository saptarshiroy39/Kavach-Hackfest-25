import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SecurityCard from '@/components/security/SecurityCard';
import { 
  Settings, 
  ArrowLeft,
  ShieldAlert,
  Database,
  Server,
  Network,
  Mail,
  KeyRound,
  Globe,
  Clock,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

const AdminSettings = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your changes have been saved successfully.",
    });
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
          <Link to="/admin" className="text-security-primary hover:underline inline-flex items-center mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Admin Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Admin Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure system settings and preferences
          </p>
        </div>

        <SecurityCard
          className="mb-6 glass-card dark:bg-sidebar-accent/50"
          title="System Configuration"
          icon={<Settings className="w-5 h-5 text-security-primary" />}
        >
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="glass-effect mb-6">
              <TabsTrigger value="general" className="data-[state=active]:bg-security-primary data-[state=active]:text-white">
                General
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-security-primary data-[state=active]:text-white">
                Security
              </TabsTrigger>
              <TabsTrigger value="api" className="data-[state=active]:bg-security-primary data-[state=active]:text-white">
                API & Integrations
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-security-primary data-[state=active]:text-white">
                Notifications
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="mt-0 space-y-6">
              <div className="glass-card rounded-lg p-4 space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">General Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <label htmlFor="site-name" className="font-medium">Application Name</label>
                      <div className="md:col-span-2">
                        <Input id="site-name" defaultValue="Kavach" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <label htmlFor="site-url" className="font-medium">Application URL</label>
                      <div className="md:col-span-2">
                        <Input id="site-url" defaultValue="https://kavach.example.com" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div>
                        <span className="font-medium">Maintenance Mode</span>
                        <p className="text-xs text-muted-foreground mt-1">Take the site offline for maintenance</p>
                      </div>
                      <div className="md:col-span-2">
                        <Switch />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div>
                        <span className="font-medium">Debug Mode</span>
                        <p className="text-xs text-muted-foreground mt-1">Enable detailed error reporting</p>
                      </div>
                      <div className="md:col-span-2">
                        <Switch />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                      <div>
                        <span className="font-medium">System Description</span>
                        <p className="text-xs text-muted-foreground mt-1">Used in emails and system reports</p>
                      </div>
                      <div className="md:col-span-2">
                        <Textarea defaultValue="Kavach is an advanced security platform for digital identity protection" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Regional Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className="flex items-center">
                        <Globe className="h-5 w-5 text-muted-foreground mr-2" />
                        <span className="font-medium">Default Language</span>
                      </div>
                      <div className="md:col-span-2">
                        <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                          <option>English (US)</option>
                          <option>Spanish</option>
                          <option>French</option>
                          <option>German</option>
                          <option>Japanese</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-muted-foreground mr-2" />
                        <span className="font-medium">Time Zone</span>
                      </div>
                      <div className="md:col-span-2">
                        <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                          <option>UTC (Coordinated Universal Time)</option>
                          <option>America/New_York (Eastern Time)</option>
                          <option>America/Chicago (Central Time)</option>
                          <option>America/Denver (Mountain Time)</option>
                          <option>America/Los_Angeles (Pacific Time)</option>
                          <option>Europe/London (Greenwich Mean Time)</option>
                          <option>Asia/Tokyo (Japan Standard Time)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div>
                        <span className="font-medium">Date Format</span>
                      </div>
                      <div className="md:col-span-2">
                        <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                          <option>MM/DD/YYYY</option>
                          <option>DD/MM/YYYY</option>
                          <option>YYYY-MM-DD</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="mt-0 space-y-6">
              <div className="glass-card rounded-lg p-4 space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Authentication Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div>
                        <span className="font-medium">Require 2FA for Admins</span>
                        <p className="text-xs text-muted-foreground mt-1">Force two-factor authentication for admin accounts</p>
                      </div>
                      <div className="md:col-span-2">
                        <Switch defaultChecked />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div>
                        <span className="font-medium">Auto-lock Timeout</span>
                        <p className="text-xs text-muted-foreground mt-1">Automatically log users out after inactivity</p>
                      </div>
                      <div className="md:col-span-2">
                        <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                          <option>15 minutes</option>
                          <option>30 minutes</option>
                          <option>1 hour</option>
                          <option>4 hours</option>
                          <option>Never (not recommended)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div>
                        <span className="font-medium">Failed Login Attempts</span>
                        <p className="text-xs text-muted-foreground mt-1">Lock account after specified number of failed attempts</p>
                      </div>
                      <div className="md:col-span-2">
                        <Input type="number" defaultValue="5" min="1" max="10" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div>
                        <span className="font-medium">Password Complexity</span>
                        <p className="text-xs text-muted-foreground mt-1">Enforce strong password requirements</p>
                      </div>
                      <div className="md:col-span-2">
                        <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                          <option>High (12+ chars, special chars, numbers, mixed case)</option>
                          <option>Medium (8+ chars, numbers, mixed case)</option>
                          <option>Low (6+ chars)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Blockchain Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className="flex items-center">
                        <Network className="h-5 w-5 text-muted-foreground mr-2" />
                        <span className="font-medium">Default Network</span>
                      </div>
                      <div className="md:col-span-2">
                        <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                          <option>Ethereum Mainnet</option>
                          <option>Ethereum Testnet (Goerli)</option>
                          <option>Polygon</option>
                          <option>Binance Smart Chain</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div>
                        <span className="font-medium">Blockchain Verification</span>
                        <p className="text-xs text-muted-foreground mt-1">Enable blockchain for identity verification</p>
                      </div>
                      <div className="md:col-span-2">
                        <Switch defaultChecked />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div>
                        <span className="font-medium">API Endpoint</span>
                      </div>
                      <div className="md:col-span-2">
                        <Input defaultValue="https://mainnet.infura.io/v3/YOUR_API_KEY" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="api" className="mt-0 space-y-6">
              <div className="glass-card rounded-lg p-4 space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">API Configuration</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div>
                        <span className="font-medium">API Access</span>
                        <p className="text-xs text-muted-foreground mt-1">Enable API access for third-party applications</p>
                      </div>
                      <div className="md:col-span-2">
                        <Switch defaultChecked />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                      <div>
                        <span className="font-medium">API Secret Key</span>
                        <p className="text-xs text-muted-foreground mt-1">Used for secure API communication</p>
                      </div>
                      <div className="md:col-span-2">
                        <div className="flex items-center space-x-2">
                          <Input type="password" value="••••••••••••••••••••••••••••••" readOnly />
                          <Button variant="outline" size="sm">
                            Regenerate
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Last regenerated: 30 days ago
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div>
                        <span className="font-medium">Rate Limiting</span>
                        <p className="text-xs text-muted-foreground mt-1">Maximum requests per minute</p>
                      </div>
                      <div className="md:col-span-2">
                        <Input type="number" defaultValue="100" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">External Services</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className="flex items-center">
                        <KeyRound className="h-5 w-5 text-muted-foreground mr-2" />
                        <span className="font-medium">AI Phishing Detection</span>
                      </div>
                      <div className="md:col-span-2">
                        <div className="flex items-center space-x-2">
                          <Input placeholder="OpenAI API Key" />
                          <Button variant="outline" size="sm">
                            Test
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-muted-foreground mr-2" />
                        <span className="font-medium">SMTP Server</span>
                      </div>
                      <div className="md:col-span-2">
                        <div className="space-y-2">
                          <Input placeholder="SMTP Host" defaultValue="smtp.example.com" />
                          <div className="grid grid-cols-2 gap-2">
                            <Input placeholder="Username" defaultValue="notifications@example.com" />
                            <Input type="password" placeholder="Password" defaultValue="••••••••••" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className="flex items-center">
                        <Database className="h-5 w-5 text-muted-foreground mr-2" />
                        <span className="font-medium">Database Backup</span>
                      </div>
                      <div className="md:col-span-2">
                        <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                          <option>Daily (at midnight)</option>
                          <option>Weekly (Sunday at midnight)</option>
                          <option>Monthly (First day at midnight)</option>
                          <option>Never (not recommended)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-0 space-y-6">
              <div className="glass-card rounded-lg p-4 space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div>
                        <span className="font-medium">Security Alerts</span>
                        <p className="text-xs text-muted-foreground mt-1">Send email notifications for security events</p>
                      </div>
                      <div className="md:col-span-2">
                        <Switch defaultChecked />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div>
                        <span className="font-medium">User Registration</span>
                        <p className="text-xs text-muted-foreground mt-1">Send welcome emails to new users</p>
                      </div>
                      <div className="md:col-span-2">
                        <Switch defaultChecked />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div>
                        <span className="font-medium">Password Changes</span>
                        <p className="text-xs text-muted-foreground mt-1">Notify users when passwords are changed</p>
                      </div>
                      <div className="md:col-span-2">
                        <Switch defaultChecked />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div>
                        <span className="font-medium">Admin Summary</span>
                        <p className="text-xs text-muted-foreground mt-1">Send daily system summary to administrators</p>
                      </div>
                      <div className="md:col-span-2">
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">System Alerts</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div>
                        <span className="font-medium">Threat Severity Threshold</span>
                        <p className="text-xs text-muted-foreground mt-1">Minimum severity level for alerts</p>
                      </div>
                      <div className="md:col-span-2">
                        <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                          <option>Low (all threats)</option>
                          <option>Medium (exclude low severity)</option>
                          <option>High (critical issues only)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div>
                        <span className="font-medium">Alert Recipients</span>
                        <p className="text-xs text-muted-foreground mt-1">Email addresses for system alerts</p>
                      </div>
                      <div className="md:col-span-2">
                        <Textarea defaultValue="admin@example.com, security@example.com" />
                        <p className="text-xs text-muted-foreground mt-1">Separate multiple emails with commas</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className="flex items-center">
                        <ShieldAlert className="h-5 w-5 text-muted-foreground mr-2" />
                        <span className="font-medium">Emergency Contacts</span>
                      </div>
                      <div className="md:col-span-2">
                        <Textarea defaultValue="John Doe: +1 (555) 123-4567, Security Officer: +1 (555) 987-6543" />
                        <p className="text-xs text-muted-foreground mt-1">Contacts for critical system emergencies</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <div className="mt-6 flex justify-end">
              <Button variant="outline" className="mr-2">
                Reset to Defaults
              </Button>
              <Button className="bg-security-primary hover:bg-security-primary/90" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </Tabs>
        </SecurityCard>
      </motion.div>
    </MainLayout>
  );
};

export default AdminSettings;
