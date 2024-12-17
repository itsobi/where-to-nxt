import { ChatRoom } from '@/lib/queries/getChatRooms';
import { Conversation } from './Conversation';

interface MessageSidebarProps {
  chatRooms: ChatRoom[] | null;
}

export function MessagesSidebar({ chatRooms }: MessageSidebarProps) {
  console.log('chatRooms', chatRooms);
  if (chatRooms && chatRooms.length === 0) {
    return (
      <div className="flex items-start justify-center h-full">
        <h2 className="text-xl font-semibold">No conversations found</h2>
      </div>
    );
  }
  return (
    <div className="lg:pr-4">
      {chatRooms?.map((chatRoom) => (
        <Conversation key={chatRoom.id} chatRoom={chatRoom} />
      ))}
    </div>
  );
}
