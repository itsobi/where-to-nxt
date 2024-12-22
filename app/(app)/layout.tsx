// import './globals.css';
import '@/app/globals.css';

import type { Metadata } from 'next';
import { Sidebar } from '@/components/Sidebar';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'Where To NXT?',
  description:
    'Traveling soon? Have the travel bug? Find the best places to visit and explore while in town.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body className="h-screen flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-4 grid grid-cols-7 overflow-y-auto">
        {children}
      </main>
      <Toaster position="bottom-center" richColors />
    </body>
  );
}
