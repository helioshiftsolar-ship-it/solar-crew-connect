import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Paperclip, MoreVertical } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
  senderName: string;
}

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientName: string;
  recipientAvatar?: string;
  dealTitle: string;
}

const DUMMY_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Hi! I wanted to discuss the project timeline.',
    sender: 'other',
    timestamp: new Date(Date.now() - 3600000 * 2),
    senderName: 'Other Party',
  },
  {
    id: '2',
    text: 'Sure, I\'m available to discuss. What aspects would you like to cover?',
    sender: 'user',
    timestamp: new Date(Date.now() - 3600000 * 1.5),
    senderName: 'You',
  },
  {
    id: '3',
    text: 'I was thinking about the milestone deadlines. Can we adjust the first milestone to next week?',
    sender: 'other',
    timestamp: new Date(Date.now() - 3600000),
    senderName: 'Other Party',
  },
  {
    id: '4',
    text: 'That should work. I\'ll update the project plan accordingly.',
    sender: 'user',
    timestamp: new Date(Date.now() - 1800000),
    senderName: 'You',
  },
  {
    id: '5',
    text: 'Great! Looking forward to starting the work.',
    sender: 'other',
    timestamp: new Date(Date.now() - 900000),
    senderName: 'Other Party',
  },
];

export function ChatDialog({
  open,
  onOpenChange,
  recipientName,
  recipientAvatar,
  dealTitle,
}: ChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>(DUMMY_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
      senderName: 'You',
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // Simulate response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thanks for the message! I\'ll get back to you shortly.',
        sender: 'other',
        timestamp: new Date(),
        senderName: recipientName,
      };
      setMessages((prev) => [...prev, response]);
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg h-[600px] flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="px-4 py-3 border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={recipientAvatar} alt={recipientName} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(recipientName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-base">{recipientName}</DialogTitle>
              <p className="text-xs text-muted-foreground">{dealTitle}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-muted rounded-bl-md'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user'
                        ? 'text-primary-foreground/70'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t flex-shrink-0">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              size="icon"
              className="h-9 w-9 flex-shrink-0"
              disabled={!newMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
