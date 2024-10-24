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
};

export const getPosts = async (): Promise<PostType[]> => {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as PostType[];
};
