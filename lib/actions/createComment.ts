'use server';

import { supabaseAdmin } from '@/supabase/admin';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

type createCommentProps = {
  postId: number | undefined;
  comment: string;
  authorProfileImage: string | null;
  username: string | null;
};

export const createComment = async ({
  postId,
  comment,
  authorProfileImage,
  username,
}: createCommentProps) => {
  auth().protect();

  const { userId } = auth();

  if (!userId) {
    throw new Error('User not authenticated');
  }

  if (!postId) {
    throw new Error('Post ID is required');
  }

  const trimmedComment = comment.trim();

  if (!postId) {
    throw new Error('Post ID is required');
  }

  if (!trimmedComment) {
    throw new Error('Comment is required');
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('comments')
      .insert({
        post_id: postId,
        author_clerk_user_id: userId,
        content: trimmedComment,
        author_profile_image: authorProfileImage,
        username: username,
      })
      .select()
      .single();

    if (error) {
      console.log('ERROR >>>', error);
      throw new Error('Failed to create comment');
    }

    const { error: incrementError } = await supabaseAdmin.rpc(
      'increment_comment_count',
      { post_id: postId }
    );

    if (incrementError) {
      console.log('ERROR >>>', incrementError);
      throw new Error('Failed to increment comment count');
    }

    console.log('CREATED COMMENT WITH ID >>>', data?.id);

    revalidatePath('/');
    revalidatePath(`/post/${postId}`);

    return { success: true, message: 'Comment created successfully!' };
  } catch (error) {
    console.log('ERROR >>>', error);
    return { success: false, message: 'Failed to create comment' };
  }
};
