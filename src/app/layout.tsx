import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a clean default font
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { MainNav } from '@/components/layout/main-nav';
import { ThemeProvider } from "@/components/theme-provider"; // Import ThemeProvider

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'CogniAssist', // Updated App Name
  description: 'Your intelligent assistant for managing tasks and boosting memory.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
          <div className="container mx-auto py-6 px-4">
             <MainNav />
             <main>{children}</main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
