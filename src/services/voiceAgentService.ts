// Mock service for Voice Agent backend functionality
import { useMeetingStore, type Contact, type Meeting } from './meetingStore';

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

// Voice Processing Service
export class VoiceAgentService {
  
  // 1. Process voice and transcribe
  static async processVoice(audioBlob: Blob): Promise<string> {
    // Mock transcription - in real implementation, this would use Web Speech API or external service
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock transcript
    const mockTranscripts = [
      "Hi, my name is Alex Chen, email alex.chen@example.com, I'd like to schedule a meeting for tomorrow at 2pm to discuss our partnership proposal",
      "Hello, this is Maria Rodriguez, maria@techstart.com, can we set up a call next Tuesday at 3pm for 30 minutes to talk about the collaboration",
      "Hey there, I'm David Kim, david.kim@innovation.com, I want to book a meeting for Friday morning at 10am to discuss the project timeline"
    ];
    
    return mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
  }

  // 2. Extract information from conversation
  static async extractMeetingInformation(transcript: string): Promise<ExtractedInfo> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const info: ExtractedInfo = {};
    
    // Extract name - prioritize context about who to meet with
    const namePatterns = [
      /(?:meeting with|met with|talked to|spoke with|met)\s+([A-Za-z\s]+?)\s+(?:from|at|who)/i,
      /(?:book.*?with|schedule.*?with|call.*?with)\s+([A-Za-z\s]+?)(?:\s|,|\.|$)/i,
      /(?:my name is|i'm|i am|this is)\s+([A-Za-z\s]+?)(?:\s|,|\.|$)/i,
      /(?:name's|name is)\s+([A-Za-z\s]+?)(?:\s|,|\.|$)/i
    ];

    for (const pattern of namePatterns) {
      const match = transcript.match(pattern);
      if (match && match[1].trim().length > 2) {
        info.name = match[1].trim();
        break;
      }
    }

    // Extract email
    const emailMatch = transcript.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (emailMatch) {
      info.email = emailMatch[1];
    }

    // Extract phone
    const phoneMatch = transcript.match(/(\+?1?[-.\s]?)?(\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})/);
    if (phoneMatch) {
      info.phone = phoneMatch[0];
    }

    // Extract meeting time
    const timePatterns = [
      /(?:meeting|call|appointment|schedule).*?(?:at|on|for)\s+([^,\.]+)/i,
      /(?:tomorrow|today|next week|next month).*?(?:at|around|about)\s+([^,\.]+)/i,
      /(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday).*?(?:at|around|about)\s+([^,\.]+)/i
    ];
    
    for (const pattern of timePatterns) {
      const match = transcript.match(pattern);
      if (match) {
        info.meetingTime = match[1].trim();
        break;
      }
    }

    // Extract purpose
    const purposePatterns = [
      /(?:about|regarding|to discuss|for|concerning)\s+([^,\.]+)/i,
      /(?:discuss|talk about|meet about)\s+([^,\.]+)/i,
      /(?:partnership|collaboration|project|proposal|timeline|budget)/i
    ];
    
    for (const pattern of purposePatterns) {
      const match = transcript.match(pattern);
      if (match) {
        info.meetingPurpose = match[1] || match[0];
        break;
      }
    }

    // Extract duration
    const durationMatch = transcript.match(/(\d+)\s*(?:minute|min|hour|hr)/i);
    if (durationMatch) {
      info.duration = durationMatch[1];
    }

    // Extract company (basic pattern)
    const companyMatch = transcript.match(/(?:from|at)\s+([A-Za-z\s&]+?(?:VC|fund|ventures|capital|partners|corp|inc|company|corporation)?)\s+(?:fund|who|and|,|\.)/i);
    if (companyMatch && companyMatch[1].trim().length > 2) {
      info.company = companyMatch[1].trim();
    }

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
      createdAt: new Date().toISOString()
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
