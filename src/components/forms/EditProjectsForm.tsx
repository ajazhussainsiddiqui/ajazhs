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
import type { Project } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { useEffect } from 'react';

const projectSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Project name is required.').optional().or(z.literal('')),
    description: z.string().min(1, 'Description is required.').optional().or(z.literal('')),
    url: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
    githubUrl: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
    imageUrl: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
});

const formSchema = z.object({
    projects: z.array(projectSchema),
});

interface EditProjectsFormProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    projects: Project[];
    onSave: (data: { projects: Project[] }) => Promise<void>;
}

export function EditProjectsForm({ open, setOpen, projects, onSave }: EditProjectsFormProps) {
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            projects: projects.map(proj => ({
                ...proj,
                description: (proj.description ?? []).join('\n')
            })),
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                projects: projects.map(proj => ({
                    ...proj,
                    id: proj.id || `new_${Date.now()}`,
                    description: Array.isArray(proj.description) ? proj.description.join('\n') : proj.description
                })),
            });
        }
    }, [open, projects, form]);

    const { fields, prepend, remove } = useFieldArray({
        control: form.control,
        name: 'projects',
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSaving(true);
        const transformedValues = {
            projects: values.projects.map(proj => ({
                ...proj,
                description: proj.description ? proj.description.split('\n').filter(line => line.trim() !== '') : [],
                url: proj.url || '',
                githubUrl: proj.githubUrl || '',
                imageUrl: proj.imageUrl || '',
            })),
        };
        await onSave(transformedValues);
        setIsSaving(false);
        setOpen(false);
    }

    const handleAddNew = () => {
        prepend({
            id: `new_${Date.now()}`,
            name: '',
            description: '',
            url: '',
            githubUrl: '',
            imageUrl: '',
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Projects</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="p-4 border rounded-lg space-y-4 relative bg-card">
                                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => remove(index)}>
                                        <Trash2 className="size-4" />
                                        <span className="sr-only">Remove Project</span>
                                    </Button>
                                    <FormField control={form.control} name={`projects.${index}.name`} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Project Name</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name={`projects.${index}.description`} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description (one point per line)</FormLabel>
                                            <FormControl><Textarea {...field} rows={4} placeholder="Enter each bullet point on a new line" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FormField control={form.control} name={`projects.${index}.url`} render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Project URL (Optional)</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />

                                        <FormField
                                            control={form.control}
                                            name={`projects.${index}.githubUrl`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>GitHub URL (Optional)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="github.com/username/project" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField control={form.control} name={`projects.${index}.imageUrl`} render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Image URL (Optional)</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button type="button" variant="outline" onClick={handleAddNew}>
                            <PlusCircle className="mr-2" /> Add New Project
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