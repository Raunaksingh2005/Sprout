import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import firebaseConfig from './firebase-config';

// Initialize Firebase
const getFirebaseApp = () => {
  if (getApps().length === 0) {
    const app = initializeApp(firebaseConfig);
    return app;
  }
  return getApp();
};

export const app = getFirebaseApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Firestore collections
export const COLLECTIONS = {
  USERS: 'users',
  CHILDREN: 'children',
  SCREENINGS: 'screenings',
  SPEECH_SAMPLES: 'speech_samples',
  VIDEO_SAMPLES: 'video_samples',
  REPORTS: 'reports',
  NOTIFICATIONS: 'notifications',
  CLINICIAN_REVIEWS: 'clinician_reviews'
};