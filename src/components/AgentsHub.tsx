import { Calendar, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";

export const AgentsHub = () => {
  return (
    <div className="h-full overflow-y-auto p-4 bg-[hsl(var(--sie-near-white))]">
      {/* KPI Dashboard */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="p-4 bg-card border-border">
          <div className="text-2xl font-bold text-foreground">12</div>
          <div className="text-xs text-muted-foreground">Active Agents</div>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="text-2xl font-bold text-[hsl(var(--sie-green))]">47</div>
          <div className="text-xs text-muted-foreground">Tasks Completed</div>
        </Card>
      </div>

      {/* Agents Section */}
      <div className="space-y-4">
        {/* Scheduling Agent */}
        <Card className="p-5 bg-card border-border hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--sie-teal))] to-[hsl(var(--sie-yellow))] flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6 text-[hsl(var(--sie-near-white))]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Scheduling Agent</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Automatically book meetings with people in your network based on priorities and availability
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-1 rounded-full bg-[hsl(var(--sie-green))]/20 text-[hsl(var(--sie-green))]">
                  Active
                </span>
                <span>• 8 meetings scheduled this week</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Insight Agent */}
        <Card className="p-5 bg-card border-border hover:shadow-lg transition-shadow">
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
