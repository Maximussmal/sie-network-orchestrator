import { useState } from "react";
import { X, Send, Check, Edit, Trash2, Sparkles, Mic, Volume2 } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface AIAction {
  id: string;
  title: string;
  description: string;
  category: "email" | "meeting" | "task";
}

const mockActions: AIAction[] = [
  {
    id: "1",
    title: "Send follow-up to Marcus",
    description: "Draft and send follow-up email regarding partnership proposal",
    category: "email",
  },
  {
    id: "2",
    title: "Schedule Q4 review",
    description: "Find time slot for Q4 strategy review with Sarah and team",
    category: "meeting",
  },
  {
    id: "3",
    title: "Update budget document",
    description: "Add approved allocations to Q1 budget spreadsheet",
    category: "task",
  },
];

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistant = ({ isOpen, onClose }: AIAssistantProps) => {
  const [message, setMessage] = useState("");
  const [actions, setActions] = useState(mockActions);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleAccept = (id: string) => {
    setActions(actions.filter((a) => a.id !== id));
  };

  const handleDelete = (id: string) => {
    setActions(actions.filter((a) => a.id !== id));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Drawer from bottom */}
      <div className="fixed inset-x-0 bottom-0 h-[85vh] bg-card border-t border-border shadow-2xl z-50 flex flex-col animate-slide-in-bottom rounded-t-3xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(190,100%,17%,0.8)] to-[hsl(46,93%,45%,0.6)] ai-glow sphere-pulse flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">SIE</h2>
              <p className="text-xs text-muted-foreground">Orchestrate Everything</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

      {/* Upcoming Actions Section */}
      {actions.length > 0 && (
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">Upcoming Actions</h3>
          <div className="space-y-2">
            {actions.map((action) => (
              <Card key={action.id} className="p-3 bg-accent/50">
                <div className="mb-2">
                  <div className="text-sm font-medium text-foreground mb-1">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleAccept(action.id)}
                    className="flex-1 h-8 bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8 border-muted-foreground/30"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(action.id)}
                    className="flex-1 h-8 border-destructive/50 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <Card className="p-3 bg-secondary/10 border-secondary/30">
          <p className="text-sm text-foreground">
            Hello! I'm your SIE assistant. I can help you manage your network, prioritize communications, and automate tasks. How can I help you today?
          </p>
        </Card>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            className={`${isRecording ? 'bg-destructive text-destructive-foreground' : ''}`}
            onClick={() => setIsRecording(!isRecording)}
          >
            <Mic className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className={`${isSpeaking ? 'bg-primary text-primary-foreground' : ''}`}
            onClick={() => setIsSpeaking(!isSpeaking)}
          >
            <Volume2 className="w-4 h-4" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && message.trim()) {
                setMessage("");
              }
            }}
          />
          <Button
            size="icon"
            className="bg-primary hover:bg-primary/90"
            disabled={!message.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
      </div>
    </>
  );
};
