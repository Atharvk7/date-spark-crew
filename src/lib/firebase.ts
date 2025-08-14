import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Check if environment variables are available
const hasFirebaseConfig = import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID;

let app;
let auth;
let db;

if (hasFirebaseConfig) {
    // Use real Firebase configuration
    const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };

    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
    } catch (error) {
        console.error('Firebase initialization error:', error);
    }
} else {
    // Mock Firebase for development without config
    console.warn('Firebase configuration not found. Using mock authentication.');

    // Create mock auth and db objects
    auth = {
        currentUser: null,
        onAuthStateChanged: (callback: any) => {
            // Mock user for development
            const mockUser = {
                uid: 'mock-user-id',
                email: 'demo@tdcmatchmakers.com',
                displayName: 'Demo User'
            };
            callback(mockUser);
            return () => { };
        },
        signInWithEmailAndPassword: async (email: string, password: string) => {
            // Mock successful login
            console.log('Mock login:', email, password);
            return { user: { uid: 'mock-user-id', email } };
        },
        signOut: async () => {
            console.log('Mock logout');
            return Promise.resolve();
        }
    } as any;

    db = {
        collection: () => ({
            doc: () => ({
                set: () => Promise.resolve(),
                get: () => Promise.resolve({ data: () => null }),
                update: () => Promise.resolve(),
                delete: () => Promise.resolve()
            })
        })
    } as any;
}

export { auth, db };
export default app; 