import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  Eye, 
  RefreshCw,
  Shield,
  Ban,
  Settings,
  Info,
  Loader2,
  Check,
  Phone,
  Activity,
  Newspaper,
  MapPin,
  History,
  Users,
  Smartphone
} from "lucide-react";
import { privacyMock as mockApi } from "@/lib/securityFeaturesMock";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ConnectedApp {
  id: string;
  name: string;
  icon: string;
  lastAccess: string;
  permissions: string[];
  dataAccessed: string[];
  isSensitive: boolean;
}

interface DataCollection {
  type: string;
  collected: boolean;
  purpose: string;
  sharedWith: string[];
  controlOption: string;
}

interface PrivacyReportData {
  privacyScore: number;
  lastUpdated: string;
  connectedApps: ConnectedApp[];
  dataCollections: DataCollection[];
  suggestions: string[];
}

const PrivacyReport: React.FC = () => {
  const [reportData, setReportData] = useState<PrivacyReportData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedApp, setSelectedApp] = useState<ConnectedApp | null>(null);
  const [manageDialogOpen, setManageDialogOpen] = useState<boolean>(false);
  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchPrivacyData = async () => {
    setIsLoading(true);
    try {
      const data = await mockApi.getPrivacyReportData();
      setReportData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch privacy report data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrivacyData();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleRefreshReport = () => {
    fetchPrivacyData();
    toast({
      title: "Refresh initiated",
      description: "Updating your privacy report...",
    });
  };

  const handleRevokePermission = (appId: string, permission: string) => {
    const app = reportData?.connectedApps.find(app => app.id === appId);
    if (!app || !reportData) return;
    
    // Update app permissions locally
    const updatedApps = reportData.connectedApps.map(appItem => {
      if (appItem.id === appId) {
        return {
          ...appItem,
          permissions: appItem.permissions.filter(p => p !== permission)
        };
      }
      return appItem;
    });
    
    // Update report data with improved privacy score
    setReportData({
      ...reportData,
      privacyScore: Math.min(100, reportData.privacyScore + 2),
      connectedApps: updatedApps
    });
    
    toast({
      title: "Permission revoked",
      description: `Revoked "${permission}" permission for ${app.name}.`,
    });
  };

  const handleOpenManageDialog = (app: ConnectedApp) => {
    setSelectedApp(app);
    setManageDialogOpen(true);
  };

  const handleOpenDisconnectDialog = (app: ConnectedApp) => {
    setSelectedApp(app);
    setDisconnectDialogOpen(true);
  };

  const handleDisconnectApp = async () => {
    if (!selectedApp || !reportData) return;
    
    setIsProcessing(true);
    try {
      // Simulate API call to disconnect the app
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Filter out the disconnected app
      const updatedApps = reportData.connectedApps.filter(
        app => app.id !== selectedApp.id
      );
      
      // Update report data with improved privacy score
      setReportData({
        ...reportData,
        privacyScore: Math.min(100, reportData.privacyScore + 5),
        connectedApps: updatedApps
      });
      
      toast({
        title: "App disconnected",
        description: `Successfully disconnected ${selectedApp.name}.`,
      });
      
      setDisconnectDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to disconnect ${selectedApp?.name}.`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSavePermissionSettings = async () => {
    if (!selectedApp || !reportData) return;
    
    setIsProcessing(true);
    try {
      // Simulate API call to update permissions
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Settings updated",
        description: `Successfully updated permissions for ${selectedApp.name}.`,
      });
      
      setManageDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update permissions for ${selectedApp?.name}.`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Report
          </CardTitle>
          <CardDescription>Analyzing your privacy status...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <RefreshCw className="h-12 w-12 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!reportData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Privacy Report</CardTitle>
          <CardDescription>Failed to load privacy data.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchPrivacyData}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Report
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleRefreshReport} className="gap-1">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
        <CardDescription>
          Insights into who has access to your data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Privacy Score */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-muted rounded-lg">
          <div className="relative w-24 h-24 mx-auto md:mx-0">
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className={`text-2xl font-bold ${getScoreColor(reportData.privacyScore)}`}>
                {reportData.privacyScore}
              </span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={reportData.privacyScore >= 80 
                  ? '#10b981' 
                  : reportData.privacyScore >= 60 
                  ? '#f59e0b' 
                  : '#ef4444'}
                strokeWidth="8"
                strokeDasharray={`${reportData.privacyScore * 2.83} 283`}
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-lg font-medium">Privacy Score</h3>
            <p className="text-sm text-muted-foreground">
              Last updated: {formatDate(reportData.lastUpdated)}
            </p>
            <Progress 
              value={reportData.privacyScore} 
              className={`h-2 mt-2 ${getScoreBgColor(reportData.privacyScore)}`}
            />
          </div>
        </div>

        {/* Connected Apps */}
        <div>
          <h3 className="text-lg font-medium mb-4">
            Connected Apps ({reportData.connectedApps.length})
          </h3>
          <div className="space-y-4">
            {reportData.connectedApps.map((app) => {
              // Determine which icon to use based on app name
              let AppIcon;
              if (app.name === "Social Media App") {
                AppIcon = Phone;
              } else if (app.name === "Fitness Tracker") {
                AppIcon = Activity;
              } else if (app.name === "News Reader") {
                AppIcon = Newspaper;
              } else {
                AppIcon = Eye; // Default icon
              }
              
              return (
                <div key={app.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center mr-3">
                          <AppIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{app.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            Last accessed: {app.lastAccess}
                          </p>
                        </div>
                      </div>
                      {app.isSensitive && (
                        <Badge className="bg-red-100 text-red-800 border-red-200">
                          Sensitive Access
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="p-4 bg-muted/50 space-y-3">
                    <div>
                      <h5 className="text-sm font-medium">Permissions:</h5>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {app.permissions.map((permission, idx) => (
                          <Badge key={idx} variant="secondary" className="flex gap-1 items-center pl-2">
                            {permission}
                            <button 
                              className="ml-1 bg-muted rounded-full w-4 h-4 inline-flex items-center justify-center hover:bg-muted-foreground/20"
                              onClick={() => handleRevokePermission(app.id, permission)}
                            >
                              <Ban className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium">Data accessed:</h5>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {app.dataAccessed.map((data, idx) => (
                          <Badge key={idx} variant="outline">
                            {data}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/30 flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => handleOpenManageDialog(app)}
                    >
                      <Settings className="w-4 h-4" />
                      Manage
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => handleOpenDisconnectDialog(app)}
                    >
                      <Ban className="w-4 h-4" />
                      Disconnect
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Data Collection */}
        <div>
          <h3 className="text-lg font-medium mb-4">Data Collection</h3>
          <div className="space-y-4">
            {reportData.dataCollections.map((collection, index) => {
              // Determine which icon to use based on collection type
              let DataIcon;
              if (collection.type === "Location data") {
                DataIcon = MapPin;
              } else if (collection.type === "Browsing history") {
                DataIcon = History;
              } else if (collection.type === "Contact information") {
                DataIcon = Users;
              } else if (collection.type === "Device information") {
                DataIcon = Smartphone;
              } else {
                DataIcon = Info; // Default icon
              }
              
              return (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <DataIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{collection.type}</h4>
                        <p className="text-sm text-muted-foreground">{collection.purpose}</p>
                      </div>
                    </div>
                    <Badge variant={collection.collected ? "default" : "outline"}>
                      {collection.collected ? "Collected" : "Not Collected"}
                    </Badge>
                  </div>
                  
                  {collection.sharedWith.length > 0 && (
                    <div className="mt-2 ml-8">
                      <p className="text-sm font-medium">Shared with:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {collection.sharedWith.map((entity, idx) => (
                          <Badge key={idx} variant="secondary">
                            {entity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="ml-8 mt-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      {collection.controlOption}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Privacy Recommendations */}
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <Info className="h-5 w-5 text-blue-600" />
          <AlertTitle>Privacy Recommendations</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside text-sm space-y-1 mt-2">
              {reportData.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
        
      </CardContent>

      {/* Manage App Permissions Dialog */}
      <Dialog open={manageDialogOpen} onOpenChange={setManageDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage App Permissions</DialogTitle>
            <DialogDescription>
              {selectedApp && (
                <>Adjust what data and features "{selectedApp.name}" can access.</>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-3">
            <h4 className="text-sm font-medium">Permission settings:</h4>
            <div className="space-y-3">
              {selectedApp?.permissions.map((permission, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <Label className="font-medium">{permission}</Label>
                    <p className="text-xs text-muted-foreground">
                      Allows app to {permission.toLowerCase()}
                    </p>
                  </div>
                  <Switch defaultChecked id={`permission-${idx}`} />
                </div>
              ))}
              
              <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <Label className="font-medium">Data Collection Consent</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow app to collect usage data
                  </p>
                </div>
                <Switch id="data-collection" />
              </div>
              
              <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <Label className="font-medium">Third-party Sharing</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow sharing data with third parties
                  </p>
                </div>
                <Switch id="third-party" />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setManageDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSavePermissionSettings}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disconnect App Dialog */}
      <Dialog open={disconnectDialogOpen} onOpenChange={setDisconnectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Disconnect App</DialogTitle>
            <DialogDescription>
              {selectedApp && (
                <>
                  Are you sure you want to disconnect "{selectedApp.name}"? 
                  This will revoke all permissions and data access.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-2">
            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <AlertDescription className="text-sm">
                Disconnecting this app will prevent it from accessing your data, 
                but it may keep copies of data it has already collected.
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDisconnectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDisconnectApp}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Disconnecting...
                </>
              ) : (
                'Disconnect App'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PrivacyReport;
