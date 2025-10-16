import { Mail, MailOpen, Clock, CheckCheck } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  time: string;
  isNew: boolean;
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

export const CommunicationHub = () => {
  const newEmails = mockEmails.filter((e) => e.isNew);
  const existingEmails = mockEmails.filter((e) => !e.isNew);
  const outstandingReplies = 7;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* KPI Dashboard */}
      <div className="grid grid-cols-3 gap-2 p-4 bg-card border-b">
        <Card className="p-3 text-center">
          <div className="text-2xl font-bold text-destructive">{outstandingReplies}</div>
          <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" />
            Outstanding
          </div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-2xl font-bold text-primary">{newEmails.length}</div>
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
              <Card key={email.id} className="p-3 hover:bg-accent/50 transition-colors cursor-pointer border-l-4 border-l-primary">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-sm text-foreground">{email.from}</h3>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{email.time}</span>
                </div>
                <p className="text-sm font-medium text-foreground/90 mb-1">{email.subject}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{email.preview}</p>
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
              <Card key={email.id} className="p-3 hover:bg-accent/50 transition-colors cursor-pointer border-l-4 border-l-accent">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-medium text-sm text-foreground">{email.from}</h3>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{email.time}</span>
                </div>
                <p className="text-sm text-foreground/80 mb-1">{email.subject}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{email.preview}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
