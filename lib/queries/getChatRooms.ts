'server only';

import { supabaseAdmin } from '@/supabase/admin';

export type ChatRoom = {
  id: number;
  created_at: string;
  chat_room_id: string;
  members: string[];
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
    .select('*')
    .contains('members', [userId]);

  if (error) {
    console.log(error);
    throw new Error(error.message);
  }

  let enrichedChatRooms: any[] = [];
  for (const room of chatRooms) {
    const otherUser = room.members.find(
      (memberId: string) => memberId !== userId
    );
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('clerk_user_id', otherUser)
      .single();

    if (userError) {
      console.log(userError);
      throw new Error(userError.message);
    }

    enrichedChatRooms.push({ ...room, otherUser: userData });
  }

  return enrichedChatRooms as ChatRoom[];
};
