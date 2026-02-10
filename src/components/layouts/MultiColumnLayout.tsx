'use client';
import { ContentBlock } from '../content/ContentBlock';
import type { ContentBlock as ContentBlockType, PageContent } from '@/types';
import { useMemo, Fragment } from 'react';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { useAdmin } from '@/hooks/useAdmin';
import { updateDocument } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';

interface MultiColumnLayoutProps {
  page: PageContent;
  blocks: ContentBlockType[];
}

export function MultiColumnLayout({ page, blocks }: MultiColumnLayoutProps) {
  const { isAdmin } = useAdmin();
  const { toast } = useToast();

  const columnCount = useMemo(() => {
    switch (page.layout) {
      case 'two-column': return 2;
      case 'three-column': return 3;
      case 'four-column': return 4;
      case 'five-column': return 5;
      case 'six-column': return 6;
      default: return 1;
    }
  }, [page.layout]);

  const columns = useMemo(() => {
    const cols: ContentBlockType[][] = Array.from({ length: columnCount }, () => []);
    blocks.forEach((block) => {
      const colIndex = (block.column || 1) - 1;
      const safeIndex = Math.min(Math.max(colIndex, 0), columnCount - 1);
      cols[safeIndex].push(block);
    });
    return cols;
  }, [blocks, columnCount]);

  const handleLayoutChange = (sizes: number[]) => {
    if (!isAdmin) return;
    updateDocument(`pages/${page.id}`, { columnLayout: sizes })
      .catch((error) => {
        console.error('Failed to save layout:', error);
        toast({
          variant: 'destructive',
          title: 'Error Saving Layout',
          description: 'Could not save new column sizes.',
        });
      });
  };

  const savedLayout = page.columnLayout;
  const defaultLayout = useMemo(() => {
    if (savedLayout && savedLayout.length === columnCount) {
      return savedLayout;
    }
    return Array(columnCount).fill(100 / columnCount);
  }, [savedLayout, columnCount]);

  if (!isAdmin) {
    return (
      <div className="flex flex-col lg:flex-row w-full">
        {columns.map((colBlocks, idx) => (
          <div key={idx} style={{ flexBasis: `${defaultLayout[idx]}%`, flexGrow: 1 }}>
            {colBlocks.map((block) => (
              <ContentBlock
                key={block.id}
                block={block}
                pageId={page.id}
                allBlocks={colBlocks}
                pageBlocks={blocks}
                layout={page.layout}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <ResizablePanelGroup 
      direction="horizontal" 
      className="w-full"
      onLayout={handleLayoutChange}
    >
      {columns.map((colBlocks, idx) => (
        <Fragment key={idx}>
          <ResizablePanel defaultSize={defaultLayout[idx]}>
            {colBlocks.map((block) => (
              <ContentBlock
                key={block.id}
                block={block}
                pageId={page.id}
                allBlocks={colBlocks}
                pageBlocks={blocks}
                layout={page.layout}
              />
            ))}
          </ResizablePanel>
          {idx < columnCount - 1 && <ResizableHandle withHandle />}
        </Fragment>
      ))}
    </ResizablePanelGroup>
  );
}
