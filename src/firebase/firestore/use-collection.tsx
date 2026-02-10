'use client';
import { useEffect, useState } from 'react';
import {
  onSnapshot,
  getDocs,
  Query,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
} from 'firebase/firestore';

interface UseCollectionOptions {
  listen?: boolean;
}

export function useCollection<T>(
  query: Query | null,
  options: UseCollectionOptions = { listen: true }
): { data: T[] | null; loading: boolean; error: FirestoreError | null } {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    // If no query is provided (e.g., during initialization), keep loading state
    if (!query) {
      return;
    }

    setLoading(true);

    if (!options.listen) {
      getDocs(query)
        .then((snapshot) => {
          const docs = snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as T)
          );
          setData(docs);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
      return;
    }

    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const docs = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as T)
        );
        setData(docs);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query, options.listen]);

  return { data, loading, error };
}
