'use client';
import { useEffect, useState } from 'react';
import {
  onSnapshot,
  doc,
  getDoc,
  DocumentData,
  FirestoreError,
} from 'firebase/firestore';
import { useFirestore } from '../provider';

interface UseDocOptions {
  listen?: boolean;
}

export function useDoc<T>(
  path: string,
  options: UseDocOptions = { listen: true }
) {
  const db = useFirestore();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    // Wait for the database instance to be ready
    if (!db || !path) return;
    
    setLoading(true);

    const docRef = doc(db, path);

    if (!options.listen) {
      getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            setData({ id: docSnap.id, ...docSnap.data() } as T);
          } else {
            setData(null);
          }
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
      return;
    }

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [path, db, options.listen]);

  return { data, loading, error };
}
