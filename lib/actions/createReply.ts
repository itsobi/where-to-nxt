'use server';

import { supabaseAdmin } from '@/supabase/admin';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

type createReplyProps = {
  commentId: number | undefined;
  content: string;
  authorProfileImage: string | null;
  username: string | null;
  postId: string;
  parentReplyId?: number | null;
};

export const createReply = async ({
  commentId,
  content,
  authorProfileImage,
  username,
  postId,
  parentReplyId,
}: createReplyProps) => {
  auth().protect();

  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabaseAdmin.from('replies').insert({
    comment_id: commentId,
    author_clerk_user_id: userId,
    username: username,
    content: content,
    author_profile_image: authorProfileImage,
    parent_reply_id: parentReplyId,
  });

  if (error) {
    console.error('Error creating comment:', error);
    return { success: false, message: 'Unable to create comment' };
  }

  // Only increment the comment count if this is a direct reply to the top comment (not a reply to another reply)
  if (!parentReplyId) {
    const { error: incrementError } = await supabaseAdmin.rpc(
      'increment_reply_count',
      { comment_id: commentId }
    );

    if (incrementError) {
      console.error('Error incrementing comment count:', incrementError);
      return {
        success: false,
        message: 'Unable to increment comment count',
      };
    }
  }

  revalidatePath('/');
  revalidatePath(`/post/${postId}`);

  if (parentReplyId) {
    return { success: true, message: 'Reply created successfully!' };
  }

  return { success: true, message: 'Comment created successfully!' };
};
