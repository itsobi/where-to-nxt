'server only';

import { supabaseAdmin } from '@/supabase/admin';
import { getChatRooms } from './getChatRooms';

export type User = {
  id: number;
  created_at: string;
  clerk_user_id: string;
  username: string;
  profile_image: string;
  is_pro: boolean;
};

export const getProUsers = async (currentUserId: string) => {
  const { data: proUsers, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .not('clerk_user_id', 'eq', currentUserId)
    .eq('is_pro', true);

  if (error) {
    throw new Error(error.message);
  }

  return proUsers as User[];
};

export const getProUsersEligibleForConversation = async (
  currentUserId: string
) => {
  try {
    const existingChatRooms = await getChatRooms(currentUserId);

    if (existingChatRooms.length === 0) {
      return [];
    }

    const existingChatRoomUserIds = existingChatRooms.map(
      (chatRoom) => chatRoom.otherUser.clerk_user_id
    );

    const userIdsToExclude = [currentUserId, ...existingChatRoomUserIds];

    const proUsers = await getProUsers(currentUserId);

    const filteredProUsers = proUsers.filter((user) => {
      return !userIdsToExclude.includes(user.clerk_user_id);
    });

    return filteredProUsers as User[];
  } catch (error) {
    throw new Error(error as string);
  }
};