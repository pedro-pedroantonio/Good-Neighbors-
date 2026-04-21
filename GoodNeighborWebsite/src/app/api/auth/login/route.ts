import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import {
  AUTH_COOKIE_NAME,
  AUTH_SESSION_SECONDS,
  createAuthToken,
  verifyPassword,
} from '@/lib/auth';
import type { AuthUser } from '@/types';

const ROLE_ALIASES: Record<string, string> = {
  Director: 'Director',
  Coach: 'Coach',
  'Reception/Intake': 'Reception/Intake',
  'Data Entry/Volunteer': 'Data Entry/Volunteer',
  'Data Entry / Volunteer': 'Data Entry/Volunteer',
  'Community Partner': 'Community Partner',
  'Community Partners': 'Community Partner',
  Viewer: 'Viewer',
  'Viewer Only': 'Viewer',
};

const GENERIC_AUTH_ERROR = 'Incorrect credentials';

function normalizeRole(role?: string) {
  if (!role) {
    return null;
  }

  const trimmed = role.trim();

  return ROLE_ALIASES[trimmed] ?? null;
}

export async function POST(request: NextRequest) {
  try {
    let body: { username?: string; password?: string; role?: string };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: 'Request body must be valid JSON' },
        { status: 400 }
      );
    }

    const { username, password } = body;
    const requestedRole = normalizeRole(body.role);

    // Basic validation
    if (!username) {
      return NextResponse.json({ message: 'Username is required' }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ message: 'Password is required' }, { status: 400 });
    }

    if (!requestedRole) {
      return NextResponse.json({ message: 'Role is required' }, { status: 400 });
    }

    // Query agent table for username (case-insensitive)
    const agents = (await query(
      'SELECT AgentID, FirstName, LastName, Email, Username, Password, AgentType, Volunteer FROM agent WHERE Username = ? LIMIT 1',
      [username]
    )) as any[];

    if (agents.length === 0) {
      return NextResponse.json({ message: GENERIC_AUTH_ERROR }, { status: 401 });
    }

    const agent = agents[0];
    const storedPassword = String(agent.Password ?? '');
    const passwordMatches = verifyPassword(password, storedPassword);

    if (!passwordMatches) {
      return NextResponse.json({ message: GENERIC_AUTH_ERROR }, { status: 401 });
    }

    const actualRole = normalizeRole(String(agent.AgentType ?? ''));

    if (!actualRole) {
      return NextResponse.json(
        { message: 'Account role is not configured correctly' },
        { status: 500 }
      );
    }

    if (requestedRole !== actualRole) {
      return NextResponse.json({ message: GENERIC_AUTH_ERROR }, { status: 401 });
    }

    const user: AuthUser & { timestamp: number } = {
      agentId: agent.AgentID,
      username: agent.Username,
      firstName: agent.FirstName,
      lastName: agent.LastName,
      role: agent.AgentType,
      volunteer: Number(agent.Volunteer ?? 0) === 1,
      timestamp: Date.now(),
    };

    const response = NextResponse.json(
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
      }
    );

    response.cookies.set(AUTH_COOKIE_NAME, createAuthToken(user), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: AUTH_SESSION_SECONDS,
    });
    response.headers.set('Cache-Control', 'no-store');

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'An error occurred during login' }, { status: 500 });
  }
}
