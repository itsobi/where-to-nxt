import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';
import { ClerkProvider } from '@clerk/nextjs';

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
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
