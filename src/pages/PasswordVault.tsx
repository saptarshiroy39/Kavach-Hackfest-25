
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SecurityCard from '@/components/security/SecurityCard';
import SecurityBadge from '@/components/security/SecurityBadge';
import { mockApi, PasswordEntry } from '@/lib/mockDb';
import { 
  Key, 
  Plus, 
  Eye, 
  EyeOff, 
  Copy,
  Edit,
  Trash,
  Star,
  Search,
  Filter,
  SortAsc
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const PasswordVault = () => {
  const [passwordEntries, setPasswordEntries] = useState<PasswordEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddPasswordDialog, setShowAddPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState<PasswordEntry | null>(null);
  const [revealedPasswords, setRevealedPasswords] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    username: '',
    password: '',
    url: '',
    notes: '',
    category: 'other',
  });

  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        const data = await mockApi.getPasswordEntries();
        setPasswordEntries(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch passwords:', error);
        toast({
          title: "Error",
          description: "Failed to load password entries. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchPasswords();
  }, [toast]);

  const togglePasswordVisibility = (id: string) => {
    const newRevealedPasswords = new Set(revealedPasswords);
    if (revealedPasswords.has(id)) {
      newRevealedPasswords.delete(id);
    } else {
      newRevealedPasswords.add(id);
    }
    setRevealedPasswords(newRevealedPasswords);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  const toggleFavorite = (id: string) => {
    const updatedEntries = passwordEntries.map(entry => {
      if (entry.id === id) {
        return { ...entry, isFavorite: !entry.isFavorite };
      }
      return entry;
    });
    setPasswordEntries(updatedEntries);
  };

  const handleDeleteClick = (password: PasswordEntry) => {
    setSelectedPassword(password);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedPassword) {
      const updatedEntries = passwordEntries.filter(entry => entry.id !== selectedPassword.id);
      setPasswordEntries(updatedEntries);
      setShowDeleteDialog(false);
      setSelectedPassword(null);
      toast({
        title: "Password deleted",
        description: `"${selectedPassword.title}" has been removed from your vault`,
      });
    }
  };

  const handleAddPassword = () => {
    // Generate a simple ID for the new password
    const newId = `pwd_${Date.now()}`;
    const newPassword: PasswordEntry = {
      id: newId,
      userId: 'usr_123456789',
      title: formData.title,
      username: formData.username,
      password: formData.password,
      url: formData.url,
      notes: formData.notes,
      category: formData.category,
      strength: formData.password.length >= 12 ? 'strong' : formData.password.length >= 8 ? 'medium' : 'weak',
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setPasswordEntries([newPassword, ...passwordEntries]);
    setShowAddPasswordDialog(false);
    resetFormData();
    
    toast({
      title: "Password added",
      description: `"${formData.title}" has been added to your vault`,
    });
  };

  const resetFormData = () => {
    setFormData({
      title: '',
      username: '',
      password: '',
      url: '',
      notes: '',
      category: 'other',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const filteredPasswords = passwordEntries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (entry.url && entry.url.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || entry.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(passwordEntries.map(entry => entry.category)));

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-16 h-16 border-t-4 border-security-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading your password vault...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Password Vault</h1>
            <p className="text-muted-foreground mt-1">
              Manage and securely store your passwords
            </p>
          </div>
          <Button className="bg-security-primary hover:bg-security-primary/90" onClick={() => setShowAddPasswordDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Password
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search passwords..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <SecurityCard
          title="Password Entries"
          icon={<Key className="w-5 h-5 text-security-primary" />}
          subtitle={`${filteredPasswords.length} passwords found`}
          action={
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" /> Filter
              </Button>
              <Button variant="outline" size="sm">
                <SortAsc className="h-4 w-4 mr-1" /> Sort
              </Button>
            </div>
          }
        >
          {filteredPasswords.length > 0 ? (
            <div className="divide-y divide-border">
              {filteredPasswords.map((entry) => (
                <div key={entry.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() => toggleFavorite(entry.id)}
                        className={`p-1 rounded-full ${entry.isFavorite ? 'text-security-warning' : 'text-muted-foreground'}`}
                      >
                        <Star className="h-5 w-5" fill={entry.isFavorite ? 'currentColor' : 'none'} />
                      </button>
                      <div>
                        <h3 className="font-medium flex items-center">
                          {entry.title}
                          <SecurityBadge 
                            status={
                              entry.strength === 'strong' ? 'secure' : 
                              entry.strength === 'medium' ? 'warning' : 'danger'
                            }
                            text={entry.strength}
                            className="ml-2 capitalize"
                          />
                        </h3>
                        <p className="text-sm text-muted-foreground">{entry.url}</p>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center">
                            <span className="text-sm font-medium w-20">Username:</span>
                            <span className="text-sm mr-2">{entry.username}</span>
                            <button 
                              onClick={() => copyToClipboard(entry.username, 'Username')}
                              className="p-1 rounded-full hover:bg-muted"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium w-20">Password:</span>
                            <span className="text-sm font-mono mr-2">
                              {revealedPasswords.has(entry.id) ? entry.password : '••••••••'}
                            </span>
                            <button 
                              onClick={() => togglePasswordVisibility(entry.id)}
                              className="p-1 rounded-full hover:bg-muted mr-1"
                            >
                              {revealedPasswords.has(entry.id) ? (
                                <EyeOff className="h-3 w-3" />
                              ) : (
                                <Eye className="h-3 w-3" />
                              )}
                            </button>
                            <button 
                              onClick={() => copyToClipboard(entry.password, 'Password')}
                              className="p-1 rounded-full hover:bg-muted"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-security-danger hover:text-security-danger"
                        onClick={() => handleDeleteClick(entry)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Key className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">No passwords found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm || categoryFilter !== 'all' 
                  ? "Try adjusting your search or filters" 
                  : "Add a new password to get started"}
              </p>
              <Button 
                className="mt-4 bg-security-primary hover:bg-security-primary/90"
                onClick={() => setShowAddPasswordDialog(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Password
              </Button>
            </div>
          )}
        </SecurityCard>
      </div>

      {/* Add Password Dialog */}
      <Dialog open={showAddPasswordDialog} onOpenChange={(open) => {
        setShowAddPasswordDialog(open);
        if (!open) resetFormData();
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Password</DialogTitle>
            <DialogDescription>
              Add a new password to your secure vault.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                name="title"
                placeholder="e.g., Personal Email" 
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username/Email</Label>
              <Input 
                id="username" 
                name="username"
                placeholder="username@example.com" 
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  name="password"
                  type={revealedPasswords.has('new') ? 'text' : 'password'}
                  placeholder="Enter secure password" 
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  {revealedPasswords.has('new') ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">Website URL (optional)</Label>
              <Input 
                id="url" 
                name="url"
                placeholder="https://example.com" 
                value={formData.url}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input 
                id="notes"
                name="notes" 
                placeholder="Additional information" 
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPasswordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPassword} disabled={!formData.title || !formData.username || !formData.password}>
              Save Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Password</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this password? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedPassword && (
            <div className="py-4">
              <p className="font-medium">{selectedPassword.title}</p>
              <p className="text-sm text-muted-foreground">{selectedPassword.username}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default PasswordVault;
