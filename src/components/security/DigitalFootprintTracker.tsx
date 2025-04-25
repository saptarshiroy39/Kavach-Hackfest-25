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
  Check,
  Loader2,
  BarChart3,
  Building,
  Database,
  FileText,
  XCircle,
  CheckCircle,
  Clock3,
  AlarmClock
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { TabSwitcher } from '@/components/ui/tab-switcher';

// Type definitions
interface DigitalFootprintCompany {
  id: string;
  name: string;
  logo: string;
  category: string;
  dataCollected: string[];
  lastActivity: string;
  privacyRating: number;
  deletionStatus: 'not_requested' | 'requested' | 'in_progress' | 'completed';
  deletionSupported: boolean;
}

interface DigitalFootprintData {
  lastScan: string;
  companiesWithData: number;
  totalDataTypes: number;
  privacyScore: number;
  deleteRequestsSent: number;
  deleteRequestsCompleted: number;
  companies: DigitalFootprintCompany[];
  dataCategories: {
    category: string;
    count: number;
  }[];
}

// Mock API implementation
const digitalFootprintMock = {
  getDigitalFootprintData: async (): Promise<DigitalFootprintData> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      lastScan: new Date().toISOString(),
      companiesWithData: 27,
      totalDataTypes: 47,
      privacyScore: 68,
      deleteRequestsSent: 8,
      deleteRequestsCompleted: 5,
      dataCategories: [
        { category: "Personal Info", count: 22 },
        { category: "Contact Info", count: 16 },
        { category: "Financial Data", count: 7 }
      ],
      companies: [
        {
          id: "1",
          name: "Google",
          logo: "/app-icons/google.svg",
          category: "Search",
          dataCollected: ["Personal Info", "Search History", "Location"],
          lastActivity: new Date().toISOString(),
          privacyRating: 6,
          deletionStatus: 'not_requested',
          deletionSupported: true,
        },
        {
          id: "2",
          name: "Facebook",
          logo: "/app-icons/facebook.svg",
          category: "Social Media",
          dataCollected: ["Personal Info", "Photos", "Social Connections"],
          lastActivity: new Date().toISOString(),
          privacyRating: 4,
          deletionStatus: 'requested',
          deletionSupported: true,
        }
      ]
    };
  },
  
  requestDataDeletion: async (companyId: string): Promise<{success: boolean, message: string}> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: "Data deletion request sent successfully."
    };
  },
  
  checkDeletionStatus: async (companyId: string): Promise<{status: string, lastUpdated: string}> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const statuses = ['requested', 'in_progress', 'completed'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      status: randomStatus,
      lastUpdated: new Date().toISOString()
    };
  }
};

interface DeletionRequestStatus {
  companyId: string;
  status: string;
  message: string;
  lastUpdated: string;
}

// Simple ModernSearch component 
const ModernSearch: React.FC<{
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  variant?: string;
  mode?: string;
}> = ({ placeholder, value, onChange }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      <Input
        className="w-full pl-10 pr-4"
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

const DigitalFootprintTracker: React.FC = () => {
  const [footprintData, setFootprintData] = useState<DigitalFootprintData>({
    lastScan: new Date().toISOString(),
    companiesWithData: 0,
    totalDataTypes: 0,
    privacyScore: 0,
    deleteRequestsSent: 0,
    deleteRequestsCompleted: 0,
    companies: [],
    dataCategories: []
  });
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

  const handleRescan = async () => {
    setIsScanning(true);
    try {
      const data = await digitalFootprintMock.getDigitalFootprintData();
      setFootprintData(data);
      toast({
        title: "Rescan Complete",
        description: "Digital footprint data has been refreshed.",
      });
    } catch (error) {
      toast({
        title: "Rescan Failed",
        description: "Could not refresh footprint data.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleDeletionRequest = async () => {
    if (!selectedCompany) return;
    
    setIsRequestingDeletion(true);
    try {
      const result = await digitalFootprintMock.requestDataDeletion(selectedCompany.id);
      
      if (result.success) {
        // Update company status locally
        if (footprintData) {
          const updatedCompanies = footprintData.companies.map(company => {
            if (company.id === selectedCompany.id) {
              return { ...company, deletionStatus: 'requested' };
            }
            return company;
          });
          
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

  // Format status text for better readability
  const formatStatusText = (status: string) => {
    if (status === 'not_requested') return 'Not Requested';
    if (status === 'requested') return 'Requested';
    if (status === 'in_progress') return 'In Progress';
    if (status === 'completed') return 'Completed';
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Get icon based on status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'not_requested':
        return <XCircle className="h-4 w-4 text-muted-foreground mr-1" />;
      case 'requested':
        return <Clock3 className="h-4 w-4 text-amber-500 mr-1" />;
      case 'in_progress':
        return <Loader2 className="h-4 w-4 text-blue-500 mr-1" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500 mr-1" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground mr-1" />;
    }
  };

  // Get color based on privacy rating
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-500';
    if (rating >= 6) return 'text-amber-500';
    if (rating >= 4) return 'text-orange-500';
    return 'text-red-500';
  };

  // Helper to get company by ID
  const getCompanyById = (id: string) => {
    return footprintData?.companies.find(company => company.id === id);
  };

  // Filter companies based on search term
  const filteredCompanies = footprintData?.companies.filter(company => {
    const searchLower = searchTerm.toLowerCase();
    return (
      company.name.toLowerCase().includes(searchLower) ||
      company.category.toLowerCase().includes(searchLower) ||
      company.dataCollected.some(data => data.toLowerCase().includes(searchLower))
    );
  });

  // Tabs for the tracker
  const trackerTabs = [
    {
      id: 'companies',
      label: 'Companies',
      icon: <Building className="h-4 w-4" />
    },
    {
      id: 'categories',
      label: 'Data Categories',
      icon: <BarChart3 className="h-4 w-4" />
    },
    {
      id: 'requests',
      label: 'Deletion Requests',
      icon: <AlarmClock className="h-4 w-4" />
    }
  ];

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Digital Footprint Tracker
              </CardTitle>
              <CardDescription>Manage your online data presence</CardDescription>
            </div>
            <Button variant="outline" onClick={handleRescan} disabled={isScanning} className="mt-4 md:mt-0">
              {isScanning ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Rescan Footprint
            </Button>
          </div>
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

          {/* Tabs for different views */}
          <TabSwitcher 
            tabs={trackerTabs}
            activeTab={activeTab}
            onChange={setActiveTab}
            variant="underline"
            size="md"
            fullWidth
            layoutId="footprint-tab-underline"
            className="mt-4"
          />

          {/* Content for each tab */}
          <div className="mt-6">
            {/* Companies Tab Content */}
            {activeTab === 'companies' && (
              <div className="space-y-4">
                {/* Search companies */}
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
                        <div className="flex items-center p-3">
                          <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center mr-3 flex-shrink-0">
                            <img
                              src={company.logo}
                              alt={`${company.name} logo`}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.svg';
                              }}
                              className="w-6 h-6"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{company.name}</h3>
                            <p className="text-xs text-muted-foreground truncate">{company.category}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="ml-2"
                            onClick={() => {
                              setSelectedCompany(company);
                              setCompanyDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
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
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Data Categories Tab */}
            {activeTab === 'categories' && (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <Database className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">Data Categories</h3>
                  <p className="text-sm text-muted-foreground">
                    View the types of data companies have collected about you
                  </p>
                </div>
              </div>
            )}

            {/* Deletion Requests Tab */}
            {activeTab === 'requests' && (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">Deletion Requests</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage and track your data deletion requests
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DigitalFootprintTracker;