import './globals.css';

import type { Metadata } from 'next';
import { Sidebar } from '@/components/Sidebar';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'Where To NXT?',
  description:
    'Traveling soon? Have the travel bug? Find the best places to visit and explore while in town.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          suppressHydrationWarning
          className="h-screen flex overflow-hidden"
        >
          <Sidebar />
          <main className="flex-1 p-4 grid grid-cols-7 overflow-y-auto">
            {children}
          </main>
          <Toaster position="bottom-center" richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
