'use client';
import { createContext, useContext, useMemo } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

interface FirebaseContextValue {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  onSeed?: () => void;
}

const FirebaseContext = createContext<FirebaseContextValue>({
  firebaseApp: null,
  firestore: null,
  auth: null,
});

export const useFirebase = () => useContext(FirebaseContext);

export const useFirebaseApp = () => useContext(FirebaseContext).firebaseApp;
export const useFirestore = () => useContext(FirebaseContext).firestore;
export const useAuth = () => useContext(FirebaseContext).auth;

interface Props {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  children: React.ReactNode;
  onSeed?: () => void;
}

export function FirebaseProvider(props: Props) {
  const { firebaseApp, firestore, auth, children, onSeed } = props;
  const value = useMemo(
    () => ({ firebaseApp, firestore, auth, onSeed }),
    [firebaseApp, firestore, auth, onSeed]
  );
  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}
