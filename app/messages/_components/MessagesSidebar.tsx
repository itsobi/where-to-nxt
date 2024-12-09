import { ChatRoom } from '@/lib/queries/getChatRooms';
import { Conversation } from './Conversation';

interface MessageSidebarProps {
  chatRooms: ChatRoom[];
}

export function MessagesSidebar({ chatRooms }: MessageSidebarProps) {
  if (chatRooms.length === 0) {
    return (
      <div className="p-2">
        <h2 className="text-xl font-semibold">No conversations found</h2>
      </div>
    );
  }
  return (
    <div className="lg:pr-4">
      {chatRooms.map((chatRoom) => (
        <Conversation key={chatRoom.id} chatRoom={chatRoom} />
      ))}
    </div>
  );
}
