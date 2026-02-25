import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const stripe = getStripe();

    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) {
      throw new Error('STRIPE_PRICE_ID environment variable is required');
    }

    const origin = req.headers.get('origin') || process.env.APP_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      // Notice we removed payment_method_types. 
      // Stripe will now automatically use whatever you turn on in your dashboard!
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: `${origin}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/api/stripe/cancel`,
      customer_email: email,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
