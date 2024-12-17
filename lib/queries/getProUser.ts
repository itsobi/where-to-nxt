import { supabaseAdmin } from '@/supabase/admin';
import { getChatRooms } from './getChatRooms';
import { currentUser } from '@clerk/nextjs/server';

export type ProMember = {
  id: number;
  created_at: string;
  clerk_user_id: string;
  email: string;
  username: string;
  profile_image: string;
};

export const getProUsers = async (currentUserId: string) => {
  const { data: proUsers, error } = await supabaseAdmin
    .from('pro_members')
    .select('*')
    .not('clerk_user_id', 'eq', currentUserId);

  if (error) {
    throw new Error(error.message);
  }

  return proUsers as ProMember[];
};

export const getProUsersEligibleForConversation = async (
  currentUserId: string
) => {
  try {
    const existingChatRooms = await getChatRooms(currentUserId);

    if (!existingChatRooms) {
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

    return filteredProUsers as ProMember[];
  } catch (error) {
    throw new Error(error as string);
  }
};

export const isCurrentUserPro = async () => {
  const user = await currentUser();

  if (user?.publicMetadata?.is_pro) {
    return true;
  }

  return false;
};
