import { useState } from "react";
import { Mail, MailOpen, Clock, CheckCheck, Sparkles, MessageCircle, Calendar as CalendarIcon, Video, MapPin, Mic } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ConversationThread } from "./ConversationThread";
import { useMeetingStore } from "@/services/meetingStore";

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  time: string;
  isNew: boolean;
}

interface Message {
  id: string;
  from: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  platform: "linkedin" | "whatsapp" | "sumbios";
}

const mockEmails: Email[] = [
  {
    id: "1",
    from: "Sarah Mitchell",
    subject: "Q4 Strategy Meeting Follow-up",
    preview: "Thanks for the productive discussion. Here are the action items we agreed on...",
    time: "2h ago",
    isNew: true,
  },
  {
    id: "2",
    from: "Marcus Chen",
    subject: "Partnership Proposal - Review Needed",
    preview: "I've attached the updated proposal document. Please review sections 3 and 4...",
    time: "4h ago",
    isNew: true,
  },
  {
    id: "3",
    from: "Emma Rodriguez",
    subject: "RE: Budget Allocation Request",
    preview: "The finance team has approved the additional resources for...",
    time: "Yesterday",
    isNew: false,
  },
  {
    id: "4",
    from: "David Thompson",
    subject: "Project Timeline Update",
    preview: "We're on track for the Q1 deadline. The development team has completed...",
    time: "2 days ago",
    isNew: false,
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    from: "Peter Lange",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    lastMessage: "Let's schedule that call for next week",
    time: "5m ago",
    unread: 2,
    online: true,
    platform: "linkedin",
  },
  {
    id: "2",
    from: "Clemens Feigl",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    lastMessage: "Thanks for the intro! Really excited about this",
    time: "1h ago",
    unread: 1,
    online: true,
    platform: "whatsapp",
  },
  {
    id: "3",
    from: "Stefanie Hauer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    lastMessage: "The board meeting went great, I'll send you the notes",
    time: "3h ago",
    unread: 0,
    online: false,
    platform: "sumbios",
  },
  {
    id: "4",
    from: "Simon Tautz",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    lastMessage: "Can you review the latest prototype?",
    time: "Yesterday",
    unread: 0,
    online: false,
    platform: "linkedin",
  },
];

const getPlatformBadge = (platform: "linkedin" | "whatsapp" | "sumbios") => {
  switch (platform) {
    case "linkedin":
      return { label: "LI", color: "bg-blue-600 text-white" };
    case "whatsapp":
      return { label: "WA", color: "bg-green-600 text-white" };
    case "sumbios":
      return { label: "SIE", color: "bg-yellow-600 text-white" };
  }
};

interface CommunicationHubProps {
  activeSection: "email" | "messages" | "calendar";
  onSectionChange: (section: "email" | "messages" | "calendar") => void;
}

