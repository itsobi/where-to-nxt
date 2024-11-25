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

export const getPostsByUserId = async (userId: string) => {
  const { data: posts, error } = await supabaseAdmin
    .from('posts')
    .select('*, liked_by:post_likes(clerk_user_id)')
    .eq('author_clerk_user_id', userId);

  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }

  return posts as PostType[];
};

export const getCountryCounts = async (minCount: number) => {
  const { data, error } = await supabaseAdmin.from('posts').select('country');

  if (error) {
    console.error('Error fetching posts:', error);
    return null;
  }

  // Count occurrences of each country
  const countryCount = data.reduce((acc, country) => {
    acc[country.country] = (acc[country.country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Filter countries that appear at least minCount times
  const filteredCountries = Object.entries(countryCount)
    .filter(([_, count]) => count >= minCount)
    .map(([country]) => country);

  const { data: posts, error: postsError } = await supabaseAdmin
    .from('posts')
    .select('country')
    .in('country', filteredCountries);

  if (postsError) {
    console.error('Error fetching posts:', postsError);
    return null;
  }

  return posts;
};

export const getPostsByCountry = async (countryCode: string) => {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('*, liked_by:post_likes(clerk_user_id)')
    .eq('country', countryCode);

  if (error) {
    console.error('Error fetching posts:', error);
    return null;
  }

  return data;
};
