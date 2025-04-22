import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  AlertTriangle, 
  Clock, 
  Key, 
  Shield, 
  ShieldAlert,
  Lock,
  RefreshCw
} from "lucide-react";
import { passwordHealthMock as mockApi } from "@/lib/securityFeaturesMock";
import { useToast } from "@/hooks/use-toast";

interface Password {
  id: string;
  site: string;
  username: string;
  password: string;
  lastChanged: Date;
  strength: string;
  isReused: boolean;
  isBreached: boolean;
}

interface PasswordHealthData {
  overallScore: number;
  passwords: Password[];
  reused: number;
  weak: number;
  breached: number;
  old: number;
  suggestions: string[];
}

const PasswordHealthAnalysis: React.FC = () => {
  const [healthData, setHealthData] = useState<PasswordHealthData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const fetchPasswordHealth = async () => {
    setIsLoading(true);
    try {
      const data = await mockApi.getPasswordHealth();
      setHealthData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch password health data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPasswordHealth();
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
  const getStrengthLabel = (strength: string) => {
    switch (strength) {
      case 'weak':
        return <Badge variant="destructive">Weak</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium</Badge>;
      case 'strong':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Strong</Badge>;
      default:
        return null;
    }
  };

  const handleRefreshAnalysis = () => {
    fetchPasswordHealth();
    toast({
      title: "Refresh initiated",
      description: "Updating your password health analysis...",
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Password Health Analysis
          </CardTitle>
          <CardDescription>Analyzing your passwords...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <RefreshCw className="h-12 w-12 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!healthData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Password Health Analysis</CardTitle>
          <CardDescription>Failed to load password data.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchPasswordHealth}>Retry</Button>
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
            Password Health Analysis
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleRefreshAnalysis} className="gap-1">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
        <CardDescription>
          Analysis of your stored passwords
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Overall Health Score</h3>
            <p className="text-sm text-muted-foreground">Based on strength, uniqueness, and age</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-3xl font-bold flex items-center gap-2">
              <span className={getScoreColor(healthData.overallScore)}>
                {healthData.overallScore}
              </span>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
          </div>
        </div>
        
        <Progress 
          value={healthData.overallScore} 
          className={`h-2 ${getScoreBgColor(healthData.overallScore)}`}
        />

        {/* Issues Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-muted rounded-lg p-3 flex flex-col items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mb-1" />
            <span className="text-xl font-semibold">{healthData.weak}</span>
            <span className="text-xs text-center text-muted-foreground">Weak Passwords</span>
          </div>
          <div className="bg-muted rounded-lg p-3 flex flex-col items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mb-1" />
            <span className="text-xl font-semibold">{healthData.reused}</span>
            <span className="text-xs text-center text-muted-foreground">Reused Passwords</span>
          </div>
          <div className="bg-muted rounded-lg p-3 flex flex-col items-center">
            <ShieldAlert className="h-5 w-5 text-red-500 mb-1" />
            <span className="text-xl font-semibold">{healthData.breached}</span>
            <span className="text-xs text-center text-muted-foreground">Compromised</span>
          </div>
          <div className="bg-muted rounded-lg p-3 flex flex-col items-center">
            <Clock className="h-5 w-5 text-yellow-500 mb-1" />
            <span className="text-xl font-semibold">{healthData.old}</span>
            <span className="text-xs text-center text-muted-foreground">Outdated</span>
          </div>
        </div>

        {/* Suggestions */}
        {healthData.suggestions.length > 0 && (
          <Alert variant="default" className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertTitle>Recommendations</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                {healthData.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Password List */}
        <div>
          <h3 className="text-lg font-medium mb-4">Password Inventory</h3>
          <div className="space-y-3">
            {healthData.passwords.map((password) => (
              <div key={password.id} className="flex items-center justify-between border-b pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span className="font-medium">{password.site}</span>
                    {password.isBreached && (
                      <Badge variant="destructive" className="ml-2">Breached</Badge>
                    )}
                    {password.isReused && (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Reused</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">{password.username}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-muted-foreground mr-2">
                    {new Date(password.lastChanged).toLocaleDateString()} 
                  </div>
                  {getStrengthLabel(password.strength)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">View All Passwords</Button>
        <Button>Update Weak Passwords</Button>
      </CardFooter>
    </Card>
  );
};

export default PasswordHealthAnalysis;
