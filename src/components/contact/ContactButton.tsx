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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { sendMessage } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

const contactFormSchema = z.object({
  email: z.string().email('Please enter a valid email address.').optional().or(z.literal('')),
  message: z.string().min(1, 'Message is required.'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactButton() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      email: '',
      message: '',
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      await sendMessage(values);
      toast({
        title: 'Message Sent',
        description: 'Thank you for reaching out! I will get back to you asap 😊',
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not send message. Please contact via email.',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-accent/10 border-accent/20 hover:bg-accent/20 h-9 px-3 sm:px-4 gap-2 transition-all">
          <Mail className="h-4 w-4" />
          <span className="hidden sm:inline">Contact</span>
        </Button>
      </DialogTrigger>
      <DialogContent className={cn(
        "sm:max-w-[425px]",
        "fixed top-[2%] sm:top-[50%] translate-y-0 sm:translate-y-[-50%]"
      )}>
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Send Message</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">           
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Your message here..."
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Email (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full mt-2" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}