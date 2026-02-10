
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, Plus } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useCollection, useDoc, useMemoFirebase } from '@/hooks/use-firestore';
import { useState } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { PageContent } from '@/types';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ContactButton } from '../contact/ContactButton';
import { LoginButton } from '../auth/LoginButton';
import { useAdmin } from '@/hooks/useAdmin';
import { PageComponent } from '../page/PageComponent';
import { ensureHeaderPage } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { sortPages } from '@/lib/utils';
import dynamic from 'next/dynamic';

const AddPageButton = dynamic(() => import('../admin/AddPageButton').then(mod => mod.AddPageButton), {
  ssr: false
});

export function Header() {
  const firestore = useFirestore();
  const [open, setOpen] = useState(false);
  const { isAdmin } = useAdmin();
  const { toast } = useToast();

  const pagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'pages'), orderBy('order', 'asc'));
  }, [firestore]);

  const { data: pages } = useCollection<PageContent>(pagesQuery);
  const { data: headerPage, loading: headerLoading } = useDoc<PageContent>('pages/header');

  const sortedPages = sortPages(pages);

  const handleLinkClick = () => {
    setOpen(false);
  };

  const handleInitHeader = async () => {
    try {
      await ensureHeaderPage();
      toast({
        title: 'Header Section Created',
        description: 'You can now add blocks to your header.',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not initialize header section.',
      });
    }
  };
  
  const navLinks = sortedPages
    .filter((page) => page.title)
    .map((page) => (
      <Button asChild variant="ghost" key={page.id} onClick={handleLinkClick}>
        <Link href={`/#${page.id}`}>{page.title}</Link>
      </Button>
    ));
  
  return (
    <header className="py-2 px-4 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-50 transition-colors">
      <div className="container mx-auto flex justify-between items-center">        
      {headerPage ? (
              <div className="mr-2">
                <PageComponent page={headerPage} allPages={[]} isHeader />
              </div>
            ) : (
              isAdmin && !headerLoading && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleInitHeader}
                  className="h-8 w-8 rounded-full border border-dashed border-accent hover:bg-accent/20"
                  title="Initialize Header Content"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )
            )}
        <ContactButton /> 
        <div className="flex items-center gap-2 md:gap-4">
          <nav className="hidden md:flex items-center gap-2">
            {navLinks}
          </nav>
          <div className="flex items-center gap-1 md:gap-2 border-l pl-2 md:pl-4">
            <ThemeToggle />
            {isAdmin && <AddPageButton />}
            {isAdmin && <LoginButton />}
          </div>
          <div className="md:hidden">
             <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <SheetHeader>
                        <SheetTitle className="sr-only">Navigation</SheetTitle>
                        <SheetDescription className="sr-only">A list of page sections to navigate to.</SheetDescription>
                    </SheetHeader>
                    <nav className="flex flex-col gap-4 pt-8">
                      {navLinks}
                      <ContactButton />
                    </nav>
                </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
