'server only';

import { supabaseAdmin } from '@/supabase/admin';

export type CommentType = {
  id: number;
  content: string;
  author_profile_image: string;
  created_at: string;
  author_clerk_user_id: string;
  username: string;
  post_id: number;
  comment_count: number;
  like_count: number;
  liked_by: {
    clerk_user_id: string;
  }[];
};

export type PostType = {
  id: number;
  created_at: string;
  author_clerk_user_id: string;
  username: string;
  author_profile_image: string;
  content: string;
  country: string;
  like_count: number;
  comment_count: number;
  liked_by: {
    clerk_user_id: string;
  }[];
  images?: string[];
};

export const getPosts = async (): Promise<PostType[]> => {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select(
      `*,
      liked_by:post_likes(clerk_user_id)`
    )
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data as PostType[];
};
