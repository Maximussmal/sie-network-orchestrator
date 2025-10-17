// Voice Agent Service with Azure OpenAI integration
import { useMeetingStore, type Contact, type Meeting } from './meetingStore';
import { AzureOpenAIService, type ExtractionResult } from './azureOpenAI';
import { AudioRecorderService } from './audioRecorder';
import { findContact, findContactByName, findContactByCompany, type KnownContact } from '@/data/knownContacts';

export interface ExtractedInfo {
  name?: string;
  email?: string;
  meetingTime?: string;
  meetingPurpose?: string;
  duration?: string;
  phone?: string;
  company?: string;
}

// Get initial contacts from store
const getInitialContacts = () => {
  // This will be populated from the store when the service is used
  return [];
};

// Simple in-memory contacts used by service helpers
const mockContacts: Contact[] = [];

// Voice Processing Service
export class VoiceAgentService {
  
  // 1. Process voice and transcribe using Azure OpenAI Whisper
  static async processVoice(audioBlob: Blob): Promise<string> {
    try {
      console.log('Transcribing audio with Azure OpenAI Whisper...');
      const result = await AzureOpenAIService.transcribeAudio(audioBlob);
      console.log('Transcription complete:', result.text);
      return result.text;
    } catch (error) {
      console.error('Azure Whisper transcription failed:', error);
      throw new Error('Failed to transcribe audio. Please check your Azure OpenAI configuration.');
    }
  }

  // 2. Extract information from conversation using Azure OpenAI GPT
  static async extractMeetingInformation(transcript: string): Promise<ExtractedInfo> {
    try {
      console.log('Extracting meeting information with Azure OpenAI GPT...');
      const result = await AzureOpenAIService.extractMeetingInfo(transcript);
      console.log('Extraction complete:', result);

      // Convert ExtractionResult to ExtractedInfo format
      const info: ExtractedInfo = {
        name: result.name,
        email: result.email,
        company: result.company,
        meetingTime: result.meetingTime,
        meetingPurpose: result.meetingPurpose,
        duration: result.duration,
        phone: result.phone,
      };

      return info;
    } catch (error) {
      console.error('Azure GPT extraction failed:', error);

      // Local fallback extraction when Azure is unavailable or fails
      try {
        const fallback = this.localExtractMeetingInformation(transcript);
        if (Object.keys(fallback).length > 0) {
          console.log('Using local fallback extraction:', fallback);
          return fallback;
        }
      } catch (fallbackError) {
        console.warn('Local fallback extraction failed:', fallbackError);
      }

      throw new Error('Failed to extract meeting information. Please try again.');
    }
  }

  // Local heuristic extractor using known contacts and simple patterns
  private static localExtractMeetingInformation(transcript: string): ExtractedInfo {
    const text = (transcript || '').trim();
    if (text.length === 0) return {};

    const lower = text.toLowerCase();
    const info: ExtractedInfo = {};

    // 1) Try to infer meeting time
    const timePatterns: Array<{ regex: RegExp; repr: (m: RegExpMatchArray) => string }> = [
      { regex: /tomorrow\s+at\s+(\d{1,2}(?::\d{2})?\s?(?:am|pm)?)/i, repr: m => `tomorrow at ${m[1]}` },
      { regex: /tomorrow\b/i, repr: () => 'tomorrow' },
      { regex: /next\s+week\b/i, repr: () => 'next week' },
      { regex: /next\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)(?:\s+at\s+(\d{1,2}(?::\d{2})?\s?(?:am|pm)?))?/i, repr: m => `next ${m[1]}${m[2] ? ` at ${m[2]}` : ''}` },
      { regex: /\b(\d{1,2}(?::\d{2})?\s?(?:am|pm))\b/i, repr: m => m[1] }
    ];
    for (const p of timePatterns) {
      const m = text.match(p.regex);
      if (m) { info.meetingTime = p.repr(m as RegExpMatchArray); break; }
    }

    // 2) Try to infer purpose
    // Capture phrase after 'about' up to sentence end or conjunction
    const aboutMatch = text.match(/about\s+([^\.;\n]+?)(?:\.|\n|$|\sand\s|\sbut\s)/i);
    if (aboutMatch && aboutMatch[1]) {
      info.meetingPurpose = aboutMatch[1].trim();
    } else {
      // fallback generic purpose if user said 'schedule a meeting'
      if (/schedule\s+(a\s+)?meeting/i.test(text)) {
        info.meetingPurpose = 'meeting';
      }
    }

    // 3) Try to resolve contact by name/company from known contacts
    // Heuristic: find any known contact whose first/last name appears in the transcript
    let matched: KnownContact | null = null;

