import { useState } from "react";
import { Users, TrendingUp, TrendingDown, Network, Briefcase, GraduationCap } from "lucide-react";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

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
    avatar: "PL",
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
    avatar: "CF",
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
    avatar: "ST",
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
    avatar: "SH",
    networks: ["linkedin", "company", "school"],
  },
];

export const NetworkInterface = () => {
  const [expandedNetworks, setExpandedNetworks] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"mutual" | "trust">("mutual");

  const sortedConnections = [...mockConnections].sort((a, b) => {
    if (sortBy === "mutual") return b.mutualConnections - a.mutualConnections;
    return b.trustScore - a.trustScore;
  });

  const toggleNetwork = (id: string) => {
    setExpandedNetworks((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const getNetworkIcon = (network: string) => {
    switch (network) {
      case "linkedin":
        return <Network className="w-4 h-4" />;
      case "company":
        return <Briefcase className="w-4 h-4" />;
      case "school":
        return <GraduationCap className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* KPI Dashboard */}
      <div className="grid grid-cols-3 gap-2 p-4 bg-card border-b">
        <Card className="p-3 text-center">
          <div className="text-2xl font-bold text-foreground">247</div>
          <div className="text-xs text-muted-foreground">Total</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-2xl font-bold text-accent">94%</div>
          <div className="text-xs text-muted-foreground">Avg Trust</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-2xl font-bold text-primary">+12</div>
          <div className="text-xs text-muted-foreground">This Week</div>
        </Card>
      </div>

      {/* Sort Controls */}
      <div className="flex gap-2 p-4 border-b">
        <button
          onClick={() => setSortBy("mutual")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            sortBy === "mutual"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          Mutual First
        </button>
        <button
          onClick={() => setSortBy("trust")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            sortBy === "trust"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          Trust Score
        </button>
      </div>

      {/* Connections List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sortedConnections.map((connection) => (
          <Card key={connection.id} className="p-3">
            <div className="flex gap-3">
              <Avatar className="w-12 h-12 flex-shrink-0">
                <AvatarImage src="" />
                <AvatarFallback className="bg-secondary/20 text-secondary-foreground">
                  {connection.avatar}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-foreground truncate">
                      {connection.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {connection.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{connection.location}</p>
                  </div>

                  {/* Network Icons */}
                  <div className="flex gap-1 flex-shrink-0">
                    {connection.networks.map((network) => (
                      <button
                        key={network}
                        onClick={() => toggleNetwork(`${connection.id}-${network}`)}
                        className="w-6 h-6 rounded-full bg-muted hover:bg-primary/20 flex items-center justify-center transition-all"
                      >
                        {getNetworkIcon(network)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-muted-foreground" />
                    <span className="font-medium">{connection.mutualConnections}</span>
                    <span className="text-muted-foreground">mutual</span>
                  </div>
                  <div className="text-muted-foreground">
                    {connection.followers} followers
                  </div>
                </div>

                {/* Trust Score */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        connection.trustScore >= 90
                          ? "bg-accent"
                          : connection.trustScore >= 70
                          ? "bg-secondary"
                          : "bg-destructive"
                      }`}
                      style={{ width: `${connection.trustScore}%` }}
                    />
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs px-1.5 py-0 h-5 ${
                      connection.trend === "up"
                        ? "text-accent border-accent"
                        : "text-secondary border-secondary"
                    }`}
                  >
                    {connection.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 mr-0.5" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-0.5" />
                    )}
                    {connection.trendValue}%
                  </Badge>
                  <span className="text-xs font-semibold min-w-[3ch] text-right">
                    {connection.trustScore}%
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
