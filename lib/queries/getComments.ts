import { supabaseAdmin } from '@/supabase/admin';
import { CommentType } from './getPosts';

export const getComments = async (postId: string) => {
  const { data: comments, error: commentsError } = await supabaseAdmin
    .from('comments')
    .select('*, liked_by:comment_likes(clerk_user_id)')
    .eq('post_id', postId)
    .order('created_at', { ascending: false });
  if (commentsError) {
    throw new Error(`Failed to fetch comments: ${commentsError.message}`);
  }

  return comments as CommentType[];
};

export type ReplyType = {
  id: number;
  created_at: string;
  comment_id?: number;
  parent_reply_id?: number;
  author_clerk_user_id: string;
  username: string;
  content: string;
  author_profile_image: string;
  like_count: number;
  liked_by: {
    clerk_user_id: string;
  }[];
};

export const getCommentById = async (commentId: number) => {
  const { data, error } = await supabaseAdmin
    .from('comments')
    .select('*, liked_by:comment_likes(clerk_user_id)')
    .eq('id', commentId)
    .single();

  if (error) {
    console.log(error);
    return null;
  }

  return data as CommentType;
};

export const getSubCommentReplies = async (subCommentId: number) => {
  const { data, error } = await supabaseAdmin
    .from('sub_comments')
    .select('*')
    .eq('parent_sub_comment_id', subCommentId)
    .order('created_at', { ascending: false });

  if (error) {
    console.log(error);
    return null;
  }

  return data as ReplyType[];
};
