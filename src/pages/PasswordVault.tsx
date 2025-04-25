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
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  LayoutList,
  Clock,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { SearchInput } from '@/components/ui/search-input';
import { ModernSearch } from '@/components/ui/modern-search';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useLanguage } from '@/hooks/use-language';

// Type for sort options
type SortField = 'title' | 'createdAt' | 'strength';
type SortDirection = 'asc' | 'desc';

// Type for filter options
interface FilterOptions {
  showFavorites: boolean;
  strengthLevels: {
    weak: boolean;
    medium: boolean;
    strong: boolean;
  };
}

const PasswordVault = () => {
  const [passwordEntries, setPasswordEntries] = useState<PasswordEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddPasswordDialog, setShowAddPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditPasswordDialog, setShowEditPasswordDialog] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState<PasswordEntry | null>(null);
  const [revealedPasswords, setRevealedPasswords] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { t } = useLanguage();
  
  // New state for sort and filter
  const [sortConfig, setSortConfig] = useState<{field: SortField, direction: SortDirection}>({
    field: 'title',
    direction: 'asc'
  });
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    showFavorites: false,
    strengthLevels: {
      weak: true,
      medium: true,
      strong: true
    }
  });
  
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
          title: t("Error"),
          description: t("Failed to load password entries. Please try again."),
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchPasswords();
  }, [toast, t]);

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
      title: t("Copied!"),
      description: t(`${type} copied to clipboard`),
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
        title: t("Password deleted"),
        description: t(`"${selectedPassword.title}" has been removed from your vault`),
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
      title: t("Password added"),
      description: t(`"${formData.title}" has been added to your vault`),
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

  const toggleFilterOption = (option: keyof FilterOptions, value?: boolean) => {
    if (option === 'showFavorites') {
      setFilterOptions(prev => ({ ...prev, showFavorites: value !== undefined ? value : !prev.showFavorites }));
    }
  };

  const toggleStrengthFilter = (strength: keyof FilterOptions['strengthLevels'], value?: boolean) => {
    setFilterOptions(prev => ({
      ...prev,
      strengthLevels: {
        ...prev.strengthLevels,
        [strength]: value !== undefined ? value : !prev.strengthLevels[strength]
      }
    }));
  };

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) return <SortAsc className="h-4 w-4 opacity-50" />;
    return sortConfig.direction === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />;
  };

  const filteredPasswords = passwordEntries.filter(entry => {
    // Search filter
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (entry.url && entry.url.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || entry.category === categoryFilter;
    
    // Favorites filter
    const matchesFavorites = filterOptions.showFavorites ? entry.isFavorite : true;
    
    // Strength filter
    const matchesStrength = filterOptions.strengthLevels[entry.strength as keyof FilterOptions['strengthLevels']];
    
    return matchesSearch && matchesCategory && matchesFavorites && matchesStrength;
  }).sort((a, b) => {
    // Apply sorting
    if (sortConfig.field === 'title') {
      return sortConfig.direction === 'asc' 
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (sortConfig.field === 'createdAt') {
      return sortConfig.direction === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortConfig.field === 'strength') {
      const strengthOrder = { weak: 1, medium: 2, strong: 3 };
      const aStrength = strengthOrder[a.strength as keyof typeof strengthOrder] || 0;
      const bStrength = strengthOrder[b.strength as keyof typeof strengthOrder] || 0;
      return sortConfig.direction === 'asc' ? aStrength - bStrength : bStrength - aStrength;
    }
    return 0;
  });

  const categories = Array.from(new Set(passwordEntries.map(entry => entry.category)));

  const handleEditClick = (password: PasswordEntry) => {
    setSelectedPassword(password);
    setFormData({
      title: password.title,
      username: password.username,
      password: password.password,
      url: password.url || '',
      notes: password.notes || '',
      category: password.category,
    });
    setShowEditPasswordDialog(true);
  };

  const handleUpdatePassword = () => {
    if (selectedPassword) {
      const updatedEntries = passwordEntries.map(entry => {
        if (entry.id === selectedPassword.id) {
          return {
            ...entry,
            title: formData.title,
            username: formData.username,
            password: formData.password,
            url: formData.url,
            notes: formData.notes,
            category: formData.category,
            strength: formData.password.length >= 12 ? 'strong' : formData.password.length >= 8 ? 'medium' : 'weak',
            updatedAt: new Date().toISOString(),
          };
        }
        return entry;
      });
      
      setPasswordEntries(updatedEntries);
      setShowEditPasswordDialog(false);
      setSelectedPassword(null);
      resetFormData();
      
      toast({
        title: t("Password updated"),
        description: t(`"${formData.title}" has been updated in your vault`),
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-16 h-16 border-t-4 border-security-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">{t("Loading your password vault...")}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{t("Password Vault")}</h1>
            <p className="text-muted-foreground mt-1">
              {t("Manage and securely store your passwords")}
            </p>
          </div>
          <Button className="bg-security-primary hover:bg-security-primary/90" onClick={() => setShowAddPasswordDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> {t("Add Password")}
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <ModernSearch 
            placeholder={t("Search passwords...")} 
            value={searchTerm}
            onChange={(value) => setSearchTerm(value)}
            onSearch={(value) => {
              // Handle search submission if needed
              console.log("Searching for:", value);
            }}
            suggestions={
              passwordEntries
                .filter(entry => 
                  entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  entry.username.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .slice(0, 5)
                .map(entry => ({
                  id: entry.id,
                  text: entry.title,
                  type: entry.category,
                  icon: <Key className="h-4 w-4 mr-2" />
                }))
            }
            onSuggestionClick={(suggestion) => {
              // Find and focus on the suggested password entry
              const entry = passwordEntries.find(e => e.id === suggestion.id);
              if (entry) {
                setSearchTerm(entry.title);
                // You could add more functionality here, like highlighting the selected entry
              }
            }}
            mode="inline"
            wrapperClassName="flex-1"
            aria-label={t("Search passwords")}
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder={t("Category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("All Categories")}</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <SecurityCard
          title={t("Password Entries")}
          icon={<Key className="w-5 h-5 text-security-primary" />}
          subtitle={t(`${filteredPasswords.length} passwords found`)}
          action={
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-1" /> {t("Filter")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72" align="end">
                  <div className="space-y-4">
                    <h4 className="font-medium">{t("Filter Options")}</h4>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="filter-favorites" 
                          checked={filterOptions.showFavorites}
                          onCheckedChange={(checked) => toggleFilterOption('showFavorites', checked as boolean)}
                        />
                        <Label htmlFor="filter-favorites" className="text-sm">{t("Show favorites only")}</Label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">{t("Password Strength")}</h5>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="filter-strong" 
                            checked={filterOptions.strengthLevels.strong}
                            onCheckedChange={(checked) => toggleStrengthFilter('strong', checked as boolean)}
                          />
                          <Label htmlFor="filter-strong" className="text-sm">{t("Strong")}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="filter-medium" 
                            checked={filterOptions.strengthLevels.medium}
                            onCheckedChange={(checked) => toggleStrengthFilter('medium', checked as boolean)}
                          />
                          <Label htmlFor="filter-medium" className="text-sm">{t("Medium")}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="filter-weak" 
                            checked={filterOptions.strengthLevels.weak}
                            onCheckedChange={(checked) => toggleStrengthFilter('weak', checked as boolean)}
                          />
                          <Label htmlFor="filter-weak" className="text-sm">{t("Weak")}</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    {sortConfig.direction === 'asc' ? <SortAsc className="h-4 w-4 mr-1" /> : <SortDesc className="h-4 w-4 mr-1" />} {t("Sort")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72" align="end">
                  <div className="space-y-4">
                    <h4 className="font-medium">{t("Sort By")}</h4>
                    <RadioGroup 
                      value={sortConfig.field}
                      onValueChange={(value) => handleSort(value as SortField)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="title" id="sort-name" />
                        <Label htmlFor="sort-name" className="flex items-center">
                          <LayoutList className="h-4 w-4 mr-2" /> {t("Name")} {sortConfig.field === 'title' && 
                            (sortConfig.direction === 'asc' ? <SortAsc className="h-4 w-4 ml-2" /> : <SortDesc className="h-4 w-4 ml-2" />)}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="createdAt" id="sort-date" />
                        <Label htmlFor="sort-date" className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" /> {t("Date Added")} {sortConfig.field === 'createdAt' && 
                            (sortConfig.direction === 'asc' ? <SortAsc className="h-4 w-4 ml-2" /> : <SortDesc className="h-4 w-4 ml-2" />)}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="strength" id="sort-strength" />
                        <Label htmlFor="sort-strength" className="flex items-center">
                          <Shield className="h-4 w-4 mr-2" /> {t("Password Strength")} {sortConfig.field === 'strength' && 
                            (sortConfig.direction === 'asc' ? <SortAsc className="h-4 w-4 ml-2" /> : <SortDesc className="h-4 w-4 ml-2" />)}
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </PopoverContent>
              </Popover>
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
                            text={t(entry.strength)}
                            className="ml-2 capitalize"
                          />
                        </h3>
                        <p className="text-sm text-muted-foreground">{entry.url}</p>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center">
                            <span className="text-sm font-medium w-20">{t("Username")}:</span>
                            <span className="text-sm mr-2">{entry.username}</span>
                            <button 
                              onClick={() => copyToClipboard(entry.username, t("Username"))}
                              className="p-1 rounded-full hover:bg-muted"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium w-20">{t("Password")}:</span>
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
                              onClick={() => copyToClipboard(entry.password, t("Password"))}
                              className="p-1 rounded-full hover:bg-muted"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditClick(entry)}
                      >
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
              <h3 className="mt-4 text-lg font-medium">{t("No passwords found")}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm || categoryFilter !== 'all' 
                  ? t("Try adjusting your search or filters") 
                  : t("Add a new password to get started")}
              </p>
              <Button 
                className="mt-4 bg-security-primary hover:bg-security-primary/90"
                onClick={() => setShowAddPasswordDialog(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> {t("Add Password")}
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
            <DialogTitle>{t("Add New Password")}</DialogTitle>
            <DialogDescription>
              {t("Add a new password to your secure vault.")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t("Title")}</Label>
              <Input 
                id="title" 
                name="title"
                placeholder={t("e.g., Personal Email")} 
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">{t("Username/Email")}</Label>
              <Input 
                id="username" 
                name="username"
                placeholder={t("username@example.com")} 
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("Password")}</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  name="password"
                  type={revealedPasswords.has('new') ? 'text' : 'password'}
                  placeholder={t("Enter secure password")} 
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
              <Label htmlFor="url">{t("Website URL (optional)")}</Label>
              <Input 
                id="url" 
                name="url"
                placeholder={t("https://example.com")} 
                value={formData.url}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">{t("Category")}</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("Select category")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">{t("Email")}</SelectItem>
                  <SelectItem value="financial">{t("Financial")}</SelectItem>
                  <SelectItem value="social">{t("Social Media")}</SelectItem>
                  <SelectItem value="shopping">{t("Shopping")}</SelectItem>
                  <SelectItem value="work">{t("Work")}</SelectItem>
                  <SelectItem value="other">{t("Other")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">{t("Notes (optional)")}</Label>
              <Input 
                id="notes"
                name="notes" 
                placeholder={t("Additional information")} 
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPasswordDialog(false)}>
              {t("Cancel")}
            </Button>
            <Button onClick={handleAddPassword} disabled={!formData.title || !formData.username || !formData.password}>
              {t("Save Password")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Delete Password")}</DialogTitle>
            <DialogDescription>
              {t("Are you sure you want to delete this password? This action cannot be undone.")}
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
              {t("Cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {t("Delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Password Dialog */}
      <Dialog open={showEditPasswordDialog} onOpenChange={(open) => {
        setShowEditPasswordDialog(open);
        if (!open) resetFormData();
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("Edit Password")}</DialogTitle>
            <DialogDescription>
              {t("Update your password details.")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">{t("Title")}</Label>
              <Input 
                id="edit-title" 
                name="title"
                placeholder={t("e.g., Personal Email")} 
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-username">{t("Username/Email")}</Label>
              <Input 
                id="edit-username" 
                name="username"
                placeholder={t("username@example.com")} 
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">{t("Password")}</Label>
              <div className="relative">
                <Input 
                  id="edit-password" 
                  name="password"
                  type={revealedPasswords.has('edit') ? 'text' : 'password'}
                  placeholder={t("Enter secure password")} 
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('edit')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  {revealedPasswords.has('edit') ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-url">{t("Website URL (optional)")}</Label>
              <Input 
                id="edit-url" 
                name="url"
                placeholder={t("https://example.com")} 
                value={formData.url}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">{t("Category")}</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger id="edit-category">
                  <SelectValue placeholder={t("Select category")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">{t("Email")}</SelectItem>
                  <SelectItem value="financial">{t("Financial")}</SelectItem>
                  <SelectItem value="social">{t("Social Media")}</SelectItem>
                  <SelectItem value="shopping">{t("Shopping")}</SelectItem>
                  <SelectItem value="work">{t("Work")}</SelectItem>
                  <SelectItem value="other">{t("Other")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">{t("Notes (optional)")}</Label>
              <Input 
                id="edit-notes"
                name="notes" 
                placeholder={t("Additional information")} 
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditPasswordDialog(false)}>
              {t("Cancel")}
            </Button>
            <Button onClick={handleUpdatePassword} disabled={!formData.title || !formData.username || !formData.password}>
              {t("Update Password")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default PasswordVault;
