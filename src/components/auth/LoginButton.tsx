
'use client';
import { useAuth, useUser } from '@/firebase';
import { Button } from '../ui/button';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { LogIn, LogOut, Settings } from 'lucide-react';
import { useFirebase } from '@/firebase/provider';

interface LoginButtonProps {
  variant?: 'default' | 'minimal';
}

export function LoginButton({ variant = 'default' }: LoginButtonProps) {
  const auth = useAuth();
  const { user, loading } = useUser(auth);
  const { onSeed } = useFirebase();

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
    }
  };

  if (loading) {
    return <span className="text-xs animate-pulse">...</span>;
  }

  if (!user) {
    if (variant === 'minimal') {
      return (
        <Link href="/login" className="text-[10px] uppercase tracking-widest hover:text-foreground transition-colors">
          Admin Login
        </Link>
      );
    }
    return (
      <Link href="/login" passHref>
        <Button variant="outline" size="sm">
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Button>
      </Link>
    );
  }

  const userInitial = user.displayName ? user.displayName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : '?');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? user.email ?? 'User'} />
            <AvatarFallback className="text-xs">{userInitial}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName || user.email}</p>
            {user.displayName && user.email && (
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSeed}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Seed Database</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
