import React, { useState } from 'react';
import { Search, MoreVertical, Trash, UserCheck, UserX, Lock, Filter, X } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { useToast } from '@/hooks/use-toast';
import { ModernSearch } from '@/components/ui/modern-search';

const AdminUsers: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('user');
  const [newPassword, setNewPassword] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Mock user data - would come from an API in a real application
  const [users, setUsers] = useState([
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com', role: 'user', status: 'Active', lastLogin: '2023-05-10' },
    { id: 2, name: 'Maya Patel', email: 'maya@example.com', role: 'admin', status: 'Active', lastLogin: '2023-05-12' },
    { id: 3, name: 'Sam Wilson', email: 'sam@example.com', role: 'user', status: 'Inactive', lastLogin: '2023-04-28' },
    { id: 4, name: 'Taylor Smith', email: 'taylor@example.com', role: 'user', status: 'Active', lastLogin: '2023-05-11' },
    { id: 5, name: 'Jordan Lee', email: 'jordan@example.com', role: 'user', status: 'Active', lastLogin: '2023-05-09' }
  ]);

  const filteredUsers = users
    .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                   user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(user => statusFilter === 'all' || user.status.toLowerCase() === statusFilter.toLowerCase())
    .filter(user => roleFilter === 'all' || user.role.toLowerCase() === roleFilter.toLowerCase());

  const handleAddUser = () => {
    if (!newUserName || !newUserEmail || !newPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newUser = {
      id: users.length + 1,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: 'Active',
      lastLogin: 'Never'
    };

    setUsers([...users, newUser]);
    setShowAddUserDialog(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('user');
    setNewPassword('');
    
    toast({
      title: "User Added",
      description: `${newUserName} has been added successfully`,
    });
  };

  const handleResetPassword = () => {
    setShowResetPasswordDialog(false);
    
    toast({
      title: "Password Reset",
      description: "Password reset email has been sent",
    });
  };

  const handleDeleteUser = () => {
    if (currentUserId) {
      setUsers(users.filter(user => user.id !== currentUserId));
      
      toast({
        title: "User Deleted",
        description: "The user has been deleted successfully",
      });
    }
    setShowDeleteDialog(false);
    setCurrentUserId(null);
  };

  const toggleUserStatus = (userId: number) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
        
        toast({
          title: `User ${newStatus}`,
          description: `${user.name} is now ${newStatus}`,
        });
        
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setRoleFilter('all');
    setSearchTerm('');
    
    toast({
      title: "Filters Cleared",
      description: "All filters have been reset",
    });
  };

  // Handle search functionality
  const handleSearch = (term: string) => {
    setIsSearching(true);
    
    // Simulate search delay for better UX
    setTimeout(() => {
      setSearchTerm(term);
      setIsSearching(false);
    }, 300);
  };

  // Generate search suggestions based on users data
  const getSearchSuggestions = () => {
    if (!searchTerm.trim()) return [];
    
    const nameSuggestions = users
      .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .map(user => ({
        id: user.id.toString(),
        text: user.name,
        type: 'Name',
      }));
    
    const emailSuggestions = users
      .filter(user => user.email.toLowerCase().includes(searchTerm.toLowerCase()))
      .map(user => ({
        id: user.id.toString(),
        text: user.email,
        type: 'Email',
      }));
    
    const roleSuggestions = ['Admin', 'User']
      .filter(role => role.toLowerCase().includes(searchTerm.toLowerCase()))
      .map(role => ({
        id: role.toLowerCase(),
        text: role,
        type: 'Role',
      }));
    
    return [...nameSuggestions, ...emailSuggestions, ...roleSuggestions].slice(0, 7);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">{t('User Management')}</h1>
        <Button 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => setShowAddUserDialog(true)}
        >
          {t('Add User')}
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <ModernSearch 
            placeholder={t('Search users...')}
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={handleSearch}
            searching={isSearching}
            suggestions={getSearchSuggestions()}
            onSuggestionClick={(suggestion) => {
              // Handle suggestion click based on type
              if (suggestion.type === 'Name' || suggestion.type === 'Email') {
                const userId = parseInt(suggestion.id);
                const user = users.find(u => u.id === userId);
                if (user) {
                  // Set search to exactly match this user
                  setSearchTerm(suggestion.text);
                }
              } else if (suggestion.type === 'Role') {
                // Set role filter
                setRoleFilter(suggestion.id);
                setSearchTerm('');
                toast({
                  title: "Filter applied",
                  description: `Showing users with role: ${suggestion.text}`,
                });
              }
            }}
            variant="default"
            mode="default"
            wrapperClassName="w-full"
            aria-label="Search users by name, email or role"
          />
        </div>
        
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className={`p-2 ${(statusFilter !== 'all' || roleFilter !== 'all') ? 'border-blue-500 text-blue-500' : ''}`}
          >
            <Filter size={18} />
          </Button>
          
          {showFilterMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-md shadow-lg z-50 p-4 space-y-4">
              <h3 className="font-medium text-foreground">Filter Users</h3>
              
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Status</Label>
                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="bg-background dark:bg-slate-700 border-input dark:border-slate-600 text-foreground">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-background dark:bg-slate-700 border-input dark:border-slate-600 text-foreground">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Role</Label>
                <Select 
                  value={roleFilter} 
                  onValueChange={setRoleFilter}
                >
                  <SelectTrigger className="bg-background dark:bg-slate-700 border-input dark:border-slate-600 text-foreground">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-background dark:bg-slate-700 border-input dark:border-slate-600 text-foreground">
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-2 flex justify-between">
                <Button 
                  variant="outline"
                  onClick={clearFilters}
                  className="text-sm"
                >
                  Clear All
                </Button>
                <Button 
                  onClick={() => setShowFilterMenu(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-sm"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-muted dark:bg-slate-700 text-foreground">
            <tr>
              <th className="px-4 py-3">{t('Name')}</th>
              <th className="px-4 py-3">{t('Email')}</th>
              <th className="px-4 py-3">{t('Role')}</th>
              <th className="px-4 py-3">{t('Status')}</th>
              <th className="px-4 py-3">{t('Last Login')}</th>
              <th className="px-4 py-3">{t('Actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border dark:divide-slate-600">
            {filteredUsers.map(user => (
              <tr key={user.id} className="bg-card dark:bg-slate-800 text-foreground hover:bg-muted dark:hover:bg-slate-700">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.role === 'admin' ? 'Admin' : 'User'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3">{user.lastLogin}</td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button 
                      title={t('reset_password')} 
                      className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                      onClick={() => {
                        setCurrentUserId(user.id);
                        setShowResetPasswordDialog(true);
                      }}
                    >
                      <Lock size={16} />
                    </button>
                    {user.status === 'Active' ? (
                      <button 
                        title={t('deactivate_user')} 
                        className="p-1 text-yellow-600 dark:text-yellow-400 hover:text-yellow-500 dark:hover:text-yellow-300"
                        onClick={() => toggleUserStatus(user.id)}
                      >
                        <UserX size={16} />
                      </button>
                    ) : (
                      <button 
                        title={t('activate_user')} 
                        className="p-1 text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300"
                        onClick={() => toggleUserStatus(user.id)}
                      >
                        <UserCheck size={16} />
                      </button>
                    )}
                    <button 
                      title={t('delete_user')} 
                      className="p-1 text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300"
                      onClick={() => {
                        setCurrentUserId(user.id);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash size={16} />
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button title={t('more_options')} className="p-1 text-muted-foreground hover:text-foreground">
                          <MoreVertical size={16} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-card dark:bg-slate-800 border-border dark:border-slate-700 text-foreground">
                        <DropdownMenuLabel>User Options</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="cursor-pointer hover:bg-muted dark:hover:bg-slate-700"
                          onClick={() => {
                            toast({
                              title: "User details",
                              description: `Viewing details for ${user.name}`,
                            });
                          }}
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer hover:bg-muted dark:hover:bg-slate-700"
                          onClick={() => {
                            toast({
                              title: "Edit User",
                              description: `Editing ${user.name}`,
                            });
                          }}
                        >
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="cursor-pointer hover:bg-muted dark:hover:bg-slate-700 text-red-600 dark:text-red-400"
                          onClick={() => {
                            setCurrentUserId(user.id);
                            setShowDeleteDialog(true);
                          }}
                        >
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="text-sm text-muted-foreground text-right">
        {`${t('showing')} ${filteredUsers.length} ${t('of')} ${users.length} ${t('results')}`}
      </div>

      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="bg-slate-800 text-white border-slate-700 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the details for the new user. They will receive an email with login instructions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={newUserRole} onValueChange={setNewUserRole}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-white">
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Initial Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Set initial password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700">
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={showResetPasswordDialog} onOpenChange={setShowResetPasswordDialog}>
        <DialogContent className="bg-slate-800 text-white border-slate-700 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription className="text-gray-400">
              This will send a password reset email to the user.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetPasswordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword} className="bg-blue-600 hover:bg-blue-700">
              Send Reset Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-slate-800 text-white border-slate-700 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteUser} 
              variant="destructive"
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;