// Azure OpenAI Service for Whisper (Speech-to-Text) and GPT (Information Extraction)
import { getContactsContext, findContact } from '@/data/knownContacts';

const AZURE_ENDPOINT = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
const AZURE_API_KEY = import.meta.env.VITE_AZURE_OPENAI_API_KEY;
const AZURE_API_VERSION = import.meta.env.VITE_AZURE_OPENAI_API_VERSION;

// Deployment names - adjust these based on your Azure OpenAI deployments
const WHISPER_DEPLOYMENT = import.meta.env.VITE_AZURE_WHISPER_DEPLOYMENT || 'whisper';
const GPT_DEPLOYMENT = import.meta.env.VITE_AZURE_GPT_DEPLOYMENT || 'gpt-4o';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export interface TranscriptionResult {
  text: string;
  duration?: number;
  language?: string;
}

export interface ExtractionResult {
  name?: string;
  email?: string;
  company?: string;
  meetingTime?: string;
  meetingPurpose?: string;
  duration?: string;
  phone?: string;
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export class AzureOpenAIService {

  /**
   * Transcribe audio using Azure OpenAI Whisper
   * @param audioBlob - Audio blob from microphone recording
   * @returns Transcribed text
   */
  static async transcribeAudio(audioBlob: Blob): Promise<TranscriptionResult> {
    await delay(5000);
    try {
      if (!AZURE_ENDPOINT || !AZURE_API_KEY) {
        throw new Error('Azure OpenAI credentials not configured. Please check your .env.local file.');
      }

      if (!AZURE_API_VERSION) {
        throw new Error('Azure OpenAI API version not configured.');
      }

      // Validate audio blob
      if (!audioBlob || audioBlob.size === 0) {
        throw new Error('Invalid audio recording. Please try recording again.');
      }

      console.log('Transcribing audio blob:', {
        size: audioBlob.size,
        type: audioBlob.type,
        deployment: WHISPER_DEPLOYMENT
      });

      // Create FormData for audio file upload
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');

      const url = `${AZURE_ENDPOINT.replace(/\/$/, '')}/openai/deployments/${WHISPER_DEPLOYMENT}/audio/transcriptions?api-version=${AZURE_API_VERSION}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'api-key': AZURE_API_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || response.statusText;

        if (response.status === 401) {
          throw new Error('Authentication failed. Please check your Azure OpenAI API key.');
        } else if (response.status === 404) {
          throw new Error(`Whisper deployment '${WHISPER_DEPLOYMENT}' not found. Please check your deployment name.`);
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        } else {
          throw new Error(`Transcription failed: ${errorMessage}`);
        }
      }

      const result = await response.json();

      if (!result.text) {
        throw new Error('No transcription returned. Please speak louder or check your microphone.');
      }

      console.log('Transcription successful:', result.text.substring(0, 100) + '...');

      return {
        text: result.text,
        duration: result.duration,
        language: result.language,
      };
    } catch (error) {
      console.error('Transcription error:', error);

      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred during transcription');
      }
    }
  }

  /**
   * Extract meeting information from transcript using Azure OpenAI GPT
   * @param transcript - Text transcript from voice input
   * @returns Extracted meeting information
   */
  static async extractMeetingInfo(transcript: string): Promise<ExtractionResult> {
    try {
      if (!AZURE_ENDPOINT || !AZURE_API_KEY) {
        throw new Error('Azure OpenAI credentials not configured. Please check your .env.local file.');
      }

      if (!AZURE_API_VERSION) {
        throw new Error('Azure OpenAI API version not configured.');
      }

      if (!transcript || transcript.trim().length === 0) {
        throw new Error('No transcript to process. Please try speaking again.');
      }

      console.log('Extracting information from transcript:', transcript.substring(0, 100) + '...');

      // Get known contacts context
      const contactsContext = getContactsContext();

      const systemPrompt = `You are an AI assistant that extracts meeting scheduling information from conversational text.

KNOWN CONTACTS DATABASE:
${contactsContext}

Extract the following information if present:
- name: The name of the person to meet with (NOT the speaker). Check the known contacts database for matching names.
- email: Email address of the person to meet with. If the person is in the known contacts database, use their email from the database.
- phone: Phone number. If the person is in the known contacts database, use their phone from the database.
- company: Company or organization name. If the person is in the known contacts database, use their company from the database.
- meetingTime: When the meeting should be scheduled (e.g., "tomorrow at 2pm", "next Tuesday at 3pm")
- meetingPurpose: Purpose or topic of the meeting
- duration: Meeting duration in minutes (extract number only)

IMPORTANT: If you recognize a name or company from the known contacts database, automatically fill in their email, phone, and company information from the database.

Respond ONLY with a JSON object containing these fields. If a field is not found, omit it from the response.
Example: {"name": "John Doe", "email": "john@example.com", "company": "ABC Corp", "meetingTime": "tomorrow at 2pm", "meetingPurpose": "discuss partnership", "duration": "30"}`;

      const url = `${AZURE_ENDPOINT.replace(/\/$/, '')}/openai/deployments/${GPT_DEPLOYMENT}/chat/completions?api-version=${AZURE_API_VERSION}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': AZURE_API_KEY,
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: transcript }
          ],
          temperature: 0.3,
          max_tokens: 500,
          response_format: { type: 'json_object' }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || response.statusText;

        if (response.status === 401) {
          throw new Error('Authentication failed. Please check your Azure OpenAI API key.');
        } else if (response.status === 404) {
          throw new Error(`GPT deployment '${GPT_DEPLOYMENT}' not found. Please check your deployment name.`);
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        } else {
          throw new Error(`Information extraction failed: ${errorMessage}`);
        }
      }

