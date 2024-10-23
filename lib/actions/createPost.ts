'use server';

import { supabaseAdmin } from '@/supabase/admin';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export const createPost = async (
  formData: FormData
): Promise<{ success: boolean; message: string }> => {
  auth().protect();
  const { userId } = auth();

  if (!userId) {
    return { success: false, message: 'Not authorized.' };
  }

  const post = formData.get('post')?.toString().trim();
  const country = formData.get('country');

  if (!post || !country) {
    return {
      success: false,
      message: 'A post and country are required to create a post.',
    };
  }

  try {
    const imageUrls: string[] = [];

    for (const [key, value] of Array.from(formData.entries())) {
      if (key.startsWith('image-') && value instanceof Blob) {
        const filename = `${userId}/${Date.now()}-${value.name}`;
        const { data, error } = await supabaseAdmin.storage
          .from('posts')
          .upload(filename, value);

        if (error) {
          throw error;
        }

        console.log(`-----FILE: ${filename} UPLOADED-----`);
        const { data: publicUrl } = supabaseAdmin.storage
          .from('posts')
          .getPublicUrl(filename);

        imageUrls.push(publicUrl.publicUrl);
      }
    }

    const { data, error } = await supabaseAdmin
      .from('posts')
      .insert({
        author_clerk_user_id: userId,
        post,
        country,
        images: imageUrls,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log(`-----POST: ${data.id} CREATED -----`);

    revalidatePath('/');
    return { success: true, message: 'Post created successfully!' };
  } catch (error) {
    console.error('Error creating post:', error);
    return {
      success: false,
      message: 'An error occurred while creating the post.',
    };
  }
};
