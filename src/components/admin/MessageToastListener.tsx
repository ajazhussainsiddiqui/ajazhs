'use client';

import { useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';
import { deleteMessage } from '@/lib/db';
import { ToastAction } from '@/components/ui/toast';

export function MessageToastListener() {
  const { isAdmin } = useAdmin();
  const firestore = useFirestore();
  const { toast } = useToast();
  const processedIds = useRef<Set<string>>(new Set());
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (!isAdmin || !firestore) {
      // Reset state when logged out so it triggers correctly on next login
      isInitialLoad.current = true;
      processedIds.current.clear();
      return;
    }

    const messagesQuery = query(
      collection(firestore, 'messages'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const showToast = (id: string, message: string, duration?: number) => {
      toast({
        title: `New Message`,
        description: message.length > 60 ? message.substring(0, 60) + '...' : message,
        duration: duration,
        action: (
          <ToastAction 
            altText="Delete message" 
            onClick={async () => {
              try {
                await deleteMessage(id);
              } catch (err) {
                console.error('Failed to delete message:', err);
              }
            }}
          >
            Delete
          </ToastAction>
        ),
      });
    };

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      // On initial load (after login), toast the single most recent message persistently
      if (isInitialLoad.current) {
        const latestDoc = snapshot.docs[0];
        if (latestDoc) {
          const id = latestDoc.id;
          const data = latestDoc.data();
          if (data && data.message) {
            // Set an extremely high duration for the initial load message
            showToast(id, data.message, 100000000);
          }
        }
        
        // Mark current messages as processed
        snapshot.docs.forEach(doc => processedIds.current.add(doc.id));
        isInitialLoad.current = false;
        return;
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const id = change.doc.id;
          if (!processedIds.current.has(id)) {
            const data = change.doc.data();
            processedIds.current.add(id);
            if (data && data.message) {
              // Standard duration (3s) for subsequent new messages
              showToast(id, data.message);
            }
          }
        }
      });
    });

    return () => unsubscribe();
  }, [isAdmin, firestore, toast]);

  return null;
}
