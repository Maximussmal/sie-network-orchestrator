import { useState } from "react";
import { Users, TrendingUp, Target, ArrowUpDown, Network, Sparkles, ChevronRight, Search, Handshake, MessageSquare } from "lucide-react";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

interface SuggestedConnection {
  id: string;
  name: string;
  title: string;
  location: string;
  avatar: string;
  relevance: string;
  matchPercentage: number;
  degree: "2nd" | "3rd";
  path: Array<{
    name: string;
    avatar: string;
    relationship: string;
  }>;
}

interface IntroductionRequest {
  id: string;
  requester: {
    name: string;
    avatar: string;
    title: string;
  };
  through: {
    name: string;
    avatar: string;
  };
  request: string;
  relevance: string;
}

interface ConnectionRequest {
  id: string;
  requester: {
    name: string;
    avatar: string;
    title: string;
  };
  context: string;
  targetConnection: string;
  relevanceForTarget: string;
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

const mockSuggestedConnections: SuggestedConnection[] = [
  {
    id: "s1",
    name: "Dr. Anna Weber",
    title: "Director of Sustainability @Siemens Energy",
    location: "Munich, Germany",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    relevance: "Leading sustainable energy initiatives in Germany with focus on industrial applications. Her network overlaps with your energy storage contacts and she's actively seeking partnerships.",
    matchPercentage: 94,
    degree: "2nd",
    path: [
      {
        name: "Stefanie Hauer",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
        relationship: "Former colleague at sustainability conference"
      }
    ]
  },
  {
    id: "s2",
    name: "Marcus Schmidt",
    title: "Venture Partner @Munich Venture Partners",
    location: "Munich, Germany",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop",
    relevance: "Active climate tech investor with portfolio companies in energy storage. Strong synergies with Peter Lange's network and looking to expand in industrial energy sector.",
    matchPercentage: 87,
    degree: "2nd",
    path: [
      {
        name: "Peter Lange",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
        relationship: "Co-investor in energy storage ventures"
      }
    ]
  },
  {
    id: "s3",
    name: "Prof. Lisa Chen",
    title: "Chair of AI & Robotics @TUM",
    location: "Munich, Germany",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop",
    relevance: "Leading autonomous systems research at TUM with applications in laboratory automation. Direct connection to Simon's work and seeking industry partnerships.",
    matchPercentage: 82,
    degree: "3rd",
    path: [
      {
        name: "Simon Tautz",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
        relationship: "Student at TUM"
      },
      {
        name: "Dr. Michael Berg",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
        relationship: "Research collaborator"
      }
    ]
  }
];

const mockIntroductionRequests: IntroductionRequest[] = [
  {
    id: "intro1",
    requester: {
      name: "Thomas Mueller",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop",
      title: "CEO @CleanTech Solutions"
    },
    through: {
      name: "Peter Lange",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
    },
    request: "Introduction to discuss potential partnership on industrial energy storage projects",
    relevance: "Your expertise in sustainable energy infrastructure and network in the sector could provide valuable insights for their expansion strategy"
  },
  {
    id: "intro2",
    requester: {
      name: "Elena Popov",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop",
      title: "Partner @GreenFund Capital"
    },
    through: {
      name: "Stefanie Hauer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
    },
    request: "Seeking advice on sustainability board positions and governance in climate tech",
    relevance: "Your board experience and corporate sustainability background aligns with their focus on responsible climate investments"
  }
];

const mockConnectionRequests: ConnectionRequest[] = [
  {
    id: "conn1",
    requester: {
      name: "Dr. Sarah Williams",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop",
      title: "Research Director @Innovation Labs"
    },
    context: "Met at TUM Innovation Summit 2024, discussed autonomous laboratory systems",
    targetConnection: "Prof. Lisa Chen",
    relevanceForTarget: "Her research on AI-driven lab automation could benefit from collaboration. Dr. Williams is leading a €5M EU-funded project in this space and actively seeking academic partners"
  },
  {
    id: "conn2",
    requester: {
      name: "Martin Schneider",
      avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop",
      title: "VP Strategy @Energy Grid Systems"
    },
    context: "Former colleague at sustainability conference, shared interest in grid-scale storage",
    targetConnection: "Dr. Anna Weber",
    relevanceForTarget: "Direct alignment on industrial energy storage solutions. His company is planning major investments in Germany and seeking technical partnerships with Siemens Energy"
  }
];

export const NetworkInterface = () => {
  const [sortBy, setSortBy] = useState<"mutual" | "trust">("mutual");
  const [filterBy, setFilterBy] = useState<"all" | "1st" | "2nd" | "3rd+">("all");
  const [activeSection, setActiveSection] = useState<"nurture" | "expand" | "signals">("nurture");
  const [selectedPath, setSelectedPath] = useState<SuggestedConnection | null>(null);
  const [showAISearch, setShowAISearch] = useState(false);
  const [showIntroRequests, setShowIntroRequests] = useState(false);
  const [showConnectRequests, setShowConnectRequests] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiChatMessages, setAIChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [showRequestIntro, setShowRequestIntro] = useState(false);
  const [requestIntroTarget, setRequestIntroTarget] = useState<SuggestedConnection | null>(null);
  const [showMeetingOrchestration, setShowMeetingOrchestration] = useState(false);
  const [acceptedRequest, setAcceptedRequest] = useState<IntroductionRequest | null>(null);

  const sortedConnections = [...mockConnections].sort((a, b) => {
    if (sortBy === "mutual") return b.mutualConnections - a.mutualConnections;
    return b.trustScore - a.trustScore;
  });

  const risingCount = mockConnections.filter(c => c.trend === "up").length;
  const avgTrust = Math.round(mockConnections.reduce((acc, c) => acc + c.trustScore, 0) / mockConnections.length);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Section Toggle */}
      <div className="flex gap-2 p-4 border-b bg-card">
        <button
          onClick={() => setActiveSection("nurture")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeSection === "nurture"
              ? "bg-primary text-primary-foreground"
              : "bg-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="w-4 h-4" />
          Contacts
        </button>
        <button
          onClick={() => setActiveSection("expand")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeSection === "expand"
              ? "bg-primary text-primary-foreground"
              : "bg-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Network className="w-4 h-4" />
          Expand
        </button>
        <button
          onClick={() => setActiveSection("signals")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeSection === "signals"
              ? "bg-primary text-primary-foreground"
              : "bg-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Signals
        </button>
      </div>

      {activeSection === "signals" ? (
        <>
          {/* Signals Section */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Signals</h2>
            </div>
          </div>

          {/* Signals List */}
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
            {[
              {
                id: "sig1",
                name: "Peter Lange",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
                action: "Posted about new partnership with energy storage providers",
                platform: "LinkedIn",
                relevance: "This aligns with your interest in industrial energy storage and could be an opportunity to engage",
                time: "2 hours ago"
              },
              {
                id: "sig2",
                name: "Stefanie Hauer",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
                action: "Shared article on corporate sustainability trends",
                platform: "LinkedIn",
                relevance: "As a board member, her insights on sustainability governance are relevant to your advisory work",
                time: "5 hours ago"
              },
              {
                id: "sig3",
                name: "Clemens Feigl",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
                action: "Announced new role as CEO at everwave",
                platform: "LinkedIn",
                relevance: "Leadership transition could open new partnership opportunities in ocean cleanup tech",
                time: "1 day ago"
              },
              {
                id: "sig4",
                name: "Simon Tautz",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
                action: "Commented on AI and autonomous laboratory systems",
                platform: "LinkedIn",
                relevance: "His technical expertise in autonomous labs connects with your innovation network",
                time: "2 days ago"
              }
            ].map((signal) => (
              <Card key={signal.id} className="p-4 rounded-2xl border-0 shadow-sm bg-card">
                <div className="flex gap-3 items-start">
                  <Avatar className="w-12 h-12 flex-shrink-0">
                    <AvatarImage src={signal.avatar} alt={signal.name} />
                    <AvatarFallback className="bg-muted text-foreground text-sm font-semibold">
                      {signal.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0 space-y-2">
                    <p className="font-medium text-sm text-foreground">{signal.name}</p>
                    
                    <div className="space-y-1">
                      <div className="text-xs">
                        <span className="font-medium text-foreground">Action:</span>
                        <span className="text-muted-foreground"> {signal.action}</span>
                      </div>
                      <div className="text-xs">
                        <span className="font-medium text-foreground">Platform:</span>
                        <span className="text-muted-foreground"> {signal.platform}</span>
                      </div>
                      <div className="text-xs">
                        <span className="font-medium text-foreground">Relevance:</span>
                        <span className="text-muted-foreground"> {signal.relevance}</span>
                      </div>
                      <p className="text-xs text-muted-foreground pt-1">{signal.time}</p>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        setShowAIChat(true);
                        setAIChatMessages([
                          { 
                            role: 'assistant', 
                            content: `I noticed ${signal.name}'s recent activity. Here are some suggestions:\n\n• Send a congratulatory message\n• Share a relevant resource\n• Propose a follow-up conversation\n\nWhat would you like to do?` 
                          }
                        ]);
                      }}
                    >
                      Act
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

        </>
      ) : activeSection === "nurture" ? (
        <>
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
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Nurture
        </Button>
        
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
      </>
    ) : (
      <>
        {/* Expand Network Section */}
        <div className="p-4 space-y-4">
          {/* AI Search Bar */}
          <div className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Find your people"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowAIChat(true)}
                className="w-full pl-10 pr-12 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="absolute right-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10">
                <Sparkles className="w-3 h-3 text-primary" />
                <span className="text-xs font-medium text-primary">AI</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowIntroRequests(true)}
              className="flex-1 relative"
            >
              <Users className="w-4 h-4 mr-2" />
              Introduction
              {mockIntroductionRequests.length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground border-0 h-5 min-w-5 px-1.5">
                  {mockIntroductionRequests.length}
                </Badge>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConnectRequests(true)}
              className="flex-1 relative"
            >
              <Handshake className="w-4 h-4 mr-2" />
              Connect
              {mockConnectionRequests.length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground border-0 h-5 min-w-5 px-1.5">
                  {mockConnectionRequests.length}
                </Badge>
              )}
            </Button>
          </div>

          {/* SIE Suggestions Header */}
          <div className="flex items-center gap-2 pt-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Suggestions für SIE</span>
          </div>
        </div>

        {/* Suggested Connections List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
          {mockSuggestedConnections.map((suggestion) => (
            <Card key={suggestion.id} className="p-4 rounded-2xl border-0 shadow-sm bg-card">
              <div className="flex gap-3 items-start">
                <Avatar className="w-14 h-14 flex-shrink-0">
                  <AvatarImage src={suggestion.avatar} alt={suggestion.name} />
                  <AvatarFallback className="bg-muted text-foreground text-lg font-semibold">
                    {suggestion.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-base text-foreground">
                      {suggestion.name}
                    </h3>
                    <Badge className="bg-accent/10 text-accent border-0 px-3 py-1 text-sm font-semibold">
                      {suggestion.degree}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                    {suggestion.title}
                  </p>

                  {/* Relevance with Match Score */}
                  <div className="bg-primary/5 rounded-lg p-3 mb-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-xs font-semibold text-primary">Match Score</span>
                      </div>
                      <Badge className="bg-primary text-primary-foreground border-0 text-xs px-2">
                        {suggestion.matchPercentage}%
                      </Badge>
                    </div>
                    <p className="text-xs text-foreground">
                      {suggestion.relevance}
                    </p>
                  </div>

                  {/* Path Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPath(suggestion)}
                    className="w-full"
                  >
                    <Network className="w-4 h-4 mr-2" />
                    Path Finder
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </>
    )}

      {/* Path Dialog */}
      <Dialog open={!!selectedPath} onOpenChange={() => setSelectedPath(null)}>
        <DialogContent className="sm:max-w-md bg-card rounded-2xl">
          <DialogHeader>
            <DialogTitle>Connection Path to {selectedPath?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-4">
            {/* You */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-lg font-semibold text-primary">You</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Starting point</p>
            </div>

            {/* Connecting Line */}
            <div className="flex justify-center">
              <div className="w-0.5 h-12 bg-primary/30"></div>
            </div>

            {/* Path connections */}
            {selectedPath?.path.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <Avatar className="w-16 h-16 ring-2 ring-primary/20">
                  <AvatarImage src={step.avatar} alt={step.name} />
                  <AvatarFallback>
                    {step.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <p className="font-medium text-foreground text-sm mt-1">{step.name}</p>
                <p className="text-xs text-muted-foreground">{step.relationship}</p>
                
                {/* Line to next person */}
                <div className="w-0.5 h-12 bg-primary/30 mt-2"></div>
              </div>
            ))}

            {/* Target */}
            <div className="flex flex-col items-center">
              <Avatar className="w-16 h-16 ring-2 ring-accent/40">
                <AvatarImage src={selectedPath?.avatar} alt={selectedPath?.name} />
                <AvatarFallback>
                  {selectedPath?.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <p className="font-medium text-foreground text-sm mt-1">{selectedPath?.name}</p>
              <p className="text-xs text-muted-foreground">{selectedPath?.title}</p>
            </div>

            {/* Request Introduction Button */}
            <div className="pt-4">
              <Button 
                className="w-full" 
                onClick={() => {
                  setRequestIntroTarget(selectedPath);
                  setShowRequestIntro(true);
                  setSelectedPath(null);
                }}
              >
                Request Introduction
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Chat Interface for Search */}
      <Dialog open={showAIChat} onOpenChange={setShowAIChat}>
        <DialogContent className="sm:max-w-2xl bg-card max-h-[80vh] flex flex-col rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Find Your People with SIE
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {aiChatMessages.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  I'll help you find the right connections. Tell me:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>What kind of person are you looking for?</li>
                  <li>What industry or expertise?</li>
                  <li>Any specific location or context?</li>
                  <li>Connect this to any active missions?</li>
                </ul>
              </div>
            ) : (
              aiChatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-xl p-3 ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-foreground'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="pt-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your search criteria..."
                className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    setAIChatMessages([...aiChatMessages, { role: 'user', content: e.currentTarget.value }]);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <Button>Send</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Introduction Requests Dialog */}
      <Dialog open={showIntroRequests} onOpenChange={setShowIntroRequests}>
        <DialogContent className="sm:max-w-2xl bg-card max-h-[80vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>Introduction Requests</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              People who want to be introduced to you
            </p>
            
            {mockIntroductionRequests.map((request) => (
              <Card key={request.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12 flex-shrink-0">
                      <AvatarImage src={request.requester.avatar} alt={request.requester.name} />
                      <AvatarFallback>
                        {request.requester.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-foreground">{request.requester.name}</h3>
                      <p className="text-xs text-muted-foreground">{request.requester.title}</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                    <div>
                      <p className="text-xs font-medium text-foreground mb-1">Through:</p>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={request.through.avatar} alt={request.through.name} />
                          <AvatarFallback className="text-xs">
                            {request.through.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{request.through.name}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-foreground mb-1">Request:</p>
                      <p className="text-xs text-muted-foreground">{request.request}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-foreground mb-1">Why this is relevant:</p>
                      <p className="text-xs text-muted-foreground">{request.relevance}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => {
                        setAcceptedRequest(request);
                        setShowMeetingOrchestration(true);
                        setShowIntroRequests(false);
                      }}
                    >
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">Decline</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Connection Requests Dialog */}
      <Dialog open={showConnectRequests} onOpenChange={setShowConnectRequests}>
        <DialogContent className="sm:max-w-2xl bg-card max-h-[80vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>Connection Requests</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              People requesting introductions through you
            </p>
            
            {mockConnectionRequests.map((request) => (
              <Card key={request.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12 flex-shrink-0">
                      <AvatarImage src={request.requester.avatar} alt={request.requester.name} />
                      <AvatarFallback>
                        {request.requester.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-foreground">{request.requester.name}</h3>
                      <p className="text-xs text-muted-foreground">{request.requester.title}</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                    <div>
                      <p className="text-xs font-medium text-foreground mb-1">Context:</p>
                      <p className="text-xs text-muted-foreground">{request.context}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-foreground mb-1">Wants to connect with:</p>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {request.targetConnection.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-xs text-foreground font-medium">{request.targetConnection}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-foreground mb-1">Relevance for {request.targetConnection}:</p>
                      <p className="text-xs text-muted-foreground">{request.relevanceForTarget}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">Decline</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Request Introduction Dialog */}
      <Dialog open={showRequestIntro} onOpenChange={setShowRequestIntro}>
        <DialogContent className="sm:max-w-2xl bg-card rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Request Introduction to {requestIntroTarget?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-primary/5 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Why this could be relevant to you:</p>
                <p className="text-sm text-muted-foreground">{requestIntroTarget?.relevance}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">What could be relevant to {requestIntroTarget?.name}:</p>
                <p className="text-sm text-muted-foreground">
                  Your expertise in sustainable technology and strong network in the energy sector. 
                  Potential collaboration opportunities on industrial energy projects.
                </p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Why do you want to be connected?
              </label>
              <textarea
                className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px]"
                placeholder="Share your reason for connecting..."
              />
            </div>
            
            <div className="flex gap-2">
              <Button className="flex-1">Send Request</Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowRequestIntro(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Meeting Orchestration Dialog */}
      <Dialog open={showMeetingOrchestration} onOpenChange={setShowMeetingOrchestration}>
        <DialogContent className="sm:max-w-3xl bg-card rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Meeting Orchestration
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* AI Message */}
            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium mb-2">SIE is orchestrating your meeting</p>
                <p className="text-sm text-muted-foreground">
                  I've coordinated calendars and prepared an agenda for your introduction with {acceptedRequest?.requester.name}.
                </p>
              </div>
            </div>

            {/* Proposed Times with Visual Calendar */}
            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <h4 className="text-sm font-semibold">Proposed Meeting Times:</h4>
                
                {/* Visual Calendar for Tuesday - Best Choice */}
                <div className="p-3 bg-background rounded-lg border-2 border-primary">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-sm">Tuesday, Oct 24</div>
                    <Badge variant="outline" className="text-xs bg-primary text-primary-foreground">Best Choice</Badge>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="p-2 bg-muted/50 rounded flex justify-between">
                      <span className="text-muted-foreground">1:00 PM - Team Sync</span>
                      <span className="text-muted-foreground">Before</span>
                    </div>
                    <div className="p-2 bg-primary/10 rounded flex justify-between font-medium border-l-2 border-primary">
                      <span>2:00 PM - Introduction Call</span>
                      <span>30 min</span>
                    </div>
                    <div className="p-2 bg-muted/50 rounded flex justify-between">
                      <span className="text-muted-foreground">3:00 PM - Free</span>
                      <span className="text-muted-foreground">After</span>
                    </div>
                  </div>
                </div>

                {/* Alternative Times */}
                <div className="space-y-2">
                  <div className="p-2 bg-background rounded border text-sm">
                    Wednesday, Oct 25 at 10:00 AM (30 min)
                  </div>
                  <div className="p-2 bg-background rounded border text-sm">
                    Thursday, Oct 26 at 3:00 PM (30 min)
                  </div>
                </div>
              </div>
            </div>

            {/* Draft Agenda */}
            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-2">Draft Agenda:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Introductions and backgrounds (5 min)</li>
                  <li>• Discussion on {acceptedRequest?.request.toLowerCase()} (15 min)</li>
                  <li>• Next steps and follow-up (10 min)</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Confirm & Send Invitation
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => {
                  setShowMeetingOrchestration(false);
                  setShowAIChat(true);
                  setAIChatMessages([
                    { role: 'assistant', content: 'I\'ve prepared the meeting details. What would you like to adjust?' }
                  ]);
                }}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Edit Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
