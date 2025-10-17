// Simple state management for meetings without external dependencies
import { useState, useEffect } from 'react';

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

// Simple global state using React context pattern
class SimpleMeetingStore {
  private meetings: Meeting[] = [];
  private contacts: Contact[] = [
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
  ];
  private listeners: Set<() => void> = new Set();

  getMeetings() {
    return this.meetings;
  }

  getContacts() {
    return this.contacts;
  }

  addMeeting(meeting: Meeting, contact: Contact) {
    this.meetings.push(meeting);
    
    // Update contact's meeting history
    const contactIndex = this.contacts.findIndex(c => c.id === contact.id);
    if (contactIndex !== -1) {
      this.contacts[contactIndex].meetingHistory.push(meeting);
      this.contacts[contactIndex].lastContact = new Date().toISOString();
    }
    
    this.notifyListeners();
  }

  addContact(contact: Contact) {
    this.contacts.push(contact);
    this.notifyListeners();
  }

  updateContact(contactId: string, updates: Partial<Contact>) {
    const contactIndex = this.contacts.findIndex(c => c.id === contactId);
    if (contactIndex !== -1) {
      this.contacts[contactIndex] = { ...this.contacts[contactIndex], ...updates };
      this.notifyListeners();
    }
  }

  getUpcomingMeetings() {
    const now = new Date();
    return this.meetings
      .filter(m => new Date(m.scheduledTime) > now && m.status === 'scheduled')
      .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }
}

export const simpleMeetingStore = new SimpleMeetingStore();

// React hook for using the simple store
export function useSimpleMeetingStore() {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const unsubscribe = simpleMeetingStore.subscribe(() => {
      forceUpdate({});
    });
    return unsubscribe;
  }, []);

  return {
    meetings: simpleMeetingStore.getMeetings(),
    contacts: simpleMeetingStore.getContacts(),
    addMeeting: simpleMeetingStore.addMeeting.bind(simpleMeetingStore),
    addContact: simpleMeetingStore.addContact.bind(simpleMeetingStore),
    updateContact: simpleMeetingStore.updateContact.bind(simpleMeetingStore),
    getUpcomingMeetings: simpleMeetingStore.getUpcomingMeetings.bind(simpleMeetingStore),
  };
}
