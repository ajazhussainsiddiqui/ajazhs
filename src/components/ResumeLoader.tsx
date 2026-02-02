'use client';

import { useState, useEffect } from 'react';
import type { ResumeData } from '@/lib/types';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import Resume from '@/components/Resume';
import { useToast } from '@/hooks/use-toast';
import { STATIC_RESUME } from '@/data/static-resume';

export async function getResumeData(): Promise<ResumeData> {
  if (!db) {
    console.warn('Firestore unavailable → returning static data');
    return STATIC_RESUME;
  }
  const docRef = doc(db, 'resumes', 'main');
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    const data = snap.data() as ResumeData;
    if (!data.projects) data.projects = [];
    if (!data.certificates) data.certificates = [];
    if (!data.publications) data.publications = [];
    if (!data.avatarUrl) data.avatarUrl = '';
    if (!data.resumeUrl) data.resumeUrl = '';
    if (!data.hiddenSections) data.hiddenSections = [];
    if (!data.sectionOrder || data.sectionOrder.length === 0) {
      data.sectionOrder = STATIC_RESUME.sectionOrder;
    }
    return data;
  } else {
    await setDoc(docRef, STATIC_RESUME);
    return STATIC_RESUME;
  }
}

export async function updateResumeData(newData: Partial<ResumeData>): Promise<ResumeData> {
  if (!db) throw new Error('Firestore uninitialized');
  const docRef = doc(db, 'resumes', 'main');
  await updateDoc(docRef, newData);
  const updated = await getDoc(docRef);
  return updated.data() as ResumeData;
}

export default function ResumeLoader() {
  const [resumeData, setResumeData] = useState<ResumeData>(STATIC_RESUME);
  const { toast } = useToast();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const firestoreResume = await getResumeData();
        if (!cancelled) setResumeData(firestoreResume);
      } catch (err) {
        console.error(err);
        toast({
          variant: 'destructive',
          title: 'Could not load live data',
          description: 'Displaying cached résumé.',
        });
      }
    })();
    return () => { cancelled = true; };
  }, [toast]);

  return <Resume initialResumeData={resumeData} updateResumeData={updateResumeData} />;
}
