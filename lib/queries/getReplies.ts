import { supabaseAdmin } from '@/supabase/admin';
import { ReplyType } from './getComments';

export const getReplies = async (comment_id: number) => {
  const { data, error } = await supabaseAdmin
    .from('replies')
    .select('*')
    .eq('comment_id', comment_id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data as ReplyType[];
};
