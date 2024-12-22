import { ChatRoom } from '@/lib/queries/getChatRooms';
import { Conversation } from './Conversation';
import { MessagesHeader } from './MessagesHeader';
import { ProMember } from '@/lib/queries/getProUser';

interface MessageSidebarProps {
  chatRooms: ChatRoom[] | null;
  availableProUsers: ProMember[];
}

export function MessagesSidebar({
  chatRooms,
  availableProUsers,
}: MessageSidebarProps) {
  if (chatRooms && chatRooms.length === 0) {
    return (
      <div className="flex items-start justify-center h-full">
        <h2 className="text-xl font-semibold">No conversations found</h2>
      </div>
    );
  }
  return (
    <div className="lg:pr-4">
      <MessagesHeader availableProUsers={availableProUsers} />
      {chatRooms?.map((chatRoom) => (
        <Conversation key={chatRoom.id} chatRoom={chatRoom} />
      ))}
    </div>
  );
}
