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
  return (
    <AlertDialog open={true}>
      <AlertDialogContent className="rounded-lg max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle
            className={cn(
              'lg:text-2xl',
              success ? 'text-green-500' : 'text-red-500'
            )}
          >
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="lg:text-lg">
            {description}
          </AlertDialogDescription>
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
