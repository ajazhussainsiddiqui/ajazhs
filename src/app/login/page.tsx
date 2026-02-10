'use client';
import { useAuth } from '@/firebase';
import {
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const auth = useAuth();
  const { user, loading } = useUser(auth);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleAuthAction = async (values: FormValues) => {
    if (!auth) return;
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({ title: 'Signed in', description: 'Welcome back!' });
    } catch (error: any) {
      console.error(`Error signing in`, error);
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: error.message || `Could not sign in.`,
      });
    }
  };
  
  if (loading || (!loading && user)) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-[60vh]">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">
            Admin Login
          </CardTitle>
          <CardDescription>
            Please sign in to access editing features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAuthAction)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Processing...' : 'Sign In'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
