'use client';

import { supabaseClientRLS } from './client';

export const createMessage = async ({
  userId,
  chatRoomId,
  message,
  username,
  supabaseToken,
  recipientUserId,
}: {
  userId: string | null | undefined;
  supabaseToken: string | null;
  chatRoomId: string;
  message: string;
  username: string | null | undefined;
  recipientUserId: string | undefined;
}) => {
  if (!userId || !supabaseToken)
    return { data: [], error: 'No user ID or supabase token' };

  if (!recipientUserId || !username)
    return { data: [], error: 'No recipient user ID or username' };

  const supabase = await supabaseClientRLS({ token: supabaseToken });
  try {
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
  } catch (error) {
    console.log(error);
    return { data: [], error: 'Failed to create message' };
  }
};
