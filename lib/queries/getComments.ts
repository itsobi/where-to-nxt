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

export type SubCommentType = {
  id: number;
  created_at: string;
  comment_id: number;
  author_clerk_user_id: string;
  username: string;
  author_profile_image: string;
  content: string;
};

export const getSubComments = async (comment_id: number) => {
  const { data, error } = await supabaseAdmin
    .from('sub_comments')
    .select('*')
    .eq('comment_id', comment_id);

  if (error) throw error;

  return data as SubCommentType[];
};

export const getCommentById = async (commentId: number) => {
  const { data, error } = await supabaseAdmin
    .from('comments')
    .select('*')
    .eq('id', commentId)
    .single();

  if (error) throw error;

  return data as CommentType;
};
