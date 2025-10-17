
import { create } from 'zustand';
import { AudioRecorderService } from './audioRecorder';
import { AzureOpenAIService, ConversationMessage, ExtractionResult } from './azureOpenAI';
import { textToSpeech } from './elevenLabsService';
import { useMeetingStore, type Contact, type Meeting } from './meetingStore';

const audioRecorder = new AudioRecorderService();

type AgentStatus = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'CONFIRMING';

interface ConversationalVoiceAgentState {
  status: AgentStatus;
  conversationHistory: ConversationMessage[];
  audioStream: ReadableStream<Uint8Array> | null;
  extractedInfo: ExtractionResult | null;
  startConversation: () => Promise<void>;
  stopConversation: () => void;
  processUserResponse: () => Promise<void>;
  confirmMeeting: () => void;
  cancelMeeting: () => void;
}

const useConversationalVoiceAgentStore = create<ConversationalVoiceAgentState>((set, get) => ({
  status: 'IDLE',
  conversationHistory: [],
  audioStream: null,
  extractedInfo: null,
  startConversation: async () => {
    console.log("--- DEBUG: startConversation ---");
    set({ status: 'THINKING', conversationHistory: [], extractedInfo: null });
    try {
      const initialResponse = await AzureOpenAIService.getAgentResponse([]);
      console.log("DEBUG: Initial agent response:", initialResponse);
      const stream = await textToSpeech(initialResponse);
      set({ status: 'SPEAKING', audioStream: stream, conversationHistory: [{ role: 'assistant', content: initialResponse }] });
    } catch (error) {
      console.error("Error starting conversation:", error);
      set({ status: 'IDLE' });
    }
  },
  stopConversation: () => {
    console.log("--- DEBUG: stopConversation ---");
    audioRecorder.stopRecording();
    set({ status: 'IDLE' });
  },
  processUserResponse: async () => {
    console.log("--- DEBUG: processUserResponse ---");
    set({ status: 'LISTENING' });
    await audioRecorder.startRecording();
    setTimeout(async () => {
      const audioBlob = await audioRecorder.stopRecording();
      if (audioBlob) {
        set({ status: 'THINKING' });
        try {
          const { text } = await AzureOpenAIService.transcribeAudio(audioBlob);
          console.log("DEBUG: Transcribed text:", text);
          const newHistory = [...get().conversationHistory, { role: 'user' as const, content: text }];
          set({ conversationHistory: newHistory });
          console.log("DEBUG: Sending to getAgentResponse:", newHistory);
          const agentResponse = await AzureOpenAIService.getAgentResponse(newHistory);
          console.log("DEBUG: Agent raw response:", agentResponse);

          try {
            const meetingDetails: ExtractionResult = JSON.parse(agentResponse);
            console.log("DEBUG: Parsed meeting details:", meetingDetails);
            set({ status: 'CONFIRMING', extractedInfo: meetingDetails });
          } catch (e) {
            console.log("DEBUG: Agent response is not JSON, treating as conversational text.");
            const stream = await textToSpeech(agentResponse);
            const finalHistory = [...newHistory, { role: 'assistant' as const, content: agentResponse }];
            set({ status: 'SPEAKING', audioStream: stream, conversationHistory: finalHistory });
          }
        } catch (error) {
          console.error("Error processing user response:", error);
          set({ status: 'IDLE' });
        }
      }
    }, 5000);
  },
  confirmMeeting: () => {
    console.log("--- DEBUG: confirmMeeting ---");
    const { extractedInfo } = get();
    const { addMeeting, addContact, contacts } = useMeetingStore.getState();

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
        scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Placeholder for now
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
      console.log("DEBUG: Meeting scheduled successfully!");
      set({ status: 'IDLE', extractedInfo: null, conversationHistory: [] });
    }
  },
  cancelMeeting: () => {
    console.log("--- DEBUG: cancelMeeting ---");
    set({ status: 'IDLE', extractedInfo: null, conversationHistory: [] });
  },
}));

class ConversationalVoiceAgentService {
  get state() {
    return useConversationalVoiceAgentStore.getState();
  }

  start() {
    this.state.startConversation();
  }

  stop() {
    this.state.stopConversation();
  }

  processUserResponse() {
    this.state.processUserResponse();
  }

  confirmMeeting() {
    this.state.confirmMeeting();
  }

  cancelMeeting() {
    this.state.cancelMeeting();
  }
}

export const conversationalVoiceAgentService = new ConversationalVoiceAgentService();
export const useConversationalVoiceAgent = useConversationalVoiceAgentStore;
