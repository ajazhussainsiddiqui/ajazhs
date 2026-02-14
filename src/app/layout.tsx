import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import { AdminProvider } from '@/context/AdminProvider';
import { ThemeProvider } from '@/context/ThemeProvider';
import FirebaseClientProvider from '@/firebase/client-provider';
import { MessageToastListener } from '@/components/admin/MessageToastListener';
import { Inter, Space_Grotesk } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ajazhs.vercel.app'),
  title: {
    default: 'Ajaz Hussain Siddiqui',
    template: '%s | Ajaz Hussain Siddiqui'
  },
  description: 'Personal portfolio of Ajaz Hussain Siddiqui, Artificial Intelligence and Machine Learning Engineer. Here you can explore my latest projects and other information about me and my work.',
  keywords: ['Ajaz Hussain Siddiqui', 'AI Engineer', 'Machine Learning Engineer', 'Portfolio', 'Software Developer', 'Artificial Intelligence', 'Data Science', 'Deep Learning', 'NLP', 'Computer Vision', 'AI Agents', 'AI Researcher', 'AI Developer', 'ML Engineer', 'AI Projects', 'AI Innovations', 'LLMs', "Ajaz projects", "Ajaz AI/ML work"],
  authors: [{ name: 'Ajaz Hussain Siddiqui' }],
  creator: 'Ajaz Hussain Siddiqui',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ajazhs.vercel.app',
    title: 'Ajaz Hussain Siddiqui | AI & ML Portfolio',
    description: 'Discover AI and Machine Learning innovations by Ajaz Hussain Siddiqui.',
    siteName: 'Ajaz Hussain Siddiqui Portfolio',
    images: [
      {
        url: 'https://picsum.photos/seed/og-image/1200/630',
        width: 1200,
        height: 630,
        alt: 'Ajaz Hussain Siddiqui Portfolio Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ajaz Hussain Siddiqui | AI & ML Portfolio',
    description: 'Expertise in Artificial Intelligence and Machine Learning development.',
    images: ['https://picsum.photos/seed/og-image/1200/630'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(inter.variable, spaceGrotesk.variable)}>
      <body className={cn("font-body antialiased min-h-screen flex flex-col", "bg-background text-foreground transition-colors duration-300")}>
        <FirebaseClientProvider>
          <ThemeProvider>
            <AdminProvider>
              <MessageToastListener />
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
              <Toaster />
            </AdminProvider>
          </ThemeProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
