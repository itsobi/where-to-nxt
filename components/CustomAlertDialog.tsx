'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';

interface CustomAlertDialogProps {
  title: string;
  description: string;
  href: string;
}

export function CustomAlertDialog({
  title,
  description,
  href,
}: CustomAlertDialogProps) {
  const router = useRouter();

  return (
    <AlertDialog open={true}>
      <AlertDialogContent className="rounded-lg max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-500">{title}</AlertDialogTitle>
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
