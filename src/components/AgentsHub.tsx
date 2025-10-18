import { useState } from "react";
import { Calendar, Lightbulb, Plus, TrendingUp, Users, Network, Target, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AgentInterface } from "./AgentInterface";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

// Mock data for charts
const networkGrowthData = [
  { month: "Jan", connections: 45, engaged: 32 },
  { month: "Feb", connections: 52, engaged: 38 },
  { month: "Mar", connections: 68, engaged: 51 },
  { month: "Apr", connections: 78, engaged: 62 },
  { month: "May", connections: 95, engaged: 78 },
  { month: "Jun", connections: 112, engaged: 94 },
];

const networkHealthData = [
  { category: "Trust", value: 92 },
  { category: "Engagement", value: 85 },
  { category: "Growth", value: 78 },
  { category: "Diversity", value: 88 },
  { category: "Reciprocity", value: 81 },
];

const interactionData = [
  { type: "Meetings", count: 24 },
  { type: "Messages", count: 156 },
  { type: "Intros", count: 8 },
  { type: "Calls", count: 32 },
];

export const AgentsHub = ({ activeTab, onTabChange }: { activeTab: "scheduling" | "insight"; onTabChange: (tab: "scheduling" | "insight") => void }) => {
  const [activeAgent, setActiveAgent] = useState<"scheduling" | "insight" | null>(null);

  if (activeAgent) {
    return <AgentInterface agentType={activeAgent} onClose={() => setActiveAgent(null)} />;
  }
  
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700/50 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Lightbulb className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <span className="text-lg font-semibold text-slate-100">AI Orchestration</span>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-700/70 transition-all px-4 py-2"
            >
              Feedback
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-700/70 transition-all px-4 py-2"
            >
              Contact
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-700/70 transition-all px-4 py-2"
            >
              Collaborate
            </Button>
          </div>
        </div>
      </div>
      
      {activeTab === "scheduling" ? (
        <div className="p-6 space-y-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-100 mb-2">Orchestrate</h1>
              <p className="text-slate-400">Manage your AI agents</p>
            </div>
            <Button className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-100">
              <Plus className="w-4 h-4" />
              Create Agent
            </Button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <Users className="w-8 h-8 text-slate-300" />
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <div className="text-3xl font-bold text-slate-100 mb-1">2</div>
              <div className="text-sm text-slate-400">Active Agents</div>
              <div className="text-xs text-accent mt-2">Running smoothly</div>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <Activity className="w-8 h-8 text-accent" />
                <TrendingUp className="w-5 h-5 text-slate-300" />
              </div>
              <div className="text-3xl font-bold text-slate-100 mb-1">31</div>
              <div className="text-sm text-slate-400">Tasks Completed</div>
              <div className="text-xs text-slate-300 mt-2">This week</div>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <Network className="w-8 h-8 text-slate-300" />
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <div className="text-3xl font-bold text-slate-100 mb-1">8</div>
              <div className="text-sm text-slate-400">Meetings Scheduled</div>
              <div className="text-xs text-accent mt-2">This month</div>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <Target className="w-8 h-8 text-accent" />
                <TrendingUp className="w-5 h-5 text-slate-300" />
              </div>
              <div className="text-3xl font-bold text-slate-100 mb-1">23</div>
              <div className="text-sm text-slate-400">Insights Captured</div>
              <div className="text-xs text-slate-300 mt-2">This week</div>
            </Card>
          </div>

          {/* Agents Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-100">Your Agents</h2>
            
            <div 
              className="p-4 rounded-xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveAgent("scheduling")}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-slate-100">Scheduling Agent</div>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium">
                      VOICE
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">Voice-powered scheduling</div>
                </div>
              </div>
              <div className="text-xs text-accent">8 meetings scheduled</div>
            </div>

            <div 
              className="p-4 rounded-xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveAgent("insight")}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-100">Insight Agent</div>
                  <div className="text-xs text-slate-400">Knowledge capture</div>
                </div>
              </div>
              <div className="text-xs text-slate-300">23 insights captured</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 space-y-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-slate-100 mb-2">Network Analytics</h1>
            <p className="text-slate-400">Your network intelligence overview</p>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Network Growth Chart */}
            <Card className="p-6 bg-slate-800/50 border-slate-700 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Network Growth</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={networkGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="connections" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="engaged" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--accent))", r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Network Health Radar */}
            <Card className="p-6 bg-slate-800/50 border-slate-700 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Network Health</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={networkHealthData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis 
                    dataKey="category" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Radar 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))" 
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            {/* Interaction Types */}
            <Card className="p-6 bg-slate-800/50 border-slate-700 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Interactions by Type</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={interactionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="type" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Bar 
                    dataKey="count" 
                    fill="hsl(var(--accent))" 
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Agents Overview */}
            <Card className="p-6 bg-slate-800/50 border-slate-700 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Active Agents</h3>
              <div className="space-y-3">
                <div 
                  className="p-4 rounded-xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setActiveAgent("scheduling")}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-100">Scheduling Agent</div>
                      <div className="text-xs text-slate-400">Voice-powered scheduling</div>
                    </div>
                  </div>
                  <div className="text-xs text-accent">8 meetings scheduled</div>
                </div>

                <div 
                  className="p-4 rounded-xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setActiveAgent("insight")}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-100">Insight Agent</div>
                      <div className="text-xs text-slate-400">Knowledge capture</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-300">23 insights captured</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
