'server only';

import { supabaseAdmin } from '@/supabase/admin';

export type Message = {
  id: number;
  created_at: string;
  clerk_user_id: string;
  username: string;
  chat_room_id: string;
  message: string;
};

export const getChatRoomMessages = async (chatRoomId: string) => {
  const { data, error } = await supabaseAdmin
    .from('messages')
    .select('*')
    .eq('chat_room_id', chatRoomId);

  if (error) {
    console.log(error);
    return [];
  }

  return data as Message[];
};
