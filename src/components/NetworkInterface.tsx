import { useState } from "react";
import { Users, TrendingUp, Target, ArrowUpDown } from "lucide-react";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Connection {
  id: string;
  name: string;
  title: string;
  location: string;
  mutualConnections: number;
  followers: string;
  trustScore: number;
  trend: "up" | "down";
  trendValue: number;
  avatar: string;
  networks: ("linkedin" | "company" | "school")[];
}

const mockConnections: Connection[] = [
  {
    id: "1",
    name: "Peter Lange",
    title: "WHU | Building Europe's largest Industrial Energy Storage Network",
    location: "Berlin",
    mutualConnections: 16,
    followers: "6K",
    trustScore: 94,
    trend: "up",
    trendValue: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    networks: ["linkedin", "school"],
  },
  {
    id: "2",
    name: "Clemens Feigl",
    title: "CEO @everwave - become part of the wave!",
    location: "Bavaria, Germany",
    mutualConnections: 31,
    followers: "6K",
    trustScore: 88,
    trend: "up",
    trendValue: 3,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    networks: ["linkedin", "company"],
  },
  {
    id: "3",
    name: "Simon Tautz",
    title: "CS @ TUM | Building Autonomous Labs @ProviGen.AI",
    location: "Munich",
    mutualConnections: 9,
    followers: "2K",
    trustScore: 76,
    trend: "down",
    trendValue: 2,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    networks: ["linkedin", "school"],
  },
  {
    id: "4",
    name: "Stefanie Hauer",
    title: "Corporate Sustainability Leader, Member of the Board",
    location: "Germany",
    mutualConnections: 70,
    followers: "15K",
    trustScore: 96,
    trend: "up",
    trendValue: 8,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    networks: ["linkedin", "company", "school"],
  },
];

export const NetworkInterface = () => {
  const [sortBy, setSortBy] = useState<"mutual" | "trust">("mutual");
  const [filterBy, setFilterBy] = useState<"all" | "1st" | "2nd" | "3rd+">("all");

  const sortedConnections = [...mockConnections].sort((a, b) => {
    if (sortBy === "mutual") return b.mutualConnections - a.mutualConnections;
    return b.trustScore - a.trustScore;
  });

  const risingCount = mockConnections.filter(c => c.trend === "up").length;
  const avgTrust = Math.round(mockConnections.reduce((acc, c) => acc + c.trustScore, 0) / mockConnections.length);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* KPI Dashboard */}
      <div className="grid grid-cols-3 gap-3 p-4 bg-background">
        <Card className="p-3 rounded-xl border-0 bg-card shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Total</span>
          </div>
          <div className="text-xl font-semibold text-foreground">{mockConnections.length}</div>
        </Card>
        <Card className="p-3 rounded-xl border-0 bg-card shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Trust</span>
          </div>
          <div className="text-xl font-semibold text-foreground">{avgTrust}%</div>
        </Card>
        <Card className="p-3 rounded-xl border-0 bg-card shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-xs text-muted-foreground">Rising</span>
          </div>
          <div className="text-xl font-semibold text-accent">{risingCount}</div>
        </Card>
      </div>

      {/* Filter and Sort Controls */}
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex gap-2">
          {(["all", "1st", "2nd", "3rd+"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterBy(filter)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filterBy === filter
                  ? "bg-card text-foreground shadow-sm"
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {filter === "all" ? "All" : filter}
            </button>
          ))}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-card text-foreground shadow-sm hover:bg-card/80 transition-colors">
              <ArrowUpDown className="w-3 h-3" />
              <span>Mutual Connections</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-popover">
            <DropdownMenuItem onClick={() => setSortBy("mutual")}>
              Mutual Connections
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("trust")}>
              Trust Score
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Connections Count */}
      <div className="px-4 pb-2">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{sortedConnections.length}</span> connections
        </p>
      </div>

      {/* Connections List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {sortedConnections.map((connection) => (
          <Card key={connection.id} className="p-4 rounded-2xl border-0 shadow-sm bg-card">
            <div className="flex gap-3 items-start">
              <Avatar className="w-14 h-14 flex-shrink-0">
                <AvatarImage src={connection.avatar} alt={connection.name} />
                <AvatarFallback className="bg-muted text-foreground text-lg font-semibold">
                  {connection.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-base text-foreground">
                    {connection.name}
                  </h3>
                  <Badge className="bg-primary/10 text-primary border-0 px-3 py-1 text-sm font-semibold">
                    1st
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
                  {connection.title}
                </p>

                {/* Stats Row */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-foreground">{connection.mutualConnections}</span>
                    <span className="text-muted-foreground">mutual</span>
                    <span className="text-accent">(0%)</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Trust:</span>
                    <span className="font-semibold text-primary">{connection.trustScore}%</span>
                    <span className="flex items-center gap-0.5 text-accent">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {connection.trendValue}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
