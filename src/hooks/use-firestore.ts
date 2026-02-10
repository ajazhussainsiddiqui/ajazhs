
import { useMemo } from 'react';
export { useCollection } from '@/firebase/firestore/use-collection';
export { useDoc } from '@/firebase/firestore/use-doc';

/**
 * Custom hook to stabilize Firestore queries/references.
 * Ensures the reference only changes when its dependencies change,
 * preventing infinite loops in useCollection/useDoc.
 */
export function useMemoFirebase<T>(factory: () => T, deps: any[]): T {
  return useMemo(factory, deps);
}
