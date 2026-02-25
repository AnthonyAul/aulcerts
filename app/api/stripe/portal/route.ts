import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server'; // We use Clerk to securely identify them

export async function POST(req: Request) {
  try {
    // 1. Ensure the user is securely logged in
    const user = await currentUser();
    if (!user || !user.primaryEmailAddress) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Look them up in your database to get their Stripe Customer ID
    const dbUser = await prisma.user.findUnique({
      where: { email: user.primaryEmailAddress.emailAddress },
    });

    if (!dbUser || !dbUser.stripeCustomerId) {
      return NextResponse.json({ error: 'No active subscription found.' }, { status: 400 });
    }

    // 3. Generate the secure Stripe Portal link
    const stripe = getStripe();
    const origin = req.headers.get('origin') || process.env.APP_URL || 'https://aulcerts.com';

    const session = await stripe.billingPortal.sessions.create({
      customer: dbUser.stripeCustomerId,
      return_url: `${origin}/dashboard`, // Sends them back to your dashboard when they are done
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe portal error:', error);
    return NextResponse.json({ error: 'Failed to open billing portal' }, { status: 500 });
  }
}
