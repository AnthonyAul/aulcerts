import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(req: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    return NextResponse.json({
      currentRole: dbUser?.currentRole || '',
      desiredRole: dbUser?.desiredRole || '',
    });
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { currentRole, desiredRole } = await req.json();

    // Upsert ensures we update the user if they exist, or create them if they don't!
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        currentRole,
        desiredRole,
      },
      create: {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        currentRole,
        desiredRole,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
