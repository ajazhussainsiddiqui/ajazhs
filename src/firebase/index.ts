import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

import {
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
  FirebaseProvider,
} from './provider';

import FirebaseClientProvider from './client-provider';

function initializeFirebase() {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const firebaseApp = !getApps().length
    ? initializeApp(firebaseConfig)
    : getApp();

  const firestore = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  return { firebaseApp, firestore, auth };
}

import { useUser } from './auth/use-user';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';

export {
  initializeFirebase,
  FirebaseProvider,
  FirebaseClientProvider,
  useUser,
  useCollection,
  useDoc,
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
};
