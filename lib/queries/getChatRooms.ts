import { supabaseAdmin } from '@/supabase/admin';
import { getUserById } from './getUser';

export type ChatRoom = {
  id: number;
  created_at: string;
  chat_room_id: string;
  members: string[];
  lastMessage?: {
    message: string;
    created_at: string;
  };
  otherUser: {
    id: number;
    created_at: string;
    clerk_user_id: string;
    username: string;
    profile_image: string;
    is_pro: boolean;
  };
};

export const getChatRooms = async (userId: string) => {
  const { data: chatRooms, error } = await supabaseAdmin
    .from('chat_rooms')
    .select(
      `
    *,
    messages (
      message,
      created_at
    )
  `
    )
    .contains('members', [userId])
    .order('created_at', { foreignTable: 'messages', ascending: false })
    .limit(1, { foreignTable: 'messages' });

  if (error) {
    console.log(error);
    throw new Error(error.message);
  }

  const enrichedChatRooms: ChatRoom[] = [];
  for (const room of chatRooms) {
    const lastMessage = room.messages?.[0] || null;

    const otherUser = room.members.find(
      (memberId: string) => memberId !== userId
    );
    let userData;

    try {
      userData = await getUserById(otherUser);
    } catch (error) {
      console.log(error);
    }

    if (!userData) {
      return null;
    }

    enrichedChatRooms.push({
      ...room,
      lastMessage,
      otherUser: userData,
    });
  }

  return enrichedChatRooms as ChatRoom[];
};
