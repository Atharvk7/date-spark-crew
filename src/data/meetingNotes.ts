import { MeetingNote } from '../lib/aiUtils';

export const meetingNotes: MeetingNote[] = [
  {
    id: "note1",
    customerId: "1",
    matchmakerId: "matchmaker1",
    date: "2024-01-15",
    meetingType: "Video Call",
    duration: 45,
    notes: "Uma is very focused on her career goals and wants someone who understands her academic ambitions. She's looking for intellectual compatibility and shared values around education. Mentioned she's open to long-distance initially if the match is right.",
    followUpRequired: true,
    followUpDate: "2024-01-22",
    nextSteps: "Send profiles of academically-oriented matches, particularly those in research or education fields",
    mood: "Positive",
    topicsDiscussed: ["Career aspirations", "Educational background", "Family values", "Ideal partner qualities"],
    customerFeedback: "Very satisfied with the consultation. Appreciated the detailed discussion about compatibility factors.",
    matchmakerObservations: "Highly articulate and clear about preferences. Good candidate for academic/professional matches."
  },
  {
    id: "note2",
    customerId: "1",
    matchmakerId: "matchmaker1",
    date: "2024-01-08",
    meetingType: "Coffee Meeting",
    duration: 60,
    notes: "Initial consultation went well. Uma shared her background in detail and discussed her family's expectations. She's particularly interested in finding someone who values both career and family balance.",
    followUpRequired: false,
    mood: "Excited",
    topicsDiscussed: ["Family background", "Career goals", "Lifestyle preferences", "Deal breakers"],
    customerFeedback: "Felt comfortable sharing personal details. Looking forward to seeing match suggestions.",
    matchmakerObservations: "Very genuine and authentic. Has realistic expectations about relationships."
  },
  {
    id: "note3",
    customerId: "2",
    matchmakerId: "matchmaker1",
    date: "2024-01-20",
    meetingType: "Call",
    duration: 30,
    notes: "Hina is looking for someone in the healthcare field who understands her demanding schedule. She values work-life balance and wants a supportive partner. Mentioned interest in profiles from Mumbai or Pune.",
    followUpRequired: true,
    followUpDate: "2024-01-27",
    nextSteps: "Focus on healthcare professionals or those with flexible schedules",
    mood: "Positive",
    topicsDiscussed: ["Work schedule", "Location preferences", "Healthcare career", "Support system"],
    customerFeedback: "Appreciated the understanding of healthcare profession demands.",
    matchmakerObservations: "Very dedicated professional. Needs someone who respects her career commitments."
  }
];

export const getNotesForCustomer = (customerId: string): MeetingNote[] => {
  return meetingNotes.filter(note => note.customerId === customerId);
};

export const addMeetingNote = (note: Omit<MeetingNote, 'id'>): MeetingNote => {
  const newNote: MeetingNote = {
    ...note,
    id: `note${Date.now()}`
  };
  meetingNotes.push(newNote);
  return newNote;
};

export const updateMeetingNote = (id: string, updates: Partial<MeetingNote>): MeetingNote | null => {
  const noteIndex = meetingNotes.findIndex(note => note.id === id);
  if (noteIndex === -1) return null;
  
  meetingNotes[noteIndex] = { ...meetingNotes[noteIndex], ...updates };
  return meetingNotes[noteIndex];
};

export const deleteMeetingNote = (id: string): boolean => {
  const noteIndex = meetingNotes.findIndex(note => note.id === id);
  if (noteIndex === -1) return false;
  
  meetingNotes.splice(noteIndex, 1);
  return true;
};
