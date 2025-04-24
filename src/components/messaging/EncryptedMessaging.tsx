import { useState, useEffect, useRef } from 'react';
import { useResizable } from '@/hooks/use-resizable';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator } from "@/components/ui/context-menu";
import { 
  MessageSquare, 
  Send, 
  Clock, 
  Paperclip, 
  MoreVertical, 
  Lock, 
  Image as ImageIcon,
  Loader2,
  Search,
  PlusCircle,
  CheckCircle,
  User,
  RefreshCw,
  Trash,
  Trash2,
  Download,
  Forward,
  Share2,
  FileText,
  Video,
  File as FileIcon,
  X,
  Play,
  Reply,
  Copy,
  Star,
  Pin,
  AudioLines,
  FileCode,
  FileArchive,
  FileSpreadsheet
} from "lucide-react";
import { messagingMock as mockApi } from "@/lib/securityFeaturesMock";
import { useToast } from "@/hooks/use-toast";
import { ModernSearch } from "@/components/ui/modern-search";

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  lastSeen: string;
  status: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  mediaType?: 'image' | 'video' | 'document' | 'audio';
  mediaUrl?: string;
  fileData?: {
    name: string;
    size: number;
    type: string;
    url?: string; // For local preview
    blob?: Blob; // For storing the actual file data
  };
}

interface Conversation {
  id: string;
  contact: Contact;
  messages: Message[];
  encryptionStatus: string;
}

