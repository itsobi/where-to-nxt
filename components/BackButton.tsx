'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { SignedIn } from '@clerk/nextjs';
import { NotificationFeed } from './NotifcationFeed';

interface BackButtonProps {
  label: string;
}

export function BackButton({ label }: BackButtonProps) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center gap-1">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <p className="text-xl font-semibold">{label}</p>
      </div>
      <SignedIn>
        <NotificationFeed />
      </SignedIn>
    </div>
  );
}
