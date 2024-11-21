'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  text: string;
}

export function BackButton({ text }: BackButtonProps) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-1 mb-1">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft />
      </Button>
      <p className="text-xl font-semibold">{text}</p>
    </div>
  );
}
