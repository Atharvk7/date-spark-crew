import { Customer } from "./customers";

export type MatchStatus = "Suggested" | "Sent" | "Accepted" | "Rejected" | "Meeting Scheduled" | "Feedback Pending";
export type JourneyStage = "Profile Creation" | "Profile Review" | "Active Matching" | "Match Sent" | "Meeting Phase" | "Feedback Collection" | "Success" | "On Hold";
export type VerificationStatus = "Pending" | "Verified" | "Rejected" | "Incomplete";

export interface Match {
  id: string;
  clientId: string;
  suggestedMatchId: string;
  status: MatchStatus;
  createdAt: string;
  sentAt?: string;
  responseAt?: string;
  notes?: string;
  compatibilityScore: number; // 0-100
  matchReason: string[];
}

export interface ClientJourney {
  clientId: string;
  currentStage: JourneyStage;
  stageHistory: {
    stage: JourneyStage;
    timestamp: string;
    notes?: string;
  }[];
  verificationStatus: VerificationStatus;
  totalMatches: number;
  activeMatches: number;
  successfulMatches: number;
}

// Dummy match data
export const matches: Match[] = [
  {
    id: "m1",
    clientId: "1", // Aisha Khan
    suggestedMatchId: "2", // Rohit Mehra
    status: "Suggested",
    createdAt: "2024-01-15T10:00:00Z",
    compatibilityScore: 85,
    matchReason: ["Similar education background", "Compatible age range", "Both open to relocation"]
  },
  {
    id: "m2",
    clientId: "1", // Aisha Khan
    suggestedMatchId: "4", // Arjun Singh
    status: "Sent",
    createdAt: "2024-01-10T14:30:00Z",
    sentAt: "2024-01-12T09:15:00Z",
    compatibilityScore: 78,
    matchReason: ["Professional compatibility", "Similar income range", "Both in Maharashtra"]
  },
  {
    id: "m3",
    clientId: "2", // Rohit Mehra
    suggestedMatchId: "3", // Neha Verma
    status: "Suggested",
    createdAt: "2024-01-14T16:45:00Z",
    compatibilityScore: 82,
    matchReason: ["Both highly educated", "Similar cultural background", "Compatible personalities"]
  },
  {
    id: "m4",
    clientId: "2", // Rohit Mehra
    suggestedMatchId: "1", // Aisha Khan
    status: "Meeting Scheduled",
    createdAt: "2024-01-08T11:20:00Z",
    sentAt: "2024-01-10T10:00:00Z",
    responseAt: "2024-01-11T15:30:00Z",
    compatibilityScore: 85,
    matchReason: ["Excellent compatibility", "Similar values", "Both career-focused"]
  },
  {
    id: "m5",
    clientId: "4", // Arjun Singh
    suggestedMatchId: "5", // Sara D'Souza
    status: "Suggested",
    createdAt: "2024-01-13T13:00:00Z",
    compatibilityScore: 75,
    matchReason: ["Both business-minded", "Open to new experiences", "Compatible lifestyle"]
  },
  {
    id: "m6",
    clientId: "6", // Imran Sheikh
    suggestedMatchId: "1", // Aisha Khan
    status: "Feedback Pending",
    createdAt: "2024-01-05T09:30:00Z",
    sentAt: "2024-01-07T14:00:00Z",
    responseAt: "2024-01-09T11:45:00Z",
    compatibilityScore: 88,
    matchReason: ["Shared religion", "Similar educational background", "Both internationally minded"]
  }
];

