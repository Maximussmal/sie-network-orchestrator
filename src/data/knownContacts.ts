// Known Contacts Database
// This database is used to lookup contact information when users mention people by name

export interface KnownContact {
  name: string;
  email: string;
  phone?: string;
  company: string;
  title?: string;
  notes?: string;
}

export const knownContacts: KnownContact[] = [
  {
    name: "Phil Anderson",
    email: "phil.anderson@abcvc.com",
    phone: "+1-415-555-0101",
    company: "ABC VC Fund",
    title: "Managing Partner",
    notes: "Interested in AI and VC space"
  },
  {
    name: "Sarah Chen",
    email: "sarah.chen@techventures.com",
    phone: "+1-650-555-0202",
    company: "Tech Ventures Capital",
    title: "Senior Partner",
    notes: "Focus on early-stage startups"
  },
  {
    name: "Michael Rodriguez",
    email: "m.rodriguez@innovatefund.io",
    phone: "+1-408-555-0303",
    company: "Innovate Fund",
    title: "Investment Director",
    notes: "Specializes in SaaS investments"
  },
  {
    name: "Emily Watson",
    email: "emily.watson@growthcapital.com",
    phone: "+1-415-555-0404",
    company: "Growth Capital Partners",
    title: "Principal",
    notes: "B2B software expert"
  },
  {
    name: "David Kim",
    email: "david.kim@nextgenvc.com",
    phone: "+1-650-555-0505",
    company: "NextGen Ventures",
    title: "Venture Partner",
    notes: "AI/ML focused investor"
  },
  {
    name: "Jessica Martinez",
    email: "jessica@alphaventures.com",
    phone: "+1-415-555-0606",
    company: "Alpha Ventures",
    title: "Partner",
    notes: "Enterprise software investments"
  },
  {
    name: "Robert Taylor",
    email: "robert.taylor@summitfund.com",
    phone: "+1-650-555-0707",
    company: "Summit Fund",
    title: "Managing Director",
    notes: "Late-stage growth investor"
  },
  {
    name: "Lisa Patel",
    email: "lisa.patel@horizonvc.com",
    phone: "+1-408-555-0808",
    company: "Horizon VC",
    title: "General Partner",
    notes: "Deep tech investments"
  },
  {
    name: "James Wilson",
    email: "james.wilson@catalystcapital.com",
    phone: "+1-415-555-0909",
    company: "Catalyst Capital",
    title: "Senior Associate",
    notes: "Consumer tech focus"
  },
  {
    name: "Amanda Foster",
    email: "amanda.foster@pioneerfund.com",
    phone: "+1-650-555-1010",
    company: "Pioneer Fund",
    title: "Investment Manager",
    notes: "Healthcare and biotech"
  }
];

/**
 * Search for a contact by name (fuzzy matching)
 * @param name - Name to search for
 * @returns Matching contact or null
 */
export function findContactByName(name: string): KnownContact | null {
  if (!name) return null;

  const searchName = name.toLowerCase().trim();

  // Exact match
  let match = knownContacts.find(contact =>
    contact.name.toLowerCase() === searchName
  );

  if (match) return match;

  // Partial match - first name or last name
  match = knownContacts.find(contact => {
    const contactParts = contact.name.toLowerCase().split(' ');
    const searchParts = searchName.split(' ');

    // Check if any part of the search name matches any part of the contact name
    return searchParts.some(searchPart =>
      contactParts.some(contactPart =>
        contactPart.includes(searchPart) || searchPart.includes(contactPart)
      )
    );
  });

  return match || null;
}

/**
 * Search for a contact by company name
 * @param company - Company name to search for
 * @returns Matching contact or null
 */
export function findContactByCompany(company: string): KnownContact | null {
  if (!company) return null;

  const searchCompany = company.toLowerCase().trim();

  return knownContacts.find(contact =>
    contact.company.toLowerCase().includes(searchCompany) ||
    searchCompany.includes(contact.company.toLowerCase())
  ) || null;
}

/**
 * Get all contacts from a specific company
 * @param company - Company name
 * @returns Array of contacts
 */
export function getContactsByCompany(company: string): KnownContact[] {
  if (!company) return [];

  const searchCompany = company.toLowerCase().trim();

  return knownContacts.filter(contact =>
    contact.company.toLowerCase().includes(searchCompany) ||
    searchCompany.includes(contact.company.toLowerCase())
  );
}

/**
 * Search for a contact by partial information
 * @param name - Name (optional)
 * @param company - Company (optional)
 * @returns Best matching contact or null
 */
export function findContact(name?: string, company?: string): KnownContact | null {
  // Try to find by name first
  if (name) {
    const byName = findContactByName(name);
    if (byName) {
      // If company is also provided, verify it matches
      if (company) {
        const companyMatch = byName.company.toLowerCase().includes(company.toLowerCase()) ||
                            company.toLowerCase().includes(byName.company.toLowerCase());
        if (companyMatch) return byName;
      } else {
        return byName;
      }
    }
  }

  // Try to find by company
  if (company) {
    return findContactByCompany(company);
  }

  return null;
}

/**
 * Get formatted contact list for AI context
 */
export function getContactsContext(): string {
  return knownContacts.map(contact =>
    `${contact.name} (${contact.company}) - ${contact.email}${contact.phone ? `, ${contact.phone}` : ''}`
  ).join('\n');
}
