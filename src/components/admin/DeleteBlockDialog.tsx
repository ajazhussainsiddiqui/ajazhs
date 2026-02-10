'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { deleteDocument, deletePage } from '@/lib/db';

interface DeleteBlockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  docPath: string;
  label: string;
}

export function DeleteBlockDialog({
  open,
  onOpenChange,
  docPath,
  label,
}: DeleteBlockDialogProps) {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const pathParts = docPath.split('/');
      if (pathParts.length === 2 && pathParts[0] === 'pages') {
        // It's a page, which is a section on our main page
        await deletePage(pathParts[1]);
        toast({ title: 'Success', description: `Page section "${label}" has been deleted.` });
      } else {
        // It's a content block
        await deleteDocument(docPath);
        toast({ title: 'Success', description: `Block "${label}" has been deleted.` });
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Could not delete ${label}.`,
      });
    }
  };
  
  const isPage = docPath.split('/').length === 2;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the {isPage ? 'page section' : 'block'}
            "{label}" {isPage ? 'and all of its content.' : ''}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
