import { ContentBlock } from '../content/ContentBlock';
import type { ContentBlock as ContentBlockType, PageLayout } from '@/types';

interface SingleColumnLayoutProps {
  pageId: string;
  blocks: ContentBlockType[];
  layout: PageLayout;
}

export function SingleColumnLayout({
  pageId,
  blocks,
  layout,
}: SingleColumnLayoutProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {blocks?.map((block) => (
        <ContentBlock
          key={block.id}
          block={block}
          pageId={pageId}
          allBlocks={blocks}
          pageBlocks={blocks}
          layout={layout}
        />
      ))}
    </div>
  );
}
