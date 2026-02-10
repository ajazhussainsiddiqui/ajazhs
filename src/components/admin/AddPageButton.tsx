'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/hooks/useAdmin';
import { addPage } from '@/lib/db';
import { FilePlus } from 'lucide-react';

export function AddPageButton() {
  const { isAdmin } = useAdmin();
  const { toast } = useToast();

  const handleAddPage = async () => {
    try {
      await addPage();
      toast({
        title: 'Page Section Created',
        description: `A new section has been added to your page.`,
      });
    } catch (error) {
      console.error("Error adding page:", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not create new page section.',
      });
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Button variant="outline" onClick={handleAddPage}>
      <FilePlus className="h-4 w-4" />
    </Button>
  );
}
