// Shared state management for meetings across the application
import { create } from 'zustand';

export interface Meeting {
  id: string;
  contactId: string;
  title: string;
  scheduledTime: string;
  duration: number;
  purpose: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  calendarLink?: string;
  emailSent: boolean;
  createdAt: string;
  source: 'voice-agent' | 'manual' | 'import';
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  meetingHistory: Meeting[];
  createdAt: string;
  lastContact: string;
}

interface MeetingStore {
  meetings: Meeting[];
  contacts: Contact[];
  addMeeting: (meeting: Meeting, contact: Contact) => void;
  updateMeeting: (meetingId: string, updates: Partial<Meeting>) => void;
  addContact: (contact: Contact) => void;
  updateContact: (contactId: string, updates: Partial<Contact>) => void;
  getMeetingsByContact: (contactId: string) => Meeting[];
  getUpcomingMeetings: () => Meeting[];
}

export const useMeetingStore = create<MeetingStore>((set, get) => ({
  meetings: [],
  contacts: [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@techcorp.com",
      phone: "+1-555-0123",
      company: "TechCorp",
      meetingHistory: [],
      createdAt: "2024-01-15T10:00:00Z",
      lastContact: "2024-01-15T10:00:00Z"
    },
    {
      id: "2", 
      name: "Sarah Johnson",
      email: "sarah.j@startup.io",
      phone: "+1-555-0456",
      company: "StartupIO",
      meetingHistory: [
        {
          id: "m1",
          contactId: "2",
          title: "Project Discussion",
          scheduledTime: "2024-01-20T14:00:00Z",
          duration: 60,
          purpose: "Discuss collaboration opportunities",
          status: "completed",
          emailSent: true,
          createdAt: "2024-01-18T09:00:00Z",
          source: "manual"
        }
      ],
      createdAt: "2024-01-10T08:00:00Z",
      lastContact: "2024-01-20T14:00:00Z"
    }
  ],

  addMeeting: (meeting: Meeting, contact: Contact) => {
    set((state) => {
      const updatedMeetings = [...state.meetings, meeting];
      
      // Update contact's meeting history
      const updatedContacts = state.contacts.map(c => 
        c.id === contact.id 
          ? { ...c, meetingHistory: [...c.meetingHistory, meeting], lastContact: new Date().toISOString() }
          : c
      );

      return {
        meetings: updatedMeetings,
        contacts: updatedContacts
      };
    });
  },

  updateMeeting: (meetingId: string, updates: Partial<Meeting>) => {
    set((state) => ({
      meetings: state.meetings.map(m => 
        m.id === meetingId ? { ...m, ...updates } : m
      ),
      contacts: state.contacts.map(contact => ({
        ...contact,
        meetingHistory: contact.meetingHistory.map(m => 
          m.id === meetingId ? { ...m, ...updates } : m
        )
      }))
    }));
  },

  addContact: (contact: Contact) => {
    set((state) => ({
      contacts: [...state.contacts, contact]
    }));
  },

  updateContact: (contactId: string, updates: Partial<Contact>) => {
    set((state) => ({
      contacts: state.contacts.map(c => 
        c.id === contactId ? { ...c, ...updates } : c
      )
    }));
  },

  getMeetingsByContact: (contactId: string) => {
    const { meetings } = get();
    return meetings.filter(m => m.contactId === contactId);
  },

  getUpcomingMeetings: () => {
    const { meetings } = get();
    const now = new Date();
    return meetings
      .filter(m => new Date(m.scheduledTime) > now && m.status === 'scheduled')
      .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());
  }
}));
