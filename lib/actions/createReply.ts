'use server';

import { supabaseAdmin } from '@/supabase/admin';
import { currentUser } from '@clerk/nextjs/server';
import { Knock } from '@knocklabs/node';
import { revalidatePath } from 'next/cache';
import { PROJECT_URL } from '../constants';
import { isCurrentUserPro } from '../queries/getProUser';

type createReplyProps = {
  commentId: number | undefined;
  content: string;
  postId: string;
  parentReplyId?: number | null;
  authorId: string;
};

const knock = new Knock(process.env.KNOCK_SECRET_KEY);

export const createReply = async ({
  commentId,
  content,
  postId,
  parentReplyId,
  authorId,
}: createReplyProps) => {
  const user = await currentUser();

  if (!user?.id) {
    throw new Error('Unauthorized');
  }

  const proUser = await isCurrentUserPro();

  const { error } = await supabaseAdmin.from('replies').insert({
    comment_id: commentId,
    author_clerk_user_id: user.id,
    username: user.username,
    content: content,
    author_profile_image: user.imageUrl,
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

  // FOR PRO USERS ONLY
  if (proUser) {
    try {
      await knock.workflows.trigger('new-reply', {
        actor: {
          id: user.id,
        },
        data: {
          sender: user.username,
          url: `${PROJECT_URL}/post/${postId}/comment/${commentId}`,
        },
        recipients: [
          {
            id: authorId,
          },
        ],
      });
    } catch (error) {
      console.log('KNOCK ERROR >>>', error);
      throw error;
    }
  }

  revalidatePath('/');
  revalidatePath(`/post/${postId}`);

  if (parentReplyId) {
    return { success: true, message: 'Reply created successfully!' };
  }

  return { success: true, message: 'Comment created successfully!' };
};
