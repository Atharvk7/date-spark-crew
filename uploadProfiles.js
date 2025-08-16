// This script is not part of the main application bundle.
// It's a utility to be run from the command line, e.g., `node uploadProfiles.js`.

// To make this script work, you need to ensure a few things:
// 1. You have `firebase` and `@faker-js/faker` as dependencies in your `package.json`.
// 2. You are using a Node.js version that supports ES Modules (or you configure your project for CommonJS).
//    This script assumes ES Modules. You might need to add `"type": "module"` to your `package.json`.
// 3. You have authenticated with Firebase in your environment if required by your security rules.

console.log('Script starting...');
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

console.log('Imports successful.');

// IMPORTANT: Copy your Firebase config object here
const firebaseConfig = {
  apiKey: "AIzaSyAaYgI_SMLy7ba3mYkOUiFhzBBmtU29j8k", // Replace with your actual config
  authDomain: "the-date-crew.firebaseapp.com",
  projectId: "the-date-crew",
  storageBucket: "the-date-crew.firebasestorage.app",
  messagingSenderId: "315837828381",
  appId: "1:315837828381:web:c01d41332a94857eb4e5f4",
  measurementId: "G-WPQD3W5YEV"
};

// Initialize a separate Firebase app for the script
console.log('Initializing Firebase app...');
const app = initializeApp(firebaseConfig);
console.log('Firebase app initialized.');
const db = getFirestore(app);
console.log('Firestore instance created.');

const profilesFilePath = path.join(process.cwd(), 'src', 'data', 'profiles.json');

const uploadProfiles = async () => {
  console.log(`Attempting to read file at: ${profilesFilePath}`);
  const profilesData = fs.readFileSync(profilesFilePath, 'utf8');
  console.log('File read successfully.');
  
  console.log('Parsing JSON data...');
  const profiles = JSON.parse(profilesData);
  console.log('JSON data parsed successfully.');

  if (!Array.isArray(profiles)) {
    throw new Error('Profiles data is not an array.');
  }

  console.log(`Found ${profiles.length} profiles to upload.`);

  const profilesCollection = collection(db, 'profiles');
  const uploadPromises = profiles.map(profile => {
    if (!profile.id) {
      console.warn('Skipping profile without an ID:', profile);
      return Promise.resolve(); // Resolve immediately for invalid profiles
    }
    const profileDocRef = doc(profilesCollection, profile.id);
    console.log(`Uploading profile ID: ${profile.id}...`);
    return setDoc(profileDocRef, profile);
  });

  await Promise.all(uploadPromises);
  console.log(`\nUpload complete! ${profiles.length} profiles processed.`);
};

(async () => {
  try {
    await uploadProfiles();
    console.log('Script finished successfully.');
    process.exit(0);
  } catch (error) {
    console.error('An error occurred during the upload process:', error);
    process.exit(1);
  }
})();
