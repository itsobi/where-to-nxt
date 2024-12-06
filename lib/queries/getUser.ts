'server only';

import { supabaseAdmin } from '@/supabase/admin';
import { User } from './getProUser';

export const getUserById = async (userId: string) => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('clerk_user_id', userId)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data as User;
};
