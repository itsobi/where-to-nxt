import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatRoom } from '@/lib/queries/getChatRooms';
import Link from 'next/link';

interface ConversationProps {
  chatRoom: ChatRoom;
}

export function Conversation({ chatRoom }: ConversationProps) {
  return (
    <Link
      href={`/messages/${chatRoom.chat_room_id}`}
      className="flex space-x-2 p-4 hover:bg-gray-100 rounded-md cursor-pointer truncate h-fit"
    >
      <Avatar>
        <AvatarImage src={chatRoom.otherUser.profile_image} />
        <AvatarFallback>
          {chatRoom.otherUser.username[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <div className="flex items-center space-x-2 truncate">
          <p className="font-semibold">{chatRoom.otherUser.username}</p>
          <p className="text-sm text-gray-500">
            [last message time herefasdfsdf]
          </p>
        </div>
        <p className="text-sm text-gray-500">[last message here]</p>
      </div>
    </Link>
  );
}
