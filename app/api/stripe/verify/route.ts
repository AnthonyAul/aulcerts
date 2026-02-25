import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // --- NEW BULLETPROOF DATABASE SYNC ---
    // If the payment was successful, ensure they exist in the DB with their Stripe ID
    const user = await currentUser();
    if (user && session.customer && session.payment_status === 'paid') {
      const email = user.primaryEmailAddress?.emailAddress;
      if (email) {
        await prisma.user.upsert({
          where: { email: email },
          update: { 
            isPro: true, 
            stripeCustomerId: session.customer as string 
          },
          create: { 
            id: user.id, // Matches Clerk's ID
            email: email, 
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            isPro: true, 
            stripeCustomerId: session.customer as string 
          }
        });
      }
    }

    return NextResponse.json({ 
      customerId: session.customer,
      status: session.status,
      paymentStatus: session.payment_status
    });
  } catch (error: any) {
    console.error('Stripe verify error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
