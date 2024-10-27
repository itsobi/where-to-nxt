'use server';

import { supabaseAdmin } from '@/supabase/admin';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function likePost(
  alreadyLiked: boolean,
  postId: number,
  userId: string | undefined
) {
  auth().protect();

  if (!userId || !postId) {
    throw new Error('User ID or post ID is missing');
  }

  console.log(`STARTING LIKE POST for user ${userId} and post ${postId}`);

  try {
    if (alreadyLiked) {
      // Unlike the post
      const { error: deleteError } = await supabaseAdmin
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('clerk_user_id', userId);

      if (deleteError) {
        console.error('Error deleting like:', deleteError);
        throw deleteError;
      }

      const { error: decrementError } = await supabaseAdmin.rpc(
        'decrement_likes',
        { post_id: postId }
      );
      if (decrementError) {
        console.error('Error decrementing likes:', decrementError);
        throw decrementError;
      }

      console.log('Post unliked successfully');
    } else {
      // Like the post
      const { error: insertError } = await supabaseAdmin
        .from('likes')
        .insert({ post_id: postId, clerk_user_id: userId });

      if (insertError) {
        console.error('Error inserting like:', insertError);
        throw insertError;
      }

      const { error: incrementError } = await supabaseAdmin.rpc(
        'increment_likes',
        { post_id: postId }
      );
      if (incrementError) {
        console.error('Error incrementing likes:', incrementError);
        throw incrementError;
      }

      console.log('Post liked successfully');
    }

    revalidatePath('/');
    revalidatePath(`/post/${postId}`);
    console.log('LIKE POST SUCCESSFUL');
    return { success: true };
  } catch (error) {
    console.error('Error in likePost:', error);
    return {
      success: false,
      message: 'Failed to like post',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
