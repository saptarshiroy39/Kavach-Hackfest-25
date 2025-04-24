import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  Search, 
  RefreshCw,
  Shield,
  Trash2,
  Eye,
  Clock,
  Check,
  Loader2,
  BarChart3,
  Building,
  Database,
  FileText,
  ArrowUpRight,
  XCircle,
  CheckCircle,
  HelpCircle,
  Clock3,
  AlarmClock,
  X
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { DigitalFootprintCompany, DigitalFootprintData, digitalFootprintMock } from '@/lib/digitalFootprintMock';
import { useToast } from "@/hooks/use-toast";
import { ModernSearch } from "@/components/ui/modern-search";

interface DeletionRequestStatus {
  companyId: string;
  status: string;
  message: string;
  lastUpdated: string;
}

const DigitalFootprintTracker: React.FC = () => {
  const [footprintData, setFootprintData] = useState<DigitalFootprintData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCompany, setSelectedCompany] = useState<DigitalFootprintCompany | null>(null);
  const [companyDialogOpen, setCompanyDialogOpen] = useState<boolean>(false);
  const [deletionDialogOpen, setDeletionDialogOpen] = useState<boolean>(false);
  const [isRequestingDeletion, setIsRequestingDeletion] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('companies');
  const [deletionRequests, setDeletionRequests] = useState<DeletionRequestStatus[]>([]);
  const [categoryView, setCategoryView] = useState<'list' | 'chart'>('list');
  const { toast } = useToast();

  // Fetch digital footprint data
  const fetchFootprintData = async () => {
    setIsLoading(true);
    try {
      const data = await digitalFootprintMock.getDigitalFootprintData();
      setFootprintData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch digital footprint data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize component
  useEffect(() => {
    fetchFootprintData();
  }, []);

  // Rescan digital footprints
  const handleRescan = async () => {
    setIsScanning(true);
    toast({
      title: "Scan in progress",
      description: "Scanning the web for companies holding your data...",
    });
    
    try {
      const result = await digitalFootprintMock.rescanDigitalFootprints();
      if (result.success) {
        await fetchFootprintData(); // Refresh data
        toast({
          title: "Scan completed",
          description: `Found ${result.newCompaniesFound} new companies with your data.`,
        });
      }
    } catch (error) {
      toast({
        title: "Scan failed",
        description: "Unable to complete scan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  // Request data deletion
  const handleRequestDeletion = async () => {
    if (!selectedCompany) return;
    
    setIsRequestingDeletion(true);
    try {
      const result = await digitalFootprintMock.requestDataDeletion(selectedCompany.id);
      
      if (result.success) {
        // Update company status locally
        if (footprintData) {
          const updatedCompanies = footprintData.companies.map(company => {
            if (company.id === selectedCompany.id) {
              return { ...company, deletionStatus: 'requested' as 'requested' };
            }
            return company;
          });
          
          // Fix: Ensure property names match exactly with state object
          setFootprintData({
            ...footprintData,
            deleteRequestsSent: footprintData.deleteRequestsSent + 1,
            companies: updatedCompanies
          });
          
          // Add to deletion requests tracking
          setDeletionRequests(prev => [
            ...prev, 
            {
              companyId: selectedCompany.id,
              status: 'requested',
              message: result.message,
              lastUpdated: new Date().toISOString()
            }
          ]);
        }
        
        toast({
          title: "Deletion request sent",
          description: result.message,
        });
        
        setDeletionDialogOpen(false);
      }
    } catch (error) {
      toast({
        title: "Request failed",
        description: "Failed to send deletion request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRequestingDeletion(false);
    }
  };

  // Format date strings
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Function to check deletion status
  const checkDeletionStatus = async (companyId: string) => {
    try {
      const result = await digitalFootprintMock.checkDeletionStatus(companyId);
      
      // Update local tracking
      setDeletionRequests(prev => prev.map(req => 
        req.companyId === companyId 
          ? { ...req, status: result.status, lastUpdated: result.lastUpdated } 
          : req
      ));
      
      // Update company status if needed
      if (footprintData) {
        const updatedCompanies = footprintData.companies.map(company => {
          if (company.id === companyId) {
            return { ...company, deletionStatus: result.status as any };
          }
          return company;
        });
        
        setFootprintData({
          ...footprintData,
          companies: updatedCompanies
        });
      }
      
      toast({
        title: "Status updated",
        description: `Deletion request status: ${formatStatusText(result.status)}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check deletion status.",
        variant: "destructive",
      });
    }
  };

  // Format status for display
  const formatStatusText = (status: string) => {
    switch(status) {
      case 'not_requested': return 'Not Requested';
      case 'requested': return 'Requested';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'not_requested': 
        return <HelpCircle className="h-5 w-5 text-gray-400" />;
      case 'requested': 
        return <Clock3 className="h-5 w-5 text-amber-500" />;
      case 'in_progress': 
        return <RefreshCw className="h-5 w-5 text-blue-500" />;
      case 'completed': 
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <HelpCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  // Get color for privacy rating
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-green-500";
    if (rating >= 5) return "text-yellow-500";
    return "text-red-500";
  };

  // Filter companies based on search term
  const filteredCompanies = footprintData?.companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.dataCollected.some(data => data.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get company by ID
  const getCompanyById = (id: string) => {
    return footprintData?.companies.find(company => company.id === id);
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Digital Footprint Tracker
          </CardTitle>
          <CardDescription>Loading your digital footprint data...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!footprintData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Digital Footprint Tracker</CardTitle>
          <CardDescription>Failed to load digital footprint data.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchFootprintData}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Digital Footprint Tracker
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRescan} 
            disabled={isScanning}
            className="gap-1 bg-primary/10 hover:bg-primary/20 border-primary/30"
          >
            {isScanning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                <span className="whitespace-nowrap">Rescan for Companies</span>
              </>
            )}
          </Button>
        </div>
        <CardDescription>
          Monitor and manage companies holding your personal data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-muted rounded-lg p-3 flex flex-col items-center justify-center">
            <Building className="h-5 w-5 text-primary mb-1" />
            <span className="text-xl font-semibold">{footprintData.companiesWithData}</span>
            <span className="text-xs text-center text-muted-foreground">Companies</span>
          </div>
          <div className="bg-muted rounded-lg p-3 flex flex-col items-center">
            <Database className="h-5 w-5 text-blue-500 mb-1" />
            <span className="text-xl font-semibold">{footprintData.totalDataTypes}</span>
            <span className="text-xs text-center text-muted-foreground">Data Types</span>
          </div>
          <div className="bg-muted rounded-lg p-3 flex flex-col items-center">
            <FileText className="h-5 w-5 text-amber-500 mb-1" />
            <span className="text-xl font-semibold">{footprintData.deleteRequestsSent}</span>
            <span className="text-xs text-center text-muted-foreground">Deletion Requests</span>
          </div>
          <div className="bg-muted rounded-lg p-3 flex flex-col items-center">
            <Check className="h-5 w-5 text-green-500 mb-1" />
            <span className="text-xl font-semibold">{footprintData.deleteRequestsCompleted}</span>
            <span className="text-xs text-center text-muted-foreground">Completed</span>
          </div>
        </div>

        {/* Last scan information */}
        <div className="flex items-center justify-between py-2 text-sm text-muted-foreground border-b border-gray-200 dark:border-gray-700">
          <span className="flex items-center gap-1">
            <Clock3 className="h-4 w-4" />
            Last scan: {formatDate(footprintData.lastScan)}
          </span>
          <span className="flex items-center gap-1">
            <Shield className="h-4 w-4 text-primary" />
            Privacy score: {footprintData.privacyScore}/100
          </span>
        </div>

        {/* Action buttons for quick access */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Button 
            variant={activeTab === 'companies' ? 'default' : 'outline'}
            size="sm" 
            className={activeTab === 'companies' ? 'flex gap-1 flex-1 bg-primary text-white' : 'flex gap-1 flex-1'}
            onClick={() => setActiveTab('companies')}
          >
            <Building className="h-4 w-4" />
            View Companies
          </Button>
          <Button 
            variant={activeTab === 'categories' ? 'default' : 'outline'}
            size="sm"
            className={activeTab === 'categories' ? 'flex gap-1 flex-1 bg-primary text-white' : 'flex gap-1 flex-1'}
            onClick={() => setActiveTab('categories')}
          >
            <BarChart3 className="h-4 w-4" />
            Data Categories
          </Button>
          <Button 
            variant={activeTab === 'requests' ? 'default' : 'outline'}
            size="sm"
            className={activeTab === 'requests' ? 'flex gap-1 flex-1 bg-primary text-white' : 'flex gap-1 flex-1'}
            onClick={() => setActiveTab('requests')}
          >
            <AlarmClock className="h-4 w-4" />
            Deletion Requests
          </Button>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="companies" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          {/* Companies Tab */}
          <TabsContent value="companies" className="space-y-4">
            {/* Search companies - Using ModernSearch component */}
            <ModernSearch 
              placeholder="Search companies by name or data type..."
              value={searchTerm}
              onChange={setSearchTerm}
              variant="default"
              mode="inline"
            />

            {/* List of companies with your data */}
            <div className="space-y-3 mt-4">
              {filteredCompanies && filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <div key={company.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="flex justify-between items-center p-3 bg-muted/30">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center mr-3">
                          <img
                            src={company.logo}
                            alt={`${company.name} logo`}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                            className="w-6 h-6"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{company.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {company.category} • Last activity: {formatDate(company.lastActivity)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getRatingColor(company.privacyRating)}>
                          Privacy: {company.privacyRating}/10
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="px-2"
                          onClick={() => {
                            setSelectedCompany(company);
                            setCompanyDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                      </div>
                    </div>
                    <div className="p-3 flex flex-wrap gap-1">
                      {company.dataCollected?.slice(0, 3).map((dataType, idx) => (
                        <Badge key={idx} variant="outline" className="bg-muted/50">
                          {dataType}
                        </Badge>
                      ))}
                      {(company.dataCollected?.length ?? 0) > 3 && (
                        <Badge variant="outline" className="bg-muted/50">
                          +{(company.dataCollected?.length ?? 0) - 3} more
                        </Badge>
                      )}
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 flex items-center justify-between py-2 px-3 text-sm">
                      <span className="flex items-center gap-1">
                        {getStatusIcon(company.deletionStatus)}
                        <span>{formatStatusText(company.deletionStatus)}</span>
                      </span>
                      {company.deletionStatus !== 'completed' && (
                        <Button 
                          variant={company.deletionStatus === 'not_requested' ? "destructive" : "ghost"}
                          size="sm" 
                          className={company.deletionStatus === 'not_requested' ? 
                            "bg-red-500/90 hover:bg-red-600 text-white" : 
                            "text-amber-600 hover:text-amber-700"}
                          onClick={() => {
                            setSelectedCompany(company);
                            setDeletionDialogOpen(true);
                          }}
                        >
                          {company.deletionStatus === 'not_requested' ? 
                            <Trash2 className="h-4 w-4 mr-1" /> :
                            <FileText className="h-4 w-4 mr-1" />
                          }
                          {company.deletionStatus === 'not_requested' ? 'Request Deletion' : 'View Request'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "No companies match your search criteria" : "No companies found with your data"}
                </div>
              )}
            </div>
            
            {/* Extra guidance for users */}
            <Alert className="bg-primary/5 border-primary/20">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription className="text-sm">
                To request deletion of your data from a company, click the "Request Deletion" button on their card.
                You can also use the "Rescan" button at the top to find new companies with your data.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Data Categories Tab - Chart/List toggle with improved color */}
          <TabsContent value="categories" className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
              <h3 className="text-lg font-medium">Data Categories</h3>
              <div className="flex items-center gap-2 rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                <Button 
                  variant={categoryView === 'list' ? 'default' : 'ghost'}
                  size="sm" 
                  className={categoryView === 'list' ? 'bg-primary text-white' : ''}
                  onClick={() => setCategoryView('list')}
                >
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">List</span>
                </Button>
                <Button 
                  variant={categoryView === 'chart' ? 'default' : 'ghost'}
                  size="sm" 
                  className={categoryView === 'chart' ? 'bg-primary text-white' : ''}
                  onClick={() => setCategoryView('chart')}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Chart</span>
                </Button>
              </div>
            </div>

            {/* Rest of categories tab content */}
            {categoryView === 'list' ? (
              <div className="space-y-3">
                {footprintData.dataCategories.map((category, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="p-3 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{category.category}</h4>
                        <p className="text-xs text-muted-foreground">
                          Found in {category.count} companies
                        </p>
                      </div>
                      <Badge variant="outline">
                        {category.count} instances
                      </Badge>
                    </div>
                    <div className="px-3 pb-3">
                      <Progress value={(category.count / footprintData.companiesWithData) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-muted/20 rounded-lg p-6 h-[300px] flex items-center justify-center">
                <div className="flex items-end justify-around w-full h-[250px]">
                  {footprintData.dataCategories.map((category, index) => {
                    const heightPercentage = (category.count / Math.max(...footprintData.dataCategories.map(c => c.count))) * 100;
                    const barHeight = `${Math.max(heightPercentage, 10)}%`;
                    return (
                      <div key={index} className="flex flex-col items-center gap-2 h-full">
                        <div className="flex flex-col items-center justify-end h-full">
                          <span className="text-xs font-medium mb-2">{category.count}</span>
                          <div 
                            className="w-16 bg-primary hover:bg-primary/80 transition-colors rounded-t-md relative"
                            style={{ height: barHeight }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {category.category}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            <Alert className="bg-muted/50 border-muted">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Understanding Your Data Categories</AlertTitle>
              <AlertDescription className="text-sm">
                These categories represent the types of data that companies have collected about you.
                Personal and contact information are typically the most commonly collected data types.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Deletion Requests Tab - Enhancing this section */}
          <TabsContent value="requests" className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Trash2 className="h-4 w-4 text-red-500" />
                Deletion Request Status
              </h3>
              <span className="text-sm bg-muted px-2 py-1 rounded-md">
                {footprintData.deleteRequestsCompleted} of {footprintData.deleteRequestsSent} completed
              </span>
            </div>

            {/* Rest of deletion requests tab content */}
            {footprintData.companies.filter(company => 
              company.deletionStatus !== 'not_requested'
            ).length > 0 ? (
              <div className="space-y-3">
                {footprintData.companies
                  .filter(company => company.deletionStatus !== 'not_requested')
                  .map((company) => (
                    <div key={company.id} className="border rounded-lg overflow-hidden">
                      <div className="flex justify-between items-center p-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center mr-3">
                            <img
                              src={company.logo}
                              alt={`${company.name} logo`}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.svg';
                              }}
                              className="w-5 h-5"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">{company.name}</h4>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              {getStatusIcon(company.deletionStatus)}
                              <span>{formatStatusText(company.deletionStatus)}</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => checkDeletionStatus(company.id)}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          <span>Check Status</span>
                        </Button>
                      </div>
                      
                      {company.deletionStatus === 'in_progress' && (
                        <div className="px-3 pb-3">
                          <p className="text-xs text-muted-foreground">
                            Deletion in progress. Companies typically take 15-30 days to complete this process.
                          </p>
                          <Progress value={50} className="h-2 mt-2" />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="border rounded-lg p-6 flex flex-col items-center justify-center text-center">
                <Database className="h-10 w-10 text-muted-foreground mb-2 opacity-50" />
                <h4 className="text-lg font-medium">No Deletion Requests</h4>
                <p className="text-sm text-muted-foreground max-w-md mt-1 mb-4">
                  You haven't requested any companies to delete your data yet. Go to the Companies tab to send deletion requests.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('companies')}
                >
                  View Companies
                </Button>
              </div>
            )}
            
            <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-sm">
                Data deletion typically takes 15-30 days to process. Some companies may require additional verification steps.
                Use the "Check Status" button to get the latest update on your request.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Company Details Dialog */}
      <Dialog open={companyDialogOpen} onOpenChange={setCompanyDialogOpen}>
        <DialogContent className="max-w-md">
          {selectedCompany && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center">
                    <img
                      src={selectedCompany.logo}
                      alt={`${selectedCompany.name} logo`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                      className="w-5 h-5"
                    />
                  </div>
                  <DialogTitle>{selectedCompany.name}</DialogTitle>
                </div>
                <DialogDescription>
                  {selectedCompany.category} • Privacy Rating: {selectedCompany.privacyRating}/10
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-3">
                <div>
                  <h4 className="font-medium mb-2">Data Collected</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedCompany.dataCollected.map((dataType, idx) => (
                      <Badge key={idx} variant="outline" className="bg-muted/50">
                        {dataType}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Last Activity</h4>
                  <p className="text-sm">{formatDate(selectedCompany.lastActivity)}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Deletion Status</h4>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedCompany.deletionStatus)}
                    <span>{formatStatusText(selectedCompany.deletionStatus)}</span>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setCompanyDialogOpen(false)}>
                  Close
                </Button>
                {selectedCompany.deletionStatus === 'not_requested' && (
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      setCompanyDialogOpen(false);
                      setDeletionDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Request Deletion
                  </Button>
                )}
                {(selectedCompany.deletionStatus === 'requested' || selectedCompany.deletionStatus === 'in_progress') && (
                  <Button 
                    variant="default" 
                    onClick={() => checkDeletionStatus(selectedCompany.id)}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Check Status
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Deletion Request Dialog - Enhancing this section */}
      <Dialog open={deletionDialogOpen} onOpenChange={setDeletionDialogOpen}>
        <DialogContent className="max-w-md">
          {selectedCompany && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-500">
                  <Trash2 className="h-5 w-5" />
                  Request Data Deletion
                </DialogTitle>
                <DialogDescription>
                  Request {selectedCompany.name} to delete all personal data they hold about you.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-3">
                <Alert className="border-primary/20 bg-primary/10">
                  <Shield className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-sm">
                    This request is covered under data protection regulations like GDPR and CCPA,
                    giving you the right to request deletion of your personal data.
                  </AlertDescription>
                </Alert>
                
                <div>
                  <h4 className="font-medium mb-2">Data to be Deleted</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedCompany.dataCollected.map((dataType, idx) => (
                      <Badge key={idx} variant="outline" className="bg-muted/50">
                        {dataType}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {selectedCompany.deletionStatus !== 'not_requested' && (
                  <div>
                    <h4 className="font-medium mb-1">Current Status</h4>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedCompany.deletionStatus)}
                      <span className="text-sm">{formatStatusText(selectedCompany.deletionStatus)}</span>
                    </div>
                    
                    {selectedCompany.deletionStatus === 'in_progress' && (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground mb-1">
                          Deletion in progress. This typically takes 15-30 days.
                        </p>
                        <Progress value={50} className="h-2" />
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setDeletionDialogOpen(false)}>
                  Cancel
                </Button>
                {selectedCompany.deletionStatus === 'not_requested' ? (
                  <Button 
                    onClick={handleRequestDeletion}
                    disabled={isRequestingDeletion}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    {isRequestingDeletion ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Submit Deletion Request
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    onClick={() => checkDeletionStatus(selectedCompany.id)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Check Status
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DigitalFootprintTracker;