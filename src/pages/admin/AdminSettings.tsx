import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  AlertCircle, 
  Save, 
  Server, 
  Shield, 
  Database, 
  LockKeyhole, 
  Globe, 
  Clock, 
  Copy, 
  RefreshCw,
  Key,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';

const AdminSettings: React.FC = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [apiKey, setApiKey] = useState<string>('kavach_live_api_xCpT8zvKL2RJwqY5');
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [apiKeyCopied, setApiKeyCopied] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  // Function to generate random API key
  const generateApiKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const prefix = 'kavach_live_api_';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setApiKey(prefix + result);
    toast({
      title: t("New API Key Generated"),
      description: t("Remember to save changes to apply the new key."),
    });
  };

  // Function to copy API key to clipboard
  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setApiKeyCopied(true);
    toast({
      title: t("API Key Copied"),
      description: t("The API key has been copied to clipboard."),
    });
    setTimeout(() => setApiKeyCopied(false), 3000);
  };

  // Function to save changes
  const saveChanges = () => {
    setSaveLoading(true);
    setTimeout(() => {
      setSaveLoading(false);
      toast({
        title: t("Settings Saved"),
        description: t("Your changes have been saved successfully."),
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">{t('Admin Settings')}</h1>
        <Button 
          className="flex items-center" 
          onClick={saveChanges} 
          disabled={saveLoading}
        >
          {saveLoading ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {t('saveChanges')}
        </Button>
      </div>
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t('Important')}</AlertTitle>
        <AlertDescription>
          {t('Changes to these settings will affect all users on the platform. Please proceed with caution.')}
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="security" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="security">{t("Security")}</TabsTrigger>
          <TabsTrigger value="users">{t("User Policies")}</TabsTrigger>
          <TabsTrigger value="system">{t("System")}</TabsTrigger>
          <TabsTrigger value="api">{t("API & Integration")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="security" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-primary" />
                <CardTitle>{t('Security Settings')}</CardTitle>
              </div>
              <CardDescription>{t('Configure security policies for the platform')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="2fa" className="font-medium">{t('Enforce 2FA for all users')}</Label>
                    <p className="text-sm text-muted-foreground">{t('All users will be required to set up two-factor authentication')}</p>
                  </div>
                  <Switch id="2fa" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pwdPolicy" className="font-medium">{t('Strong Password Policy')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Require complex passwords with numbers, symbols and uppercase letters')}</p>
                  </div>
                  <Switch id="pwdPolicy" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="loginAttempts" className="font-medium">{t('Maximum Login Attempts')}</Label>
                  <p className="text-sm text-muted-foreground">{t('Number of failed attempts before account lockout')}</p>
                  <Select defaultValue="5">
                    <SelectTrigger id="loginAttempts" className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">{t('3 attempts')}</SelectItem>
                      <SelectItem value="5">{t('5 attempts')}</SelectItem>
                      <SelectItem value="10">{t('10 attempts')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">{t('Session Timeout (minutes)')}</Label>
                    <span className="text-sm font-medium">30</span>
                  </div>
                  <Slider defaultValue={[30]} min={5} max={60} step={5} />
                  <p className="text-sm text-muted-foreground">{t('Automatically log users out after period of inactivity')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <LockKeyhole className="mr-2 h-5 w-5 text-primary" />
                <CardTitle>{t('Encryption Settings')}</CardTitle>
              </div>
              <CardDescription>{t('Data encryption and protection configurations')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">{t('End-to-End Encryption')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Enable end-to-end encryption for all communications')}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label className="font-medium">{t('Encryption Algorithm')}</Label>
                  <Select defaultValue="aes256">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('Select algorithm')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aes256">{t('AES-256')}</SelectItem>
                      <SelectItem value="aes128">{t('AES-128')}</SelectItem>
                      <SelectItem value="chacha20">{t('ChaCha20-Poly1305')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Database className="mr-2 h-5 w-5 text-primary" />
                <CardTitle>{t('User Policies')}</CardTitle>
              </div>
              <CardDescription>{t('Configure default settings for users')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="passwordReset" className="font-medium">{t('Periodic Password Reset')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Require users to reset passwords periodically')}</p>
                  </div>
                  <Switch id="passwordReset" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="passwordDays" className="font-medium">{t('Password Expiry (days)')}</Label>
                  <p className="text-sm text-muted-foreground">{t('Days before password must be changed')}</p>
                  <Select defaultValue="90">
                    <SelectTrigger id="passwordDays" className="w-full">
                      <SelectValue placeholder={t('Select')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">{t('30 days')}</SelectItem>
                      <SelectItem value="60">{t('60 days')}</SelectItem>
                      <SelectItem value="90">{t('90 days')}</SelectItem>
                      <SelectItem value="180">{t('180 days')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="multiDevice" className="font-medium">{t('Allow Multiple Device Login')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Users can be logged in on multiple devices simultaneously')}</p>
                  </div>
                  <Switch id="multiDevice" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxDevices" className="font-medium">{t('Maximum Devices Per User')}</Label>
                  <p className="text-sm text-muted-foreground">{t('Maximum number of active devices per user')}</p>
                  <Select defaultValue="3">
                    <SelectTrigger id="maxDevices" className="w-full">
                      <SelectValue placeholder={t('Select')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">{t('1 device')}</SelectItem>
                      <SelectItem value="2">{t('2 devices')}</SelectItem>
                      <SelectItem value="3">{t('3 devices')}</SelectItem>
                      <SelectItem value="5">{t('5 devices')}</SelectItem>
                      <SelectItem value="unlimited">{t('Unlimited')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="activityLogging" className="font-medium">{t('User Activity Logging')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Track and log all user activities on the platform')}</p>
                  </div>
                  <Switch id="activityLogging" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="geoRestrict" className="font-medium">{t('Geographic Restrictions')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Enable location-based access restrictions')}</p>
                  </div>
                  <Switch id="geoRestrict" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                <CardTitle>{t('accountSettings')}</CardTitle>
              </div>
              <CardDescription>{t('Account lifecycle and access controls')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inactivityDays" className="font-medium">{t('Account Inactivity Period')}</Label>
                  <p className="text-sm text-muted-foreground">{t('Days before an inactive account is suspended')}</p>
                  <Select defaultValue="90">
                    <SelectTrigger id="inactivityDays" className="w-full">
                      <SelectValue placeholder={t('Select')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">{t('30 days')}</SelectItem>
                      <SelectItem value="60">{t('60 days')}</SelectItem>
                      <SelectItem value="90">{t('90 days')}</SelectItem>
                      <SelectItem value="180">{t('180 days')}</SelectItem>
                      <SelectItem value="never">{t('Never suspend')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoAccountRecovery" className="font-medium">{t('Automatic Account Recovery')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Allow users to recover accounts without admin approval')}</p>
                  </div>
                  <Switch id="autoAccountRecovery" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="userSelfDelete" className="font-medium">{t('Allow Self Account Deletion')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Users can permanently delete their own accounts')}</p>
                  </div>
                  <Switch id="userSelfDelete" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Server className="mr-2 h-5 w-5 text-primary" />
                <CardTitle>{t('System Configuration')}</CardTitle>
              </div>
              <CardDescription>{t('Server and infrastructure settings')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenanceMode" className="font-medium">{t('Maintenance Mode')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Temporarily restrict access for non-admin users')}</p>
                  </div>
                  <Switch id="maintenanceMode" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="systemBackup" className="font-medium">{t('Automated Backups')}</Label>
                  <p className="text-sm text-muted-foreground">{t('Frequency of system-wide data backups')}</p>
                  <Select defaultValue="daily">
                    <SelectTrigger id="systemBackup" className="w-full">
                      <SelectValue placeholder={t('Select')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">{t('Every hour')}</SelectItem>
                      <SelectItem value="daily">{t('Daily')}</SelectItem>
                      <SelectItem value="weekly">{t('Weekly')}</SelectItem>
                      <SelectItem value="monthly">{t('Monthly')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="debugMode" className="font-medium">{t('Debug Mode')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Enable detailed logging for troubleshooting')}</p>
                  </div>
                  <Switch id="debugMode" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dataRetention" className="font-medium">{t('Data Retention Period')}</Label>
                  <p className="text-sm text-muted-foreground">{t('How long to retain system logs and usage data')}</p>
                  <Select defaultValue="90">
                    <SelectTrigger id="dataRetention" className="w-full">
                      <SelectValue placeholder={t('Select')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">{t('30 days')}</SelectItem>
                      <SelectItem value="90">{t('90 days')}</SelectItem>
                      <SelectItem value="180">{t('180 days')}</SelectItem>
                      <SelectItem value="365">{t('1 year')}</SelectItem>
                      <SelectItem value="forever">{t('Indefinitely')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                <CardTitle>{t('Performance Settings')}</CardTitle>
              </div>
              <CardDescription>{t('System performance and optimization')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">{t('Resource Allocation')}</Label>
                    <span className="text-sm font-medium">50%</span>
                  </div>
                  <Slider defaultValue={[50]} min={10} max={90} step={10} />
                  <p className="text-sm text-muted-foreground">{t('Percentage of system resources allocated to core functions')}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="cacheOptimization" className="font-medium">{t('Cache Optimization')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Optimize system cache for faster performance')}</p>
                  </div>
                  <Switch id="cacheOptimization" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cleanupInterval" className="font-medium">{t('Automated Cleanup Interval')}</Label>
                  <p className="text-sm text-muted-foreground">{t('Frequency of temporary file cleanup')}</p>
                  <Select defaultValue="daily">
                    <SelectTrigger id="cleanupInterval" className="w-full">
                      <SelectValue placeholder={t('Select')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">{t('Every hour')}</SelectItem>
                      <SelectItem value="daily">{t('Daily')}</SelectItem>
                      <SelectItem value="weekly">{t('Weekly')}</SelectItem>
                      <SelectItem value="manual">{t('Manual only')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    {t('Run System Diagnostics')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Key className="mr-2 h-5 w-5 text-primary" />
                <CardTitle>{t('API Settings')}</CardTitle>
              </div>
              <CardDescription>{t('API keys and integration configurations')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="apiEnabled" className="font-medium">{t('Enable API Access')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Allow external applications to access the API')}</p>
                  </div>
                  <Switch id="apiEnabled" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="apiRateLimit" className="font-medium">{t('API Rate Limit')}</Label>
                  <p className="text-sm text-muted-foreground">{t('Maximum number of requests per minute')}</p>
                  <Select defaultValue="100">
                    <SelectTrigger id="apiRateLimit" className="w-full">
                      <SelectValue placeholder={t('Select')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">{t('60 requests')}</SelectItem>
                      <SelectItem value="100">{t('100 requests')}</SelectItem>
                      <SelectItem value="500">{t('500 requests')}</SelectItem>
                      <SelectItem value="1000">{t('1000 requests')}</SelectItem>
                      <SelectItem value="unlimited">{t('Unlimited')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="apiKey" className="font-medium">{t('API Key')}</Label>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={generateApiKey}
                      >
                        <RefreshCw className="mr-1 h-3.5 w-3.5" />
                        {t('Generate')}
                      </Button>
                    </div>
                  </div>
                  <div className="flex">
                    <Input
                      id="apiKey"
                      value={apiKey}
                      readOnly
                      className="flex-1 font-mono text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2"
                      onClick={copyApiKey}
                    >
                      {apiKeyCopied ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{t('This key grants full access to the API. Keep it secure.')}</p>
                </div>
                
                <div className="pt-2 pb-2 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-sm pt-2">{t('Access Controls')}</h4>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="readAccess" className="font-medium">{t('Read Access')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Allow retrieving data via API')}</p>
                  </div>
                  <Switch id="readAccess" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="writeAccess" className="font-medium">{t('Write Access')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Allow modifying data via API')}</p>
                  </div>
                  <Switch id="writeAccess" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="deleteAccess" className="font-medium">{t('Delete Access')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Allow deleting data via API')}</p>
                  </div>
                  <Switch id="deleteAccess" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Globe className="mr-2 h-5 w-5 text-primary" />
                <CardTitle>{t('Webhook Configuration')}</CardTitle>
              </div>
              <CardDescription>{t('Configure webhook endpoints for event notifications')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="webhooksEnabled" className="font-medium">{t('Enable Webhooks')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Send event notifications to external services')}</p>
                  </div>
                  <Switch id="webhooksEnabled" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl" className="font-medium">{t('Webhook URL')}</Label>
                  <Input
                    id="webhookUrl"
                    placeholder={t('https://example.com/webhook')}
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">{t('URL to receive event notifications')}</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhookEvents" className="font-medium">{t('Events to Send')}</Label>
                  <div className="pt-2 grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="event-login" className="rounded" defaultChecked />
                      <label htmlFor="event-login" className="text-sm">{t('User Login')}</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="event-signup" className="rounded" defaultChecked />
                      <label htmlFor="event-signup" className="text-sm">{t('New Account')}</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="event-password" className="rounded" defaultChecked />
                      <label htmlFor="event-password" className="text-sm">{t('Password Change')}</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="event-security" className="rounded" defaultChecked />
                      <label htmlFor="event-security" className="text-sm">{t('Security Alerts')}</label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    {t('Test Webhook')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
