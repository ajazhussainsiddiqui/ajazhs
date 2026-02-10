
'use client';

import { useAdmin } from '@/hooks/useAdmin';
import { useFirestore } from '@/firebase';
import { useCollection, useMemoFirebase } from '@/hooks/use-firestore';
import { collection, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Mail, Calendar, User } from 'lucide-react';
import { deleteMessage } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export function AdminMessages() {
  const { isAdmin } = useAdmin();
  const firestore = useFirestore();
  const { toast } = useToast();

  const messagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'messages'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: messages, loading } = useCollection<any>(messagesQuery);

  if (!isAdmin) return null;

  const handleDelete = async (id: string) => {
    try {
      await deleteMessage(id);
      toast({
        title: 'Message deleted',
        description: 'The message has been removed from your inbox.',
      });
    } catch (err) {
      console.error('Error deleting message:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not delete the message.',
      });
    }
  };

  return (
    <section className="py-20 bg-muted/10 border-t mt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold font-headline tracking-tight">Inbox</h2>
              <p className="text-muted-foreground text-sm">Manage your contact form submissions</p>
            </div>
          </div>
          <div className="bg-background border rounded-full px-4 py-1.5 text-xs font-medium shadow-sm">
            {messages?.length || 0} Total Messages
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : !messages || messages.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl">
            <Mail className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium">No messages yet</h3>
            <p className="text-muted-foreground">When someone contacts you, they'll appear here.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {messages.map((msg) => (
              <Card key={msg.id} className="relative group border-none shadow-md hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="pb-3 border-b border-border/50 bg-muted/30">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-primary">
                        <User className="h-3 w-3" />
                        <CardTitle className="text-sm font-semibold truncate max-w-[150px]">
                          {msg.email || 'Anonymous'}
                        </CardTitle>
                      </div>
                      <div className="flex items-center text-[10px] text-muted-foreground uppercase tracking-wider">
                        <Calendar className="mr-1.5 h-3 w-3" />
                        {msg.createdAt ? format(msg.createdAt.toDate(), 'MMM d, yyyy • h:mm a') : 'Just now'}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-full"
                      onClick={() => handleDelete(msg.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap break-words">
                    {msg.message}
                  </p>
                </CardContent>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 to-transparent" />
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
