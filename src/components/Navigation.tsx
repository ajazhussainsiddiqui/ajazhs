'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/button';
import { LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

import { Contact } from './Contact';

interface NavigationProps {
  sectionOrder: string[];
  hiddenSections: string[];
  resumeUrl?: string;
}

export function Navigation({ sectionOrder, hiddenSections, resumeUrl }: NavigationProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
        toast({ title: 'Success', description: 'You have been logged out.' });
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to log out.' });
    }
  };

  const navItems = [
    { id: 'summary', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'education', label: 'Education' },
    { id: 'certificates', label: 'Certifications' },
    { id: 'publications', label: 'Publications' },
  ];

  const visibleNavItems = navItems.filter(
    (item) => sectionOrder.includes(item.id) && !hiddenSections.includes(item.id)
  );

  // Sort based on sectionOrder
  visibleNavItems.sort((a, b) => sectionOrder.indexOf(a.id) - sectionOrder.indexOf(b.id));


  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Height of header + some padding
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent bg-background/80 backdrop-blur-md",
      isScrolled && "border-border shadow-sm py-2",
      !isScrolled && "py-4"
    )}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div /> 🧠🤖<div>
            <h2 className="font-bold text-lg tracking-tight leading-none">Ajaz H.S.</h2>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-2">
          {visibleNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-3 py-2"
            >
              {item.label}
            </button>
          ))}
          <div className="h-6 w-px bg-border mx-2" />
          <Contact resumeUrl={resumeUrl} className="p-0 gap-3" />
        </div>

        <div className="hidden lg:flex items-center gap-2">
          {user && (
            <>
              <Button onClick={handleLogout} variant="ghost" size="icon" className="hover:text-destructive hover:bg-destructive/10">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background border-b border-border p-4 flex flex-col gap-2 lg:hidden shadow-lg animate-accordion-down origin-top">
          {visibleNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-md transition-colors"
            >
              {item.label}
            </button>
          ))}
          <div className="border-t border-border mt-2 pt-4 pb-2">
            <Contact resumeUrl={resumeUrl} className="p-0 gap-4 flex-col w-full" />
          </div>
          {user && (
            <div className="border-t border-border mt-2 pt-2 flex flex-col gap-2">
              <Button onClick={handleLogout} variant="ghost" className="justify-start px-4 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
