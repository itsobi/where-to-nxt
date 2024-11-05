import { Container } from '@/components/Container';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Container className="col-span-full min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <Link href="/" className="text-blue-500 hover:underline" replace>
        Return Home
      </Link>
    </Container>
  );
}
