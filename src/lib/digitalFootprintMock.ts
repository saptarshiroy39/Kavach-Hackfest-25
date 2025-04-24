export interface DigitalFootprintCompany {
  id: string;
  name: string;
  logo: string;
  category: string;
  dataCollected: string[];
  lastActivity: string;
  privacyRating: number; // 1-10, 10 being the best privacy practices
  deletionStatus: 'not_requested' | 'requested' | 'in_progress' | 'completed';
  deletionSupported: boolean;
}

export interface DigitalFootprintData {
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

// Mock implementation for Digital Footprint Tracker (similar to Mine)
export const digitalFootprintMock = {
  getDigitalFootprintData: async (): Promise<DigitalFootprintData> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
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
        { category: "Online Activity", count: 14 },
        { category: "Financial Data", count: 7 },
        { category: "Location Data", count: 18 },
        { category: "Social Connections", count: 11 },
      ],
      companies: [
        {
          id: "1",
          name: "Google",
          logo: "/app-icons/google.svg", // Corrected path
          category: "Search & Advertising",
          dataCollected: ["Personal Info", "Search History", "Location", "Online Activity", "Device Info", "Contacts"],
          lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          privacyRating: 6,
          deletionStatus: 'not_requested',
          deletionSupported: true,
        },
        {
          id: "2",
          name: "Facebook",
          logo: "/app-icons/facebook.svg", // Corrected path
          category: "Social Media",
          dataCollected: ["Personal Info", "Photos", "Social Connections", "Location", "Interests", "Messages"],
          lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          privacyRating: 4,
          deletionStatus: 'requested',
          deletionSupported: true,
        },
        {
          id: "3",
          name: "Amazon",
          logo: "/app-icons/amazon.svg", // Corrected path
          category: "E-commerce",
          dataCollected: ["Purchase History", "Personal Info", "Payment Info", "Browsing History"],
          lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          privacyRating: 5,
          deletionStatus: 'not_requested',
          deletionSupported: true,
        },
        {
          id: "4",
          name: "Netflix",
          logo: "/app-icons/netflix.svg", // Corrected path
          category: "Entertainment",
          dataCollected: ["Viewing History", "Personal Info", "Payment Info", "Device Info"],
          lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          privacyRating: 7,
          deletionStatus: 'not_requested',
          deletionSupported: true,
        },
        {
          id: "5",
          name: "X",
          logo: "/app-icons/x.svg", // Corrected path
          category: "Social Media", // Added category for consistency
          dataCollected: ["Personal Info", "Posts", "Social Connections", "Interests"], // Added dataCollected for consistency
          lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Standardized lastActivity
          privacyRating: 6, // Added privacyRating
          deletionStatus: 'in_progress', // Added deletionStatus
          deletionSupported: true, // Added deletionSupported
        },
        {
          id: "6",
          name: "LinkedIn",
          logo: "/app-icons/linkedin.svg", // Corrected path
          category: "Professional Network",
          dataCollected: ["Professional Info", "Social Connections", "Employment History", "Education", "Messages"],
          lastActivity: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          privacyRating: 6,
          deletionStatus: 'not_requested',
          deletionSupported: true,
        },
        {
          id: "7",
          name: "Spotify",
          logo: "/app-icons/spotify.svg", // Corrected path
          category: "Entertainment",
          dataCollected: ["Listening History", "Personal Info", "Payment Info"],
          lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          privacyRating: 7,
          deletionStatus: 'not_requested',
          deletionSupported: true,
        },
        {
          id: "8",
          name: "Adobe",
          logo: "/app-icons/adobe.svg", // Corrected path
          category: "Software",
          dataCollected: ["Personal Info", "Payment Info", "Usage Data", "Creative Works"],
          lastActivity: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
          privacyRating: 5,
          deletionStatus: 'completed',
          deletionSupported: true,
        },
        {
          id: "9",
          name: "Microsoft",
          logo: "/app-icons/microsoft.svg", // Corrected path
          category: "Software & Services",
          dataCollected: ["Personal Info", "Device Info", "Usage Data", "Files", "Communications"],
          lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          privacyRating: 6,
          deletionStatus: 'not_requested',
          deletionSupported: true,
        },
        {
          id: "10",
          name: "Uber",
          logo: "/app-icons/uber.svg", // Corrected path
          category: "Transportation",
          dataCollected: ["Location Data", "Personal Info", "Payment Info", "Travel History"],
          lastActivity: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
          privacyRating: 5,
          deletionStatus: 'not_requested',
          deletionSupported: true,
        },
        {
          id: "11",
          name: "DoorDash",
          logo: "/app-icons/doordash.svg", // Corrected path
          category: "Food Delivery",
          dataCollected: ["Order History", "Personal Info", "Payment Info", "Location Data"],
          lastActivity: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
          privacyRating: 5,
          deletionStatus: 'completed',
          deletionSupported: true,
        },
        {
          id: "12",
          name: "Instagram",
          logo: "/app-icons/instagram.svg", // Corrected path
          category: "Social Media",
          dataCollected: ["Photos", "Personal Info", "Social Connections", "Interests", "Location", "Interactions"],
          lastActivity: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          privacyRating: 3,
          deletionStatus: 'requested',
          deletionSupported: true,
        }
      ]
    };
  },
  
  // Send deletion request to a company
  requestDataDeletion: async (companyId: string): Promise<{success: boolean, message: string}> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    return {
      success: true,
      message: "Data deletion request sent successfully. This process may take up to 30 days to complete."
    };
  },
  
  // Get updated status of a deletion request
  checkDeletionStatus: async (companyId: string): Promise<{status: string, lastUpdated: string}> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const statuses = ['not_requested', 'requested', 'in_progress', 'completed'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      status: randomStatus,
      lastUpdated: new Date().toISOString()
    };
  },
  
  // Scan for new digital footprints
  rescanDigitalFootprints: async (): Promise<{success: boolean, newCompaniesFound: number}> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      newCompaniesFound: Math.floor(Math.random() * 3) // 0-2 new companies found
    };
  }
};