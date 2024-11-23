import { supabaseAdmin } from '@/supabase/admin';
import { ReplyType } from './getComments';

export const getReplies = async (comment_id: number) => {
  const { data, error } = await supabaseAdmin
    .from('replies')
    .select(
      `*,
      liked_by:reply_likes(clerk_user_id)`
    )
    .eq('comment_id', comment_id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data as ReplyType[];
};