export default function EncryptedMessaging() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showFileConfirmation, setShowFileConfirmation] = useState(false);
  const [selfDestructTime, setSelfDestructTime] = useState<string>('Off');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditContactDialog, setShowEditContactDialog] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'contacts' | 'files' | 'starred'>('all');
  const [editedContactName, setEditedContactName] = useState('');
  const [showContactInfo, setShowContactInfo] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Conversation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contactsAreaRef = useRef<HTMLDivElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  // New state for media previews and actions
  const [viewingMedia, setViewingMedia] = useState<Message | null>(null);
  const [showForwardDialog, setShowForwardDialog] = useState(false);
  const [forwardTargets, setForwardTargets] = useState<Set<string>>(new Set());
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
  const [showDeleteMessageDialog, setShowDeleteMessageDialog] = useState(false);
  const [showReplyToMessage, setShowReplyToMessage] = useState<Message | null>(null);
  const [starredMessages, setStarredMessages] = useState<Set<string>>(new Set());
  const [pinnedMessages, setPinnedMessages] = useState<Record<string, Message[]>>({});
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [messageToShare, setMessageToShare] = useState<Message | null>(null);
  
  // Initialize resizable functionality for contacts section
  const { isResizing, startResizing } = useResizable({
    sidebarRef: contactsAreaRef,
    minWidth: 250,
    maxWidth: 500,
    defaultWidth: 320,
    storageKey: 'kavach-messages-contacts-width'
  });
  const { toast } = useToast();

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const data = await mockApi.getEncryptedConversations();
      setConversations(data);
      if (data.length > 0 && !activeConversation) {
        setActiveConversation(data[0].id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch conversations.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation, conversations]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    const currentConversation = conversations.find(conv => conv.id === activeConversation);
    if (!currentConversation) return;

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      senderId: 'current-user',
      receiverId: currentConversation.contact.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false
    };

    // Update conversations with new message
    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeConversation) {
        return {
          ...conv,
          messages: [...conv.messages, newMsg]
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setNewMessage('');

    // Simulate reply after delay
    setTimeout(() => {
      const autoReply: Message = {
        id: `msg_${Date.now() + 1}`,
        senderId: currentConversation.contact.id,
        receiverId: 'current-user',
        content: 'Thanks for your message! This is an auto-reply for demonstration purposes.',
        timestamp: new Date().toISOString(),
        read: false
      };

      setConversations(convs => 
        convs.map(conv => {
          if (conv.id === activeConversation) {
            return {
              ...conv,
              messages: [...conv.messages, autoReply]
            };
          }
          return conv;
        })
      );
    }, 1500);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const getCurrentConversation = () => {
    return conversations.find(conv => conv.id === activeConversation);
  };

  const handleRefresh = () => {
    fetchConversations();
    toast({
      title: "Refreshed",
      description: "Your conversations have been refreshed.",
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full h-[700px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading secure messages...</p>
        </div>
      </Card>
    );
  }

  const handleNewChat = () => {
    setShowNewChatDialog(true);
  };

  const handleCreateChat = () => {
    if (!newContactName.trim()) return;
    
    const newContact: Contact = {
      id: `contact-${Date.now()}`,
      name: newContactName,
      lastSeen: new Date().toISOString(),
      status: 'online'
    };
    
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      contact: newContact,
      messages: [],
      encryptionStatus: 'secure'
    };
    
    setConversations([...conversations, newConversation]);
    setActiveConversation(newConversation.id);
    setShowNewChatDialog(false);
    setNewContactName('');
    
    toast({
      title: "Secure Chat Created",
      description: `New encrypted chat with ${newContactName} has been set up successfully.`
    });
  };

  // Filter conversations based on active filter
  const getFilteredConversations = () => {
    switch (activeFilter) {
      case 'unread':
        return conversations.filter(conv => 
          conv.messages.some(msg => !msg.read && msg.senderId !== 'current-user')
        );
      case 'contacts':
        // Sort by name
        return [...conversations].sort((a, b) => 
          a.contact.name.localeCompare(b.contact.name)
        );
      case 'files':
        return conversations.filter(conv => 
          conv.messages.some(msg => msg.content.includes('📎 File:'))
        );
      case 'starred':
        // Filter conversations that have starred messages
        return conversations.filter(conv => 
          conv.messages.some(msg => starredMessages.has(msg.id))
        );
      case 'all':
      default:
        return conversations;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      
      // Process files to create previews
      const processedFiles = filesArray.map(file => {
        // Create URL for previewing images and videos
        const url = URL.createObjectURL(file);
        return {
          file,
          url: file.type.startsWith('image/') || file.type.startsWith('video/') ? url : undefined
        };
      });
      
      setSelectedFiles(filesArray);
      setShowFileConfirmation(true);
    }
  };

  const handleFilesConfirm = () => {
    // Here we would normally upload and send the files
    // For demo purposes, we'll create message objects with media support
    if (!activeConversation || selectedFiles.length === 0) return;
    
    const currentConversation = conversations.find(conv => conv.id === activeConversation);
    if (!currentConversation) return;

    const updatedConversations = [...conversations];
    const conversationIndex = updatedConversations.findIndex(c => c.id === activeConversation);

    // Create a message for each file with appropriate media type and preview
    selectedFiles.forEach(file => {
      // Determine the media type
      let mediaType: 'image' | 'video' | 'document' | 'audio' | undefined;
      
      if (file.type.startsWith('image/')) {
        mediaType = 'image';
      } else if (file.type.startsWith('video/')) {
        mediaType = 'video';
      } else if (file.type.startsWith('audio/')) {
        mediaType = 'audio';
      } else {
        mediaType = 'document';
      }

      // Create the message object with file data
      const newMsg: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        senderId: 'current-user',
        receiverId: currentConversation.contact.id,
        content: `📎 File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
        timestamp: new Date().toISOString(),
        read: false,
        mediaType,
        fileData: {
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
          blob: file
        }
      };
      
      updatedConversations[conversationIndex].messages.push(newMsg);
    });

    setConversations(updatedConversations);
    setSelectedFiles([]);
    setShowFileConfirmation(false);

    toast({
      title: `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} sent`,
      description: 'Files have been securely sent with end-to-end encryption',
    });
  };

  const handleCancelFiles = () => {
    setSelectedFiles([]);
    setShowFileConfirmation(false);
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  // New function to handle contact search
  const handleSearch = (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      const results = conversations.filter(conv => 
        conv.contact.name.toLowerCase().includes(term.toLowerCase()) || 
        conv.messages.some(msg => 
          msg.content.toLowerCase().includes(term.toLowerCase())
        )
      );
      
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  };

  // Define search suggestions for contacts
  const getSearchSuggestions = () => {
    if (!searchTerm) return [];
    
    return conversations
      .filter(conv => conv.contact.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 5)
      .map(conv => ({
        id: conv.id,
        text: conv.contact.name,
        type: 'Contact',
      }));
  };

  return (
    <Card className="w-full h-[calc(100vh-12rem)] overflow-hidden flex flex-col rounded-xl">
      {/* Removing the header section to give more space for the chat */}
      <CardContent className="flex flex-1 p-0 overflow-hidden relative">
        {/* Conversations Sidebar */}
        <div 
          ref={contactsAreaRef} 
          className={cn(
            "border-r dark:border-r border-border bg-card h-full w-[320px] transition-all duration-100 rounded-l-xl overflow-hidden flex flex-col relative",
            isResizing && "select-none user-select-none"
          )}>
          <div className="p-2 border-b">
            <ModernSearch 
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={setSearchTerm}
              onSearch={handleSearch}
              searching={isSearching}
              suggestions={getSearchSuggestions()}
              onSuggestionClick={(suggestion) => {
                // Find and set the active conversation based on the suggestion
                const conversationId = suggestion.id;
                setActiveConversation(conversationId);
                setSearchTerm(''); // Clear search after selection
              }}
              variant="condensed"
              mode="inline"
              wrapperClassName="w-full"
              aria-label="Search contacts and messages"
            />
            
            {/* Horizontal scrollable tabs container */}
            <div className="relative mt-2">
              {/* Left scroll button */}
              <button 
                onClick={() => {
                  const tabsContainer = document.getElementById('filter-tabs-container');
                  if (tabsContainer) {
                    tabsContainer.scrollLeft -= 100; // Scroll left by 100px
                  }
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 rounded-full shadow-md p-1 text-muted-foreground hover:text-foreground transition-all"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px'
                }}
                aria-label="Scroll tabs left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              
              {/* Scrollable container */}
              <div 
                id="filter-tabs-container"
                className="overflow-x-auto flex gap-1 py-1 px-5 scrollbar-hide"
                style={{ 
                  scrollBehavior: 'smooth',
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none'
                }}
              >
                
                <Button 
                  size="sm" 
                  variant={activeFilter === 'all' ? "default" : "outline"}
                  onClick={() => setActiveFilter('all')}
                  className="rounded-full whitespace-nowrap"
                >
                  All
                </Button>
                <Button 
                  size="sm" 
                  variant={activeFilter === 'unread' ? "default" : "outline"}
                  className={activeFilter === 'unread' ? "bg-red-500 hover:bg-red-600 rounded-full whitespace-nowrap" : "text-red-500 border-red-500/20 rounded-full whitespace-nowrap"}
                  onClick={() => setActiveFilter('unread')}
                >
                  Unread
                </Button>
                <Button 
                  size="sm" 
                  variant={activeFilter === 'contacts' ? "default" : "outline"}
                  className={activeFilter === 'contacts' ? "bg-emerald-500 hover:bg-emerald-600 rounded-full whitespace-nowrap" : "text-emerald-500 border-emerald-500/20 rounded-full whitespace-nowrap"}
                  onClick={() => setActiveFilter('contacts')}
                >
                  Contacts
                </Button>
                <Button 
                  size="sm" 
                  variant={activeFilter === 'files' ? "default" : "outline"}
                  className={activeFilter === 'files' ? "bg-purple-500 hover:bg-purple-600 rounded-full whitespace-nowrap" : "text-purple-500 border-purple-500/20 rounded-full whitespace-nowrap"}
                  onClick={() => setActiveFilter('files')}
                >
                  Files
                </Button>
                <Button 
                  size="sm" 
                  variant={activeFilter === 'starred' ? "default" : "outline"}
                  className={activeFilter === 'starred' ? "bg-yellow-500 hover:bg-yellow-600 rounded-full whitespace-nowrap" : "text-yellow-500 border-yellow-500/20 rounded-full whitespace-nowrap"}
                  onClick={() => setActiveFilter('starred')}
                >
                  Starred
                </Button>
              </div>
              
              {/* Right scroll button */}
              <button 
                onClick={() => {
                  const tabsContainer = document.getElementById('filter-tabs-container');
                  if (tabsContainer) {
                    tabsContainer.scrollLeft += 100; // Scroll right by 100px
                  }
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-background/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 rounded-full shadow-md p-1 text-muted-foreground hover:text-foreground transition-all"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px'
                }}
                aria-label="Scroll tabs right"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
          {/* Conversation List Area */}
          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="p-2 space-y-1">
              {(searchTerm ? searchResults : getFilteredConversations()).map((conv) => {
                const lastMessage = conv.messages[conv.messages.length - 1];
                const unreadCount = conv.messages.filter(msg => !msg.read && msg.senderId !== 'current-user').length;

                return (
                  <div
                    key={conv.id}
                    className={cn(
                      "flex items-center p-3 rounded-lg cursor-pointer transition-colors",
                      activeConversation === conv.id
                        ? "bg-primary/10 dark:bg-[#1e2b47]"
                        : "hover:bg-gray-100 dark:hover:bg-[#1e2b47]/70"
                    )}
                    onClick={() => setActiveConversation(conv.id)}
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback>{conv.contact.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium truncate text-sm">{conv.contact.name}</h4>
                        {lastMessage && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatTime(lastMessage.timestamp)}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-muted-foreground truncate">
                          {lastMessage ? lastMessage.content : 'No messages yet'}
                        </p>
                        {unreadCount > 0 && (
                          <Badge className="h-5 px-1.5 text-xs rounded-full bg-red-500 text-white">
                            {unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {(searchTerm ? searchResults : getFilteredConversations()).length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  {searchTerm ? 'No results found.' : 'No conversations yet.'}
                </div>
              )}
            </div>
          </ScrollArea>
          {/* Add New Chat Button */}
          <div className="p-2 border-t">
            <Button className="w-full" variant="outline" onClick={handleNewChat}>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Secure Chat
            </Button>
          </div>
        </div>

        {/* Resize Handle */}
        <div
          className={cn(
            "absolute h-full w-1 top-0 z-50",
            isResizing ? "select-none" : "hover:bg-transparent"
          )}
          style={{
            left: `${contactsAreaRef.current ? contactsAreaRef.current.getBoundingClientRect().width : 320}px`,
            cursor: 'col-resize',
          }}
          onMouseDown={startResizing}
        />
        
        {/* Messages Area */}
        <div className="flex-1 flex flex-col bg-background dark:bg-slate-950 rounded-r-xl overflow-hidden">
          {activeConversation ? (
            <>
              {/* Active conversation header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center">
                  <Popover open={showContactInfo === activeConversation} onOpenChange={(open) => setShowContactInfo(open ? activeConversation : null)}>
                    <PopoverTrigger asChild>
                      <Avatar className="h-10 w-10 mr-3 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                        <AvatarFallback>
                          {getCurrentConversation()?.contact.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 rounded-xl p-4 shadow-lg border border-border z-50">
                      <div className="flex flex-col items-center space-y-3 p-2">
                        <Avatar className="h-20 w-20">
                          <AvatarFallback className="text-xl">
                            {getCurrentConversation()?.contact.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-center space-y-1">
                          <h3 className="font-semibold text-lg">{getCurrentConversation()?.contact.name}</h3>
                          <div className="text-sm text-muted-foreground flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-green-500 mr-1" />
                            Active now
                          </div>
                        </div>
                        <div className="w-full pt-3 border-t border-border mt-2">
                          <div className="grid grid-cols-2 gap-2 w-full">
                            <Button variant="outline" size="sm" className="w-full" onClick={() => {
                              const currentContact = getCurrentConversation()?.contact;
                              if (currentContact) {
                                setEditedContactName(currentContact.name);
                                setShowEditContactDialog(true);
                                setShowContactInfo(null);
                              }
                            }}>
                              <User className="mr-1 h-4 w-4" />
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm" className="w-full" onClick={() => {
                              setShowDeleteDialog(true);
                              setShowContactInfo(null);
                            }}>
                              <Trash2 className="mr-1 h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                          <div className="mt-3 text-xs text-center text-muted-foreground">
                            Last seen: {formatDate(getCurrentConversation()?.contact.lastSeen || '')}
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <div>
                    <h3 className="font-semibold">{getCurrentConversation()?.contact.name}</h3>
                    <div className="text-xs text-muted-foreground flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-1" />
                      Online
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 flex items-center gap-1 px-2 rounded-full">
                    <Lock className="h-3 w-3" />
                    <span className="text-xs">End-to-End Encrypted</span>
                  </Badge>
                  <div className="flex items-center">
                    <Button 
                      size="icon" 
                      variant="ghost"
                      className="rounded-full"
                      onClick={() => {
                        setShowMoreMenu(!showMoreMenu);
                      }}
                    >
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                    {showMoreMenu && (
                      <div className="absolute right-4 top-14 bg-background border border-border shadow-md rounded-lg p-2 z-10">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-sm rounded-md"
                          onClick={() => {
                            const currentContact = getCurrentConversation()?.contact;
                            if (currentContact) {
                              setEditedContactName(currentContact.name);
                              setShowEditContactDialog(true);
                              setShowMoreMenu(false);
                            }
                          }}
                        >
                          Edit Contact
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-sm text-red-500 rounded-md"
                          onClick={() => {
                            setShowDeleteDialog(true);
                            setShowMoreMenu(false);
                          }}
                        >
                          Delete Chat
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {getCurrentConversation()?.messages.map((msg) => {
                    const isCurrentUser = msg.senderId === 'current-user';
                    return (
                      <div 
                        key={msg.id}
                        className={cn(
                          "flex",
                          isCurrentUser ? "justify-end" : "justify-start"
                        )}
                      >
                        {!isCurrentUser && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Avatar className="h-8 w-8 mr-2 cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all">
                                <AvatarFallback>
                                  {getCurrentConversation()?.contact.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            </PopoverTrigger>
                            <PopoverContent side="left" align="start" className="w-60 rounded-xl p-3 shadow-lg border border-border z-50">
                              <div className="flex flex-col items-center p-2 space-y-2">
                                <Avatar className="h-16 w-16">
                                  <AvatarFallback className="text-lg">
                                    {getCurrentConversation()?.contact.name.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <h4 className="font-medium">{getCurrentConversation()?.contact.name}</h4>
                                <div className="text-xs text-muted-foreground flex items-center">
                                  <div className="h-2 w-2 rounded-full bg-green-500 mr-1" />
                                  Online
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                        <div>
                          <ContextMenu>
                            <ContextMenuTrigger>
                              <div 
                                className={cn(
                                  "px-4 py-2 rounded-2xl max-w-md text-sm",
                                  isCurrentUser ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted rounded-tl-none",
                                  msg.mediaType && "overflow-hidden p-0"
                                )}
                              >
                                {msg.mediaType && msg.fileData ? (
                                  <div className="flex flex-col">
                                    {/* Image Media Preview */}
                                    {msg.mediaType === 'image' && msg.fileData.url && (
                                      <div 
                                        className="cursor-pointer relative overflow-hidden rounded-lg border border-white/20"
                                        onClick={() => setViewingMedia(msg)}
                                      >
                                        {starredMessages.has(msg.id) && (
                                          <div className="absolute top-2 right-2 z-10">
                                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                          </div>
                                        )}
                                        <img 
                                          src={msg.fileData.url} 
                                          alt={msg.fileData.name} 
                                          className="w-full max-h-64 object-cover"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent backdrop-blur-[2px] text-white text-xs p-2 flex justify-between items-center">
                                          <span className="truncate mr-2">{msg.fileData.name}</span>
                                          <span className="whitespace-nowrap">{(msg.fileData.size / 1024).toFixed(1)} KB</span>
                                        </div>
                                      </div>
                                    )}
                                    {/* Video Media Preview */}
                                    {msg.mediaType === 'video' && msg.fileData.url && (
                                      <div 
                                        className="cursor-pointer relative overflow-hidden rounded-lg border border-white/20"
                                        onClick={() => setViewingMedia(msg)}
                                      >
                                        {starredMessages.has(msg.id) && (
                                          <div className="absolute top-2 right-2 z-10">
                                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                          </div>
                                        )}
                                        <video 
                                          src={msg.fileData.url}
                                          className="w-full max-h-64 object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                                            <Play className="h-8 w-8 text-white" />
                                          </div>
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent backdrop-blur-[2px] text-white text-xs p-2 flex justify-between items-center">
                                          <span className="truncate mr-2">{msg.fileData.name}</span>
                                          <span className="whitespace-nowrap">{(msg.fileData.size / 1024).toFixed(1)} KB</span>
                                        </div>
                                      </div>
                                    )}
                                    {/* Audio File Preview */}
                                    {msg.mediaType === 'audio' && msg.fileData.url && (
                                      <div 
                                        className="cursor-pointer relative overflow-hidden rounded-lg border border-white/20"
                                        onClick={() => setViewingMedia(msg)}
                                      >
                                        {starredMessages.has(msg.id) && (
                                          <div className="absolute top-2 right-2 z-10">
                                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                          </div>
                                        )}
                                        <div className="flex items-center gap-3 p-3">
                                          <div className={cn(
                                            "p-2 rounded-full",
                                            isCurrentUser ? "bg-white/20" : "bg-primary/10"
                                          )}>
                                            <AudioLines className="h-6 w-6" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                              {msg.fileData.name}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                              <div className="h-1 bg-gray-300/30 dark:bg-gray-600/30 flex-1 rounded-full overflow-hidden">
                                                <div className="h-full w-1/3 bg-primary/70 rounded-full"></div>
                                              </div>
                                              <span className="text-xs opacity-70 whitespace-nowrap">0:42</span>
                                            </div>
                                          </div>
                                          <div className="p-1.5 rounded-full bg-primary/10">
                                            <Play className="h-4 w-4" />
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {/* Document File Preview */}
                                    {msg.mediaType === 'document' && (
                                      <div className="flex items-center gap-3 p-3 relative">
                                        {starredMessages.has(msg.id) && (
                                          <div className="absolute top-2 right-2 z-10">
                                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                          </div>
                                        )}
                                        <div className={cn(
                                          "p-2 rounded-full",
                                          isCurrentUser ? "bg-white/20" : "bg-primary/10"
                                        )}>
                                          {/* Show different icons based on file type */}
                                          {msg.fileData?.type.includes('pdf') ? (
                                            <FileText className="h-5 w-5" />
                                          ) : msg.fileData?.type.includes('spreadsheet') || msg.fileData?.name.endsWith('.xlsx') || msg.fileData?.name.endsWith('.xls') ? (
                                            <FileSpreadsheet className="h-5 w-5" />
                                          ) : msg.fileData?.type.includes('zip') || msg.fileData?.name.endsWith('.zip') || msg.fileData?.name.endsWith('.rar') ? (
                                            <FileArchive className="h-5 w-5" />
                                          ) : msg.fileData?.type.includes('code') || (msg.fileData?.name && /\.(jsx?|tsx?|html|css|py|java|rb|php|go)$/.test(msg.fileData.name)) ? (
                                            <FileCode className="h-5 w-5" />
                                          ) : (
                                            <FileText className="h-5 w-5" />
                                          )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium truncate">
                                            {msg.fileData?.name}
                                          </p>
                                          <p className="text-xs opacity-70 mt-0.5">
                                            {msg.fileData && (msg.fileData.size / 1024).toFixed(1)} KB • {msg.fileData?.type.split('/')[1]?.toUpperCase() || 'Document'}
                                          </p>
                                        </div>
                                        <div className="p-1.5 rounded-full bg-primary/10">
                                          <Download className="h-4 w-4" />
                                        </div>
                                      </div>
                                    )}
                                    {/* Time display for all media messages */}
                                    <div className={cn(
                                      "flex justify-end p-1 text-xs",
                                      isCurrentUser 
                                        ? "text-gray-200 bg-primary" 
                                        : "text-gray-500 bg-muted"
                                    )}>
                                      <span>{formatTime(msg.timestamp)}</span>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    {/* Regular text message with star icon if starred */}
                                    <div className="flex items-center gap-1">
                                      {msg.content}
                                      {starredMessages.has(msg.id) && (
                                        <Star className="h-3 w-3 ml-1 fill-yellow-500 text-yellow-500" />
                                      )}
                                    </div>
                                    <div className="flex justify-end mt-1 -mr-2 text-xs">
                                      <span className={isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"}>
                                        {formatTime(msg.timestamp)}
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </ContextMenuTrigger>
                            <ContextMenuContent className="w-56 bg-slate-800 text-white border border-slate-700 shadow-xl">
                              <ContextMenuItem 
                                className="flex items-center gap-2 hover:bg-slate-700 focus:bg-slate-700" 
                                onClick={() => {
                                  setShowReplyToMessage(msg);
                                  setNewMessage(`Replying to: "${msg.content.length > 15 ? msg.content.slice(0, 15) + '...' : msg.content}"\n`);
                                  // Focus the input after setting the reply
                                  setTimeout(() => {
                                    const inputElement = document.querySelector('input[placeholder="Type a secure message..."]') as HTMLInputElement;
                                    if (inputElement) {
                                      inputElement.focus();
                                    }
                                  }, 100);
                                }}
                              >
                                <Reply className="h-4 w-4" />
                                <span>Reply</span>
                              </ContextMenuItem>
                              <ContextMenuItem 
                                className="flex items-center gap-2 hover:bg-slate-700 focus:bg-slate-700" 
                                onClick={() => {
                                  // Copy message content to clipboard
                                  navigator.clipboard.writeText(msg.content);
                                  toast({
                                    title: "Copied",
                                    description: "Message copied to clipboard",
                                  });
                                }}
                              >
                                <Copy className="h-4 w-4" />
                                <span>Copy</span>
                              </ContextMenuItem>
                              <ContextMenuItem 
                                className="flex items-center gap-2 hover:bg-slate-700 focus:bg-slate-700"
                                onClick={() => {
                                  setViewingMedia(msg);
                                  setShowForwardDialog(true);
                                }}
                              >
                                <Forward className="h-4 w-4" />
                                <span>Forward</span>
                              </ContextMenuItem>
                              <ContextMenuSeparator className="bg-slate-700" />
                              <ContextMenuItem 
                                className="flex items-center gap-2 hover:bg-slate-700 focus:bg-slate-700"
                                onClick={() => {
                                  const newStarredMessages = new Set(starredMessages);
                                  if (starredMessages.has(msg.id)) {
                                    newStarredMessages.delete(msg.id);
                                    toast({
                                      title: "Removed from starred",
                                      description: "Message removed from starred messages",
                                    });
                                  } else {
                                    newStarredMessages.add(msg.id);
                                    toast({
                                      title: "Starred",
                                      description: "Message added to starred messages",
                                    });
                                  }
                                  setStarredMessages(newStarredMessages);
                                }}
                              >
                                <Star className={cn("h-4 w-4", starredMessages.has(msg.id) ? "fill-yellow-500 text-yellow-500" : "")} />
                                <span>{starredMessages.has(msg.id) ? "Unstar" : "Star"}</span>
                              </ContextMenuItem>
                              <ContextMenuItem 
                                className="flex items-center gap-2 hover:bg-slate-700 focus:bg-slate-700"
                                onClick={() => {
                                  if (!activeConversation) return;
                                  
                                  const updatedPinnedMessages = { ...pinnedMessages };
                                  const conversationPins = updatedPinnedMessages[activeConversation] || [];
                                  
                                  // Check if already pinned
                                  const isPinned = conversationPins.some(pinned => pinned.id === msg.id);
                                  
                                  if (isPinned) {
                                    updatedPinnedMessages[activeConversation] = conversationPins.filter(
                                      pinned => pinned.id !== msg.id
                                    );
                                    toast({
                                      title: "Unpinned",
                                      description: "Message has been unpinned",
                                    });
                                  } else {
                                    updatedPinnedMessages[activeConversation] = [...conversationPins, msg];
                                    toast({
                                      title: "Pinned",
                                      description: "Message has been pinned to this chat",
                                    });
                                  }
                                  
                                  setPinnedMessages(updatedPinnedMessages);
                                }}
                              >
                                <Pin className={cn(
                                  "h-4 w-4",
                                  pinnedMessages[activeConversation || ""]?.some(pinned => pinned.id === msg.id) 
                                    ? "text-blue-500 fill-blue-500" 
                                    : ""
                                )} />
                                <span>{pinnedMessages[activeConversation || ""]?.some(pinned => pinned.id === msg.id) ? "Unpin" : "Pin"}</span>
                              </ContextMenuItem>
                              <ContextMenuSeparator className="bg-slate-700" />
                              <ContextMenuItem 
                                className="flex items-center gap-2 text-red-400 hover:bg-slate-700 focus:bg-slate-700 hover:text-red-400"
                                onClick={() => {
                                  setMessageToDelete(msg);
                                  setShowDeleteMessageDialog(true);
                                }}
                              >
                                <Trash className="h-4 w-4" />
                                <span>Delete for me</span>
                              </ContextMenuItem>
                              <ContextMenuItem 
                                className="flex items-center gap-2 hover:bg-slate-700 focus:bg-slate-700"
                                onClick={() => {
                                  setIsSelectionMode(true);
                                  setSelectedMessages(new Set([msg.id]));
                                  toast({
                                    title: "Selection mode",
                                    description: "You can now select multiple messages",
                                  });
                                }}
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span>Select</span>
                              </ContextMenuItem>
                              <ContextMenuItem 
                                className="flex items-center gap-2 hover:bg-slate-700 focus:bg-slate-700"
                                onClick={() => {
                                  setMessageToShare(msg);
                                  setShowShareDialog(true);
                                }}
                              >
                                <Share2 className="h-4 w-4" />
                                <span>Share</span>
                              </ContextMenuItem>
                            </ContextMenuContent>
                          </ContextMenu>
                        </div>
                      </div>
                    );
                  })}
                  {/* Move the messageEndRef div outside the map function */}
                  <div ref={messageEndRef} />
                </div>
              </ScrollArea>
              
              {/* Message input */}
              <div className="border-t p-4">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    multiple
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="rounded-full"
                    onClick={openFileSelector}
                  >
                    <Paperclip className="h-5 w-5 text-muted-foreground" />
                  </Button>
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a secure message..."
                    className="rounded-full"
                  />
                  <Button type="submit" size="icon" className="rounded-full" disabled={!newMessage.trim()}>
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <LockIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Secure Messaging</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Your messages are end-to-end encrypted. Start a conversation by selecting a contact or create a new chat.
              </p>
              <Button onClick={handleNewChat}>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Secure Chat
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* New Chat Dialog */}
      <Dialog open={showNewChatDialog} onOpenChange={setShowNewChatDialog}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Create New Secure Chat</DialogTitle>
            <DialogDescription>
              Enter the name of the contact you want to chat with securely.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="contactName" className="text-sm font-medium">
                Contact Name
              </label>
              <Input 
                id="contactName"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                placeholder="Enter contact name"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewChatDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateChat} disabled={!newContactName.trim()}>Create Chat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (!activeConversation) return;
                
                const filteredConversations = conversations.filter(conv => conv.id !== activeConversation);
                setConversations(filteredConversations);
                
                if (filteredConversations.length > 0) {
                  setActiveConversation(filteredConversations[0].id);
                } else {
                  setActiveConversation(null);
                }
                
                setShowDeleteDialog(false);
                
                toast({
                  title: "Chat Deleted",
                  description: "The chat has been permanently deleted."
                });
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Contact Dialog */}
      <Dialog open={showEditContactDialog} onOpenChange={setShowEditContactDialog}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogDescription>
              Update the contact's information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="contactName" className="text-sm font-medium">
                Contact Name
              </label>
              <Input 
                id="editContactName"
                value={editedContactName}
                onChange={(e) => setEditedContactName(e.target.value)}
                placeholder="Enter contact name"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditContactDialog(false)}>Cancel</Button>
            <Button 
              onClick={() => {
                if (!activeConversation || !editedContactName.trim()) return;
                
                const updatedConversations = conversations.map(conv => {
                  if (conv.id === activeConversation) {
                    return {
                      ...conv,
                      contact: {
                        ...conv.contact,
                        name: editedContactName
                      }
                    };
                  }
                  return conv;
                });
                
                setConversations(updatedConversations);
                setShowEditContactDialog(false);
                
                toast({
                  title: "Contact Updated",
                  description: "The contact information has been updated."
                });
              }} 
              disabled={!editedContactName.trim()}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* File Confirmation Dialog */}
      <Dialog open={showFileConfirmation} onOpenChange={setShowFileConfirmation}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Confirm File Attachment</DialogTitle>
            <DialogDescription>
              You are about to send {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}. These files will be end-to-end encrypted.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 max-h-60 overflow-y-auto">
            <div className="space-y-2">
              <div>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center p-2 border rounded-md">
                    <div className="bg-primary/10 p-2 rounded-full mr-2">
                      {file.type.startsWith('image/') ? (
                        <ImageIcon className="h-4 w-4 text-primary" />
                      ) : file.type.startsWith('video/') ? (
                        <Video className="h-4 w-4 text-primary" />
                      ) : file.type.startsWith('audio/') ? (
                        <Paperclip className="h-4 w-4 text-primary" />
                      ) : (
                        <FileIcon className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelFiles}>Cancel</Button>
            <Button onClick={handleFilesConfirm}>Send Files</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Media Viewer Dialog */}
      <Dialog 
        open={!!viewingMedia} 
        onOpenChange={(open) => {
          if (!open) setViewingMedia(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl md:max-w-3xl rounded-xl p-1 bg-black/90">
          <div className="absolute top-2 right-2 z-10">
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={() => setViewingMedia(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-col h-full w-full">
            {/* Media content */}
            <div className="flex-1 flex items-center justify-center p-4 min-h-[300px]">
              {viewingMedia?.mediaType === 'image' && viewingMedia.fileData?.url && (
                <img 
                  src={viewingMedia.fileData.url} 
                  alt={viewingMedia.fileData.name}
                  className="max-h-[70vh] max-w-full object-contain" 
                />
              )}
              
              {viewingMedia?.mediaType === 'video' && viewingMedia.fileData?.url && (
                <video 
                  src={viewingMedia.fileData.url}
                  controls
                  className="max-h-[70vh] max-w-full" 
                />
              )}
              
              {viewingMedia?.mediaType === 'audio' && viewingMedia.fileData?.url && (
                <div className="w-full p-4 bg-slate-800 rounded-lg">
                  <p className="text-white mb-2 flex items-center gap-2">
                    <Paperclip className="h-4 w-4" />
                    {viewingMedia.fileData.name}
                  </p>
                  <audio 
                    src={viewingMedia.fileData.url}
                    controls
                    className="w-full" 
                  />
                </div>
              )}
              
              {viewingMedia?.mediaType === 'document' && (
                <div className="flex items-center justify-center p-8 bg-slate-800 rounded-lg">
                  <div className="flex flex-col items-center">
                    <FileIcon className="h-16 w-16 text-primary mb-4" />
                    <p className="text-white text-center">{viewingMedia.fileData?.name}</p>
                    <p className="text-gray-400 text-sm">
                      {viewingMedia.fileData && (viewingMedia.fileData.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Media actions */}
            <div className="bg-slate-800 p-3 rounded-b-lg">
              <div className="flex items-center justify-between">
                <p className="text-white text-sm truncate max-w-[50%]">
                  {viewingMedia?.fileData?.name}
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-white hover:bg-slate-700"
                    onClick={() => {
                      if (viewingMedia?.fileData?.url) {
                        const a = document.createElement('a');
                        a.href = viewingMedia.fileData.url;
                        a.download = viewingMedia.fileData.name;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        
                        toast({
                          title: "Download started",
                          description: `Downloading ${viewingMedia.fileData.name}`,
                        });
                      }
                    }}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-white hover:bg-slate-700"
                    onClick={() => {
                      setShowForwardDialog(true);
                    }}
                  >
                    <Forward className="h-4 w-4 mr-1" />
                    Forward
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-red-400 hover:bg-slate-700 hover:text-red-400"
                    onClick={() => {
                      setMessageToDelete(viewingMedia);
                      setShowDeleteMessageDialog(true);
                    }}
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Forward Media Dialog */}
      <Dialog 
        open={showForwardDialog} 
        onOpenChange={setShowForwardDialog}
      >
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Forward Media</DialogTitle>
            <DialogDescription>
              Select a contact to forward this media to.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 max-h-60 overflow-y-auto">
            <div className="space-y-2">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={cn(
                    "flex items-center p-3 rounded-lg cursor-pointer",
                    forwardTargets.has(conv.id) 
                      ? "bg-primary/10 dark:bg-[#1e2b47]" 
                      : "bg-transparent hover:bg-gray-100 dark:hover:bg-[#1e2b47]/70"
                  )}
                  onClick={() => {
                    const newForwardTargets = new Set(forwardTargets);
                    if (newForwardTargets.has(conv.id)) {
                      newForwardTargets.delete(conv.id);
                    } else {
                      newForwardTargets.add(conv.id);
                    }
                    setForwardTargets(newForwardTargets);
                  }}
                >
                  <Avatar className="h-9 w-9 mr-3">
                    <AvatarFallback>
                      {conv.contact.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-base font-medium">{conv.contact.name}</p>
                  </div>
                  {forwardTargets.has(conv.id) && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowForwardDialog(false);
              setForwardTargets(new Set());
            }}>Cancel</Button>
            <Button 
              onClick={() => {
                if (!viewingMedia || forwardTargets.size === 0) return;
                
                // Create a copy of the message in the target conversation
                const updatedConversations = conversations.map(conv => {
                  if (forwardTargets.has(conv.id)) {
                    // Create a new message with the same media
                    const forwardedMsg: Message = {
                      ...viewingMedia,
                      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                      senderId: 'current-user',
                      receiverId: conv.contact.id,
                      timestamp: new Date().toISOString(),
                      read: false,
                      content: `📎 Forwarded: ${viewingMedia.fileData?.name} (${(viewingMedia.fileData?.size || 0) / 1024}KB)`
                    };
                    
                    return {
                      ...conv,
                      messages: [...conv.messages, forwardedMsg]
                    };
                  }
                  return conv;
                });
                
                setConversations(updatedConversations);
                setShowForwardDialog(false);
                setViewingMedia(null);
                setForwardTargets(new Set());
                
                toast({
                  title: "Media forwarded",
                  description: "The media has been forwarded successfully",
                });
              }}
              disabled={forwardTargets.size === 0}
            >
              Forward
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Message Dialog */}
      <Dialog 
        open={showDeleteMessageDialog} 
        onOpenChange={setShowDeleteMessageDialog}
      >
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Delete Media</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this media? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => {
                setShowDeleteMessageDialog(false);
                setMessageToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                if (!messageToDelete || !activeConversation) return;
                
                // Remove the message from the conversation
                const updatedConversations = conversations.map(conv => {
                  if (conv.id === activeConversation) {
                    return {
                      ...conv,
                      messages: conv.messages.filter(msg => msg.id !== messageToDelete.id)
                    };
                  }
                  return conv;
                });
                
                setConversations(updatedConversations);
                setShowDeleteMessageDialog(false);
                setViewingMedia(null);
                setMessageToDelete(null);
                
                toast({
                  title: "Media deleted",
                  description: "The media has been permanently deleted",
                });
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};



// Helper component for the empty state
const LockIcon = (props) => {
  return (
    <div className="relative">
      <div className="absolute -inset-1 rounded-full bg-primary/10 blur-sm" />
      <div className="relative bg-background rounded-full p-4">
        <Lock {...props} />
      </div>
    </div>
  );
};
