'use server';

import { supabaseAdmin } from '@/supabase/admin';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function likePost(
  alreadyLiked: boolean,
  postId: number,
  userId: string | null | undefined
) {
  await auth.protect();

  if (!userId || !postId) {
    throw new Error('User ID or post ID is missing');
  }

  console.log(`STARTING LIKE POST for user ${userId} and post ${postId}`);

  try {
    if (alreadyLiked) {
      // Unlike the post
      const { error: deleteError } = await supabaseAdmin
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('clerk_user_id', userId);

      if (deleteError) {
        console.error('Error removing like:', deleteError);
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
        .from('post_likes')
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

export const likeComment = async (
  alreadyLiked: boolean,
  commentId: number,
  postId: string
) => {
  await auth.protect();

  const { userId } = await auth();

  if (!commentId || !userId) {
    throw new Error('Comment ID or user ID is missing');
  }

  try {
    if (alreadyLiked) {
      // Unlike the comment
      const { error: deleteError } = await supabaseAdmin
        .from('comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('clerk_user_id', userId);

      if (deleteError) {
        console.error('Error removing like:', deleteError);
        throw deleteError;
      }

      const { error: decrementError } = await supabaseAdmin.rpc(
        'decrement_comment_likes',
        { comment_id: commentId }
      );
      if (decrementError) {
        console.error('Error decrementing likes:', decrementError);
        throw decrementError;
      }
    } else {
      // Like the comment
      const { error: insertError } = await supabaseAdmin
        .from('comment_likes')
        .insert({ comment_id: commentId, clerk_user_id: userId });

      if (insertError) {
        console.error('Error inserting like:', insertError);
        throw insertError;
      }

      const { error: incrementError } = await supabaseAdmin.rpc(
        'increment_comment_likes',
        { comment_id: commentId }
      );
      if (incrementError) {
        console.error('Error incrementing likes:', incrementError);
        throw incrementError;
      }
    }
    revalidatePath('/');
    revalidatePath(`/post/${postId}`);
    console.log('LIKE POST SUCCESSFUL');
    return { success: true };
  } catch (error) {
    console.error('Error in likeComment:', error);
    return {
      success: false,
      message: 'Failed to like comment',
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export const likeReply = async (
  alreadyLiked: boolean,
  replyId: number,
  postId: string,
  commentId: string
) => {
  await auth.protect();

  const { userId } = await auth();

  if (!replyId || !userId) {
    throw new Error('Reply ID or user ID is missing');
  }

  try {
    if (alreadyLiked) {
      // Unlike the reply
      const { error: deleteError } = await supabaseAdmin
        .from('reply_likes')
        .delete()
        .eq('reply_id', replyId)
        .eq('clerk_user_id', userId);

      if (deleteError) {
        console.error('Error removing like:', deleteError);
        throw deleteError;
      }

      const { error: decrementError } = await supabaseAdmin.rpc(
        'decrement_reply_likes',
        { reply_id: replyId }
      );
      if (decrementError) {
        console.error('Error decrementing likes:', decrementError);
        throw decrementError;
      }
    } else {
      // Like the reply
      const { error: insertError } = await supabaseAdmin
        .from('reply_likes')
        .insert({ reply_id: replyId, clerk_user_id: userId });

      if (insertError) {
        console.error('Error inserting like:', insertError);
        throw insertError;
      }

      const { error: incrementError } = await supabaseAdmin.rpc(
        'increment_reply_likes',
        { reply_id: replyId }
      );
      if (incrementError) {
        console.error('Error incrementing likes:', incrementError);
        throw incrementError;
      }
    }

    revalidatePath('/');
    revalidatePath(`/post/${postId}/comment/${commentId}`);
    console.log('LIKE REPLY SUCCESSFUL');
    return { success: true };
  } catch (error) {
    console.error('Error in likeReply:', error);
    return {
      success: false,
      message: 'Failed to like reply',
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
