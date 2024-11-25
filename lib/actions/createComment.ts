'use server';

import { supabaseAdmin } from '@/supabase/admin';
import { auth, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import { Knock } from '@knocklabs/node';

type createCommentProps = {
  postId: number | undefined;
  comment: string;
  authorId: string;
};

export const createComment = async ({
  postId,
  comment,
  authorId,
}: createCommentProps) => {
  auth().protect();

  const user = await currentUser();
  const knock = new Knock(process.env.KNOCK_SECRET_KEY);

  if (!user?.id) {
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
        author_clerk_user_id: user.id,
        content: trimmedComment,
        author_profile_image: user.imageUrl,
        username: user.username,
      })
      .select()
      .single();

    if (error) {
      console.log('ERROR >>>', error);
      return { success: false, message: 'Failed to create comment' };
    }

    const { error: incrementError } = await supabaseAdmin.rpc(
      'increment_comment_count',
      { post_id: postId }
    );

    if (incrementError) {
      console.log('ERROR >>>', incrementError);
      return { success: false, message: 'Failed to increment comment count' };
    }

    await knock.workflows.trigger('new-comment', {
      actor: {
        id: user.id,
      },
      data: {
        sender: user.username,
        // TODO: CHANGE THIS TO THE ACTUAL URL
        url: `http://localhost:3000/post/${postId}`,
      },
      recipients: [
        {
          id: authorId,
        },
      ],
    });

    revalidatePath('/');
    revalidatePath(`/post/${postId}`);

    return { success: true, message: 'Comment created successfully!' };
  } catch (error) {
    console.log('ERROR >>>', error);
    return { success: false, message: 'Failed to create comment' };
  }
};
