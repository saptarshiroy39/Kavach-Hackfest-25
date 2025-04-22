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
  ShieldAlert,
  Mail,
  CheckCircle
} from "lucide-react";
import { darkWebMock as mockApi } from "@/lib/securityFeaturesMock";
import { useToast } from "@/hooks/use-toast";

interface Breach {
  id: string;
  source: string;
  date: string;
  exposedData: string[];
  severity: string;
  description: string;
  affectedAccount: string;
}

interface DarkWebMonitoringData {
  lastScan: string;
  riskScore: number;
  breachesFound: number;
  emailsMonitored: string[];
  breaches: Breach[];
}

const DarkWebMonitoring: React.FC = () => {
  const [monitoringData, setMonitoringData] = useState<DarkWebMonitoringData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const fetchDarkWebData = async () => {
    setIsLoading(true);
    try {
      const data = await mockApi.getDarkWebMonitoringData();
      setMonitoringData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch dark web monitoring data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDarkWebData();
  }, []);

  const getRiskColor = (score: number) => {
    if (score <= 20) return "text-green-500";
    if (score <= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getRiskLevel = (score: number) => {
    if (score <= 20) return "Low";
    if (score <= 50) return "Medium";
    return "High";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return "bg-green-100 text-green-800 border-green-200";
      case 'medium':
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 'high':
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleRefreshScan = () => {
    fetchDarkWebData();
    toast({
      title: "Scan initiated",
      description: "Scanning the dark web for your information...",
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Dark Web Monitoring
          </CardTitle>
          <CardDescription>Scanning for data breaches...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <RefreshCw className="h-12 w-12 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!monitoringData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Dark Web Monitoring</CardTitle>
          <CardDescription>Failed to load monitoring data.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchDarkWebData}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Dark Web Monitoring
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleRefreshScan} className="gap-1">
            <RefreshCw className="h-4 w-4" />
            Refresh Scan
          </Button>
        </div>
        <CardDescription>
          Monitoring the dark web for your personal information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Score & Stats */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-muted rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="bg-background rounded-full p-4 h-24 w-24 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getRiskColor(monitoringData.riskScore)}`}>
                  {monitoringData.riskScore}
                </div>
                <div className="text-xs text-muted-foreground">Risk Score</div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium">
                {getRiskLevel(monitoringData.riskScore)} Risk Level
              </h3>
              <p className="text-sm text-muted-foreground">
                Last scan: {formatDate(monitoringData.lastScan)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 md:mt-0">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {monitoringData.breachesFound}
              </div>
              <div className="text-xs text-muted-foreground">
                Breaches Found
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {monitoringData.emailsMonitored.length}
              </div>
              <div className="text-xs text-muted-foreground">
                Emails Monitored
              </div>
            </div>
          </div>
        </div>

        {/* Monitored Emails */}
        <div>
          <h3 className="text-lg font-medium mb-3">Monitored Emails</h3>
          <div className="space-y-2">
            {monitoringData.emailsMonitored.map((email, index) => (
              <div key={index} className="flex items-center border p-2 rounded-lg">
                <Mail className="h-4 w-4 mr-2" />
                <span>{email}</span>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-3 w-full text-sm">
            Add Email to Monitor
          </Button>
        </div>

        {/* Breaches Found */}
        <div>
          <h3 className="text-lg font-medium mb-3">
            Breaches Found {monitoringData.breaches.length > 0 && `(${monitoringData.breaches.length})`}
          </h3>
          
          {monitoringData.breaches.length === 0 ? (
            <div className="border rounded-lg p-6 flex flex-col items-center justify-center text-center">
              <CheckCircle className="h-10 w-10 text-green-500 mb-2" />
              <h4 className="text-lg font-medium">No Breaches Found</h4>
              <p className="text-sm text-muted-foreground max-w-md">
                Good news! We haven't found any of your information in data breaches or leaks on the dark web.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {monitoringData.breaches.map((breach) => (
                <div key={breach.id} className="border rounded-lg overflow-hidden">
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{breach.source}</h4>
                        <p className="text-sm text-muted-foreground">
                          Breach detected: {formatDate(breach.date)}
                        </p>
                      </div>
                      <Badge variant="outline" className={`${getSeverityColor(breach.severity)}`}>
                        {breach.severity.charAt(0).toUpperCase() + breach.severity.slice(1)} Severity
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/50">
                    <div className="text-sm space-y-2">
                      <p>{breach.description}</p>
                      <p>
                        <span className="font-medium">Affected account:</span> {breach.affectedAccount}
                      </p>
                      <p className="font-medium">Exposed information:</p>
                      <div className="flex flex-wrap gap-1">
                        {breach.exposedData.map((data, index) => (
                          <Badge key={index} variant="secondary">
                            {data}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/30 flex justify-end">
                    <Button>Take Action</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommendations */}
        {monitoringData.breaches.length > 0 && (
          <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertTitle>Your information was found in data breaches</AlertTitle>
            <AlertDescription>
              <p className="mt-2">We recommend that you take the following actions:</p>
              <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                <li>Change your password for the affected accounts immediately</li>
                <li>Enable two-factor authentication where possible</li>
                <li>Monitor your accounts for suspicious activity</li>
                <li>Consider using a password manager to generate strong, unique passwords</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default DarkWebMonitoring;
