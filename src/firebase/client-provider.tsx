'use client';
import { useEffect, useState } from 'react';

import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { FirebaseProvider, initializeFirebase, useAuth, useUser } from '.';
import { seedDatabase } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';

interface Props {
  children: React.ReactNode;
}

export default function FirebaseClientProvider(props: Props) {
  const { toast } = useToast();
  const [firebaseApp, setFirebaseApp] = useState<FirebaseApp | null>(null);
  const [firestore, setFirestore] = useState<Firestore | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    const { firebaseApp, firestore, auth } = initializeFirebase();
    setFirebaseApp(firebaseApp);
    setFirestore(firestore);
    setAuth(auth);
  }, []);

  const handleSeed = async () => {
    if (!firestore) return;
    try {
      await seedDatabase(firestore);
      toast({
        title: 'Database Seeded',
        description: 'The database has been seeded with initial data.',
      });
    } catch (error) {
      console.error('Error seeding database:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not seed the database.',
      });
    }
  };

  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      firestore={firestore}
      auth={auth}
      onSeed={handleSeed}
    >
      {props.children}
    </FirebaseProvider>
  );
}

export function AuthStateListener({
  children,
  loading,
}: {
  children: React.ReactNode;
  loading: React.ReactNode;
}) {
  const auth = useAuth();
  const { user, loading: userLoading, error } = useUser(auth);

  if (userLoading) {
    return <>{loading}</>;
  }

  return <>{children}</>;
}
