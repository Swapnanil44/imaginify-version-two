import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createUser } from '@/lib/actions/user.action';
 // Adjust import path as needed

export async function POST(req: Request) {
  // Verify the webhook
  const headerPayload = headers();
  const svixId = (await headerPayload).get('svix-id');
  const svixTimestamp = (await headerPayload).get('svix-timestamp');
  const svixSignature = (await headerPayload).get('svix-signature');

  // Validate headers
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Error: Missing webhook headers', { status: 400 });
  }

  // Get the body
  const payload = await req.text();

  // Get webhook secret
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error('CLERK_WEBHOOK_SECRET is not set');
  }

  // Create a new Svix Webhook
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  // Verify the webhook
  try {
    evt = wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook', err);
    return new Response('Error: Invalid webhook', { status: 400 });
  }

  // Handle the webhook event
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url, username } = evt.data;

    try {
      await createUser({
        clerkId: id as string,
        email: email_addresses[0].email_address,
        username: username || '',
        firstName: first_name || '',
        lastName: last_name || '',
        photo: image_url || ''
      });

      return new Response('User processed', { status: 200 });
    } catch (error) {
      console.error('Error processing user:', error);
      return new Response('Error processing user', { status: 500 });
    }
  }

  return new Response('', { status: 200 });
}