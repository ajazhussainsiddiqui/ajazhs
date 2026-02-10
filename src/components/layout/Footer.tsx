
"use client";
import { useState, useEffect } from "react";
import { LoginButton } from "../auth/LoginButton";
import { useAdmin } from "@/hooks/useAdmin";

export function Footer() {
  const [year, setYear] = useState<number | null>(null);
  const { isAdmin } = useAdmin();

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-8 px-6 border-t mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-4 text-muted-foreground">
        <p className="text-sm">&copy; {year ?? '...'} Ajaz Hussain Siddiqui. All rights reserved.</p>
        <div className="flex items-center gap-2">
           {!isAdmin && (
             <>
               <span className="text-xs opacity-30">|</span>
               <LoginButton variant="minimal" />
             </>
           )}
        </div>
      </div>
    </footer>
  );
}
