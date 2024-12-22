import { supabaseAdmin } from '@/supabase/admin';

export type SupabaseUser = {
  id: number;
  created_at: string;
  clerk_user_id: string;
  username: string;
  profile_image: string;
  is_pro: boolean;
};

export const getUserById = async (userId: string | undefined) => {
  if (!userId) {
    return null;
  }

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('clerk_user_id', userId)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  if (!user) {
    return null;
  }

  return user as SupabaseUser;
};
