'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageContent } from '@/types';
import { getDb, updateDocument } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { collection, doc, getDocs, writeBatch } from 'firebase/firestore';

const formSchema = z.object({
  title: z.string(),
  layout: z.enum(['single', 'two-column', 'three-column', 'four-column', 'five-column', 'six-column', 'grid', 'masonry']),
});

type FormValues = z.infer<typeof formSchema>;

interface PageFormProps {
  docPath: string;
  data: PageContent;
  onFinished: () => void;
}

export function PageForm({ docPath, data, onFinished }: PageFormProps) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data.title || '',
      layout: data.layout,
    },
  });

  async function onSubmit(values: FormValues) {
    const multiColumnLayouts = [
      'two-column',
      'three-column',
      'four-column',
      'five-column',
      'six-column'
    ];

    const wasSingleOrGrid = data.layout === 'single' || data.layout === 'grid';
    const isMultiColumn = multiColumnLayouts.includes(values.layout);
    
    const needsColumnUpdate = wasSingleOrGrid && isMultiColumn;

    try {
      if (needsColumnUpdate) {
        const db = await getDb();
        const pageRef = doc(db, docPath);
        const blocksRef = collection(db, `${docPath}/blocks`);
        const blocksSnapshot = await getDocs(blocksRef);
        const batch = writeBatch(db);

        blocksSnapshot.forEach((blockDoc) => {
          const blockData = blockDoc.data();
          if (blockData.column === undefined) {
            batch.update(blockDoc.ref, { column: 1 });
          }
        });

        batch.update(pageRef, values);
        await batch.commit();
      } else {
        await updateDocument(docPath, values);
      }
      toast({ title: 'Success', description: 'Page updated.' });
      onFinished();
    } catch (error) {
      console.error("Error updating page:", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not update page.',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter page title..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="layout"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Layout</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a layout" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="single">Single Column</SelectItem>
                  <SelectItem value="two-column">Two Column</SelectItem>
                  <SelectItem value="three-column">Three Column</SelectItem>
                  <SelectItem value="four-column">Four Column</SelectItem>
                  <SelectItem value="five-column">Five Column</SelectItem>
                  <SelectItem value="six-column">Six Column</SelectItem>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="masonry">Masonry</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save changes</Button>
      </form>
    </Form>
  );
}
