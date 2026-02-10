'use client';

import { Button } from '@/components/ui/button';
import {
  ArrowDown,
  ArrowUp,
  Edit,
  PlusCircle,
  Trash2,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { EditBlockDialog } from './EditBlockDialog';
import { ContentBlock, PageContent, PageLayout } from '@/types';
import { useState, useMemo } from 'react';
import { DeleteBlockDialog } from './DeleteBlockDialog';
import { addBlock, swapBlockOrder, swapPageOrder, updateDocument } from '@/lib/db';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

type AdminControlsProps = {
  scope: 'page' | 'block';
  label: string;
  docPath: string;
  data: ContentBlock | PageContent;
  pageId?: string;
  allBlocks?: ContentBlock[];
  pageBlocks?: ContentBlock[];
  pageLayout?: PageLayout;
  allPages?: PageContent[];
};

export function AdminControls({
  scope,
  label,
  docPath,
  data,
  pageId,
  allBlocks,
  pageBlocks,
  pageLayout,
  allPages,
}: AdminControlsProps) {
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Hook must be called at the top level before any conditional returns
  const maxColumns = useMemo(() => {
    switch (pageLayout) {
      case 'two-column': return 2;
      case 'three-column': return 3;
      case 'four-column': return 4;
      case 'five-column': return 5;
      case 'six-column': return 6;
      default: return 1;
    }
  }, [pageLayout]);

  if (!isAdmin) return null;

  const handleAddBlock = async (type: 'text' | 'spacer') => {
    if (scope === 'page' && 'id' in data) {
      const page = data as PageContent;
      const multiColumnLayouts = ['two-column', 'three-column', 'four-column', 'five-column', 'six-column'];
      const column = multiColumnLayouts.includes(page.layout) ? 1 : undefined;

      let blockData: Partial<ContentBlock>;
      if (type === 'text') {
        blockData = { type: 'text', content: 'New text block' };
      } else {
        blockData = { type: 'spacer', height: 64 };
      }
      await addBlock(page.id, blockData, column);
    }
  };

  const handleBlockMove = async (direction: 'up' | 'down') => {
    if (scope !== 'block' || !allBlocks || !pageId) return;

    const currentBlock = data as ContentBlock;
    const currentIndex = allBlocks.findIndex((b) => b.id === currentBlock.id);

    if (currentIndex === -1) return;

    let swapIndex = -1;
    if (direction === 'up' && currentIndex > 0) {
      swapIndex = currentIndex - 1;
    } else if (
      direction === 'down' &&
      currentIndex < allBlocks.length - 1
    ) {
      swapIndex = currentIndex + 1;
    }

    if (swapIndex !== -1) {
      const blockToSwapWith = allBlocks[swapIndex];
      try {
        await swapBlockOrder(pageId, currentBlock, blockToSwapWith);
        toast({
          title: 'Block moved',
          description: 'The block position has been updated.',
        });
      } catch (error) {
        console.error('Error moving block:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not move the block.',
        });
      }
    }
  };
  
  const handlePageMove = async (direction: 'up' | 'down') => {
    if (scope !== 'page' || !allPages) return;

    const currentPage = data as PageContent;
    const currentIndex = allPages.findIndex((p) => p.id === currentPage.id);

    if (currentIndex === -1) return;

    let swapIndex = -1;
    if (direction === 'up' && currentIndex > 0) {
      swapIndex = currentIndex - 1;
    } else if (direction === 'down' && currentIndex < allPages.length - 1) {
      swapIndex = currentIndex + 1;
    }

    if (swapIndex !== -1) {
      const pageToSwapWith = allPages[swapIndex];
      try {
        await swapPageOrder(currentPage, pageToSwapWith);
        toast({
          title: 'Section moved',
          description: 'The page section position has been updated.',
        });
      } catch (error) {
        console.error('Error moving section:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not move the page section.',
        });
      }
    }
  };

  const handleMoveColumn = async (direction: 'left' | 'right') => {
    const currentBlock = data as ContentBlock;
    if (!pageId || currentBlock.column === undefined || !pageBlocks) return;

    const newColumn =
      direction === 'left' ? currentBlock.column - 1 : currentBlock.column + 1;

    // Place block at the end of the page order when changing columns
    const maxOrder = pageBlocks.reduce(
      (max, b) => (b.order > max ? b.order : max),
      0
    );

    try {
      await updateDocument(`pages/${pageId}/blocks/${currentBlock.id}`, {
        column: newColumn,
        order: maxOrder + 1,
      });
      toast({
        title: 'Block moved',
        description: 'The block has been moved to another column.',
      });
    } catch (error) {
      console.error('Error moving block column:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not move the block to another column.',
      });
    }
  };

  const currentBlockIndex =
    scope === 'block' && allBlocks
      ? allBlocks.findIndex((b) => b.id === (data as ContentBlock).id)
      : -1;
  const isFirstBlock = currentBlockIndex === 0;
  const isLastBlock = allBlocks ? currentBlockIndex === allBlocks.length - 1 : true;
  
  const currentPageIndex =
    scope === 'page' && allPages
      ? allPages.findIndex((p) => p.id === (data as PageContent).id)
      : -1;
  const isFirstPage = currentPageIndex === 0;
  const isLastPage = allPages ? currentPageIndex === allPages.length - 1 : true;


  const currentBlock = data as ContentBlock;
  const multiColumnLayouts = ['two-column', 'three-column', 'four-column', 'five-column', 'six-column'];
  const isMultiColumn = multiColumnLayouts.includes(pageLayout || '');
  
  const canMoveLeft =
    isMultiColumn &&
    currentBlock.column !== undefined &&
    currentBlock.column > 1;

  const canMoveRight =
    isMultiColumn &&
    currentBlock.column !== undefined &&
    currentBlock.column < maxColumns;

  return (
    <>
      <div className="absolute top-0 right-0 z-10 m-2 flex items-center gap-1 rounded-full border bg-background/80 p-1 shadow-md backdrop-blur-sm">
        {scope === 'page' && allPages && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => handlePageMove('up')}
              disabled={isFirstPage}
              title="Move section up"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => handlePageMove('down')}
              disabled={isLastPage}
              title="Move section down"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </>
        )}
        
        {scope === 'page' && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <PlusCircle className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleAddBlock('text')}>
                Add Text Block
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddBlock('spacer')}>
                Add Spacer Block
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {scope === 'block' && allBlocks && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleBlockMove('up')}
              disabled={isFirstBlock}
              title="Move block up"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleBlockMove('down')}
              disabled={isLastBlock}
              title="Move block down"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
            {isMultiColumn && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleMoveColumn('left')}
                  disabled={!canMoveLeft}
                  title="Move block left"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleMoveColumn('right')}
                  disabled={!canMoveRight}
                  title="Move block right"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setIsEditDialogOpen(true)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          className="h-7 w-7"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <EditBlockDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        docPath={docPath}
        data={data}
      />

      <DeleteBlockDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        docPath={docPath}
        label={label}
      />
    </>
  );
}
