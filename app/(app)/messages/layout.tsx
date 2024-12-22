import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { MessagesSidebar } from './_components/MessagesSidebar';
import { getChatRoomsUserIsApartOf } from '@/lib/queries/getChatRooms';
import {
  getProUsersEligibleForConversation,
  isCurrentUserPro,
} from '@/lib/queries/getProUser';

interface MessagesLayoutProps {
  children: React.ReactNode;
}

export default async function MessageLayout({ children }: MessagesLayoutProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }
  const isProMember = await isCurrentUserPro(userId);
  const chatRooms = await getChatRoomsUserIsApartOf(userId);
  const availableProUsers = await getProUsersEligibleForConversation(userId);

  return (
    <div className="col-span-full h-full">
      <div className="flex h-full space-x-2">
        {isProMember && (
          <div className="hidden lg:flex flex-col border-r w-1/4">
            <MessagesSidebar
              chatRooms={chatRooms}
              availableProUsers={availableProUsers}
            />
          </div>
        )}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
