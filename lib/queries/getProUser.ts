'server only';

import { supabaseAdmin } from '@/supabase/admin';

export type User = {
  id: number;
  created_at: string;
  clerk_user_id: string;
  username: string;
  profile_image: string;
  is_pro: boolean;
};

export const getProUsers = async (userId: string) => {
  const { data: proUsers, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .not('clerk_user_id', 'eq', userId)
    .eq('is_pro', true);

  if (error) {
    throw new Error(error.message);
  }

  return proUsers as User[];
};
