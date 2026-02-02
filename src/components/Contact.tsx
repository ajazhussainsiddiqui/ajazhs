'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import { cn } from '@/lib/utils';

export function Contact({ resumeUrl, className }: { resumeUrl?: string; className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) {
      toast({
        title: 'Error',
        description: 'Firebase is not configured.',
        variant: 'destructive',
      });
      return;
    }
    if (!message) {
      toast({
        title: 'Error',
        description: 'Message cannot be empty.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'messages'), {
        email,
        message,
        createdAt: serverTimestamp(),
      });
      toast({
        title: 'Success',
        description: 'Your message has been sent. Thanks!',
      });
      setIsOpen(false);
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'OOPS!  There was an error sending your message.',
        variant: 'destructive',
      });
    }
    finally {
      setIsSubmitting(false); // stop loading
    }
  };

  return (
    <div className={cn("flex justify-center items-center gap-6 p-4", className)}>
      {resumeUrl && (
        <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="border-gray-300">Resume</Button>
        </a>
      )}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>Contact me</Button>
        </DialogTrigger>
        <DialogContent className="sm:top-[30%] top-[25%]">
          <DialogHeader>
            <DialogTitle>Contact me</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <Textarea
                placeholder="Your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Input
                placeholder="Your email ID (Optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}