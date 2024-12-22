'use server';

import { supabaseAdmin } from '@/supabase/admin';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { Knock } from '@knocklabs/node';
import { PROJECT_URL } from '../constants';
import { isCurrentUserPro } from '../queries/getProUser';

type createCommentProps = {
  postId: number | undefined;
  comment: string;
  authorId: string;
};

const knock = new Knock(process.env.KNOCK_SECRET_KEY);

export const createComment = async ({
  postId,
  comment,
  authorId,
}: createCommentProps) => {
  const user = await currentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const proUser = await isCurrentUserPro(user.id);

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
    const { error } = await supabaseAdmin
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

    // FOR PRO USERS ONLY
    if (proUser) {
      try {
        await knock.workflows.trigger('new-comment', {
          actor: {
            id: user.id,
          },
          data: {
            sender: user.username,

            url: `${PROJECT_URL}/post/${postId}`,
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

    return { success: true, message: 'Comment created successfully!' };
  } catch (error) {
    console.log('ERROR >>>', error);
    return { success: false, message: 'Failed to create comment' };
  }
};
