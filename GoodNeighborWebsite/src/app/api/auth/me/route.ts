import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, readAuthToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = readAuthToken(request.cookies.get(AUTH_COOKIE_NAME)?.value);

  if (!user) {
    return NextResponse.json(
      { message: 'Not authenticated' },
      {
        status: 401,
        headers: { 'Cache-Control': 'no-store' },
      }
    );
  }

  return NextResponse.json(
    {
      success: true,
      user: {
        agentId: user.agentId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        volunteer: user.volunteer,
      },
    },
    {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    }
  );
}