export const CommunicationHub = ({ activeSection, onSectionChange }: CommunicationHubProps) => {
  const [selectedContact, setSelectedContact] = useState<{
    name: string;
    avatar: string;
    title?: string;
    platform?: "linkedin" | "whatsapp" | "sumbios" | "email";
  } | null>(null);
  
  const { meetings, contacts, getUpcomingMeetings } = useMeetingStore();
  const upcomingMeetings = getUpcomingMeetings();
  const voiceAgentMeetings = meetings.filter(m => m.source === 'voice-agent');
  
  const newEmails = mockEmails.filter((e) => e.isNew);
  const existingEmails = mockEmails.filter((e) => !e.isNew);
  const outstandingReplies = 7;
  const unreadMessages = mockMessages.reduce((acc, msg) => acc + msg.unread, 0);

  if (selectedContact) {
    return (
      <ConversationThread
        contact={selectedContact}
        platform={selectedContact.platform}
        onClose={() => setSelectedContact(null)}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-blue-950 dark:via-cyan-950 dark:to-blue-900">
      {/* Content based on active section */}

      {activeSection === "calendar" ? (
        <>
          {/* Calendar Header with Mini Calendar */}
          <div className="p-4 border-b border-blue-200/50 dark:border-blue-800/50 bg-white/50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-100">
                  {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' })}
                </p>
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <CalendarIcon className="w-4 h-4 mr-2" />
                New Event
              </Button>
            </div>

            {/* Mini 2-Week Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={i} className="text-xs font-semibold text-blue-700 dark:text-blue-300 py-1">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 14 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                const isToday = i === 0;
                const hasEvent = [5, 8, 12].includes(i);
                return (
                  <button
                    key={i}
                    className={`
                      aspect-square rounded-lg text-xs font-medium transition-all
                      ${isToday ? 'bg-blue-600 text-white' : hasEvent ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100' : 'text-blue-900 dark:text-blue-100 hover:bg-blue-50 dark:hover:bg-blue-900/20'}
                    `}
                  >
                    {date.getDate()}
                    {hasEvent && (
                      <div className="w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400 mx-auto mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Voice Agent Meetings Section */}
          {voiceAgentMeetings.length > 0 && (
            <div className="px-4 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center">
                  <Mic className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">Voice Scheduled</h3>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs">{voiceAgentMeetings.length}</Badge>
              </div>
              <div className="space-y-2">
                {voiceAgentMeetings.slice(0, 3).map((meeting) => {
                  const contact = contacts.find(c => c.id === meeting.contactId);
                  return (
                    <Card key={meeting.id} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="w-1 h-full bg-blue-500 rounded-full" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100">{meeting.title}</h4>
                            <span className="text-xs text-blue-700 dark:text-blue-300 font-medium flex-shrink-0">
                              {new Date(meeting.scheduledTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-blue-700/70 dark:text-blue-300/70 mb-1">
                            {contact?.name} • {contact?.email}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-0 text-xs px-2 py-0">
                              <Mic className="w-3 h-3 mr-1" />
                              Voice
                            </Badge>
                            <span className="text-xs text-blue-600/60 dark:text-blue-400/60">{meeting.duration} min</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Calendar Events List - Google Style */}
          <div className="flex-1 overflow-y-auto px-4 pt-6 pb-4 space-y-6">
            {/* Today */}
            <div>
              <h3 className="text-xs font-bold text-blue-900 dark:text-blue-100 uppercase tracking-wide mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                Today
              </h3>
              <div className="space-y-2">
                <Card className="p-4 rounded-xl bg-white dark:bg-slate-800 border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="text-center flex-shrink-0">
                      <div className="text-blue-600 dark:text-blue-400 font-bold text-sm">2:00</div>
                      <div className="text-blue-600/60 dark:text-blue-400/60 text-xs">PM</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-1">Strategy Review Call</h4>
                      <p className="text-xs text-blue-700/70 dark:text-blue-300/70 mb-2">Peter Lange, Clemens Feigl</p>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-0 text-xs px-2 py-0">
                          <Video className="w-3 h-3 mr-1" />
                          Zoom
                        </Badge>
                        <span className="text-xs text-blue-600/60 dark:text-blue-400/60">45 min</span>
                      </div>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 rounded-xl bg-white dark:bg-slate-800 border-l-4 border-l-cyan-500 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="text-center flex-shrink-0">
                      <div className="text-cyan-600 dark:text-cyan-400 font-bold text-sm">4:30</div>
                      <div className="text-cyan-600/60 dark:text-cyan-400/60 text-xs">PM</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-1">Team Stand-up</h4>
                      <p className="text-xs text-blue-700/70 dark:text-blue-300/70 mb-2">Daily sync with development team</p>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border-0 text-xs px-2 py-0">
                          <CalendarIcon className="w-3 h-3 mr-1" />
                          Meeting
                        </Badge>
                        <span className="text-xs text-cyan-600/60 dark:text-cyan-400/60">30 min</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Tomorrow */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Tomorrow</h3>
              <div className="space-y-2">
                <Card className="p-4 rounded-2xl border-0 shadow-sm bg-card">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-sm text-foreground">Client Meeting - Siemens Energy</h4>
                        <span className="text-xs text-muted-foreground flex-shrink-0">10:00 AM</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">Munich Office, Building A</p>
                      <div className="flex items-center gap-1.5 text-xs text-primary">
                        <MapPin className="w-3 h-3" />
                        <span>In-person</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* This Week */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">This Week</h3>
              <div className="space-y-2">
                <Card className="p-4 rounded-2xl border-0 shadow-sm bg-card">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <CalendarIcon className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-sm text-foreground">Board Presentation</h4>
                        <span className="text-xs text-muted-foreground flex-shrink-0">Thu 3:00 PM</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">Q4 Results & Strategy for 2025</p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>2 hours</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 rounded-2xl border-0 shadow-sm bg-card">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Video className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-sm text-foreground">Investor Call - Munich VC</h4>
                        <span className="text-xs text-muted-foreground flex-shrink-0">Fri 11:00 AM</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">Series A discussion with Marcus Schmidt</p>
                      <div className="flex items-center gap-1.5 text-xs text-primary">
                        <Video className="w-3 h-3" />
                        <span>Google Meet</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* AI Coordinate Button */}
          <div className="p-4 border-t bg-card">
            <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
              <Sparkles className="w-4 h-4" />
              Coordinate
            </button>
          </div>
        </>
      ) : activeSection === "email" ? (
        <>
          {/* Email KPI Dashboard */}
          <div className="grid grid-cols-3 gap-2 p-4 bg-card border-b">
        <Card className="p-3 text-center">
          <div className="text-2xl font-bold text-destructive">{outstandingReplies}</div>
          <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" />
            Outstanding
          </div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-2xl font-bold text-primary">{newEmails.length + voiceAgentMeetings.length}</div>
          <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <Mail className="w-3 h-3" />
            New Today
          </div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-2xl font-bold text-accent">94%</div>
          <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <CheckCheck className="w-3 h-3" />
            Response
          </div>
        </Card>
          </div>

          <div className="flex-1 overflow-y-auto">
        {/* Voice Agent Confirmation Emails */}
        {voiceAgentMeetings.length > 0 && (
          <div className="p-4 border-b">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Mic className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="font-semibold text-foreground">Voice Agent Confirmations</h2>
              <Badge className="ml-auto bg-blue-100 text-blue-800">{voiceAgentMeetings.length}</Badge>
            </div>

            <div className="space-y-2">
              {voiceAgentMeetings.map((meeting) => {
                const contact = contacts.find(c => c.id === meeting.contactId);
                return (
                  <Card 
                    key={meeting.id} 
                    className="p-3 hover:bg-accent/50 transition-colors cursor-pointer border-l-4 border-l-blue-500 bg-blue-50/50"
                    onClick={() => setSelectedContact({
                      name: contact?.name || 'Unknown',
                      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop`,
                      title: `Meeting: ${meeting.title}`,
                      platform: "email"
                    })}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-sm text-foreground">{contact?.name}</h3>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {new Date(meeting.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground/90 mb-1">Meeting Confirmation: {meeting.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      Meeting scheduled for {new Date(meeting.scheduledTime).toLocaleString()} ({meeting.duration} minutes)
                    </p>
                    <div className="flex items-center gap-1 text-xs text-blue-600">
                      <Mic className="w-3 h-3" />
                      <span className="font-medium">Voice Agent Scheduled</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* New Emails Section */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Mail className="w-4 h-4 text-primary" />
            </div>
            <h2 className="font-semibold text-foreground">New Emails</h2>
            <Badge className="ml-auto bg-primary text-primary-foreground">{newEmails.length}</Badge>
          </div>

          <div className="space-y-2">
            {newEmails.map((email) => (
              <Card 
                key={email.id} 
                className="p-3 hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => setSelectedContact({
                  name: email.from,
                  avatar: `https://images.unsplash.com/photo-${email.id === "1" ? "1494790108377-be9c29b29330" : email.id === "2" ? "1507003211169-0a1dd7228f2d" : "1438761681033-6461ffad8d80"}?w=150&h=150&fit=crop`,
                  title: email.subject,
                  platform: "email"
                })}
              >
                <div className="flex items-start gap-3">
                  {/* Sender Avatar on the Left */}
                  <Avatar className="w-12 h-12 flex-shrink-0">
                    <AvatarImage src={`https://images.unsplash.com/photo-${email.id === "1" ? "1494790108377-be9c29b29330" : email.id === "2" ? "1507003211169-0a1dd7228f2d" : "1438761681033-6461ffad8d80"}?w=150&h=150&fit=crop`} />
                    <AvatarFallback>{email.from.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-sm text-foreground">{email.from}</h3>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-accent" />
                        <span className="text-xs text-muted-foreground">{email.time}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{email.preview}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Existing Emails Section */}
        <div className="p-4 pt-0">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <MailOpen className="w-4 h-4 text-accent" />
            </div>
            <h2 className="font-semibold text-foreground">Recent</h2>
          </div>

          <div className="space-y-2">
            {existingEmails.map((email) => (
              <Card 
                key={email.id} 
                className="p-3 hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => setSelectedContact({
                  name: email.from,
                  avatar: `https://images.unsplash.com/photo-${email.id === "3" ? "1438761681033-6461ffad8d80" : "1472099645785-5658abf4ff4e"}?w=150&h=150&fit=crop`,
                  title: email.subject,
                  platform: "email"
                })}
              >
                <div className="flex items-start gap-3">
                  {/* Sender Avatar on the Left */}
                  <Avatar className="w-12 h-12 flex-shrink-0">
                    <AvatarImage src={`https://images.unsplash.com/photo-${email.id === "3" ? "1438761681033-6461ffad8d80" : "1472099645785-5658abf4ff4e"}?w=150&h=150&fit=crop`} />
                    <AvatarFallback>{email.from.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-sm text-foreground">{email.from}</h3>
                      <span className="text-xs text-muted-foreground">{email.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{email.preview}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Messages KPI Dashboard */}
          <div className="grid grid-cols-3 gap-2 p-4 bg-card border-b">
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold text-primary">{unreadMessages}</div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <MessageCircle className="w-3 h-3" />
                Unread
              </div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold text-foreground">{mockMessages.length}</div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <MessageCircle className="w-3 h-3" />
                Conversations
              </div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold text-accent">
                {mockMessages.filter(m => m.online).length}
              </div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <CheckCheck className="w-3 h-3" />
                Online
              </div>
            </Card>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {mockMessages.map((message) => (
              <Card
                key={message.id}
                className="p-3 hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => setSelectedContact({
                  name: message.from,
                  avatar: message.avatar,
                  platform: message.platform
                })}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={message.avatar} alt={message.from} />
                      <AvatarFallback>
                        {message.from.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    {message.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-accent rounded-full border-2 border-card" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-sm text-foreground">{message.from}</h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge className={`${getPlatformBadge(message.platform).color} text-[10px] px-1.5 py-0 h-5 font-bold`}>
                          {getPlatformBadge(message.platform).label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{message.time}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{message.lastMessage}</p>
                  </div>
                  {message.unread > 0 && (
                    <Badge className="bg-primary text-primary-foreground text-xs px-2">
                      {message.unread}
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
