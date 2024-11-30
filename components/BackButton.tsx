'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { SignedIn } from '@clerk/nextjs';
import { NotificationFeed } from './NotifcationFeed';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  showNotificationBell?: boolean;
  label?: string;
  className?: string;
}

export function BackButton({
  showNotificationBell = false,
  label,
  className,
}: BackButtonProps) {
  const router = useRouter();
  return (
    <div className={cn('flex items-center justify-between mb-1', className)}>
      <div className="flex items-center gap-1">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        {label && <p className="text-xl font-semibold">{label}</p>}
      </div>
      {showNotificationBell && (
        <SignedIn>
          <NotificationFeed />
        </SignedIn>
      )}
    </div>
  );
}
