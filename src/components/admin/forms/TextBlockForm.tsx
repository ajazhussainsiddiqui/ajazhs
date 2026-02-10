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
import { Textarea } from '@/components/ui/textarea';
import { TextBlock } from '@/types';
import { updateDocument } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  className: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TextBlockFormProps {
  docPath: string;
  data: TextBlock;
  onFinished: () => void;
}

export function TextBlockForm({ docPath, data, onFinished }: TextBlockFormProps) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: data.content,
      className: data.className || '',
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      await updateDocument(docPath, values);
      toast({ title: 'Success', description: 'Text block updated.' });
      onFinished();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not update text block.',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content (Markdown supported)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter markdown content..."
                  className="min-h-[200px]"
                  {...field}
                />
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
              <FormLabel>Custom Styles & Effects</FormLabel>
              <FormControl>
                <Input placeholder="e.g., bg-card/50 backdrop-blur-md p-6 rounded-xl border shadow-lg" {...field} />
              </FormControl>
              <FormDescription>
                Try these modern styles:<br/>
                • <b>Glass Card:</b> bg-card/40 backdrop-blur-lg border shadow-xl p-8 rounded-2xl<br/>
                • <b>Purple Gradient:</b> bg-gradient-to-br from-purple/20 to-blue/20 border-purple/30 p-6 rounded-xl shadow-lg<br/>
                • <b>Teal Glow:</b> bg-teal/10 border-teal/30 border shadow-[0_0_25px_rgba(20,184,166,0.3)] p-6 rounded-xl<br/>
                • <b>Interactive:</b> bg-muted/50 hover:bg-muted hover:scale-[1.02] transition-all duration-300 p-6 rounded-lg cursor-pointer
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