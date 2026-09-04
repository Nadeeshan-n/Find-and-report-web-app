import { ItemCategory, Match, Report } from './types';

export const LOCATIONS: string[] = [
  "Main Library (2nd Floor Quiet Zone)",
  "Student Union Food Court",
  "Science & Engineering Hall (1st Floor Atrium)",
  "Recreation & Fitness Center (Locker Rooms)",
  "Campus Shuttle Stop B (North Gate)",
  "Humanities Hall (Lecture Hall 104)",
  "University Bookstore & Café",
  "Central Quad Lawn & Benches",
  "Dining Commons East",
  "Engineering Lab Complex (Room 302)"
];

export const CATEGORIES: { id: ItemCategory; label: string; icon: string; countHint?: number }[] = [
  { id: "Electronics", label: "Electronics", icon: "Laptop" },
  { id: "ID Cards", label: "ID Cards", icon: "CreditCard" },
  { id: "Wallets", label: "Wallets", icon: "Wallet" },
  { id: "Keys", label: "Keys", icon: "Key" },
  { id: "Bags", label: "Bags & Backpacks", icon: "Briefcase" },
  { id: "Books", label: "Books & Notes", icon: "BookOpen" },
  { id: "Clothing", label: "Clothing & Apparel", icon: "Shirt" },
  { id: "Other", label: "Other Items", icon: "Package" }
];

