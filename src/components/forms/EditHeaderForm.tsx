
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import type { ResumeData } from '@/lib/types';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  title: z.string().min(1, 'Title is required.').optional().or(z.literal('')),
  avatarUrl: z.string().url('Invalid URL.').optional().or(z.literal('')),
  resumeUrl: z.string().url('Invalid URL.').optional().or(z.literal('')),
  contact: z.object({
    email: z.string().email('Invalid email address.'),
    phone: z.string().min(1, 'Phone is required.').optional().or(z.literal('')),
    linkedin: z.string().url('Invalid URL. Must include https://').optional().or(z.literal('')),
    github: z.string().url('Invalid URL. Must include https://').optional().or(z.literal('')),
    location: z.string().min(1, 'Location is required.').optional().or(z.literal('')),
    website: z.string().url('Invalid URL. Must include https://').optional().or(z.literal('')),
  }),
});

interface EditHeaderFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  resumeData: Pick<ResumeData, 'name' | 'title' | 'contact' | 'avatarUrl' | 'resumeUrl'>;
  onSave: (data: Pick<ResumeData, 'name' | 'title' | 'contact' | 'avatarUrl' | 'resumeUrl'>) => Promise<void>;
}

export function EditHeaderForm({ open, setOpen, resumeData, onSave }: EditHeaderFormProps) {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: resumeData.name,
      title: resumeData.title,
      avatarUrl: resumeData.avatarUrl,
      resumeUrl: resumeData.resumeUrl,
      contact: {
        email: resumeData.contact.email,
        phone: resumeData.contact.phone,
        linkedin: resumeData.contact.linkedin ? `https://${resumeData.contact.linkedin}` : '',
        github: resumeData.contact.github ? `https://${resumeData.contact.github}` : '',
        location: resumeData.contact.location,
        website: resumeData.contact.website ? `https://${resumeData.contact.website}` : '',
      },
    },
  });

  // Re-sync when dialog opens and prop has changed
  useEffect(() => {
    if (open) {
      form.reset({
        name: resumeData.name,
        title: resumeData.title,
        avatarUrl: resumeData.avatarUrl,
        resumeUrl: resumeData.resumeUrl,
        contact: {
          email: resumeData.contact.email,
          phone: resumeData.contact.phone,
          linkedin: resumeData.contact.linkedin ? `https://${resumeData.contact.linkedin}` : '',
          github: resumeData.contact.github ? `https://${resumeData.contact.github}` : '',
          location: resumeData.contact.location,
          website: resumeData.contact.website ? `https://${resumeData.contact.website}` : '',
        },
      });
    }
  }, [open, resumeData, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSaving(true);
    const transformedValues = {
      ...values,
      contact: {
        ...values.contact,
        linkedin: values.contact.linkedin?.replace(/^(https?:\/\/)/, '') || '',
        github: values.contact.github?.replace(/^(https?:\/\/)/, '') || '',
        website: values.contact.website?.replace(/^(https?:\/\/)/, '') || '',
      }
    };
    await onSave(transformedValues);
    setIsSaving(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Header</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Title</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
             <FormField control={form.control} name="avatarUrl" render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar Image URL (Optional)</FormLabel>
                <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="resumeUrl" render={({ field }) => (
              <FormItem>
                <FormLabel>Resume URL (Optional)</FormLabel>
                <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="contact.email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl><Input type="email" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="contact.linkedin" render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn URL</FormLabel>
                <FormControl><Input placeholder="https://linkedin.com/in/..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />           
            <FormField control={form.control} name="contact.website" render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl><Input placeholder="https://yourwebsite.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="contact.github" render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub URL</FormLabel>
                <FormControl><Input placeholder="https://github.com/..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="contact.phone" render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl><Input placeholder="+1234567890" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField
              control={form.control}
              name="contact.location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="City, Country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={isSaving}>Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
