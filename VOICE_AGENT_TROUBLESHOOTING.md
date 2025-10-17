# Voice Agent Troubleshooting Guide

## 🎤 Speech Recognition Issues

### Common Error Messages and Solutions:

#### 1. "Speech recognition is not supported in your browser"
**Solution:** Use a supported browser:
- ✅ Chrome (recommended)
- ✅ Edge 
- ✅ Safari
- ❌ Firefox (limited support)

#### 2. "Microphone access denied"
**Solution:** 
1. Click the microphone icon in your browser's address bar
2. Select "Allow" for microphone access
3. Refresh the page and try again

#### 3. "Speech recognition failed"
**Possible causes:**
- No internet connection (speech recognition requires internet)
- Browser security settings blocking the feature
- Microphone hardware issues

**Solutions:**
- Check your internet connection
- Try in an incognito/private window
- Test your microphone in other applications

## 🎭 Demo Mode

If speech recognition doesn't work, you can use **Demo Mode**:

1. Open the Scheduling Agent
2. Click the **"🎭 Demo Mode"** button
3. Watch the voice agent process a sample meeting request

This will show you exactly how the voice agent works with:
- Information extraction
- Contact management
- Meeting scheduling
- Email confirmation

## 🔧 Testing the Voice Agent

### Sample Voice Commands:
```
"Hi, my name is John Smith, email john@example.com, I'd like to schedule a meeting for tomorrow at 2pm to discuss our partnership proposal"

"Hello, this is Maria Rodriguez, maria@techcorp.com, can we set up a call next Tuesday at 3pm for 30 minutes to talk about the collaboration"

"Hey, I'm David Kim, david@startup.io, I want to book a meeting for Friday morning at 10am to discuss the project timeline"
```

### What the Agent Extracts:
- **Name**: From phrases like "my name is", "I'm", "this is"
- **Email**: Standard email format detection
- **Meeting Time**: "tomorrow", "next week", "at 2pm"
- **Purpose**: "to discuss", "about", "regarding"
- **Duration**: "30 minutes", "1 hour"

## 🚀 Features Working

✅ Voice transcription  
✅ Information extraction  
✅ Contact creation/updating  
✅ Meeting scheduling  
✅ Email confirmation  
✅ Error handling  
✅ Demo mode fallback  

## 🛠️ Development Notes

The voice agent uses:
- Web Speech API for transcription
- Mock services for backend simulation
- Real-time status updates
- Comprehensive error handling

All services are designed to be easily replaceable with real APIs when ready for production.
