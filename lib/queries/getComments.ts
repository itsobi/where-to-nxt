import { supabaseAdmin } from '@/supabase/admin';
import { CommentType } from './getPosts';

export const getComments = async (postId: string) => {
  const { data: comments, error: commentsError } = await supabaseAdmin
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: false });
  if (commentsError) {
    throw new Error(`Failed to fetch comments: ${commentsError.message}`);
  }

  return comments as CommentType[];
};
