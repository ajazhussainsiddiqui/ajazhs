import { ContentBlock } from '../content/ContentBlock';
import type { ContentBlock as ContentBlockType, PageLayout } from '@/types';

interface MasonryLayoutProps {
  pageId: string;
  blocks: ContentBlockType[];
  layout: PageLayout;
}

export function MasonryLayout({ pageId, blocks, layout }: MasonryLayoutProps) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3">
      {blocks?.map((block) => (
        <div key={block.id} className="w-full h-full break-inside-avoid">
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
