'use server';

import { supabaseAdmin } from '@/supabase/admin';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export const deleteComment = async (
  authorId: string,
  commentId: number,
  postId: number
) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  if (userId !== authorId) {
    throw new Error('Unauthorized to delete this comment');
  }

  const { error } = await supabaseAdmin
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) {
    console.error('Error deleting comment:', error);
    return { success: false, message: 'Unable to delete comment' };
  }

  const { error: decrementError } = await supabaseAdmin.rpc(
    'decrement_comment_count',
    { post_id: postId }
  );

  if (decrementError) {
    console.error('Error decrementing comment count:', decrementError);
    throw new Error('Unable to decrement comment count');
  }

  revalidatePath(`/post/${postId}`);
  revalidatePath('/');

  return { success: true };
};
