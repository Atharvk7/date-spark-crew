// This script is a utility to upload meeting notes to Firestore subcollections.
// Run from the command line: `node uploadNotes.js`

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

// IMPORTANT: Your Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyAaYgI_SMLy7ba3mYkOUiFhzBBmtU29j8k",
  authDomain: "the-date-crew.firebaseapp.com",
  projectId: "the-date-crew",
  storageBucket: "the-date-crew.firebasestorage.app",
  messagingSenderId: "315837828381",
  appId: "1:315837828381:web:c01d41332a94857eb4e5f4",
  measurementId: "G-WPQD3W5YEV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Data copied from src/data/meetingNotes.ts
const meetingNotes = [
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

const uploadNotes = async () => {
  console.log('Starting upload of meeting notes...');

  if (!meetingNotes || meetingNotes.length === 0) {
    console.log('No meeting notes to upload.');
    return;
  }

  for (const note of meetingNotes) {
    if (!note.customerId || !note.id) {
      console.warn('Skipping note without customerId or id:', note);
      continue;
    }

    try {
      // Create a reference to the subcollection 'notes' within the customer's document
      const noteDocRef = doc(db, 'profiles', note.customerId, 'notes', note.id);
      await setDoc(noteDocRef, note);
      console.log(`Successfully uploaded note ID: ${note.id} for customer ID: ${note.customerId}`);
    } catch (error) {
      console.error(`Failed to upload note ID: ${note.id}. Error:`, error);
    }
  }

  console.log('\nUpload complete! All notes have been processed.');
};

uploadNotes();
