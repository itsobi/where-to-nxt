import { supabaseAdmin } from '@/supabase/admin';
import { PostType } from './getPosts';

export const getPost = async (postId: string) => {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select(
      `*,
      liked_by:likes(clerk_user_id),
      comments(*)`
    )
    .eq('id', postId)
    .single();

  if (error) throw error;

  return data as PostType;
};
