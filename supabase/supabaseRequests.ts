import { supabaseClientRLS } from './client';

export const createMessage = async ({
  userId,
  chatRoomId,
  message,
  username,
  supabaseToken,
}: {
  userId: string | null | undefined;
  supabaseToken: string | null;
  chatRoomId: string;
  message: string;
  username: string | null | undefined;
}) => {
  if (!userId || !supabaseToken)
    return { data: [], error: 'No user ID or supabase token' };

  const supabase = await supabaseClientRLS({ token: supabaseToken });
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

export const createTodo = async ({
  token,
  userId,
  todo,
}: {
  token: string | null;
  userId: string | null | undefined;
  todo: string;
}) => {
  if (!userId || !token)
    return { data: [], error: 'No user ID or supabase token' };

  const supabase = await supabaseClientRLS({ token: token });
  const { data, error } = await supabase
    .from('todos')
    .insert({
      user_id: userId,
      todo,
    })
    .select();
  if (error) {
    console.log(error);
    return { data: [], error: error.message };
  }
  return { data };
};
