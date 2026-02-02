
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useState } from 'react';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import type { Experience } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { useEffect } from 'react';

const experienceSchema = z.object({
  id: z.string(),
  title: z.string().optional().or(z.literal('')),
  company: z.string().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  startDate: z.string().optional().or(z.literal('')),
  endDate: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
});

const formSchema = z.object({
  experience: z.array(experienceSchema),
});

interface EditExperienceFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  experience: Experience[];
  onSave: (data: { experience: Experience[] }) => Promise<void>;
}

export function EditExperienceForm({ open, setOpen, experience, onSave }: EditExperienceFormProps) {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      experience: experience.map(exp => ({ ...exp, description: (exp.description || []).join('\n') })),
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        experience: experience.map(exp => ({ ...exp, description: (exp.description || []).join('\n') })),
      });
    }
  }, [open, experience, form]);

  const { fields, prepend, remove } = useFieldArray({
    control: form.control,
    name: 'experience',
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSaving(true);
    const transformedValues = {
      experience: values.experience.map(exp => ({
        ...exp,
        description: exp.description ? exp.description.split('\n').filter(line => line.trim() !== '') : [],
      })),
    };
    await onSave(transformedValues);
    setIsSaving(false);
    setOpen(false);
  }

  const handleAddNew = () => {
    prepend({
      id: `new_${Date.now()}`,
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Experience</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4 relative bg-card">
                  <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => remove(index)}>
                    <Trash2 className="size-4" />
                    <span className="sr-only">Remove Experience</span>
                  </Button>
                  <FormField control={form.control} name={`experience.${index}.title`} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (Optional)</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`experience.${index}.company`} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company (Optional)</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField control={form.control} name={`experience.${index}.location`} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location (Optional)</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`experience.${index}.startDate`} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date (Optional)</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`experience.${index}.endDate`} render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date (Optional)</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name={`experience.${index}.description`} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional, one point per line)</FormLabel>
                      <FormControl><Textarea {...field} rows={4} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" onClick={handleAddNew}>
              <PlusCircle className="mr-2" /> Add New Experience
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
