
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SecurityCard from '@/components/security/SecurityCard';
import { 
  Users, 
  ShieldAlert, 
  Database, 
  Lock,
  Settings,
  Activity,
  BarChart4,
  KeyRound,
  Network,
  Server
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Route, Routes, Link } from 'react-router-dom';
import AdminUsers from './AdminUsers';
import AdminSettings from './AdminSettings';

const AdminDashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboardHome />} />
      <Route path="/users" element={<AdminUsers />} />
      <Route path="/settings" element={<AdminSettings />} />
    </Routes>
  );
};

const AdminDashboardHome = () => {
  return (
    <MainLayout>
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            System administration and management console
          </p>
        </div>

        <SecurityCard
          className="mb-6 glass-card dark:bg-sidebar-accent/50"
          title="System Overview"
          icon={<Lock className="w-5 h-5 text-security-primary" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-card p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <h3 className="text-2xl font-bold mt-1">5,238</h3>
                </div>
                <div className="p-2 bg-security-primary/10 rounded-full">
                  <Users className="h-5 w-5 text-security-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs">
                <span className="text-security-secondary">+12%</span>
                <span className="ml-1 text-muted-foreground">from last month</span>
              </div>
            </div>
            
            <div className="glass-card p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Active Threats</p>
                  <h3 className="text-2xl font-bold mt-1">23</h3>
                </div>
                <div className="p-2 bg-security-danger/10 rounded-full">
                  <ShieldAlert className="h-5 w-5 text-security-danger" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs">
                <span className="text-security-danger">+5</span>
                <span className="ml-1 text-muted-foreground">new threats detected today</span>
              </div>
            </div>
            
            <div className="glass-card p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">System Health</p>
                  <h3 className="text-2xl font-bold mt-1">98.3%</h3>
                </div>
                <div className="p-2 bg-security-secondary/10 rounded-full">
                  <Activity className="h-5 w-5 text-security-secondary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs">
                <span className="text-security-secondary">+0.5%</span>
                <span className="ml-1 text-muted-foreground">uptime improvement</span>
              </div>
            </div>
            
            <div className="glass-card p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Database Size</p>
                  <h3 className="text-2xl font-bold mt-1">1.2 TB</h3>
                </div>
                <div className="p-2 bg-security-primary/10 rounded-full">
                  <Database className="h-5 w-5 text-security-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs">
                <span className="text-security-warning">+8.3%</span>
                <span className="ml-1 text-muted-foreground">growth in last 30 days</span>
              </div>
            </div>
          </div>
        </SecurityCard>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SecurityCard
              className="mb-6 glass-card dark:bg-sidebar-accent/50"
              title="Administration Controls"
              icon={<Settings className="w-5 h-5 text-security-primary" />}
            >
              <Tabs defaultValue="users" className="w-full">
                <TabsList className="glass-effect mb-4">
                  <TabsTrigger value="users" className="data-[state=active]:bg-security-primary data-[state=active]:text-white">Users</TabsTrigger>
                  <TabsTrigger value="security" className="data-[state=active]:bg-security-primary data-[state=active]:text-white">Security</TabsTrigger>
                  <TabsTrigger value="system" className="data-[state=active]:bg-security-primary data-[state=active]:text-white">System</TabsTrigger>
                </TabsList>
                
                <TabsContent value="users" className="mt-0">
                  <div className="glass-card p-4 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">User Management</h3>
                      <Button size="sm" variant="outline" asChild>
                        <Link to="/admin/users">View All Users</Link>
                      </Button>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 font-medium">User</th>
                            <th className="text-left py-2 font-medium">Status</th>
                            <th className="text-left py-2 font-medium">Role</th>
                            <th className="text-left py-2 font-medium">Last Login</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-border hover:bg-muted/20">
                            <td className="py-2">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-security-primary/20 flex items-center justify-center mr-2">JD</div>
                                <div>
                                  <div>John Doe</div>
                                  <div className="text-xs text-muted-foreground">john@example.com</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-security-secondary/20 text-security-secondary">
                                Active
                              </span>
                            </td>
                            <td className="py-2">Admin</td>
                            <td className="py-2">Today, 9:43 AM</td>
                          </tr>
                          <tr className="border-b border-border hover:bg-muted/20">
                            <td className="py-2">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-security-primary/20 flex items-center justify-center mr-2">AS</div>
                                <div>
                                  <div>Alice Smith</div>
                                  <div className="text-xs text-muted-foreground">alice@example.com</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-security-secondary/20 text-security-secondary">
                                Active
                              </span>
                            </td>
                            <td className="py-2">User</td>
                            <td className="py-2">Yesterday, 2:15 PM</td>
                          </tr>
                          <tr className="hover:bg-muted/20">
                            <td className="py-2">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-security-primary/20 flex items-center justify-center mr-2">RJ</div>
                                <div>
                                  <div>Robert Johnson</div>
                                  <div className="text-xs text-muted-foreground">robert@example.com</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-security-danger/20 text-security-danger">
                                Suspended
                              </span>
                            </td>
                            <td className="py-2">User</td>
                            <td className="py-2">Last week</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="security" className="mt-0">
                  <div className="glass-card p-4 rounded-lg space-y-4">
                    <h3 className="font-medium mb-4">Security Controls</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 border border-border rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-2 bg-security-primary/10 rounded-full mr-3">
                            <KeyRound className="h-5 w-5 text-security-primary" />
                          </div>
                          <div>
                            <div className="font-medium">API Access Keys</div>
                            <div className="text-xs text-muted-foreground">Manage system API keys</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Manage</Button>
                      </div>
                      
                      <div className="p-3 border border-border rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-2 bg-security-primary/10 rounded-full mr-3">
                            <Lock className="h-5 w-5 text-security-primary" />
                          </div>
                          <div>
                            <div className="font-medium">Access Control</div>
                            <div className="text-xs text-muted-foreground">User permissions & roles</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Configure</Button>
                      </div>
                      
                      <div className="p-3 border border-border rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-2 bg-security-primary/10 rounded-full mr-3">
                            <Network className="h-5 w-5 text-security-primary" />
                          </div>
                          <div>
                            <div className="font-medium">Blockchain Settings</div>
                            <div className="text-xs text-muted-foreground">Configure blockchain connections</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Manage</Button>
                      </div>
                      
                      <div className="p-3 border border-border rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-2 bg-security-primary/10 rounded-full mr-3">
                            <ShieldAlert className="h-5 w-5 text-security-primary" />
                          </div>
                          <div>
                            <div className="font-medium">Threat Intelligence</div>
                            <div className="text-xs text-muted-foreground">Threat database & rules</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Configure</Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="system" className="mt-0">
                  <div className="glass-card p-4 rounded-lg space-y-4">
                    <h3 className="font-medium mb-4">System Configuration</h3>
                    
                    <div className="space-y-4">
                      <div className="p-3 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <Server className="h-5 w-5 text-security-primary mr-2" />
                            <span className="font-medium">System Resources</span>
                          </div>
                          <Button size="sm" variant="outline">Optimize</Button>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>CPU Usage</span>
                              <span>42%</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-security-primary" style={{ width: '42%' }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Memory Usage</span>
                              <span>61%</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-security-primary" style={{ width: '61%' }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Storage Usage</span>
                              <span>35%</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-security-primary" style={{ width: '35%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 border border-border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <Database className="h-5 w-5 text-security-primary mr-2" />
                              <span className="font-medium">Database Status</span>
                            </div>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-security-secondary/20 text-security-secondary">
                              Healthy
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Last backup: Today, 3:30 AM <br />
                            Queries per second: 215 <br />
                            Connections: 18/100
                          </p>
                        </div>
                        
                        <div className="p-3 border border-border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <Activity className="h-5 w-5 text-security-primary mr-2" />
                              <span className="font-medium">System Logs</span>
                            </div>
                            <Button size="sm" variant="outline">View Logs</Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            0 critical errors in last 24h <br />
                            5 warnings in last 24h <br />
                            Log retention: 30 days
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </SecurityCard>
          </div>
          
          <div>
            <SecurityCard
              className="mb-6 glass-card dark:bg-sidebar-accent/50"
              title="Analytics"
              icon={<BarChart4 className="w-5 h-5 text-security-primary" />}
            >
              <div className="space-y-6">
                <div className="p-3 glass-effect rounded-lg">
                  <h3 className="font-medium mb-3">Threat Detection</h3>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Email Phishing</span>
                    <span>78</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-security-danger" style={{ width: '78%' }}></div>
                  </div>
                  
                  <div className="flex justify-between text-sm mb-1">
                    <span>SMS Scams</span>
                    <span>45</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-security-warning" style={{ width: '45%' }}></div>
                  </div>
                  
                  <div className="flex justify-between text-sm mb-1">
                    <span>Malicious URLs</span>
                    <span>93</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-security-danger" style={{ width: '93%' }}></div>
                  </div>
                  
                  <div className="flex justify-between text-sm mb-1">
                    <span>Payment Fraud</span>
                    <span>23</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-security-secondary" style={{ width: '23%' }}></div>
                  </div>
                </div>
                
                <div className="p-3 glass-effect rounded-lg">
                  <h3 className="font-medium mb-3">User Activity</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Users</span>
                      <span className="text-security-secondary font-medium">3,827</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">New Sign-ups (Today)</span>
                      <span className="text-security-secondary font-medium">42</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Password Changes</span>
                      <span className="text-security-secondary font-medium">128</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">2FA Enabled</span>
                      <span className="text-security-secondary font-medium">65%</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button asChild>
                    <Link to="/admin/settings">
                      Admin Settings
                    </Link>
                  </Button>
                </div>
              </div>
            </SecurityCard>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default AdminDashboard;
