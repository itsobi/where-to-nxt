'use client';

import { ChatRoom } from '@/lib/queries/getChatRooms';
import { usePathname } from 'next/navigation';
import { Conversation } from './Conversation';
import { cn } from '@/lib/utils';

interface MessageSidebarProps {
  chatRooms: ChatRoom[];
}

export function MessagesSidebar({ chatRooms }: MessageSidebarProps) {
  const pathname = usePathname();

  if (chatRooms.length === 0) {
    return (
      <div className="p-2">
        <h2 className="text-xl font-semibold">No conversations found</h2>
      </div>
    );
  }
  return (
    <>
      {chatRooms.map((chatRoom) => (
        <Conversation key={chatRoom.id} chatRoom={chatRoom} />
      ))}
    </>
  );
}
