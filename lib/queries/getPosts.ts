import { supabaseAdmin } from '@/supabase/admin';

export type PostType = {
  id: number;
  created_at: string;
  author_clerk_user_id: string;
  username: string;
  author_profile_image: string;
  post: string;
  country: string;
  images?: string[];
  likes: {
    count: number;
  }[];
  liked_by: {
    clerk_user_id: string;
  }[];
};

export const getPosts = async (): Promise<PostType[]> => {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select(
      `
      *,
      likes:likes(count),
      liked_by:likes(clerk_user_id)
    `
    )
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Transform the data to include the likes count and liked_by array
  // const posts = data.map((post) => ({
  //   ...post,
  //   likes: post.likes[0]?.count || 0,
  //   liked_by: post.liked_by.map(
  //     (like: { clerk_user_id: string }) => like.clerk_user_id
  //   ),
  // }));

  return data as PostType[];
};
