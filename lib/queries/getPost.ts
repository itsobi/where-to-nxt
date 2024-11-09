import { supabaseAdmin } from '@/supabase/admin';
import { PostType } from './getPosts';

export const getPost = async (postId: string) => {
  const { data: post, error } = await supabaseAdmin
    .from('posts')
    .select(
      `*,
      liked_by:post_likes(clerk_user_id)`
    )
    .eq('id', postId)
    .single();

  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }

  return post as PostType;
};
