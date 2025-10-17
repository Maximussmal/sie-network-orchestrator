# Known Contacts Database

## Overview
The Voice Scheduling Agent now includes a **Known Contacts Database** that automatically fills in contact information (email, phone, company) when you mention someone by name, even if you don't provide their email address.

## Problem Solved
Previously, if you said:
> "Book a meeting with Phil from ABC VC fund tomorrow at 2pm"

The system would fail because no email was provided. Now it automatically looks up Phil's contact information from the database.

## How It Works

### 1. Known Contacts Database
Located in: `src/data/knownContacts.ts`

Contains 10 pre-configured contacts:

| Name | Email | Phone | Company |
|------|-------|-------|---------|
| Phil Anderson | phil.anderson@abcvc.com | +1-415-555-0101 | ABC VC Fund |
| Sarah Chen | sarah.chen@techventures.com | +1-650-555-0202 | Tech Ventures Capital |
| Michael Rodriguez | m.rodriguez@innovatefund.io | +1-408-555-0303 | Innovate Fund |
| Emily Watson | emily.watson@growthcapital.com | +1-415-555-0404 | Growth Capital Partners |
| David Kim | david.kim@nextgenvc.com | +1-650-555-0505 | NextGen Ventures |
| Jessica Martinez | jessica@alphaventures.com | +1-415-555-0606 | Alpha Ventures |
| Robert Taylor | robert.taylor@summitfund.com | +1-650-555-0707 | Summit Fund |
| Lisa Patel | lisa.patel@horizonvc.com | +1-408-555-0808 | Horizon VC |
| James Wilson | james.wilson@catalystcapital.com | +1-415-555-0909 | Catalyst Capital |
| Amanda Foster | amanda.foster@pioneerfund.com | +1-650-555-1010 | Pioneer Fund |

### 2. AI Integration
The Azure GPT model now receives the entire known contacts database as context and is instructed to:
1. Check if the mentioned name matches anyone in the database
2. Check if the mentioned company matches anyone in the database
3. Automatically fill in email, phone, and company from the database

### 3. Fallback Mechanism
If the AI doesn't find the contact, a JavaScript fallback function searches the database using:
- **Exact name match**: "Phil Anderson" → finds Phil Anderson
- **Partial name match**: "Phil" → finds Phil Anderson
- **Company match**: "ABC VC" → finds Phil Anderson from ABC VC Fund
- **Fuzzy matching**: Handles variations in naming

## Usage Examples

### Example 1: Name Only
**You say:**
> "Hey Sumbios, book a meeting with Phil tomorrow at 2pm"

**System extracts:**
- Name: Phil Anderson
- Email: phil.anderson@abcvc.com ✅ (from database)
- Company: ABC VC Fund ✅ (from database)
- Phone: +1-415-555-0101 ✅ (from database)
- Meeting Time: tomorrow at 2pm
- Purpose: meeting

### Example 2: Name + Company
**You say:**
> "I met Sarah from Tech Ventures today, let's schedule a follow-up call next week"

**System extracts:**
- Name: Sarah Chen
- Email: sarah.chen@techventures.com ✅ (from database)
- Company: Tech Ventures Capital ✅ (from database)
- Phone: +1-650-555-0202 ✅ (from database)
- Meeting Time: next week
- Purpose: follow-up call

### Example 3: Company Only
**You say:**
> "Book a meeting with someone from NextGen Ventures tomorrow"

**System extracts:**
- Name: David Kim ✅ (found by company)
- Email: david.kim@nextgenvc.com ✅ (from database)
- Company: NextGen Ventures ✅ (from database)
- Phone: +1-650-555-0505 ✅ (from database)
- Meeting Time: tomorrow

### Example 4: Explicit Email (Override)
**You say:**
> "Book a meeting with Phil at phil@newcompany.com tomorrow"

**System extracts:**
- Name: Phil Anderson
- Email: phil@newcompany.com ✅ (uses provided email, not database)
- Company: ABC VC Fund (from database)
- Meeting Time: tomorrow

## Adding New Contacts

To add more contacts to the database, edit `src/data/knownContacts.ts`:

```typescript
export const knownContacts: KnownContact[] = [
  // ... existing contacts ...
  {
    name: "New Contact Name",
    email: "email@company.com",
    phone: "+1-555-123-4567",
    company: "Company Name",
    title: "Job Title",
    notes: "Additional notes"
  }
];
```

## Search Functions

The module provides several utility functions:

### `findContactByName(name: string)`
Finds a contact by name with fuzzy matching.
```typescript
findContactByName("Phil") // Returns Phil Anderson
findContactByName("anderson") // Returns Phil Anderson
```

### `findContactByCompany(company: string)`
Finds a contact by company name.
```typescript
findContactByCompany("ABC VC") // Returns Phil Anderson
```

### `findContact(name?: string, company?: string)`
Smart search that tries both name and company.
```typescript
findContact("Phil", "ABC VC") // Returns Phil Anderson
findContact(undefined, "ABC VC") // Returns Phil Anderson
```

### `getContactsByCompany(company: string)`
Returns all contacts from a specific company.
```typescript
getContactsByCompany("ABC VC") // Returns [Phil Anderson]
```

## Implementation Details

### In Azure OpenAI Service
The `extractMeetingInfo` method now:
1. Retrieves the contacts database context
2. Includes it in the GPT system prompt
3. Instructs GPT to match names/companies with the database
4. Falls back to JavaScript search if GPT misses it

### Code Flow
```
User speaks → Transcription
    ↓
Extract information with GPT (includes contacts database)
    ↓
If email missing → JavaScript fallback search
    ↓
Display extracted info (with database matches) → User confirms
    ↓
Schedule meeting
```

## Benefits

✅ **No need to say email addresses**
- Just mention the person's name or company

✅ **Faster meeting scheduling**
- Reduces voice input time
- More natural conversation

✅ **Error reduction**
- No spelling mistakes in emails
- Consistent contact information

✅ **Automatic completion**
- Fills in phone and company automatically
- Maintains accurate contact database

## Future Enhancements

Planned improvements:
1. **CRM Integration**: Sync with Salesforce, HubSpot
2. **Learning System**: Add new contacts automatically
3. **Relationship Mapping**: Track interactions and history
4. **Smart Suggestions**: Suggest meeting attendees based on context
5. **Contact Disambiguation**: Handle multiple people with same name

## Testing

### Test with Demo Mode
1. Click "🎭 Demo Mode" button
2. The demo transcript mentions "Phil from ABC VC fund" WITHOUT an email
3. System automatically fills in Phil's email, phone, and company
4. Review extracted information - all fields should be populated

### Test with Voice
Say any of these:
- "Book a meeting with Sarah tomorrow"
- "Schedule a call with David Kim next week"
- "I need to meet with someone from Growth Capital"
- "Set up a meeting with Phil at 3pm"

The system should automatically fill in the contact details from the database.

## Troubleshooting

### Contact Not Found
If a contact isn't recognized:
1. Check spelling of name/company in transcript
2. Verify contact exists in `knownContacts.ts`
3. Check console logs for matching attempts
4. Add contact to database if needed

### Wrong Contact Matched
If the wrong person is matched:
1. Provide more context (full name + company)
2. Use the Edit feature to correct information
3. Consider refining the contact name in database

### Multiple Matches
If multiple people from same company:
- Specify the full name
- Mention the person's title if known
- Use the Edit feature to select correct person

## Summary

The Known Contacts Database transforms the voice agent from requiring complete information to understanding context like a human assistant. Just mention someone's name, and the system handles the rest!
