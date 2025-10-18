import { useState } from "react";
import { Calendar, Lightbulb, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AgentInterface } from "./AgentInterface";

export const AgentsHub = () => {
  const [activeAgent, setActiveAgent] = useState<"scheduling" | "insight" | null>(null);

  if (activeAgent) {
    return <AgentInterface agentType={activeAgent} onClose={() => setActiveAgent(null)} />;
  }
  return (
    <div className="h-full overflow-y-auto p-4 bg-[hsl(var(--sie-near-white))]">
      {/* Create Agent Button */}
      <div className="flex justify-center mb-6">
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Agent
        </Button>
      </div>

      {/* Agents Section */}
      <div className="space-y-4">
        {/* Scheduling Agent - Enhanced with Voice */}
        <Card 
          className="p-5 bg-card border-border hover:shadow-lg transition-shadow cursor-pointer border-2 border-blue-200"
          onClick={() => setActiveAgent("scheduling")}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--sie-teal))] to-[hsl(var(--sie-yellow))] flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6 text-[hsl(var(--sie-near-white))]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">Scheduling Agent</h3>
                <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                  VOICE ENABLED
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Voice-powered meeting scheduler with CRM integration. Process voice input, extract meeting details, and automatically schedule meetings.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-1 rounded-full bg-[hsl(var(--sie-green))]/20 text-[hsl(var(--sie-green))]">
                  Active
                </span>
                <span>• 8 meetings scheduled • Voice processing • CRM integration</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Insight Agent */}
        <Card 
          className="p-5 bg-card border-border hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setActiveAgent("insight")}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--sie-yellow))] to-[hsl(var(--sie-green))] flex items-center justify-center shrink-0">
              <Lightbulb className="w-6 h-6 text-[hsl(var(--sie-near-white))]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Insight Agent</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Capture and organize knowledge and insights from conversations and interactions
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-1 rounded-full bg-[hsl(var(--sie-green))]/20 text-[hsl(var(--sie-green))]">
                  Active
                </span>
                <span>• 23 insights captured this week</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
