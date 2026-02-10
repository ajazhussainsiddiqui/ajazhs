'use client';

import { useCollection, useMemoFirebase } from '@/hooks/use-firestore';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { PageContent } from '@/types';
import { PageComponent } from '@/components/page/PageComponent';
import { sortPages } from '@/lib/utils';
import pageData from '@/lib/initial-data.json';
import dynamic from 'next/dynamic';

// Dynamically import the AdminMessages component so it's not in the main visitor bundle
const AdminMessages = dynamic(() => import('@/components/admin/AdminMessages').then(mod => mod.AdminMessages), { 
  ssr: false 
});

export default function Home() {
  const firestore = useFirestore();

  const pagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'pages'), orderBy('order', 'asc'));
  }, [firestore]);

  const { data: pages, loading: pagesLoading } = useCollection<PageContent>(pagesQuery);

  // Use initial data for instant pre-rendering on the server/first-paint
  const initialPages = sortPages(pageData.pages.map(p => ({ ...p, createdAt: undefined } as any)));
  
  // If we have live data, use it; otherwise use the static shell data
  const sortedPages = pages && pages.length > 0 ? sortPages(pages) : initialPages;

  return (
    <div className="flex flex-col space-y-0 py-0">
      {sortedPages.map((page) => (
        <PageComponent key={page.id} page={page} allPages={sortedPages} />
      ))}
      <AdminMessages />
    </div>
  );
}