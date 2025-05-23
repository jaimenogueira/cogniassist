
'use client'; // Required for usePathname and framer-motion components

import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a clean default font
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { MainNav } from '@/components/layout/main-nav';
import { ThemeProvider } from "@/components/theme-provider"; // Import ThemeProvider
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

// Metadata cannot be dynamically generated in a client component at the root level this way
// For dynamic titles, you'd typically use the generateMetadata export in page.tsx files
// export const metadata: Metadata = {
//   title: 'CogniAssist', 
//   description: 'O seu assistente inteligente para gerir tarefas e impulsionar a memória.',
// };

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname();

  return (
    <html lang="pt-PT" suppressHydrationWarning>
      <head>
        {/* Static metadata can be placed here if needed, or use generateMetadata in child pages */}
        <title>CogniAssist</title>
        <meta name="description" content="O seu assistente inteligente para gerir tarefas e impulsionar a memória." />
      </head>
      <body
        className={cn(
          'min-h-screen bg-secondary font-sans antialiased', // Use secondary color for body background
          inter.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="container mx-auto py-6 px-4 flex flex-col min-h-screen">
             <MainNav />
             <AnimatePresence mode="wait">
               <motion.main
                key={pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex-grow" // Ensures main content takes available space
               >
                {children}
               </motion.main>
             </AnimatePresence>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