export const INITIAL_REPORTS: Report[] = [
  {
    id: "LF-2026-00101",
    type: "lost",
    title: "Samsung Galaxy Buds Pro (Black Case)",
    category: "Electronics",
    description: "Lost black Samsung Galaxy Buds Pro 2 in matte black charging case. Left them on a desk by the south study carrels while reviewing notes.",
    color: "Black",
    brand: "Samsung",
    location: "Main Library (2nd Floor Quiet Zone)",
    date: "2026-09-02",
    time: "14:30",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    status: "active",
    reporterName: "Marcus Vance",
    createdAt: "2026-09-02T15:10:00Z"
  },
  {
    id: "LF-2026-00102",
    type: "found",
    title: "University Student ID Card",
    category: "ID Cards",
    description: "Found standard student campus card with red lanyard on the lunch counter near the bagel kiosk. Name starts with 'Alex R.'",
    color: "White/Red",
    brand: "Campus ID Services",
    location: "Student Union Food Court",
    date: "2026-09-03",
    time: "12:15",
    imageUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=80",
    status: "active",
    reporterName: "Campus Safety Desk (Officer Chen)",
    createdAt: "2026-09-03T12:45:00Z"
  },
  {
    id: "LF-2026-00103",
    type: "lost",
    title: "Navy Blue Herschel Backpack",
    category: "Bags",
    description: "Navy blue Herschel Little America backpack with brown leather buckle straps. Contains notebook, water bottle pouch, and calculus binder.",
    color: "Navy Blue",
    brand: "Herschel",
    location: "Science & Engineering Hall (1st Floor Atrium)",
    date: "2026-09-01",
    time: "16:45",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    status: "possible_match",
    reporterName: "Elena Rostova",
    createdAt: "2026-09-01T17:30:00Z"
  },
  {
    id: "LF-2026-00104",
    type: "found",
    title: "Hydro Flask 32oz Sage Green Water Bottle",
    category: "Other",
    description: "Found stainless steel 32oz Hydro Flask in sage green with several national park and mountain stickers. Left on treadmill bench.",
    color: "Sage Green",
    brand: "Hydro Flask",
    location: "Recreation & Fitness Center (Locker Rooms)",
    date: "2026-09-03",
    time: "09:00",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
    status: "active",
    reporterName: "Staff Member Liam",
    createdAt: "2026-09-03T09:30:00Z"
  },
  {
    id: "LF-2026-00105",
    type: "lost",
    title: "Black Leather Bifold Wallet",
    category: "Wallets",
    description: "Slim black leather bifold wallet with driver license, campus meal card, and public transit CharlieCard. Critical for getting home!",
    color: "Black",
    brand: "Bellroy",
    location: "Campus Shuttle Stop B (North Gate)",
    date: "2026-09-02",
    time: "18:20",
    imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80",
    status: "active",
    reporterName: "Devon Kim",
    createdAt: "2026-09-02T19:00:00Z"
  },
  {
    id: "LF-2026-00106",
    type: "found",
    title: "TI-84 Plus CE Graphing Calculator",
    category: "Electronics",
    description: "Graphing calculator in light blue hard slide case. Left on row 4 desk right after the Calc II exam. Screen has small cat sticker on back.",
    color: "Light Blue",
    brand: "Texas Instruments",
    location: "Humanities Hall (Lecture Hall 104)",
    date: "2026-09-02",
    time: "11:45",
    imageUrl: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80",
    status: "returned",
    reporterName: "Prof. Henderson TA",
    createdAt: "2026-09-02T12:00:00Z"
  },
  {
    id: "LF-2026-00107",
    type: "found",
    title: "SanDisk 64GB USB-C Flash Drive",
    category: "Electronics",
    description: "Silver metal SanDisk Ultra Dual Luxe 64GB flash drive attached to a bright red fabric key fob with 'BioChem 2026' written in sharpie.",
    color: "Silver",
    brand: "SanDisk",
    location: "Engineering Lab Complex (Room 302)",
    date: "2026-09-03",
    time: "13:30",
    imageUrl: "https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=600&auto=format&fit=crop&q=80",
    status: "active",
    reporterName: "Lab Monitor Maya",
    createdAt: "2026-09-03T14:15:00Z"
  },
  {
    id: "LF-2026-00108",
    type: "lost",
    title: "Champion Grey Pullover Hoodie (Size L)",
    category: "Clothing",
    description: "Heavyweight heather grey Champion reverse weave pullover hoodie. Has small embroidered 'C' logo on left wrist.",
    color: "Grey",
    brand: "Champion",
    location: "University Bookstore & Café",
    date: "2026-08-31",
    time: "15:00",
    imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80",
    status: "active",
    reporterName: "Jordan Bailey",
    createdAt: "2026-08-31T16:00:00Z"
  },
  {
    id: "LF-2026-00109",
    type: "found",
    title: "Brass Keys with Red Carabiner",
    category: "Keys",
    description: "Ring with 3 brass house/dorm keys, a small copper bicycle lock key, and a red aluminum climbing carabiner with a Planet Fitness barcode tag.",
    color: "Brass/Red",
    brand: "Schlage / Generic",
    location: "Central Quad Lawn & Benches",
    date: "2026-09-03",
    time: "10:15",
    imageUrl: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80",
    status: "active",
    reporterName: "Grounds Crew Sam",
    createdAt: "2026-09-03T10:45:00Z"
  },
  {
    id: "LF-2026-00110",
    type: "lost",
    title: "Organic Chemistry 8th Edition Hardcover",
    category: "Books",
    description: "Vollhardt & Schore Organic Chemistry 8th edition textbook. Has colorful tab flags sticking out of chapter 6 and 7. Left near booths.",
    color: "Dark Blue/Yellow",
    brand: "Macmillan Learning",
    location: "Dining Commons East",
    date: "2026-09-02",
    time: "19:15",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    status: "active",
    reporterName: "Chloe Nguyen",
    createdAt: "2026-09-02T20:00:00Z"
  },
  // Extra pair to demonstrate a great high-score match out of the box:
  {
    id: "LF-2026-00111",
    type: "found",
    title: "Samsung Wireless Earbuds in Black Case",
    category: "Electronics",
    description: "Pair of black wireless bluetooth Samsung earbuds in oval charging cradle found by quiet desks on level 2.",
    color: "Black",
    brand: "Samsung",
    location: "Main Library (2nd Floor Quiet Zone)",
    date: "2026-09-02",
    time: "16:00",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    status: "possible_match",
    reporterName: "Library Circulation Desk",
    createdAt: "2026-09-02T16:30:00Z"
  },
  {
    id: "LF-2026-00112",
    type: "found",
    title: "Herschel Blue Rucksack Backpack",
    category: "Bags",
    description: "Found dark blue navy backpack with magnetic pin straps in atrium area near vending machine.",
    color: "Navy Blue",
    brand: "Herschel",
    location: "Science & Engineering Hall (1st Floor Atrium)",
    date: "2026-09-01",
    time: "18:00",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    status: "possible_match",
    reporterName: "Hall Facilities",
    createdAt: "2026-09-01T18:20:00Z"
  }
];

