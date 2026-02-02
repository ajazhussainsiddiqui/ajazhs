
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useState } from 'react';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import type { Education } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { useEffect } from 'react';

const educationSchema = z.object({
  id: z.string(),
  institution: z.string().optional().or(z.literal('')),
  degree: z.string().optional().or(z.literal('')),
  fieldOfStudy: z.string().optional().or(z.literal('')),
  startDate: z.string().optional().or(z.literal('')),
  endDate: z.string().optional().or(z.literal('')),
});

const formSchema = z.object({
  education: z.array(educationSchema),
});

interface EditEducationFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  education: Education[];
  onSave: (data: { education: Education[] }) => Promise<void>;
}

export function EditEducationForm({ open, setOpen, education, onSave }: EditEducationFormProps) {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { education },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        education: education.map(edu => ({ ...edu, id: edu.id || `new_${Date.now()}` })),
      });
    }
  }, [open, education, form]);

  const { fields, prepend, remove } = useFieldArray({
    control: form.control,
    name: 'education',
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSaving(true);
    await onSave(values);
    setIsSaving(false);
    setOpen(false);
  }

  const handleAddNew = () => {
    prepend({
      id: `new_${Date.now()}`,
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: ''
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Education</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4 relative bg-card">
                  <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => remove(index)}>
                    <Trash2 className="size-4" />
                    <span className="sr-only">Remove Education</span>
                  </Button>
                  <FormField control={form.control} name={`education.${index}.institution`} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution (Optional)</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name={`education.${index}.degree`} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Degree (Optional)</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`education.${index}.fieldOfStudy`} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field of Study (Optional)</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name={`education.${index}.startDate`} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date (Optional)</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`education.${index}.endDate`} render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date (Optional)</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" onClick={handleAddNew}>
              <PlusCircle className="mr-2" /> Add New Education
            </Button>
            <Separator />
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
