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
        <div className="hidden lg:inline-flex flex-col border-r">
          <MessagesSidebar chatRooms={chatRooms} />
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
