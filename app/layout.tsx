import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';
import { ClerkProvider, SignedIn } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/sonner';
import { NotificationFeed } from '@/components/NotifcationFeed';
import { Header } from '@/components/Header';

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
        <body className="h-screen flex overflow-hidden">
          <Sidebar />

          <div className="flex flex-col flex-1">
            <SignedIn>
              <div className="grid grid-cols-7">
                <Header />
              </div>
            </SignedIn>
            <main className="flex-1 p-4 grid grid-cols-7 overflow-y-auto">
              {children}
            </main>
          </div>
          <Toaster position="bottom-center" richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