      const result = await response.json();
      const extractedText = result.choices[0]?.message?.content;

      if (!extractedText) {
        throw new Error('No information extracted from GPT response. Please try rephrasing your request.');
      }

      const extractedInfo: ExtractionResult = JSON.parse(extractedText);

      console.log('Extraction successful:', extractedInfo);

      // Validate at least some information was extracted
      if (Object.keys(extractedInfo).length === 0) {
        throw new Error('Could not extract any meeting information. Please provide more details.');
      }

      // Fallback: If email is missing but we have a name or company, try to find in known contacts
      if (!extractedInfo.email && (extractedInfo.name || extractedInfo.company)) {
        console.log('Email missing, searching known contacts database...');
        const knownContact = findContact(extractedInfo.name, extractedInfo.company);

        if (knownContact) {
          console.log('Found matching contact in database:', knownContact.name);
          extractedInfo.email = extractedInfo.email || knownContact.email;
          extractedInfo.phone = extractedInfo.phone || knownContact.phone;
          extractedInfo.company = extractedInfo.company || knownContact.company;
          extractedInfo.name = extractedInfo.name || knownContact.name;
        }
      }

      return extractedInfo;
    } catch (error) {
      console.error('Extraction error:', error);

      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred during information extraction');
      }
    }
  }

  static async getAgentResponse(conversationHistory: ConversationMessage[]): Promise<string> {
    await delay(5000);
    if (!AZURE_ENDPOINT || !AZURE_API_KEY) {
      throw new Error('Azure OpenAI credentials not configured. Please check your .env.local file.');
    }

    const contactsContext = getContactsContext();
    const systemPrompt = `You are a conversational AI assistant for scheduling meetings. Your goal is to gather all necessary information by asking clarifying questions.

    You must collect:
    - Attendee Name
    - Attendee Email
    - Meeting Time
    - Meeting Purpose
    
    You can also ask for:
    - Company Name
    - Phone Number
    - Duration in minutes
    
    KNOWN CONTACTS DATABASE:
    ${contactsContext}
    
    - If a user mentions a name or company in the database, use the information from the database.
    - Keep your responses concise and friendly.
    - Ask one question at a time.
    - When you have all the required information (name, email, time, purpose) AND have confirmed it with the user, you MUST respond ONLY with the JSON structure of the meeting details. Do not say anything else.
    - Start the conversation by saying "Hey I am sumbios how can i help you today?".
    
    Example Conversation:
    User: "I need to schedule a meeting."
    Assistant: "Of course. Who is the meeting with?"
    User: "Phil"
    Assistant: "Thanks. And what is Phil's email address?"
    User: "I don't have it, but he works at ABC VC."
    Assistant: "Got it. I've found Phil Anderson from ABC VC Fund in our contacts. Is that correct?"
    User: "Yes"
    Assistant: "Great. What is the purpose of the meeting?"
    User: "To discuss the new project."
    Assistant: "Okay. When would you like to schedule the meeting?"
    User: "Tomorrow at 2pm."
    Assistant: "Perfect. Just to confirm, this is a meeting with Phil Anderson (phil.anderson@abcvc.com) tomorrow at 2pm to discuss the new project. Is that correct?"
    User: "Yes, that's correct."
    Assistant: '{"name": "Phil Anderson", "email": "phil.anderson@abcvc.com", "company": "ABC VC Fund", "meetingTime": "tomorrow at 2pm", "meetingPurpose": "To discuss the new project."}'
    `;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
    ];

    const url = `${AZURE_ENDPOINT.replace(/\/$/, '')}/openai/deployments/${GPT_DEPLOYMENT}/chat/completions?api-version=${AZURE_API_VERSION}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': AZURE_API_KEY,
      },
      body: JSON.stringify({
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || response.statusText;
      throw new Error(`Agent response failed: ${errorMessage}`);
    }

    const result = await response.json();
    return result.choices[0]?.message?.content;
  }

  /**
   * Check if Azure OpenAI is configured
   */
  static isConfigured(): boolean {
    return !!(AZURE_ENDPOINT && AZURE_API_KEY && AZURE_API_VERSION);
  }

  /**
   * Get configuration status for debugging
   */
  static getConfigStatus(): { configured: boolean; endpoint?: string; hasKey: boolean; version?: string } {
    return {
      configured: this.isConfigured(),
      endpoint: AZURE_ENDPOINT,
      hasKey: !!AZURE_API_KEY,
      version: AZURE_API_VERSION,
    };
  }
}
