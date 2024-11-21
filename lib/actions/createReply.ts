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
};

type createSubCommentReplyProps = {
  commentId: number | undefined;
  parentCommentId: number | undefined;
  content: string;
  authorProfileImage: string | null;
  username: string | null;
  postId: string;
};

export const createReply = async ({
  commentId,
  content,
  authorProfileImage,
  username,
  postId,
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
  });

  if (error) {
    console.error('Error creating sub comment:', error);
    return { success: false, message: 'Unable to create sub comment' };
  }

  const { error: incrementError } = await supabaseAdmin.rpc(
    'increment_sub_comment_count',
    { comment_id: commentId }
  );

  if (incrementError) {
    console.error('Error incrementing sub comment count:', incrementError);
    return { success: false, message: 'Unable to increment sub comment count' };
  }

  revalidatePath('/');
  revalidatePath(`/post/${postId}`);

  return { success: true, message: 'Comment created successfully!' };
};

export const createSubCommentReply = async ({
  commentId,
  parentCommentId,
  postId,
  content,
  authorProfileImage,
  username,
}: createSubCommentReplyProps) => {
  auth().protect();

  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabaseAdmin.from('sub_comments').insert({
    comment_id: commentId,
    parent_sub_comment_id: parentCommentId,
    author_clerk_user_id: userId,
    username: username,
    content: content,
    author_profile_image: authorProfileImage,
  });

  if (error) {
    console.error('Error creating sub comment reply:', error);
    return { success: false, message: 'Unable to create reply' };
  }

  const { error: incrementError } = await supabaseAdmin.rpc(
    'increment_sub_comment_count',
    { comment_id: commentId }
  );

  if (incrementError) {
    console.error('Error incrementing sub comment count:', incrementError);
    return { success: false, message: 'Unable to increment sub comment count' };
  }

  revalidatePath(`/post/${postId}/comment/${commentId}`);

  console.log('CREATED SUB COMMENT REPLY WITH POST ID >>>', postId);

  return { success: true, message: 'Reply created successfully!' };
};