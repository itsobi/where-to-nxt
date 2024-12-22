import { supabaseAdmin } from '@/supabase/admin';
import { getUserById, SupabaseUser } from './getUser';

export type ChatRoom = {
  id: number;
  created_at: string;
  chat_room_id: string;
  members: string[];
  lastMessage?: {
    message: string;
    created_at: string;
  };
  otherUser: SupabaseUser;
};

export const getChatRoomsUserIsApartOf = async (userId: string) => {
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

    const otherUserId = room.members.find(
      (memberId: string) => memberId !== userId
    );
    let userData;

    try {
      userData = await getUserById(otherUserId);
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
