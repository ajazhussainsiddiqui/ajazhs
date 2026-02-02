
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useState, useEffect, useRef } from 'react';
import { Loader2, GripVertical } from 'lucide-react';
import type { SectionKey } from '@/lib/types';

const SECTIONS: { id: SectionKey, label: string }[] = [
  { id: 'summary', label: 'Summary' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'publications', label: 'Publications' },
  { id: 'skills', label: 'Skills' },
];

const formSchema = z.object({
  hiddenSections: z.array(z.string()),
  sectionOrder: z.array(z.string()),
});

interface ManageSectionsFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  hiddenSections: SectionKey[];
  sectionOrder: SectionKey[];
  onSave: (data: { hiddenSections: SectionKey[], sectionOrder: SectionKey[] }) => Promise<void>;
}

export function ManageSectionsForm({ open, setOpen, hiddenSections, sectionOrder, onSave }: ManageSectionsFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [orderedSections, setOrderedSections] = useState<typeof SECTIONS>([]);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hiddenSections: [],
      sectionOrder: [],
    },
  });

  useEffect(() => {
    if (open) {
      const savedOrder = sectionOrder && sectionOrder.length > 0 ? sectionOrder : SECTIONS.map(s => s.id);
      const ordered = savedOrder.map(id => SECTIONS.find(s => s.id === id)).filter(Boolean) as typeof SECTIONS;
      const remaining = SECTIONS.filter(s => !savedOrder.includes(s.id));
      const newOrderedSections = [...ordered, ...remaining];

      setOrderedSections(newOrderedSections);
      form.reset({
        hiddenSections: hiddenSections || [],
        sectionOrder: newOrderedSections.map(s => s.id),
      });
    }
  }, [open, hiddenSections, sectionOrder, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSaving(true);
    await onSave({
      hiddenSections: values.hiddenSections as SectionKey[],
      sectionOrder: orderedSections.map(s => s.id) as SectionKey[],
    });
    setIsSaving(false);
    setOpen(false);
  }

  const handleDragSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const newOrderedSections = [...orderedSections];
    const draggedItemContent = newOrderedSections.splice(dragItem.current, 1)[0];
    newOrderedSections.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setOrderedSections(newOrderedSections);
    form.setValue('sectionOrder', newOrderedSections.map(s => s.id));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Customize Sections</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Drag sections to reorder them. Uncheck a section to hide it.
              </p>
              <div className='space-y-2'>
                {orderedSections.map((item, index) => (
                  <div
                    key={item.id}
                    className='flex items-center justify-between p-2 border rounded-md cursor-grab'
                    draggable
                    onDragStart={() => (dragItem.current = index)}
                    onDragEnter={() => (dragOverItem.current = index)}
                    onDragEnd={handleDragSort}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <div className="flex items-center space-x-2">
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                      <FormLabel className="font-normal text-sm">{item.label}</FormLabel>
                    </div>
                    <FormField
                      control={form.control}
                      name="hiddenSections"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Checkbox
                              checked={!field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                const currentValues = field.value || [];
                                field.onChange(
                                  checked
                                    ? currentValues.filter((value) => value !== item.id)
                                    : [...currentValues, item.id]
                                );
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={isSaving}>Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
