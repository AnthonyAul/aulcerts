import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  // 1. Get the raw text body and the Stripe signature header
  const payload = await req.text();
  const signature = req.headers.get('Stripe-Signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature found' }, { status: 400 });
  }

  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  // 2. Cryptographically verify that this message actually came from Stripe
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // 3. Process the 5 events we set up
  try {
    switch (event.type) {
      
      // When they first sign up (or use the VIP coupon)
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        // Grab the email they used at checkout and their new Stripe Customer ID
        const customerEmail = session.customer_details?.email || session.customer_email;
        const customerId = session.customer as string;

        if (customerEmail && customerId) {
          // Find them in your database by email and upgrade them!
          await prisma.user.updateMany({
            where: { email: customerEmail },
            data: {
              isPro: true,
              stripeCustomerId: customerId, // Save this so we recognize them next month
            },
          });
          console.log(`Upgraded user ${customerEmail} to Pro.`);
        }
        break;
      }
      
      // When their monthly recurring charge succeeds
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;
        const customerId = invoice.customer as string;
        
        if (customerId) {
          await prisma.user.updateMany({
            where: { stripeCustomerId: customerId },
            data: { isPro: true },
          });
        }
        break;
      }

      // If their card declines, or they cancel their subscription
      case 'invoice.payment_failed':
      case 'customer.subscription.deleted': {
        const object = event.data.object as any;
        const customerId = object.customer as string;

        if (customerId) {
          await prisma.user.updateMany({
            where: { stripeCustomerId: customerId },
            data: { isPro: false }, // Revoke Pro access instantly
          });
          console.log(`Revoked Pro for customer ${customerId}`);
        }
        break;
      }

      // If they upgrade/downgrade their plan
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer as string;
        const status = subscription.status;

        // They only get Pro if their Stripe status is strictly 'active' or 'trialing'
        const isPro = status === 'active' || status === 'trialing';

        if (customerId) {
          await prisma.user.updateMany({
            where: { stripeCustomerId: customerId },
            data: { isPro: isPro },
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Error processing webhook database update:', error);
    return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
  }

  // Tell Stripe we successfully received and processed the message
  return NextResponse.json({ received: true });
}
