import { useState } from "react";
import { X, Send, Mic, Sparkles, Target, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  sender: "user" | "other";
  content: string;
  timestamp: string;
}

interface ConversationThreadProps {
  contact: {
    name: string;
    avatar: string;
    title?: string;
  };
  platform?: "linkedin" | "whatsapp" | "sumbios" | "email";
  onClose: () => void;
}

const mockConversation: Message[] = [
  {
    id: "1",
    sender: "other",
    content: "Hi! I wanted to follow up on our discussion from last week about the energy storage project.",
    timestamp: "2h ago"
  },
  {
    id: "2",
    sender: "user",
    content: "Thanks for reaching out! I've been thinking about the collaboration opportunities.",
    timestamp: "1h ago"
  },
  {
    id: "3",
    sender: "other",
    content: "Great! Would you be interested in scheduling a call to discuss the specifics?",
    timestamp: "30m ago"
  }
];

const aiSuggestions = [
  "Confirm availability and propose 2-3 specific time slots for next week",
  "Ask about their current priorities and how this aligns with their roadmap",
  "Share a brief outline of what you'd like to cover in the call",
  "Mention specific expertise or resources you can bring to the collaboration"
];

const getPlatformBadge = (platform: "linkedin" | "whatsapp" | "sumbios" | "email") => {
  switch (platform) {
    case "linkedin":
      return { label: "LI", color: "bg-blue-600 text-white" };
    case "whatsapp":
      return { label: "WA", color: "bg-green-600 text-white" };
    case "sumbios":
      return { label: "SIE", color: "bg-yellow-600 text-white" };
    case "email":
      return { label: "EMAIL", color: "bg-gray-600 text-white" };
  }
};

export const ConversationThread = ({ contact, platform, onClose }: ConversationThreadProps) => {
  const [message, setMessage] = useState("");
  const [showGoalDialog, setShowGoalDialog] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    console.log("Sending message:", message);
    setMessage("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-card">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Avatar className="w-10 h-10">
          <AvatarImage src={contact.avatar} alt={contact.name} />
          <AvatarFallback>
            {contact.name.split(" ").map(n => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-foreground">{contact.name}</h2>
            {platform && (
              <Badge className={`${getPlatformBadge(platform).color} text-[10px] px-1.5 py-0 h-5 font-bold`}>
                {getPlatformBadge(platform).label}
              </Badge>
            )}
          </div>
          {contact.title && (
            <p className="text-xs text-muted-foreground truncate">{contact.title}</p>
          )}
        </div>
      </div>

      {/* Conversation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mockConversation.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p className={`text-xs mt-1 ${
                msg.sender === "user" 
                  ? "text-primary-foreground/70" 
                  : "text-muted-foreground"
              }`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* AI Suggestions Section */}
      <div className="border-t bg-card/50 p-4">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">AI Suggested Responses</h3>
            <span className="text-xs text-muted-foreground">
              to move towards your desired outcome
            </span>
          </div>
          
          <div className="space-y-2">
            {aiSuggestions.map((suggestion, index) => (
              <Card
                key={index}
                className="p-3 cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex items-start gap-2">
                  <span className="text-primary font-semibold text-sm">•</span>
                  <p className="text-sm text-foreground flex-1">{suggestion}</p>
                </div>
              </Card>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowGoalDialog(true)}
          >
            <Target className="w-4 h-4 mr-2" />
            Speak with AI to clarify goal & desired outcome
          </Button>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-card p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-2">
            <Button
              variant="outline"
              size="icon"
              className="flex-shrink-0"
            >
              <Mic className="w-4 h-4" />
            </Button>

            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="min-h-[44px] max-h-32 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />

            <Button
              onClick={handleSend}
              disabled={!message.trim()}
              className="flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Goal Clarification Dialog */}
      {showGoalDialog && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  Clarify Conversation Goal
                </h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowGoalDialog(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Speak with AI to define and refine your desired outcome for this conversation
            </p>

            <div className="space-y-3">
              <Card className="p-4 bg-primary/5">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Current Goal:</span> Schedule a collaboration call to discuss energy storage project opportunities
                </p>
              </Card>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Mic className="w-4 h-4 mr-2" />
                  Voice Chat
                </Button>
                <Button className="flex-1">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Refine Goal
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
