import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { passcode } = await request.json();
    const correctPasscode = process.env.TPC_PASSCODE;

    if (!correctPasscode) {
      return NextResponse.json(
        { error: 'Server configuration error: TPC_PASSCODE not set' },
        { status: 500 }
      );
    }

    if (passcode === correctPasscode) {
      // In a real app, we would set an HttpOnly cookie with a JWT here.
      // For this MVP, we'll return success and let the client handle basic state,
      // but ideally this should use secure sessions.
      const response = NextResponse.json({ success: true });
      
      // Set a simple cookie to denote admin status (in production, sign this!)
      response.cookies.set('admin_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 // 1 day
      });
      
      return response;
    }

    return NextResponse.json(
      { error: 'Invalid passcode' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
