
import { useEffect, useRef, useState } from "react";
import { X, Mic, User, Bot, Check, XCircle, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useConversationalVoiceAgent, conversationalVoiceAgentService } from "@/services/conversationalVoiceAgentService";
import { ExtractionResult } from "@/services/azureOpenAI";
import { useMeetingStore, type Contact, type Meeting } from "@/services/meetingStore";

interface AgentInterfaceProps {
  agentType: "scheduling" | "insight";
  onClose: () => void;
}

export const AgentInterface = ({ agentType, onClose }: AgentInterfaceProps) => {
  const { status, conversationHistory, audioStream, extractedInfo } = useConversationalVoiceAgent();
  const { addMeeting, addContact, contacts } = useMeetingStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState<ExtractionResult | null>(null);

  useEffect(() => {
    if (audioStream && audioRef.current) {
      const audio = audioRef.current;
      const reader = audioStream.getReader();
      const chunks: Uint8Array[] = [];

      const read = () => {
        reader.read().then(({ done, value }) => {
          if (done) {
            const blob = new Blob(chunks, { type: 'audio/mpeg' });
            const url = URL.createObjectURL(blob);
            audio.src = url;
            audio.play();
            return;
          }
          chunks.push(value);
          read();
        });
      };
      read();
    }
  }, [audioStream]);

  useEffect(() => {
    if (extractedInfo) {
      setEditedInfo(extractedInfo);
    }
  }, [extractedInfo]);

  const handleSave = () => {
    if (editedInfo) {
      (useConversationalVoiceAgent.setState as any)({ extractedInfo: editedInfo });
      setIsEditing(false);
    }
  };

  const handleConfirm = () => {
    console.log("DEBUG: handleConfirm called");
    if (extractedInfo) {
      console.log("DEBUG: Extracted info for confirmation:", extractedInfo);
      if (!extractedInfo.email) {
        console.error("DEBUG: Email is required to schedule a meeting");
        return;
      }

      let contact = contacts.find(c =>
        extractedInfo.email && c.email.toLowerCase() === extractedInfo.email.toLowerCase()
      );
      console.log("DEBUG: Found existing contact?", contact);

      if (!contact) {
        contact = {
          id: Date.now().toString(),
          name: extractedInfo.name || 'Unknown',
          email: extractedInfo.email,
          phone: extractedInfo.phone,
          company: extractedInfo.company || 'Unknown',
          meetingHistory: [],
          createdAt: new Date().toISOString(),
          lastContact: new Date().toISOString()
        };
        console.log("DEBUG: Creating new contact:", contact);
        addContact(contact);
      } else {
        contact = {
          ...contact,
          name: extractedInfo.name || contact.name,
          phone: extractedInfo.phone || contact.phone,
          company: extractedInfo.company || contact.company,
          lastContact: new Date().toISOString()
        };
        console.log("DEBUG: Updating existing contact:", contact);
      }

      const meeting: Meeting = {
        id: Date.now().toString(),
        contactId: contact.id,
        title: extractedInfo.meetingPurpose || 'Meeting',
        scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Placeholder
        duration: parseInt(extractedInfo.duration || '60'),
        purpose: extractedInfo.meetingPurpose || 'General discussion',
        status: 'scheduled',
        calendarLink: `https://calendar.google.com/event?action=TEMPLATE&text=${encodeURIComponent(extractedInfo.meetingPurpose || 'Meeting')}`,
        emailSent: true,
        createdAt: new Date().toISOString(),
        source: 'voice-agent'
      };

      console.log("DEBUG: Creating new meeting:", meeting);
      addMeeting(meeting, contact);
      console.log("DEBUG: Meeting scheduled successfully via addMeeting!");
      conversationalVoiceAgentService.confirmMeeting(); // This will now just reset the state
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 animate-fade-in">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📅</div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Scheduling Agent</h2>
              <p className="text-xs text-muted-foreground">Conversational AI Assistant</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto">
            {conversationHistory.map((msg, index) => (
              <div key={index} className={`flex items-start gap-3 my-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'assistant' && <Bot className="w-6 h-6" />}
                <Card className={`p-3 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : ''}`}>
                  <p>{msg.content}</p>
                </Card>
                {msg.role === 'user' && <User className="w-6 h-6" />}
              </div>
            ))}

            {status === 'CONFIRMING' && extractedInfo && (
              <Card className="p-4 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">Confirm Meeting Details</h3>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
                    <Edit2 className="w-4 h-4 mr-1" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </div>

                {isEditing && editedInfo ? (
                  <div className="space-y-3">
                    {Object.keys(editedInfo).map((key) => (
                      <div key={key}>
                        <label className="text-sm text-muted-foreground">{key}:</label>
                        <Input
                          value={(editedInfo as any)[key] || ''}
                          onChange={(e) => setEditedInfo({ ...editedInfo, [key]: e.target.value })}
                        />
                      </div>
                    ))}
                    <Button onClick={handleSave} className="w-full">Save Changes</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(extractedInfo).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-sm text-muted-foreground">{key}:</span>
                        <p className="font-medium">{value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {!isEditing && (
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleConfirm} className="flex-1">
                      <Check className="w-4 h-4 mr-2" />
                      Confirm
                    </Button>
                    <Button onClick={() => conversationalVoiceAgentService.cancelMeeting()} variant="outline" className="flex-1">
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t bg-card">
          <div className="max-w-3xl mx-auto p-4">
            <div className="flex items-center justify-center gap-4">
              <Button onClick={() => conversationalVoiceAgentService.start()} disabled={status !== 'IDLE'}>
                Start Conversation
              </Button>
              <Button onClick={() => conversationalVoiceAgentService.processUserResponse()} disabled={status !== 'SPEAKING'}>
                <Mic className="w-4 h-4 mr-2" />
                Respond
              </Button>
              <Button onClick={() => conversationalVoiceAgentService.stop()} disabled={status === 'IDLE' || status === 'CONFIRMING'}>
                Stop Conversation
              </Button>
            </div>
            <div className="text-center mt-2 text-sm text-muted-foreground">
              Status: {status}
            </div>
          </div>
        </div>
        <audio ref={audioRef} hidden />
      </div>
    </div>
  );
};
