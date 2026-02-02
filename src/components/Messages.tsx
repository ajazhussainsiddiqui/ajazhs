'use client';

import { useEffect, useState, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, type DocumentData } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Message extends DocumentData {
  id: string;
  email?: string;
  message: string;
  createdAt: any;
}

export function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();
  const displayedIds = useRef(new Set<string>());

  useEffect(() => {
    if (user && db) {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const msgs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Message));

        // Show toast for new messages
        [...msgs].reverse().forEach((msg) => {
          if (!displayedIds.current.has(msg.id)) {
            displayedIds.current.add(msg.id);
            toast({
              title: msg.email || 'New Message',
              description: msg.message,
              duration: 100000,
            });
          }
        });

        setMessages(msgs);
      });

      return () => unsubscribe();
    }
  }, [user, toast]);

  const handleDelete = async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'messages', id));
      toast({
        title: 'Success',
        description: 'Message deleted.',
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: 'Error',
        description: 'Could not delete message.',
        variant: 'destructive',
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start justify-between p-4 border rounded-lg">
              <div>
                {msg.email && <p className="text-sm font-medium">{msg.email}</p>}
                <p className="text-sm text-muted-foreground">{msg.message}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(msg.id)}>Delete</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}