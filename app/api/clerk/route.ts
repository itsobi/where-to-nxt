import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/supabase/admin';

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      'Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local'
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification error', {
      status: 400,
    });
  }

  if (evt.type === 'user.created') {
    const { id, username, image_url } = evt.data;

    try {
      const { error } = await supabaseAdmin
        .from('users')
        .insert({
          clerk_user_id: id,
          username,
          profile_image: image_url,
        })
        .select();

      if (error) {
        console.error('Supabase insert error:', error);
        return new Response('Error inserting user', { status: 500 });
      }
    } catch (error) {
      console.error('Error: Could not insert user into database:', error);
      return new Response('Error inserting user', { status: 500 });
    }
  }

  if (evt.type === 'user.deleted') {
    const { id } = evt.data;
    try {
      await supabaseAdmin.from('users').delete().eq('clerk_user_id', id);
    } catch (error) {
      console.error('Error: Could not delete user from database', error);
    }
  }

  return new Response('Webhook received', { status: 200 });
}