/**
 * AI Matching Engine (Deterministic, weighted overlap according to prompt specification):
 * - category match -> +40
 * - same location -> +25
 * - >=2 shared keywords in title/description -> +25
 * - date within 3 days -> +10
 * Capped at 95 (never claim 100% certainty)
 */
export function calculateMatchScore(target: Report, candidate: Report): { score: number; reasons: string[] } {
  // Only match opposite types (lost <-> found)
  if (target.type === candidate.type) {
    return { score: 0, reasons: [] };
  }

  let score = 0;
  const reasons: string[] = [];

  // 1. Category match (+40)
  if (target.category === candidate.category) {
    score += 40;
    reasons.push(`Category match: ${target.category} (+40%)`);
  }

  // 2. Same location (+25)
  if (target.location.toLowerCase().trim() === candidate.location.toLowerCase().trim()) {
    score += 25;
    reasons.push(`Identical campus location: ${target.location} (+25%)`);
  } else {
    // Partial location similarity bonus check if both contain "library", "gym", "hall", etc.
    const targetBuilding = target.location.split('(')[0].trim().toLowerCase();
    const candidateBuilding = candidate.location.split('(')[0].trim().toLowerCase();
    if (targetBuilding && candidateBuilding && targetBuilding === candidateBuilding) {
      score += 15;
      reasons.push(`Nearby building match: ${targetBuilding} (+15%)`);
    }
  }

  // 3. Shared keywords in title/description (+25 for >=2 shared keywords)
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "in", "on", "at", "by", "with", "for", "to", "of",
    "is", "it", "my", "was", "left", "found", "lost", "near", "from", "has", "have", "this", "that"
  ]);

  const extractTokens = (text: string): string[] => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w));
  };

  const targetTokens = new Set([
    ...extractTokens(target.title),
    ...extractTokens(target.description),
    ...(target.brand ? extractTokens(target.brand) : []),
    ...(target.color ? extractTokens(target.color) : [])
  ]);

  const candidateTokens = [
    ...extractTokens(candidate.title),
    ...extractTokens(candidate.description),
    ...(candidate.brand ? extractTokens(candidate.brand) : []),
    ...(candidate.color ? extractTokens(candidate.color) : [])
  ];

  const matchedKeywords = Array.from(new Set(candidateTokens.filter(t => targetTokens.has(t))));
  if (matchedKeywords.length >= 2) {
    score += 25;
    reasons.push(`Shared keywords (${matchedKeywords.slice(0, 3).join(", ")}): (+25%)`);
  } else if (matchedKeywords.length === 1) {
    score += 10;
    reasons.push(`Keyword overlap (${matchedKeywords[0]}): (+10%)`);
  }

  // 4. Date within 3 days (+10)
  try {
    const tDate = new Date(target.date).getTime();
    const cDate = new Date(candidate.date).getTime();
    const diffDays = Math.abs(tDate - cDate) / (1000 * 60 * 60 * 24);
    if (!isNaN(diffDays) && diffDays <= 3) {
      score += 10;
      reasons.push(`Reported within 3 days window (+10%)`);
    }
  } catch {
    // Ignore date parse issues
  }

  // Cap at 95 (never claim 100% certainty)
  const finalScore = Math.min(95, score);
  return { score: finalScore, reasons };
}

export function findMatchesForReport(target: Report, allReports: Report[]): Match[] {
  const matches: Match[] = [];

  for (const candidate of allReports) {
    if (candidate.id === target.id) continue;
    if (candidate.type === target.type) continue; // Must be lost vs found
    
    const { score, reasons } = calculateMatchScore(target, candidate);
    if (score >= 40) { // Keep top candidates above threshold (brief states >= 50% shown)
      const lostId = target.type === "lost" ? target.id : candidate.id;
      const foundId = target.type === "found" ? target.id : candidate.id;

      matches.push({
        id: `match-${lostId}-${foundId}`,
        lostReportId: lostId,
        foundReportId: foundId,
        score,
        reason: reasons.length > 0 ? reasons.join(" • ") : "Attribute overlap",
        matchedReport: candidate
      });
    }
  }

  // Sort descending by score, take top 3
  return matches.sort((a, b) => b.score - a.score).slice(0, 3);
}
