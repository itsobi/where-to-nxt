'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CheckoutAlertDialogProps {
  title: string;
  description: string;
  href: string;
  success?: boolean;
}

export function CheckoutAlertDialog({
  title,
  description,
  href,
  success,
}: CheckoutAlertDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  return (
    <AlertDialog open={true}>
      <AlertDialogContent className="rounded-lg max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle
            className={cn(success ? 'text-green-500' : 'text-red-500')}
          >
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => router.replace(href)}>
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
