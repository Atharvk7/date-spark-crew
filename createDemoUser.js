// Development utility to create demo user
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyAaYgI_SMLy7ba3mYkOUiFhzBBmtU29j8k",
  authDomain: "the-date-crew.firebaseapp.com",
  projectId: "the-date-crew",
  storageBucket: "the-date-crew.firebasestorage.app",
  messagingSenderId: "315837828381",
  appId: "1:315837828381:web:c01d41332a94857eb4e5f4",
  measurementId: "G-WPQD3W5YEV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function createDemoUser() {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      'demo@tdcmatchmakers.com', 
      'demo123'
    );
    console.log('✅ Demo user created successfully:', userCredential.user.email);
    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('✅ Demo user already exists');
    } else {
      console.error('❌ Error creating demo user:', error.message);
    }
    process.exit(1);
  }
}

createDemoUser();
