import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SecurityCard from '@/components/security/SecurityCard';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  MoreHorizontal,
  UserCog,
  UserMinus,
  ShieldAlert,
  Mail,
  ArrowLeft,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from 'framer-motion';

const usersList = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: 'Today, 9:43 AM',
    securityScore: 92,
    hasTwoFactor: true,
  },
  {
    id: 2,
    name: 'Alice Smith',
    email: 'alice@example.com',
    role: 'User',
    status: 'Active',
    lastLogin: 'Yesterday, 2:15 PM',
    securityScore: 78,
    hasTwoFactor: true,
  },
  {
    id: 3,
    name: 'Robert Johnson',
    email: 'robert@example.com',
    role: 'User',
    status: 'Suspended',
    lastLogin: 'Last week',
    securityScore: 45,
    hasTwoFactor: false,
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily@example.com',
    role: 'User',
    status: 'Active',
    lastLogin: 'Today, 11:20 AM',
    securityScore: 85,
    hasTwoFactor: true,
  },
  {
    id: 5,
    name: 'Michael Brown',
    email: 'michael@example.com',
    role: 'User',
    status: 'Active',
    lastLogin: '2 days ago',
    securityScore: 65,
    hasTwoFactor: false,
  },
  {
    id: 6,
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    role: 'Moderator',
    status: 'Active',
    lastLogin: 'Today, 8:05 AM',
    securityScore: 88,
    hasTwoFactor: true,
  },
  {
    id: 7,
    name: 'David Miller',
    email: 'david@example.com',
    role: 'User',
    status: 'Inactive',
    lastLogin: '2 weeks ago',
    securityScore: 32,
    hasTwoFactor: false,
  },
  {
    id: 8,
    name: 'Jennifer Taylor',
    email: 'jennifer@example.com',
    role: 'User',
    status: 'Active',
    lastLogin: 'Yesterday, 4:30 PM',
    securityScore: 74,
    hasTwoFactor: true,
  },
];

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'User',
    password: ''
  });
  const { toast } = useToast();

  const handleAddUser = () => {
    // Validate form
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would send the data to the server
    // For the demo, we'll just show success and close the dialog
    toast({
      title: "User added",
      description: `Successfully added ${newUser.name} as a ${newUser.role.toLowerCase()}.`,
    });

    // Reset form and close dialog
    setNewUser({
      name: '',
      email: '',
      role: 'User',
      password: ''
    });
    setShowAddUserDialog(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRoleChange = (role: string) => {
    setNewUser(prev => ({ ...prev, role }));
  };

  // Filter users based on search and filters
  const filteredUsers = usersList.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || user.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleSendEmail = (user: typeof usersList[0]) => {
    toast({
      title: "Email sent",
      description: `Notification email sent to ${user.name}`,
    });
  };

  const handleResetPassword = (user: typeof usersList[0]) => {
    toast({
      title: "Password reset",
      description: `Password reset link sent to ${user.email}`,
    });
  };

  const handleToggleStatus = (user: typeof usersList[0]) => {
    const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    toast({
      title: `User ${newStatus.toLowerCase()}`,
      description: `${user.name} has been ${newStatus.toLowerCase()}`,
      variant: newStatus === 'Active' ? 'default' : 'destructive',
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
        <div className="flex items-center justify-between">
          <div>
            <Link to="/admin" className="text-security-primary hover:underline inline-flex items-center mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Admin Dashboard
            </Link>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage user accounts and permissions
            </p>
          </div>
          <Button className="bg-security-primary hover:bg-security-primary/90" onClick={() => setShowAddUserDialog(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        <SecurityCard
          className="mb-6 glass-card dark:bg-sidebar-accent/50"
          title="Users"
          icon={<Users className="w-5 h-5 text-security-primary" />}
        >
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="relative flex-1">                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none z-10" />
                <Input
                  placeholder="Search users..."
                  className="pl-12"
                  style={{ textIndent: "5px" }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="z-50">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent className="z-50">
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium">User</th>
                    <th className="text-left py-3 px-4 font-medium">Role</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Security</th>
                    <th className="text-left py-3 px-4 font-medium">Last Login</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-muted/20">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-full ${
                            user.role === 'Admin' 
                              ? 'bg-security-primary/20' 
                              : user.role === 'Moderator'
                              ? 'bg-security-secondary/20'
                              : 'bg-muted'
                          } flex items-center justify-center mr-3`}>
                            {user.name.split(' ').map(name => name[0]).join('')}
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'Admin' 
                            ? 'bg-security-primary/20 text-security-primary' 
                            : user.role === 'Moderator'
                            ? 'bg-security-secondary/20 text-security-secondary'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'Active' 
                            ? 'bg-security-secondary/20 text-security-secondary' 
                            : user.status === 'Suspended'
                            ? 'bg-security-danger/20 text-security-danger'
                            : 'bg-security-warning/20 text-security-warning'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-16 mr-2">
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  user.securityScore >= 80 ? 'bg-security-secondary' : 
                                  user.securityScore >= 60 ? 'bg-security-warning' : 
                                  'bg-security-danger'
                                }`}
                                style={{ width: `${user.securityScore}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="text-xs font-medium">{user.securityScore}%</div>
                          {user.hasTwoFactor && (
                            <div className="ml-2 text-security-secondary" title="2FA Enabled">
                              <ShieldAlert className="h-3.5 w-3.5" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {user.lastLogin}
                      </td>
                      <td className="py-3 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="glass-card">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleSendEmail(user)}>
                              <Mail className="mr-2 h-4 w-4" />
                              <span>Contact User</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                              <UserCog className="mr-2 h-4 w-4" />
                              <span>Reset Password</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                              <UserMinus className="mr-2 h-4 w-4" />
                              <span>{user.status === 'Active' ? 'Suspend User' : 'Activate User'}</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="font-medium">No users found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
            
            <div className="flex justify-between items-center pt-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredUsers.length} of {usersList.length} users
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm" disabled>Next</Button>
              </div>
            </div>
          </div>
        </SecurityCard>
      </motion.div>
      
      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with the specified details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Full Name</label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={newUser.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email Address</label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="user@example.com"
                value={newUser.email}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Initial Password</label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={newUser.password}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">
                User will be prompted to change this password on first login.
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">User Role</label>
              <Select value={newUser.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Administrator</SelectItem>
                  <SelectItem value="Moderator">Moderator</SelectItem>
                  <SelectItem value="User">Regular User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleAddUser} className="bg-security-primary hover:bg-security-primary/90">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default AdminUsers;
