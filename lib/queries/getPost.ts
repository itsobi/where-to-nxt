import { supabaseAdmin } from '@/supabase/admin';
import { PostType } from './getPosts';

export const getPost = async (postId: string) => {
  const { data: post, error } = await supabaseAdmin
    .from('posts')
    .select(
      `*,
      liked_by:likes(clerk_user_id)`
    )
    .eq('id', postId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch post: ${error.message}`);
  }

  return post as PostType;
};
