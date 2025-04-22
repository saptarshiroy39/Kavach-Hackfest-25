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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
                        <Select defaultValue="en-US">
                          <SelectTrigger className="w-full glass-effect dark:bg-sidebar-accent/30">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent className="glass-effect dark:bg-sidebar-accent/80 border-white/10 z-50">
                            <SelectItem value="en-US">English (US)</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="ja">Japanese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-muted-foreground mr-2" />
                        <span className="font-medium">Time Zone</span>
                      </div>
                      <div className="md:col-span-2">
                        <Select defaultValue="UTC">
                          <SelectTrigger className="w-full glass-effect dark:bg-sidebar-accent/30">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent className="glass-effect dark:bg-sidebar-accent/80 border-white/10 z-50">
                            <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                            <SelectItem value="America/New_York">America/New_York (Eastern Time)</SelectItem>
                            <SelectItem value="America/Chicago">America/Chicago (Central Time)</SelectItem>
                            <SelectItem value="America/Denver">America/Denver (Mountain Time)</SelectItem>
                            <SelectItem value="America/Los_Angeles">America/Los_Angeles (Pacific Time)</SelectItem>
                            <SelectItem value="Europe/London">Europe/London (Greenwich Mean Time)</SelectItem>
                            <SelectItem value="Asia/Tokyo">Asia/Tokyo (Japan Standard Time)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div>
                        <span className="font-medium">Date Format</span>
                      </div>
                      <div className="md:col-span-2">
                        <Select defaultValue="MM/DD/YYYY">
                          <SelectTrigger className="w-full glass-effect dark:bg-sidebar-accent/30">
                            <SelectValue placeholder="Select date format" />
                          </SelectTrigger>
                          <SelectContent className="glass-effect dark:bg-sidebar-accent/80 border-white/10 z-50">
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
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
                        <Select defaultValue="15">
                          <SelectTrigger className="w-full glass-effect dark:bg-sidebar-accent/30">
                            <SelectValue placeholder="Select timeout" />
                          </SelectTrigger>
                          <SelectContent className="glass-effect dark:bg-sidebar-accent/80 border-white/10 z-50">
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="240">4 hours</SelectItem>
                            <SelectItem value="0">Never (not recommended)</SelectItem>
                          </SelectContent>
                        </Select>
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
                        <Select defaultValue="high">
                          <SelectTrigger className="w-full glass-effect dark:bg-sidebar-accent/30">
                            <SelectValue placeholder="Select complexity" />
                          </SelectTrigger>
                          <SelectContent className="glass-effect dark:bg-sidebar-accent/80 border-white/10 z-50">
                            <SelectItem value="high">High (12+ chars, special chars, numbers, mixed case)</SelectItem>
                            <SelectItem value="medium">Medium (8+ chars, numbers, mixed case)</SelectItem>
                            <SelectItem value="low">Low (6+ chars)</SelectItem>
                          </SelectContent>
                        </Select>
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
                        <Select defaultValue="ethereum">
                          <SelectTrigger className="w-full glass-effect dark:bg-sidebar-accent/30">
                            <SelectValue placeholder="Select network" />
                          </SelectTrigger>
                          <SelectContent className="glass-effect dark:bg-sidebar-accent/80 border-white/10 z-50">
                            <SelectItem value="ethereum">Ethereum Mainnet</SelectItem>
                            <SelectItem value="goerli">Ethereum Testnet (Goerli)</SelectItem>
                            <SelectItem value="polygon">Polygon</SelectItem>
                            <SelectItem value="bsc">Binance Smart Chain</SelectItem>
                          </SelectContent>
                        </Select>
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
                        <Select defaultValue="daily">
                          <SelectTrigger className="w-full glass-effect dark:bg-sidebar-accent/30">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent className="glass-effect dark:bg-sidebar-accent/80 border-white/10 z-50">
                            <SelectItem value="daily">Daily (at midnight)</SelectItem>
                            <SelectItem value="weekly">Weekly (Sunday at midnight)</SelectItem>
                            <SelectItem value="monthly">Monthly (First day at midnight)</SelectItem>
                            <SelectItem value="never">Never (not recommended)</SelectItem>
                          </SelectContent>
                        </Select>
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
                        <Select defaultValue="low">
                          <SelectTrigger className="w-full glass-effect dark:bg-sidebar-accent/30">
                            <SelectValue placeholder="Select threshold" />
                          </SelectTrigger>
                          <SelectContent className="glass-effect dark:bg-sidebar-accent/80 border-white/10 z-50">
                            <SelectItem value="low">Low (all threats)</SelectItem>
                            <SelectItem value="medium">Medium (exclude low severity)</SelectItem>
                            <SelectItem value="high">High (critical issues only)</SelectItem>
                          </SelectContent>
                        </Select>
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
