# Voice Scheduling Agent - Setup Guide

## Overview
The Voice Scheduling Agent uses Azure OpenAI Whisper for speech-to-text transcription and GPT for intelligent information extraction to schedule meetings through natural conversation.

## Architecture

### Flow
1. **Voice Recording** → User speaks into microphone
2. **Transcription** → Azure Whisper converts speech to text
3. **Extraction** → Azure GPT extracts meeting details (name, email, time, purpose, etc.)
4. **Confirmation** → User reviews and can edit extracted information
5. **Approval** → User confirms the details
6. **Scheduling** → Meeting is scheduled and contact is created/updated

### Components

#### 1. Audio Recorder Service (`src/services/audioRecorder.ts`)
- Handles microphone access and audio recording
- Captures audio in WebM/Opus format (optimal for Whisper)
- Returns audio blob for transcription

#### 2. Azure OpenAI Service (`src/services/azureOpenAI.ts`)
- **Whisper Integration**: Transcribes audio to text
- **GPT Integration**: Extracts structured meeting information from conversational text
- Uses JSON mode for reliable extraction

#### 3. Voice Agent Service (`src/services/voiceAgentService.ts`)
- Orchestrates the voice agent workflow
- Integrates with Azure services
- Manages contact and meeting creation

#### 4. Agent Interface (`src/components/AgentInterface.tsx`)
- User interface for voice interaction
- Editable extracted information display
- Confirmation and approval flow

## Configuration

### 1. Azure OpenAI Setup

You need an Azure OpenAI resource with:
- **Whisper deployment** for speech-to-text
- **GPT-4o deployment** for information extraction

### 2. ElevenLabs Setup

You need an ElevenLabs account to get an API key for text-to-speech conversion.

1. Go to [elevenlabs.io](https://elevenlabs.io/) and sign up or log in.
2. Click on your profile icon in the top right corner and select "Profile + API Key".
3. Copy your API key.

### 3. Environment Variables

Create a `.env.local` file with:

```bash
# Azure OpenAI Configuration
VITE_AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
VITE_AZURE_OPENAI_API_KEY=your-api-key-here
VITE_AZURE_OPENAI_API_VERSION=2024-12-01-preview

# Deployment Names (optional, defaults shown)
VITE_AZURE_WHISPER_DEPLOYMENT=whisper
VITE_AZURE_GPT_DEPLOYMENT=gpt-4o

# ElevenLabs Configuration
VITE_ELEVENLABS_API_KEY=your-elevenlabs-api-key-here
```

**Important Notes:**
- Use `VITE_` prefix for Vite to expose variables to the client
- Never commit `.env.local` to version control
- Add `.env.local` to `.gitignore`

### 4. Azure OpenAI Deployments

#### Whisper Deployment
1. Go to Azure OpenAI Studio
2. Navigate to Deployments
3. Create new deployment:
   - Model: `whisper`
   - Deployment name: `whisper` (or custom name)

#### GPT Deployment
1. Create new deployment:
   - Model: `gpt-4o` or `gpt-4`
   - Deployment name: `gpt-4o` (or custom name)

If using custom deployment names, update them in `.env.local`:
```bash
VITE_AZURE_WHISPER_DEPLOYMENT=your-whisper-deployment-name
VITE_AZURE_GPT_DEPLOYMENT=your-gpt-deployment-name
```

## Usage

### 1. Start the Application
```bash
npm install
npm run dev
```

### 2. Access Voice Agent
1. Click on "Agents" in the SIE navigation bar
2. Select "Scheduling Agent"
3. Click the microphone icon to start recording

### 3. Voice Interaction
Say something like:
> "Hey Sumbios! I just had a meeting with Phil from ABC VC fund who is interested in investing in our startup. We talked about the possibilities of AI in the VC space and he seems really interested. Can you book a meeting with him tomorrow at 2pm to present my pitch deck? His email is phil.anderson@abcvc.com"

### 4. Review & Edit
- The agent will extract:
  - Name: Phil
  - Email: phil.anderson@abcvc.com
  - Company: ABC VC fund
  - Meeting Time: tomorrow at 2pm
  - Purpose: present pitch deck
- Click "Edit" to modify any field
- Click "Confirm & Schedule" to proceed

### 5. Meeting Scheduled
- Contact is created or updated
- Meeting is added to your meeting store
- Success message is displayed

## Demo Mode

For testing without Azure OpenAI:
1. Click "Demo Mode" button
2. Uses pre-filled transcript for demonstration
3. Shows the full flow without API calls

## Troubleshooting

### Microphone Access Denied
- Check browser permissions
- Allow microphone access when prompted
- Chrome/Edge/Safari recommended

### Azure API Errors

#### 401 Unauthorized
- Verify `VITE_AZURE_OPENAI_API_KEY` is correct
- Check API key hasn't expired

#### 404 Not Found
- Verify `VITE_AZURE_OPENAI_ENDPOINT` is correct
- Check deployment names match your Azure deployments

#### 429 Rate Limit
- You've exceeded Azure OpenAI rate limits
- Wait and retry, or increase quota in Azure

### Transcription Issues
- Speak clearly and at moderate pace
- Reduce background noise
- Use a good quality microphone
- Ensure stable internet connection

### Extraction Issues
- GPT might not extract all fields if information is ambiguous
- Use the Edit feature to correct missing/incorrect fields
- Speak naturally but include key details (name, email, time)

## API Costs

### Azure OpenAI Pricing
- **Whisper**: ~$0.006 per minute of audio
- **GPT-4o**: ~$0.005 per 1K tokens (input) + $0.015 per 1K tokens (output)

Typical interaction cost: ~$0.01 - $0.05 per meeting scheduled

## Next Steps

### Planned Features
1. **Calendar Integration**: Sync with Google Calendar, Outlook
2. **Email Integration**: Send meeting invites via Gmail, Outlook
3. **Smart Scheduling**: Find optimal meeting times based on availability
4. **Meeting Reminders**: Notifications before meetings
5. **Voice Confirmation**: Speak to confirm instead of clicking
6. **Multi-language Support**: Support for languages beyond English

## Security Notes

- API keys are stored in `.env.local` (not committed)
- Audio is sent to Azure OpenAI for processing
- No audio is stored locally or on servers
- Transcripts are processed in memory only
- Follow your organization's data privacy policies

## Support

For issues or questions:
1. Check Azure OpenAI service status
2. Verify environment variables are set correctly
3. Check browser console for detailed error messages
4. Review Azure OpenAI logs in Azure Portal

## Files Modified/Created

### New Files
- `src/services/azureOpenAI.ts` - Azure OpenAI integration
- `src/services/audioRecorder.ts` - Audio recording service
- `.env.local` - Environment configuration
- `VOICE_AGENT_SETUP.md` - This documentation

### Modified Files
- `src/services/voiceAgentService.ts` - Updated to use Azure OpenAI
- `src/components/AgentInterface.tsx` - Added edit functionality and approval flow
