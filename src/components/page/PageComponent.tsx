
'use client';

import { SingleColumnLayout } from '@/components/layouts/SingleColumnLayout';
import { MultiColumnLayout } from '@/components/layouts/MultiColumnLayout';
import { GridLayout } from '@/components/layouts/GridLayout';
import { MasonryLayout } from '@/components/layouts/MasonryLayout';
import type { ContentBlock, PageContent } from '@/types';
import { useCollection, useMemoFirebase } from '@/hooks/use-firestore';
import { useAdmin } from '@/hooks/useAdmin';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

// Heavy admin controls are dynamically loaded only when needed
const AdminControls = dynamic(() => import('@/components/admin/AdminControls').then(mod => mod.AdminControls), {
  ssr: false
});

interface PageComponentProps {
  page: PageContent;
  allPages: PageContent[];
  isHeader?: boolean;
}

export function PageComponent({ page, allPages, isHeader }: PageComponentProps) {
  const { isAdmin } = useAdmin();
  const firestore = useFirestore();

  const blocksQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, `pages/${page.id}/blocks`),
      orderBy('order')
    );
  }, [firestore, page.id]);

  const { data: blocks, loading: blocksLoading } =
    useCollection<ContentBlock>(blocksQuery);

  const renderLayout = () => {
    if (!page || !blocks) return null;

    if (blocks.length === 0) {
      if (isAdmin && !isHeader) {
        return (
          <div className="text-center py-10">
            <h3 className="text-lg font-semibold mb-2">
              This page section is empty.
            </h3>
            <p className="text-muted-foreground mb-4">
              Use the '+' icon in the controls above to add a block.
            </p>
          </div>
        );
      }
      return null;
    }

    const multiColumnLayouts = [
      'two-column',
      'three-column',
      'four-column',
      'five-column',
      'six-column'
    ];

    if (multiColumnLayouts.includes(page.layout)) {
      return (
        <MultiColumnLayout
          page={page}
          blocks={blocks}
        />
      );
    }

    switch (page.layout) {
      case 'single':
        return (
          <SingleColumnLayout
            pageId={page.id}
            blocks={blocks}
            layout={page.layout}
          />
        );
      case 'grid':
        return <GridLayout pageId={page.id} blocks={blocks} layout={page.layout} />;
      case 'masonry':
        return (
          <MasonryLayout pageId={page.id} blocks={blocks} layout={page.layout} />
        );
      default:
        return <p>Unknown layout</p>;
    }
  };

  if (blocksLoading && !blocks) {
    if (isHeader) return null;
    return (
      <section>
        <div className="container mx-auto px-4 py-0">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="h-10 bg-muted rounded-md w-1/2 animate-pulse mb-8" />
            <div className="h-40 bg-muted rounded-md w-full animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (isHeader) {
    return (
      <div className="relative group">
        {isAdmin && (
          <AdminControls
            scope="page"
            label="Header Extra"
            docPath={`pages/${page.id}`}
            data={page}
            allPages={[]}
          />
        )}
        <div className={cn(
          isAdmin && "ring-1 ring-dashed ring-accent ring-offset-2",
          "flex items-center",
          "[&_.prose]:prose-sm [&_p]:m-0 [&_h1]:m-0 [&_h2]:m-0 [&_h3]:m-0",
          "[&_div]:max-w-none [&_div]:mx-0"
        )}>
          {renderLayout()}
        </div>
      </div>
    );
  }

  return (
    <section className="relative scroll-mt-20" id={page.id}>
      {isAdmin && (
        <AdminControls
          scope="page"
          label={page.title || 'Untitled Section'}
          docPath={`pages/${page.id}`}
          data={page}
          allPages={allPages}
        />
      )}
      <div className={cn("container mx-auto px-4 py-0", isAdmin && "border-2 border-dashed border-accent")}>
        {renderLayout()}
      </div>
    </section>
  );
}
