import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  RefreshCw
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

const EncryptedMessaging: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messageEndRef = useRef<HTMLDivElement>(null);
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

  return (
    <Card className="w-full h-[700px] flex flex-col">
      <CardHeader className="px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="h-5 w-5 text-primary" />
            Encrypted Messaging
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          End-to-end encrypted communication
        </CardDescription>
      </CardHeader>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Conversations Sidebar */}
        <div className="w-1/3 border-r flex flex-col">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search contacts..." 
                className="pl-8"
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2">
              {conversations.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No conversations yet</p>
                  <Button variant="outline" className="mt-4 gap-1">
                    <PlusCircle className="h-4 w-4" />
                    Start New Chat
                  </Button>
                </div>
              ) : (
                conversations.map((conv) => (
                  <div 
                    key={conv.id}
                    className={`flex items-center gap-3 p-3 rounded-md cursor-pointer mb-1 hover:bg-muted ${
                      activeConversation === conv.id ? 'bg-muted' : ''
                    }`}
                    onClick={() => setActiveConversation(conv.id)}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conv.contact.avatar} />
                        <AvatarFallback>
                          {conv.contact.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                        conv.contact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-start">
                        <p className="font-medium truncate">{conv.contact.name}</p>
                        {conv.messages.length > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {formatTime(conv.messages[conv.messages.length - 1].timestamp)}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {conv.messages.length > 0 ? 
                          conv.messages[conv.messages.length - 1].content : 
                          'No messages yet'}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          
          <div className="p-3 border-t">
            <Button variant="secondary" className="w-full gap-1">
              <PlusCircle className="h-4 w-4" />
              New Secure Chat
            </Button>
          </div>
        </div>
        
        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-3 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={getCurrentConversation()?.contact.avatar} />
                    <AvatarFallback>
                      {getCurrentConversation()?.contact.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium leading-none">{getCurrentConversation()?.contact.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {getCurrentConversation()?.contact.status === 'online' ? 
                        'Online' : `Last seen ${getCurrentConversation()?.contact.lastSeen}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 flex items-center gap-1 px-2">
                    <Lock className="h-3 w-3" />
                    <span className="text-xs">End-to-End Encrypted</span>
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {getCurrentConversation()?.messages.map((msg, index) => {
                    const isSender = msg.senderId === 'current-user';
                    const showDate = index === 0 || 
                      formatDate(getCurrentConversation()?.messages[index-1].timestamp as string) !== 
                      formatDate(msg.timestamp);
                    
                    return (
                      <React.Fragment key={msg.id}>
                        {showDate && (
                          <div className="flex justify-center my-2">
                            <Badge variant="outline" className="bg-background">
                              {formatDate(msg.timestamp)}
                            </Badge>
                          </div>
                        )}
                        <div className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                          <div 
                            className={`max-w-[80%] rounded-lg px-3 py-2 ${
                              isSender ? 
                                'bg-primary text-primary-foreground' : 
                                'bg-muted'
                            }`}
                          >
                            <p>{msg.content}</p>
                            <div className={`text-xs mt-1 flex items-center gap-1 ${
                              isSender ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            }`}>
                              {formatTime(msg.timestamp)}
                              {isSender && (
                                <CheckCircle className="h-3 w-3 ml-1" />
                              )}
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                  <div ref={messageEndRef} />
                </div>
              </ScrollArea>
              
              {/* Message Input */}
              <div className="p-3 border-t">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Input 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button 
                    type="submit" 
                    size="icon"
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Lock className="h-3 w-3 mr-1" />
                    Messages are end-to-end encrypted
                  </div>
                  <div className="text-xs flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Self-destruct:</span>
                    <select className="text-xs bg-transparent border-none p-0">
                      <option>Off</option>
                      <option>30 seconds</option>
                      <option>1 minute</option>
                      <option>5 minutes</option>
                      <option>1 hour</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center flex-col p-4 text-center">
              <User className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">No conversation selected</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                Select a conversation from the sidebar or start a new secure chat to begin messaging.
              </p>
              <Button variant="outline" className="mt-6 gap-1">
                <PlusCircle className="h-4 w-4" />
                New Secure Chat
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default EncryptedMessaging;
