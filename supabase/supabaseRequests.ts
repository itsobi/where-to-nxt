import { supabaseClient } from './client';

export type Message = {
  id: number;
  created_at: string;
  clerk_user_id: string;
  username: string;
  chat_room_id: string;
  message: string;
};

export const getMessages = async ({
  chatRoomId,
  supabaseToken,
}: {
  chatRoomId: string;
  supabaseToken: string | null;
}) => {
  try {
    console.log('Getting messages for chat room:', chatRoomId);
    if (!chatRoomId || !supabaseToken) {
      console.error('Missing chatRoomId or supabaseToken');
      return { data: [], error: 'No chat room ID or supabase token' };
    }

    const supabase = await supabaseClient(supabaseToken);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_room_id', chatRoomId)
      .order('created_at', { ascending: true });

    if (error) {
      console.log(error);
      return { data: [], error: error.message };
    }

    return { data: data as Message[] };
  } catch (err) {
    console.error('Error in getMessages:', err);
    return { data: [], error: 'Unexpected error occurred' };
  }
};

export const createMessage = async ({
  userId,
  supabaseToken,
  chatRoomId,
  message,
  username,
}: {
  userId: string | null | undefined;
  supabaseToken: string | null;
  chatRoomId: string;
  message: string;
  username: string | null | undefined;
}) => {
  if (!userId || !supabaseToken || !username)
    return { data: [], error: 'No user ID or supabase token' };

  const supabase = await supabaseClient(supabaseToken);
  const { data, error } = await supabase
    .from('messages')
    .insert({
      clerk_user_id: userId,
      chat_room_id: chatRoomId,
      message,
      username,
    })
    .select();
  if (error) {
    console.log(error);
    return { data: [], error: error.message };
  }
  return { data };
};
