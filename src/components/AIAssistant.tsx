import { useState } from "react";
import { X, Send, Check, Edit, Trash2, Sparkles } from "lucide-react";
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

  const handleAccept = (id: string) => {
    setActions(actions.filter((a) => a.id !== id));
  };

  const handleDelete = (id: string) => {
    setActions(actions.filter((a) => a.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-[85vw] bg-card/95 backdrop-blur-md border-l border-border shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(var(--ai-blue)/0.6)] to-[hsl(var(--ai-purple)/0.4)] ai-glow flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h2 className="font-semibold text-foreground">SIE Assistant</h2>
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
                    className="flex-1 h-8 bg-[hsl(var(--trust-green))] hover:bg-[hsl(var(--trust-green)/0.9)] text-white"
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
                    className="flex-1 h-8 border-[hsl(var(--trust-red)/0.5)] text-[hsl(var(--trust-red))] hover:bg-[hsl(var(--trust-red)/0.1)]"
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
        <Card className="p-3 bg-[hsl(var(--ai-purple)/0.1)] border-[hsl(var(--ai-purple)/0.3)]">
          <p className="text-sm text-foreground">
            Hello! I'm your SIE assistant. I can help you manage your network, prioritize communications, and automate tasks. How can I help you today?
          </p>
        </Card>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
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
            className="bg-gradient-to-br from-[hsl(var(--ai-blue))] to-[hsl(var(--ai-purple))] hover:opacity-90"
            disabled={!message.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
