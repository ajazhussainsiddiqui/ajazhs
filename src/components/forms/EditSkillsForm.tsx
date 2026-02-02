
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import type { ResumeData } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { useEffect } from 'react';

const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Skill name is required.'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert', 'None']).optional(),
});

const formSchema = z.object({
  languages: z.array(skillSchema),
  frameworks: z.array(skillSchema),
  tools: z.array(skillSchema),
});

type FormValues = z.infer<typeof formSchema>;

interface EditSkillsFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  skills: ResumeData['skills'];
  onSave: (data: { skills: ResumeData['skills'] }) => Promise<void>;
}

const SkillCategoryEditor = ({ categoryName, control, form }: { categoryName: keyof FormValues, control: any, form: any }) => {
    const { fields, prepend, remove } = useFieldArray({
      control,
      name: categoryName,
    });
  
    const handleAddNew = () => {
      prepend({ id: `new_${Date.now()}`, name: '', level: 'None' });
    }
  
    return (
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-2">
            <FormField control={form.control} name={`${categoryName}.${index}.name`} render={({ field }) => (
              <FormItem className="flex-grow">
                {index === 0 && <FormLabel>Skill Name</FormLabel>}
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name={`${categoryName}.${index}.level`} render={({ field }) => (
              <FormItem>
                {index === 0 && <FormLabel>Proficiency</FormLabel>}
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive shrink-0" onClick={() => remove(index)}>
              <Trash2 className="size-4" />
              <span className="sr-only">Remove Skill</span>
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={handleAddNew}>
            <PlusCircle className="mr-2 size-4" /> Add Skill
        </Button>
      </div>
    );
  };

export function EditSkillsForm({ open, setOpen, skills, onSave }: EditSkillsFormProps) {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: skills,
  });

  useEffect(() => {
    if (open) {
      form.reset({
        languages: (skills?.languages || []).map(s => ({ ...s, id: s.id || `new_${Date.now()}`, level: s.level || 'None' })),
        frameworks: (skills?.frameworks || []).map(s => ({ ...s, id: s.id || `new_${Date.now()}`, level: s.level || 'None' })),
        tools: (skills?.tools || []).map(s => ({ ...s, id: s.id || `new_${Date.now()}`, level: s.level || 'None' })),
      });
    } else {
      form.reset();
    }
  }, [open, skills, form]);

  async function onSubmit(values: FormValues) {
    setIsSaving(true);
    await onSave({ skills: values });
    setIsSaving(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Skills</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-grow flex flex-col min-h-0">
            <Tabs defaultValue="languages" className="flex-grow flex flex-col min-h-0">
                <TabsList className="bg-muted">
                    <TabsTrigger value="languages">Languages & Libraries</TabsTrigger>
                    <TabsTrigger value="tools">Tools & Technologies</TabsTrigger>
                    <TabsTrigger value="frameworks">Concepts & Others</TabsTrigger>
                </TabsList>
                <div className="flex-grow overflow-y-auto pt-4 pr-2 -mr-2">
                    <TabsContent value="languages"><SkillCategoryEditor categoryName="languages" control={form.control} form={form} /></TabsContent>
                    <TabsContent value="tools"><SkillCategoryEditor categoryName="tools" control={form.control} form={form} /></TabsContent>
                    <TabsContent value="frameworks"><SkillCategoryEditor categoryName="frameworks" control={form.control} form={form} /></TabsContent>
                </div>
            </Tabs>
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
