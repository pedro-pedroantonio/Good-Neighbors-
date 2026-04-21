import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, readAuthToken } from '@/lib/auth';
import { getClientProfileDashboard } from '@/lib/clientProfile';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
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

    const { id } = await context.params;
    const clientId = Number(id);

    if (!Number.isInteger(clientId) || clientId <= 0) {
      return NextResponse.json(
        { message: 'Invalid client ID' },
        {
          status: 400,
          headers: { 'Cache-Control': 'no-store' },
        }
      );
    }

    const dashboard = await getClientProfileDashboard(clientId);

    if (!dashboard) {
      return NextResponse.json(
        { message: 'Client not found' },
        {
          status: 404,
          headers: { 'Cache-Control': 'no-store' },
        }
      );
    }

    return NextResponse.json(
      { success: true, data: dashboard },
      {
        status: 200,
        headers: {
          'Cache-Control': 'private, max-age=60, stale-while-revalidate=120',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching client profile:', error);
    return NextResponse.json(
      { message: 'Failed to fetch client profile' },
      {
        status: 500,
        headers: { 'Cache-Control': 'no-store' },
      }
    );
  }
}
