'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SpacerBlock } from '@/types';
import { updateDocument } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  height: z.coerce.number().min(1, 'Height must be at least 1px.'),
  className: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SpacerBlockFormProps {
  docPath: string;
  data: SpacerBlock;
  onFinished: () => void;
}

export function SpacerBlockForm({
  docPath,
  data,
  onFinished,
}: SpacerBlockFormProps) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      height: data.height || 64,
      className: data.className || '',
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      await updateDocument(docPath, values);
      toast({ title: 'Success', description: 'Spacer block updated.' });
      onFinished();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not update spacer block.',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height (px)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="className"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Styles</FormLabel>
              <FormControl>
                <Input placeholder="e.g., bg-teal, border-b, w-full" {...field} />
              </FormControl>
              <FormDescription>
                You can use visual effects here too, like <b>bg-blue/20 backdrop-blur-sm border-t</b> or <b>shadow-inner bg-black/5</b>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save changes</Button>
      </form>
    </Form>
  );
}