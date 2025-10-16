import { useState } from "react";
import { X, Send, Mic, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AgentInterfaceProps {
  agentType: "scheduling" | "insight";
  onClose: () => void;
}

const agentConfig = {
  scheduling: {
    name: "Scheduling Agent",
    icon: "📅",
    suggestions: [
      "Schedule a coffee meeting with Peter next week",
      "Find time for a 30-min call with the marketing team",
      "Block 2 hours for deep work tomorrow morning",
      "Set up weekly sync with stakeholders"
    ],
    placeholder: "e.g., 'Schedule a meeting with Sarah for next Tuesday at 2pm'"
  },
  insight: {
    name: "Insight Agent",
    icon: "💡",
    suggestions: [
      "Summarize key takeaways from today's meetings",
      "What patterns do you see in my recent conversations?",
      "Create an action plan from this week's discussions",
      "Extract important decisions from recent emails"
    ],
    placeholder: "e.g., 'What are the main themes from this week's conversations?'"
  }
};

export const AgentInterface = ({ agentType, onClose }: AgentInterfaceProps) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const config = agentConfig[agentType];

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  const handleSend = () => {
    if (!message.trim()) return;
    // TODO: Implement AI integration
    console.log("Sending message:", message);
    setMessage("");
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording
  };

  const toggleCall = () => {
    setIsInCall(!isInCall);
    // TODO: Implement voice call
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 animate-fade-in">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{config.icon}</div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{config.name}</h2>
              <p className="text-xs text-muted-foreground">AI-powered assistant</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Smart Suggestions */}
        <div className="p-4 border-b bg-card/50">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Smart Suggestions</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {config.suggestions.map((suggestion, index) => (
              <Card
                key={index}
                className="p-3 cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <p className="text-sm text-foreground">{suggestion}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto">
            {/* Messages will appear here */}
            <div className="text-center text-muted-foreground text-sm py-8">
              Click a suggestion or type your message to start
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t bg-card">
          <div className="max-w-3xl mx-auto p-4">
            <div className="flex items-end gap-2">
              {/* Voice Call Button */}
              <Button
                variant={isInCall ? "default" : "outline"}
                size="icon"
                onClick={toggleCall}
                className="flex-shrink-0"
              >
                <Phone className={`w-4 h-4 ${isInCall ? "animate-pulse" : ""}`} />
              </Button>

              {/* Voice Recording Button */}
              <Button
                variant={isRecording ? "default" : "outline"}
                size="icon"
                onClick={toggleRecording}
                className="flex-shrink-0"
              >
                <Mic className={`w-4 h-4 ${isRecording ? "animate-pulse" : ""}`} />
              </Button>

              {/* Text Input */}
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={config.placeholder}
                className="min-h-[44px] max-h-32 resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />

              {/* Send Button */}
              <Button
                onClick={handleSend}
                disabled={!message.trim()}
                className="flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {isRecording && (
              <div className="mt-2 flex items-center justify-center gap-2 text-sm text-primary">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Recording...
              </div>
            )}

            {isInCall && (
              <div className="mt-2 flex items-center justify-center gap-2 text-sm text-primary">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Connected - Speak now
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
