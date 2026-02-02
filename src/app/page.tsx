'use client';

import ResumeLoader from '@/components/ResumeLoader';
import { Messages } from '@/components/Messages';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <main >      
      <ResumeLoader />
      {user && <Messages />}
    </main>
  );
}
