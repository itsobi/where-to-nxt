import { PROJECT_URL } from '@/lib/constants';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { userId } = await auth();
  if (req.method === 'POST') {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: 'price_1QTeBKE8ey3Irs86hClPodSb',
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${PROJECT_URL}/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${PROJECT_URL}/messages`,
        automatic_tax: { enabled: true },
        metadata: {
          userId,
        },
      });

      if (!session.url) {
        return Response.json({ error: 'No URL' }, { status: 500 });
      }

      // Redirect to the checkout session URL
      return Response.redirect(session.url, 303);
    } catch (error) {
      console.error(error);
      return Response.json({ error: error }, { status: 500 });
    }
  } else {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }
}
