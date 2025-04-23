import { useState, useEffect, useRef } from 'react';
import { useResizable } from '@/hooks/use-resizable';
import { cn } from '@/lib/utils';
import ResizeHandle from '@/components/ResizeHandle';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card as CardComponent, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { 
  MessageSquare, 
  Send, 
  Clock, 
  Paperclip, 
  MoreVertical, 
  Lock, 
  Image,
  Loader2,
  Search,
  PlusCircle,
  CheckCircle,
  User,
  RefreshCw,
  Trash,
  Trash2
} from "lucide-react";
import { messagingMock as mockApi } from "@/lib/securityFeaturesMock";
import { useToast } from "@/hooks/use-toast";

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
}

interface Conversation {
  id: string;
  contact: Contact;
  messages: Message[];
  encryptionStatus: string;
}

function EncryptedMessaging() {
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
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'contacts' | 'files'>('all');
  const [editedContactName, setEditedContactName] = useState('');
  const [showContactInfo, setShowContactInfo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contactsAreaRef = useRef<HTMLDivElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  
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
      <CardComponent className="w-full h-[700px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading secure messages...</p>
        </div>
      </CardComponent>
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
      case 'all':
      default:
        return conversations;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
      setShowFileConfirmation(true);
    }
  };

  const handleFilesConfirm = () => {
    // Here we would normally upload and send the files
    // For demo purposes, we'll just create message objects for each file
    if (!activeConversation || selectedFiles.length === 0) return;
    
    const currentConversation = conversations.find(conv => conv.id === activeConversation);
    if (!currentConversation) return;

    const updatedConversations = [...conversations];
    const conversationIndex = updatedConversations.findIndex(c => c.id === activeConversation);

    // Create a message for each file
    selectedFiles.forEach(file => {
      const newMsg: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        senderId: 'current-user',
        receiverId: currentConversation.contact.id,
        content: `📎 File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
        timestamp: new Date().toISOString(),
        read: false
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

  return (
    <CardComponent className="w-full h-[calc(100vh-12rem)] overflow-hidden flex flex-col rounded-xl">
      {/* Removing the header section to give more space for the chat */}
      <CardContent className="flex flex-1 p-0 overflow-hidden relative">
        {/* Conversations Sidebar */}
        <div 
          ref={contactsAreaRef} 
          className={cn(
            "border-r dark:border-r border-border bg-card h-full w-[320px] transition-all duration-100 rounded-l-xl overflow-hidden flex flex-col",
            isResizing && "select-none user-select-none"
          )}>
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search contacts..." 
                className="pl-8 rounded-full"
              />
            </div>
            <div className="flex gap-1 mt-2">
              <Button 
                size="sm" 
                variant={activeFilter === 'all' ? "default" : "outline"}
                onClick={() => setActiveFilter('all')}
                className="rounded-full"
              >
                All
              </Button>
              <Button 
                size="sm" 
                variant={activeFilter === 'unread' ? "default" : "outline"}
                className={activeFilter === 'unread' ? "bg-red-500 hover:bg-red-600 rounded-full" : "text-red-500 border-red-500/20 rounded-full"}
                onClick={() => setActiveFilter('unread')}
              >
                Unread
              </Button>
              <Button 
                size="sm" 
                variant={activeFilter === 'contacts' ? "default" : "outline"}
                className={activeFilter === 'contacts' ? "bg-emerald-500 hover:bg-emerald-600 rounded-full" : "text-emerald-500 border-emerald-500/20 rounded-full"}
                onClick={() => setActiveFilter('contacts')}
              >
                Contacts
              </Button>
              <Button 
                size="sm" 
                variant={activeFilter === 'files' ? "default" : "outline"}
                className={activeFilter === 'files' ? "bg-amber-500 hover:bg-amber-600 rounded-full" : "text-amber-500 border-amber-500/20 rounded-full"}
                onClick={() => setActiveFilter('files')}
              >
                Files
              </Button>
            </div>
          </div>
          
          <ScrollArea className="flex-grow h-full">
            <div className="py-3 px-2 space-y-0.5">
              {getFilteredConversations().map((conv) => (
                <div
                  key={conv.id}
                  className={cn(
                    "flex items-center p-3 rounded-lg cursor-pointer",
                    activeConversation === conv.id ? 
                      "bg-primary/10 dark:bg-[#1e2b47]" : 
                      "bg-transparent hover:bg-gray-100 dark:hover:bg-[#1e2b47]/70"
                  )}
                  onClick={() => setActiveConversation(conv.id)}
                >
                  <Avatar className="h-11 w-11 mr-3 bg-primary/20 dark:bg-slate-700 text-primary dark:text-white">
                    <AvatarFallback className="text-xl font-semibold">
                      {conv.contact.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className="text-base dark:text-white text-gray-800 font-medium truncate pr-2">
                        {conv.contact.name}
                      </h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {conv.messages.length > 0 ? 
                          formatTime(conv.messages[conv.messages.length - 1].timestamp) : ''}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[85%]">
                        {conv.messages.length > 0 ? 
                          conv.messages[conv.messages.length - 1].content : 'Start a conversation'}
                      </p>
                      {conv.messages.some(msg => !msg.read && msg.senderId !== 'current-user') && (
                        <Badge className="bg-red-500 hover:bg-red-500 rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center text-[10px]">
                          {conv.messages.filter(msg => !msg.read && msg.senderId !== 'current-user').length}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          {/* New Chat button moved to bottom of sidebar */}
          <div className="p-3 border-t border-border mt-auto">
            <Button
              className="w-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center rounded-full gap-2"
              onClick={handleNewChat}
            >
              <PlusCircle className="h-4 w-4" />
              <span>New Chat</span>
            </Button>
          </div>
        </div>
        
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
                          <div 
                            className={cn(
                              "px-4 py-2 rounded-2xl max-w-md text-sm",
                              isCurrentUser ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted rounded-tl-none"
                            )}
                          >
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
                        <Image className="h-4 w-4 text-primary" />
                      ) : (
                        <Paperclip className="h-4 w-4 text-primary" />
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
    </CardComponent>
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

export default EncryptedMessaging;
