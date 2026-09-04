export type ItemType = "lost" | "found";
export type ReportStatus = "active" | "possible_match" | "contacted" | "returned" | "closed";

export type ItemCategory = 
  | "Electronics" 
  | "ID Cards" 
  | "Wallets" 
  | "Keys" 
  | "Bags" 
  | "Books" 
  | "Clothing" 
  | "Other";

export interface Report {
  id: string; // e.g. "LF-2026-00124"
  type: ItemType;
  title: string;
  category: ItemCategory;
  description: string;
  color?: string;
  brand?: string;
  location: string; // one of LOCATIONS
  date: string; // ISO date
  time?: string;
  imageUrl?: string;
  status: ReportStatus;
  reporterName: string; // display only, no email/phone shown publicly
  createdAt: string;
}

export interface Match {
  id: string;
  lostReportId: string;
  foundReportId: string;
  score: number; // 0-100
  reason: string; // e.g. "Category + location + keyword match"
  matchedReport?: Report;
}

export interface Message {
  id: string;
  reportId: string;
  sender: "user" | "reporter";
  senderName: string;
  text: string;
  timestamp: string;
}
