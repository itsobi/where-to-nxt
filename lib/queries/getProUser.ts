import { supabaseAdmin } from '@/supabase/admin';
import { getChatRoomsUserIsApartOf } from './getChatRooms';

export type ProMember = {
  id: string;
  created_at: string;
  clerk_user_id: string;
  username: string;
  profile_image: string;
  is_pro: boolean;
};

export const getProMembers = async (currentUserId: string) => {
  const { data: proMembers, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('is_pro', true)
    .not('clerk_user_id', 'eq', currentUserId);

  if (error) {
    throw new Error(error.message);
  }

  return proMembers;
};

export const getProUsersEligibleForConversation = async (
  currentUserId: string
) => {
  try {
    const existingChatRoomsUserIsApartOf = await getChatRoomsUserIsApartOf(
      currentUserId
    );

    if (
      !existingChatRoomsUserIsApartOf ||
      existingChatRoomsUserIsApartOf.length === 0
    ) {
      return [];
    }

    const existingChatRoomUserIds = existingChatRoomsUserIsApartOf.map(
      (chatRoom) => chatRoom.otherUser?.id
    );

    const userIdsToExclude = [currentUserId, ...existingChatRoomUserIds];

    const proUsers = await getProMembers(currentUserId);
    return proUsers.filter(
      (user) => !userIdsToExclude.includes(user.clerk_user_id)
    ) as ProMember[];
  } catch (error) {
    console.error('Error in getProUsersEligibleForConversation:', error);
    throw new Error(error as string);
  }
};

export const isCurrentUserPro = async (userId: string) => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('is_pro')
    .eq('clerk_user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  return data[0]?.is_pro;
};