    // Attempt name-based matching via helper
    // Extract capitalized tokens as candidate names (very simple heuristic)
    const candidateName = (() => {
      const nameAfterWith = text.match(/with\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)/);
      if (nameAfterWith) return nameAfterWith[1];
      const firstProper = text.match(/\b([A-Z][a-z]{2,})(?:\s+[A-Z][a-z]{2,})?/);
      return firstProper ? firstProper[0] : '';
    })();

    if (candidateName) {
      matched = findContactByName(candidateName);
    }

    // If still not matched, try common first-name-only patterns like "Sara(h)"
    if (!matched) {
      const firstNameOnly = text.match(/\bwith\s+([A-Za-z]{2,})\b/i)?.[1] || text.match(/\bmet\s+([A-Za-z]{2,})\b/i)?.[1];
      if (firstNameOnly) {
        matched = findContactByName(firstNameOnly);
      }
    }

    // Company-based matching
    if (!matched) {
      const companyAfterIn = text.match(/in\s+([A-Z][A-Za-z0-9&\-\s]{2,})/);
      const companyAfterFrom = text.match(/from\s+([A-Z][A-Za-z0-9&\-\s]{2,})/);
      const companyCandidate = (companyAfterIn?.[1] || companyAfterFrom?.[1] || '').trim();
      if (companyCandidate) {
        matched = findContactByCompany(companyCandidate);
      }
    }

    // Fallback smart search using provided helper
    if (!matched) {
      const maybeName = candidateName || '';
      const maybeCompany = text.match(/\b(?:at|from|with)\s+([A-Z][A-Za-z0-9&\-\s]{2,})/)?.[1] || '';
      matched = findContact(maybeName, maybeCompany);
    }

    if (matched) {
      info.name = matched.name;
      info.email = matched.email;
      info.phone = matched.phone;
      info.company = matched.company;
    }

    // Return whatever we could infer; the UI allows editing/confirmation
    return info;
  }

  // 3. Check if contact exists and create/update
  static async manageContact(extractedInfo: ExtractedInfo): Promise<Contact> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!extractedInfo.email) {
      throw new Error("Email is required to create or find contact");
    }

    // Check if contact exists
    let existingContact = mockContacts.find(
      contact => contact.email.toLowerCase() === extractedInfo.email!.toLowerCase()
    );

    if (existingContact) {
      // Update existing contact
      existingContact.name = extractedInfo.name || existingContact.name;
      existingContact.phone = extractedInfo.phone || existingContact.phone;
      existingContact.company = extractedInfo.company || existingContact.company;
      existingContact.lastContact = new Date().toISOString();
      return existingContact;
    } else {
      // Create new contact
      const newContact: Contact = {
        id: Date.now().toString(),
        name: extractedInfo.name || 'Unknown',
        email: extractedInfo.email,
        phone: extractedInfo.phone,
        company: extractedInfo.company || 'Unknown',
        meetingHistory: [],
        createdAt: new Date().toISOString(),
        lastContact: new Date().toISOString()
      };
      
      mockContacts.push(newContact);
      return newContact;
    }
  }

  // 4. Schedule meeting
  static async scheduleMeeting(
    contact: Contact, 
    extractedInfo: ExtractedInfo
  ): Promise<Meeting> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Parse meeting time (simplified - in real implementation, use proper date parsing)
    let scheduledTime: string;
    if (extractedInfo.meetingTime?.includes('tomorrow')) {
      scheduledTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    } else if (extractedInfo.meetingTime?.includes('next week')) {
      scheduledTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    } else {
      // Default to tomorrow
      scheduledTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    }

    const meeting: Meeting = {
      id: Date.now().toString(),
      contactId: contact.id,
      title: extractedInfo.meetingPurpose || 'Meeting',
      scheduledTime,
      duration: parseInt(extractedInfo.duration || '60'),
      purpose: extractedInfo.meetingPurpose || 'General discussion',
      status: 'scheduled',
      calendarLink: `https://calendar.google.com/event?action=TEMPLATE&text=${encodeURIComponent(extractedInfo.meetingPurpose || 'Meeting')}&dates=${scheduledTime.replace(/[-:]/g, '').split('.')[0]}Z/${new Date(new Date(scheduledTime).getTime() + (parseInt(extractedInfo.duration || '60') * 60000)).toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      emailSent: false,
      createdAt: new Date().toISOString(),
      source: 'voice-agent'
    };

    // Add meeting to contact's history
    contact.meetingHistory.push(meeting);
    contact.lastContact = new Date().toISOString();

    return meeting;
  }

  // 5. Send calendar email
  static async sendCalendarEmail(meeting: Meeting, contact: Contact): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock email sending
    console.log(`Sending calendar invite to ${contact.email}:`);
    console.log(`Subject: Meeting Invitation: ${meeting.title}`);
    console.log(`Body: Hi ${contact.name}, we have scheduled a meeting for ${new Date(meeting.scheduledTime).toLocaleString()}. Please click the link to add to your calendar: ${meeting.calendarLink}`);
    
    // Update meeting to reflect email sent
    meeting.emailSent = true;
    
    return true;
  }

  // 6. Generate confirmation message
  static generateConfirmationMessage(
    contact: Contact, 
    meeting: Meeting, 
    isNewContact: boolean
  ): string {
    const contactType = isNewContact ? 'new contact' : 'existing contact';
    const meetingTime = new Date(meeting.scheduledTime).toLocaleString();
    
    return `Meeting scheduled successfully! ${isNewContact ? 'Created new contact' : 'Updated existing contact'} ${contact.name} (${contact.email}). Meeting "${meeting.title}" scheduled for ${meetingTime} for ${meeting.duration} minutes. Calendar invite sent to ${contact.email}.`;
  }

  // 7. Handle errors
  static handleError(error: any): string {
    if (error.message.includes('Email')) {
      return 'Error: Valid email address is required to schedule a meeting.';
    } else if (error.message.includes('calendar')) {
      return 'Error: Unable to schedule meeting in calendar. Please check your calendar integration.';
    } else if (error.message.includes('email')) {
      return 'Error: Unable to send calendar invite. Please check email configuration.';
    } else {
      return `Error: ${error.message || 'An unexpected error occurred'}`;
    }
  }

  // Utility: Get all contacts
  static async getAllContacts(): Promise<Contact[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockContacts];
  }

  // Utility: Get contact by email
  static async getContactByEmail(email: string): Promise<Contact | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockContacts.find(contact => 
      contact.email.toLowerCase() === email.toLowerCase()
    ) || null;
  }
}
