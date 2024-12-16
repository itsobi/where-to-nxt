import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/supabase/admin';
import { Resend } from 'resend';
import { WelcomeEmailTemplate } from '@/components/EmailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const WEBHOOK_SECRET =
    process.env.NODE_ENV === 'development'
      ? process.env.DEVELOPMENT_CLERK_WEBHOOK_SECRET
      : process.env.PRODUCTION_CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      'Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local'
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400,
    });
  }

  // Do something with the payload
  const { id } = evt.data;

  if (evt.type === 'user.created') {
    console.log(evt.data);
    const { error: userCreateError } = await supabaseAdmin
      .from('users')
      .insert({
        clerk_user_id: id,
        email: evt.data.email_addresses[0].email_address,
        username: evt.data.username,
        profile_image: evt.data.image_url,
      });

    if (userCreateError) {
      console.error('Error upserting user into supabase:', userCreateError);
      return new Response('Error processing webhook', { status: 500 });
    }

    const { error: welcomeEmailError } = await resend.emails.send({
      from: 'Where to NXT? <welcome@wheretonxt.com>',
      to: [evt.data.email_addresses[0].email_address],
      subject: 'Welcome to Where To NXT!',
      react: WelcomeEmailTemplate({ username: evt.data.username! }),
    });

    if (welcomeEmailError) {
      console.error('Error sending welcome email:', welcomeEmailError);
      return Response.json({ welcomeEmailError }, { status: 500 });
    }
  }

  // if (evt.type === 'user.updated') {
  //   const { error: userUpdateError } = await supabaseAdmin.from('users').upsert(
  //     {
  //       clerk_user_id: id,
  //       username: evt.data.username,
  //       profile_image: evt.data.image_url,
  //     },
  //     {
  //       onConflict: 'clerk_user_id',
  //     }
  //   );

  //   if (userUpdateError) {
  //     console.error('Error upserting user into supabase:', userUpdateError);
  //     return new Response('Error processing webhook', { status: 500 });
  //   }
  // }

  return new Response('Webhook processed successfully', { status: 200 });
}
