'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ContentBlock, PageContent } from '@/types';
import { TextBlockForm } from './forms/TextBlockForm';
import { SpacerBlockForm } from './forms/SpacerBlockForm';
import { PageForm } from './forms/PageForm';

interface EditBlockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  docPath: string;
  data: ContentBlock | PageContent;
}

function isContentBlock(
  data: ContentBlock | PageContent
): data is ContentBlock {
  return 'type' in data;
}

export function EditBlockDialog({
  open,
  onOpenChange,
  docPath,
  data,
}: EditBlockDialogProps) {
  const isBlock = isContentBlock(data);

  const renderForm = () => {
    if (!isBlock) {
      return (
        <PageForm
          docPath={docPath}
          data={data as PageContent}
          onFinished={() => onOpenChange(false)}
        />
      );
    }

    switch (data.type) {
      case 'text':
        return (
          <TextBlockForm
            docPath={docPath}
            data={data}
            onFinished={() => onOpenChange(false)}
          />
        );
      case 'spacer':
        return (
          <SpacerBlockForm
            docPath={docPath}
            data={data}
            onFinished={() => onOpenChange(false)}
          />
        );
      default:
        return <p>Unknown block type</p>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isBlock ? 'Edit Block' : 'Edit Page'}</DialogTitle>
        </DialogHeader>
        {renderForm()}
      </DialogContent>
    </Dialog>
  );
}
