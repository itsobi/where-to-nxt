'server only';

import { supabaseAdmin } from '@/supabase/admin';
import { getChatRooms } from './getChatRooms';

export type UserType = {
  id: number;
  created_at: string;
  clerk_user_id: string;
  email: string;
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

  return proUsers as UserType[];
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

    return filteredProUsers as UserType[];
  } catch (error) {
    throw new Error(error as string);
  }
};

export const isCurrentUserPro = async (userId: string | null) => {
  if (!userId) {
    return false;
  }

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('clerk_user_id', userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return user?.is_pro as boolean;
};
