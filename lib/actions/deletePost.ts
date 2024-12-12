'use server';

import { supabaseAdmin } from '@/supabase/admin';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export const deletePost = async (postId: number, images?: string[]) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    if (images?.length) {
      const imagePaths = images
        .map((imageUrl) => {
          const match = imageUrl.match(/\/posts\/(.+)$/);
          return match ? match[1] : null;
        })
        .filter(Boolean) as string[];

      if (imagePaths.length > 0) {
        const { data, error: storageError } = await supabaseAdmin.storage
          .from('posts')
          .remove(imagePaths);

        console.log(`DELETED IMAGES: ${imagePaths}`);

        if (storageError) {
          console.error('Failed to delete images:', storageError);
          throw new Error('Failed to delete images');
        }
        console.log(`DELETED ${data?.length} images`);
      }
    }

    const { error } = await supabaseAdmin
      .from('posts')
      .delete()
      .eq('id', postId);
    console.log(`DELETED POST: ${postId}`);

    if (error) {
      throw new Error('Failed to delete post');
    }
    revalidatePath('/');
    return { success: true, message: 'Post deleted successfully!' };
  } catch (error) {
    console.error('Error deleting post:', error);
    return {
      success: false,
      message: 'An error occurred while deleting this post.',
    };
  }
};
