import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { MessagesSidebar } from './_components/MessagesSidebar';
import { getChatRooms } from '@/lib/queries/getChatRooms';

interface MessagesLayoutProps {
  children: React.ReactNode;
}

export default async function MessageLayout({ children }: MessagesLayoutProps) {
  const { userId } = auth();

  if (!userId) {
    redirect('/');
  }

  const chatRooms = await getChatRooms(userId);

  return (
    <div className="col-span-full h-full">
      <div className="flex h-full space-x-2">
        <div className="hidden lg:inline-flex bg-red-100">
          <MessagesSidebar chatRooms={chatRooms} />
        </div>
        <div className="flex-1 bg-blue-100">{children}</div>
      </div>
    </div>
  );
}
