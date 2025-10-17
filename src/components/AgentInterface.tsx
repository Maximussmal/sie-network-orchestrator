import { useState, useEffect, useRef } from "react";
import { X, Send, Mic, Phone, Sparkles, User, Calendar, Mail, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VoiceAgentService, type ExtractedInfo } from "@/services/voiceAgentService";
import { useMeetingStore, type Contact, type Meeting } from "@/services/meetingStore";

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

interface VoiceState {
  isActive: boolean;
  isProcessing: boolean;
  currentStep: 'listening' | 'processing' | 'confirming' | 'scheduling' | 'completed' | 'error';
  extractedInfo: ExtractedInfo;
  contact?: Contact;
  meeting?: Meeting;
  error?: string;
  confirmationMessage?: string;
}

export const AgentInterface = ({ agentType, onClose }: AgentInterfaceProps) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isActive: false,
    isProcessing: false,
    currentStep: 'listening',
    extractedInfo: {}
  });
  
  const config = agentConfig[agentType];
  const recognitionRef = useRef<any>(null);
  const { addMeeting, addContact, contacts } = useMeetingStore();

  // Initialize speech recognition
  useEffect(() => {
    // Check if speech recognition is available
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    try {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setVoiceState(prev => ({
          ...prev,
          currentStep: 'listening'
        }));
      };

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
        
        // Auto-process when we have a substantial transcript
        if (finalTranscript.length > 10 && !voiceState.isProcessing) {
          processVoiceInput(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        
        let errorMessage = 'Speech recognition failed';
        switch (event.error) {
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Please allow microphone access and try again.';
            break;
          case 'no-speech':
            errorMessage = 'No speech detected. Please try speaking louder or closer to the microphone.';
            break;
          case 'network':
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          case 'service-not-allowed':
            errorMessage = 'Speech service not allowed. Please check your browser settings.';
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }
        
        setVoiceState(prev => ({
          ...prev,
          currentStep: 'error',
          error: errorMessage
        }));
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsRecording(false);
      };

    } catch (error) {
      console.error('Failed to initialize speech recognition:', error);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [voiceState.isProcessing]);

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  const handleSend = () => {
    if (!message.trim()) return;
    // TODO: Implement AI integration
    console.log("Sending message:", message);
    setMessage("");
  };

  const toggleRecording = async () => {
    if (agentType !== 'scheduling') {
      setIsRecording(!isRecording);
      return;
    }

    if (!isRecording) {
      // Check if speech recognition is available
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setVoiceState(prev => ({
          ...prev,
          isActive: true,
          currentStep: 'error',
          error: 'Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.'
        }));
        return;
      }

      // Request microphone permission first
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (error) {
        setVoiceState(prev => ({
          ...prev,
          isActive: true,
          currentStep: 'error',
          error: 'Microphone access denied. Please allow microphone permission and try again.'
        }));
        return;
      }

      // Start voice processing for scheduling agent
      setIsRecording(true);
      setVoiceState(prev => ({
        ...prev,
        isActive: true,
        currentStep: 'listening',
        extractedInfo: {},
        error: undefined
      }));
      
      try {
        if (recognitionRef.current) {
          recognitionRef.current.start();
        } else {
          // Fallback: simulate voice processing with mock data
          setTimeout(() => {
            const mockTranscript = "Hey Sumbios! I just had a meeting with Phil from ABC VC fund who is interested in investing in our startup. We talked about the possibilities of AI in the VC space and he seems really interested. Can you book a meeting with him tomorrow at 2pm to present my pitch deck? His email is phil.anderson@abcvc.com";
            setTranscript(mockTranscript);
            processVoiceInput(mockTranscript);
          }, 1000);
        }
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        setVoiceState(prev => ({
          ...prev,
          currentStep: 'error',
          error: 'Failed to start speech recognition. Please try again.'
        }));
        setIsRecording(false);
      }
    } else {
      // Stop recording
      setIsRecording(false);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping recognition:', error);
        }
      }
    }
  };

  const toggleCall = () => {
    setIsInCall(!isInCall);
    if (!isInCall && agentType === 'scheduling') {
      // Start voice call mode
      setVoiceState(prev => ({
        ...prev,
        isActive: true,
        currentStep: 'listening'
      }));
      toggleRecording();
    }
  };

  // Process voice input with full workflow
  const processVoiceInput = async (voiceText: string) => {
    if (agentType !== 'scheduling') return;

    setVoiceState(prev => ({ ...prev, isProcessing: true, currentStep: 'processing' }));
    
    try {
      // Extract information
      const extractedInfo = await VoiceAgentService.extractMeetingInformation(voiceText);
      
      setVoiceState(prev => ({
        ...prev,
        extractedInfo,
        currentStep: 'confirming'
      }));

      // Find existing contact or create new one
      let contact = contacts.find(c => 
        extractedInfo.email && c.email.toLowerCase() === extractedInfo.email.toLowerCase()
      );

      if (!contact && extractedInfo.email) {
        // Create new contact
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
        addContact(contact);
      } else if (contact) {
        // Update existing contact
        contact = {
          ...contact,
          name: extractedInfo.name || contact.name,
          phone: extractedInfo.phone || contact.phone,
          company: extractedInfo.company || contact.company,
          lastContact: new Date().toISOString()
        };
      }

      if (!contact) {
        throw new Error('Could not create or find contact');
      }
      
      setVoiceState(prev => ({
        ...prev,
        contact
      }));

      // Create meeting
      const meeting: Meeting = {
        id: Date.now().toString(),
        contactId: contact.id,
        title: extractedInfo.meetingPurpose || 'Meeting',
        scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        duration: parseInt(extractedInfo.duration || '60'),
        purpose: extractedInfo.meetingPurpose || 'General discussion',
        status: 'scheduled',
        calendarLink: `https://calendar.google.com/event?action=TEMPLATE&text=${encodeURIComponent(extractedInfo.meetingPurpose || 'Meeting')}`,
        emailSent: true,
        createdAt: new Date().toISOString(),
        source: 'voice-agent'
      };

      // Add meeting to store
      addMeeting(meeting, contact);
      
      setVoiceState(prev => ({
        ...prev,
        meeting,
        currentStep: 'completed',
        confirmationMessage: `Meeting scheduled successfully! ${contact!.meetingHistory.length === 0 ? 'Created new contact' : 'Updated existing contact'} ${contact!.name} (${contact!.email}). Meeting "${meeting.title}" scheduled for ${new Date(meeting.scheduledTime).toLocaleString()} for ${meeting.duration} minutes. Calendar invite sent to ${contact!.email}.`
      }));
      
    } catch (error) {
      const errorMessage = VoiceAgentService.handleError(error);
      setVoiceState(prev => ({
        ...prev,
        currentStep: 'error',
        error: errorMessage
      }));
    } finally {
      setVoiceState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const getVoiceStatusIcon = () => {
    switch (voiceState.currentStep) {
      case 'listening':
        return <Mic className="w-5 h-5 text-green-500 animate-pulse" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'confirming':
        return <User className="w-5 h-5 text-yellow-500" />;
      case 'scheduling':
        return <Calendar className="w-5 h-5 text-purple-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Mic className="w-5 h-5" />;
    }
  };

  const getVoiceStatusText = () => {
    switch (voiceState.currentStep) {
      case 'listening':
        return 'Listening for your meeting request...';
      case 'processing':
        return 'Processing your request...';
      case 'confirming':
        return 'Confirming meeting details...';
      case 'scheduling':
        return 'Scheduling meeting...';
      case 'completed':
        return 'Meeting scheduled successfully!';
      case 'error':
        return 'Error occurred';
      default:
        return 'Ready to assist';
    }
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

        {/* Voice Status Section - Only for Scheduling Agent */}
        {agentType === 'scheduling' && voiceState.isActive && (
          <div className="p-4 border-b bg-card/50">
            <div className="flex items-center gap-3 mb-3">
              {getVoiceStatusIcon()}
              <span className="font-medium text-foreground">{getVoiceStatusText()}</span>
            </div>
            
            {transcript && (
              <Card className="p-3 bg-muted/50">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Transcript:</span> {transcript}
                </p>
              </Card>
            )}
          </div>
        )}

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto">
            
            {/* Voice Processing Results - Only for Scheduling Agent */}
            {agentType === 'scheduling' && voiceState.isActive && (
              <div className="space-y-4 mb-6">
                
                {/* Extracted Information */}
                {Object.keys(voiceState.extractedInfo).length > 0 && (
                  <Card className="p-4">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Extracted Information
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {voiceState.extractedInfo.name && (
                        <div>
                          <span className="text-sm text-muted-foreground">Name:</span>
                          <p className="font-medium">{voiceState.extractedInfo.name}</p>
                        </div>
                      )}
                      {voiceState.extractedInfo.email && (
                        <div>
                          <span className="text-sm text-muted-foreground">Email:</span>
                          <p className="font-medium">{voiceState.extractedInfo.email}</p>
                        </div>
                      )}
                      {voiceState.extractedInfo.meetingTime && (
                        <div>
                          <span className="text-sm text-muted-foreground">Meeting Time:</span>
                          <p className="font-medium">{voiceState.extractedInfo.meetingTime}</p>
                        </div>
                      )}
                      {voiceState.extractedInfo.meetingPurpose && (
                        <div>
                          <span className="text-sm text-muted-foreground">Purpose:</span>
                          <p className="font-medium">{voiceState.extractedInfo.meetingPurpose}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {/* Contact Information */}
                {voiceState.contact && (
                  <Card className="p-4">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Contact
                    </h3>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback>
                          {voiceState.contact.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{voiceState.contact.name}</p>
                        <p className="text-sm text-muted-foreground">{voiceState.contact.email}</p>
                        <p className="text-sm text-muted-foreground">{voiceState.contact.company}</p>
                      </div>
                      <Badge variant="outline" className="ml-auto">
                        {voiceState.contact.meetingHistory.length > 0 ? 'Existing' : 'New'}
                      </Badge>
                    </div>
                  </Card>
                )}

                {/* Meeting Information */}
                {voiceState.meeting && (
                  <Card className="p-4">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Scheduled Meeting
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Title:</span>
                        <p className="font-medium">{voiceState.meeting.title}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Scheduled Time:</span>
                        <p className="font-medium">{new Date(voiceState.meeting.scheduledTime).toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Duration:</span>
                        <p className="font-medium">{voiceState.meeting.duration} minutes</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">
                          {voiceState.meeting.emailSent ? 'Email sent' : 'Sending email...'}
                        </span>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Confirmation Message */}
                {voiceState.confirmationMessage && (
                  <Card className="p-4 bg-green-50 border-green-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="text-green-800 font-medium">{voiceState.confirmationMessage}</p>
                    </div>
                  </Card>
                )}

                {/* Error Message */}
                {voiceState.error && (
                  <Card className="p-4 bg-red-50 border-red-200">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <p className="text-red-800 font-medium">{voiceState.error}</p>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* Regular Messages */}
            <div className="text-center text-muted-foreground text-sm py-8">
              {agentType === 'scheduling' ? (
                voiceState.isActive ? (
                  "Voice processing in progress..."
                ) : (
                  <div className="space-y-4">
                    <p>Click the microphone to start voice scheduling or type your message</p>
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const mockTranscript = "Hey Sumbios! I just had a meeting with Phil from ABC VC fund who is interested in investing in our startup. We talked about the possibilities of AI in the VC space and he seems really interested. Can you book a meeting with him tomorrow at 2pm to present my pitch deck? His email is phil.anderson@abcvc.com";
                          setTranscript(mockTranscript);
                          setVoiceState(prev => ({
                            ...prev,
                            isActive: true,
                            currentStep: 'listening'
                          }));
                          processVoiceInput(mockTranscript);
                        }}
                        className="text-xs"
                      >
                        🎭 Demo Mode
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Use demo mode if microphone access is not available
                    </p>
                  </div>
                )
              ) : (
                "Click a suggestion or type your message to start"
              )}
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

            {/* Voice Status Indicators */}
            {agentType === 'scheduling' && voiceState.isActive && (
              <div className="mt-2 space-y-2">
                {voiceState.currentStep === 'listening' && (
                  <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                    <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                    Listening for your meeting request...
                  </div>
                )}
                
                {voiceState.isProcessing && (
                  <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    Processing your request...
                  </div>
                )}
                
                {voiceState.currentStep === 'completed' && (
                  <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Meeting scheduled successfully!
                  </div>
                )}
                
                {voiceState.currentStep === 'error' && (
                  <div className="flex items-center justify-center gap-2 text-sm text-red-600">
                    <XCircle className="w-4 h-4" />
                    {voiceState.error}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setVoiceState({
                          isActive: false,
                          isProcessing: false,
                          currentStep: 'listening',
                          extractedInfo: {}
                        });
                        setTranscript("");
                      }}
                      className="ml-2 text-xs"
                    >
                      Reset
                    </Button>
                  </div>
                )}
              </div>
            )}

            {isRecording && agentType !== 'scheduling' && (
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
