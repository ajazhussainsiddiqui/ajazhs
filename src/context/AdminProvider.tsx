'use client';

import { useUser, useAuth } from '@/firebase';
import { createContext } from 'react';

interface AdminContextValue {
  isAdmin: boolean;
}

export const AdminContext = createContext<AdminContextValue>({
  isAdmin: false,
});

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const { user } = useUser(auth);

  const isAdmin = !!user;

  return (
    <AdminContext.Provider value={{ isAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}
