
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
import type { Publication } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { useEffect } from 'react';

const publicationSchema = z.object({
    id: z.string(),
    title: z.string().optional().or(z.literal('')),
    journal: z.string().optional().or(z.literal('')),
    date: z.string().optional().or(z.literal('')),
    url: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
});

const formSchema = z.object({
    publications: z.array(publicationSchema),
});

interface EditPublicationsFormProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    publications: Publication[];
    onSave: (data: { publications: Publication[] }) => Promise<void>;
}

export function EditPublicationsForm({ open, setOpen, publications, onSave }: EditPublicationsFormProps) {
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { publications },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                publications: publications.map(pub => ({ ...pub, id: pub.id || `new_${Date.now()}` })),
            });
        }
    }, [open, publications, form]);

    const { fields, prepend, remove } = useFieldArray({
        control: form.control,
        name: 'publications',
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSaving(true);
        const transformedValues = {
            publications: values.publications.map(p => ({
                ...p,
                url: p.url || '',
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
            journal: '',
            date: '',
            url: '',
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Publications</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="p-4 border rounded-lg space-y-4 relative bg-card">
                                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => remove(index)}>
                                        <Trash2 className="size-4" />
                                        <span className="sr-only">Remove Publication</span>
                                    </Button>
                                    <FormField control={form.control} name={`publications.${index}.title`} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name={`publications.${index}.journal`} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Journal / Conference</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FormField control={form.control} name={`publications.${index}.date`} render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Date Published</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name={`publications.${index}.url`} render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Publication URL</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button type="button" variant="outline" onClick={handleAddNew}>
                            <PlusCircle className="mr-2" /> Add New Publication
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