// Client journey tracking
export const clientJourneys: ClientJourney[] = [
  {
    clientId: "1", // Aisha Khan
    currentStage: "Active Matching",
    verificationStatus: "Verified",
    totalMatches: 2,
    activeMatches: 2,
    successfulMatches: 0,
    stageHistory: [
      { stage: "Profile Creation", timestamp: "2024-01-01T10:00:00Z", notes: "Initial profile created" },
      { stage: "Profile Review", timestamp: "2024-01-02T14:00:00Z", notes: "Profile reviewed and approved" },
      { stage: "Active Matching", timestamp: "2024-01-05T09:00:00Z", notes: "Started active matching process" }
    ]
  },
  {
    clientId: "2", // Rohit Mehra
    currentStage: "Meeting Phase",
    verificationStatus: "Verified",
    totalMatches: 2,
    activeMatches: 1,
    successfulMatches: 1,
    stageHistory: [
      { stage: "Profile Creation", timestamp: "2023-12-28T10:00:00Z", notes: "Profile created" },
      { stage: "Profile Review", timestamp: "2023-12-29T16:00:00Z", notes: "Profile verified" },
      { stage: "Active Matching", timestamp: "2024-01-02T11:00:00Z", notes: "Matching started" },
      { stage: "Match Sent", timestamp: "2024-01-10T10:00:00Z", notes: "First match sent to Aisha" },
      { stage: "Meeting Phase", timestamp: "2024-01-11T15:30:00Z", notes: "Meeting scheduled with Aisha" }
    ]
  },
  {
    clientId: "3", // Neha Verma
    currentStage: "On Hold",
    verificationStatus: "Verified",
    totalMatches: 0,
    activeMatches: 0,
    successfulMatches: 0,
    stageHistory: [
      { stage: "Profile Creation", timestamp: "2024-01-03T12:00:00Z", notes: "Profile created" },
      { stage: "Profile Review", timestamp: "2024-01-04T10:00:00Z", notes: "Profile approved" },
      { stage: "On Hold", timestamp: "2024-01-06T14:00:00Z", notes: "Client requested temporary hold" }
    ]
  },
  {
    clientId: "4", // Arjun Singh
    currentStage: "Active Matching",
    verificationStatus: "Verified",
    totalMatches: 1,
    activeMatches: 1,
    successfulMatches: 0,
    stageHistory: [
      { stage: "Profile Creation", timestamp: "2024-01-08T09:00:00Z", notes: "Profile created" },
      { stage: "Profile Review", timestamp: "2024-01-09T11:00:00Z", notes: "Profile verified" },
      { stage: "Active Matching", timestamp: "2024-01-12T10:00:00Z", notes: "Started matching process" }
    ]
  },
  {
    clientId: "5", // Sara D'Souza
    currentStage: "Profile Review",
    verificationStatus: "Pending",
    totalMatches: 0,
    activeMatches: 0,
    successfulMatches: 0,
    stageHistory: [
      { stage: "Profile Creation", timestamp: "2024-01-12T15:00:00Z", notes: "Profile submitted" },
      { stage: "Profile Review", timestamp: "2024-01-13T09:00:00Z", notes: "Under review" }
    ]
  },
  {
    clientId: "6", // Imran Sheikh
    currentStage: "Feedback Collection",
    verificationStatus: "Verified",
    totalMatches: 1,
    activeMatches: 0,
    successfulMatches: 0,
    stageHistory: [
      { stage: "Profile Creation", timestamp: "2024-01-01T08:00:00Z", notes: "Profile created" },
      { stage: "Profile Review", timestamp: "2024-01-02T10:00:00Z", notes: "Profile verified" },
      { stage: "Active Matching", timestamp: "2024-01-04T12:00:00Z", notes: "Matching started" },
      { stage: "Match Sent", timestamp: "2024-01-07T14:00:00Z", notes: "Match sent to Aisha" },
      { stage: "Meeting Phase", timestamp: "2024-01-09T11:45:00Z", notes: "Meeting completed" },
      { stage: "Feedback Collection", timestamp: "2024-01-12T16:00:00Z", notes: "Collecting feedback" }
    ]
  }
];

// Helper functions
export const getMatchesForClient = (clientId: string): Match[] => {
  return matches.filter(match => match.clientId === clientId);
};

export const getClientJourney = (clientId: string): ClientJourney | undefined => {
  return clientJourneys.find(journey => journey.clientId === clientId);
};

export const getMatchById = (matchId: string): Match | undefined => {
  return matches.find(match => match.id === matchId);
};

export const getPotentialMatches = (clientId: string, allClients: Customer[]): Customer[] => {
  const client = allClients.find(c => c.id === clientId);
  if (!client) return [];
  
  // Simple matching logic - exclude same gender and already matched clients
  const existingMatchIds = matches
    .filter(m => m.clientId === clientId)
    .map(m => m.suggestedMatchId);
  
  return allClients.filter(c => 
    c.id !== clientId && 
    c.gender !== client.gender && 
    !existingMatchIds.includes(c.id) &&
    c.status === "Active"
  );
};
