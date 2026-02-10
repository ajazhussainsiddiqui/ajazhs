
'use client';
import type { ContentBlock as ContentBlockType, PageLayout } from '@/types';
import { TextBlock } from './TextBlock';
import { SpacerBlock } from './SpacerBlock';
import { useAdmin } from '@/hooks/useAdmin';
import dynamic from 'next/dynamic';

const AdminControls = dynamic(() => import('@/components/admin/AdminControls').then(mod => mod.AdminControls), {
  ssr: false
});

interface ContentBlockProps {
  block: ContentBlockType;
  pageId: string;
  allBlocks: ContentBlockType[];
  pageBlocks: ContentBlockType[];
  layout: PageLayout;
}

export function ContentBlock({
  block,
  pageId,
  allBlocks,
  pageBlocks,
  layout,
}: ContentBlockProps) {
  const { isAdmin } = useAdmin();

  const renderBlock = () => {
    switch (block.type) {
      case 'text':
        return <TextBlock content={block.content} className={block.className} />;
      case 'spacer':
        return <SpacerBlock height={block.height} className={block.className} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {isAdmin && (
        <AdminControls
          scope="block"
          label={`Block: ${block.type}`}
          docPath={`pages/${pageId}/blocks/${block.id}`}
          data={block}
          pageId={pageId}
          allBlocks={allBlocks}
          pageBlocks={pageBlocks}
          pageLayout={layout}
        />
      )}
      {renderBlock()}
    </div>
  );
}
