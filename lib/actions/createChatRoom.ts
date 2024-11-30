'use server';

import { supabaseAdmin } from '@/supabase/admin';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export const createChatRoom = async (
  memberId1: string,
  memberId2: string,
  chatRoomId: string
) => {
  auth().protect();

  try {
    const { data: existingChatroom, error: existingChatroomError } =
      await supabaseAdmin
        .from('chat_rooms')
        .select('chat_room_id')
        .eq('chat_room_id', chatRoomId)
        .maybeSingle();

    if (existingChatroomError) {
      throw new Error(existingChatroomError.message);
    }

    if (existingChatroom?.chat_room_id) {
      console.log('Chatroom already exists');
      return {
        success: true,
        chat_room_id: existingChatroom.chat_room_id,
      };
    }

    const { error } = await supabaseAdmin
      .from('chat_rooms')
      .insert({
        chat_room_id: chatRoomId,
        members: [memberId1, memberId2],
      })
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, message: 'Chatroom created successfully' };
  } catch (error: any) {
    console.log(error);
    return { success: false, message: error.message };
  }
};
