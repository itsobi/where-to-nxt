import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'WhereToNxt?',
  description: 'Traveling soon? Find the best places to explore while in town.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen flex">
          <Sidebar />
          <main className="flex-1 p-4 grid grid-cols-7">{children}</main>
          <Toaster position="bottom-center" richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
