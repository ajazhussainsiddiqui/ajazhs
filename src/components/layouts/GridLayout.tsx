import { ContentBlock } from '../content/ContentBlock';
import type { ContentBlock as ContentBlockType, PageLayout } from '@/types';

interface GridLayoutProps {
  pageId: string;
  blocks: ContentBlockType[];
  layout: PageLayout;
}

export function GridLayout({ pageId, blocks, layout }: GridLayoutProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {blocks?.map((block) => (
        <div key={block.id} className="w-full h-full">
          <ContentBlock
            block={block}
            pageId={pageId}
            allBlocks={blocks}
            pageBlocks={blocks}
            layout={layout}
          />
        </div>
      ))}
    </div>
  );
}
