'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/button';
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResumeSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onEdit?: () => void;
  titleClassName?: string;
}

export default function ResumeSection({ title, icon, children, onEdit, titleClassName }: ResumeSectionProps) {
  const { user } = useAuth();

  return (
    <section className="relative py-12">
      <div className="flex flex-col items-start justify-start mb-8 text-left border-b pb-4 w-full">
        <div className="flex items-center gap-4">
          {icon}
          <h2 className={cn("text-3xl font-bold font-headline tracking-tight", titleClassName)}>{title}</h2>
        </div>
        {user && onEdit && (
          <Button variant="ghost" size="icon" onClick={onEdit} className="no-print absolute top-12 right-0">
            <Pencil className="size-4" />
            <span className="sr-only">Edit {title}</span>
          </Button>
        )}
      </div>
      {children}
    </section>
  );
}
