import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, readAuthToken } from '@/lib/auth';
import { getClientNames, type ClientNameRow } from '@/lib/clients';

function clientsJson(
  data: ClientNameRow[],
  hasMore: boolean,
  nextOffset: number,
  cacheStatus: 'HIT' | 'MISS'
) {
  return NextResponse.json(
    {
      success: true,
      data,
      hasMore,
      nextOffset,
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'private, max-age=60, stale-while-revalidate=120',
        'X-Cache': cacheStatus,
      },
    }
  );
}

function parsePositiveInt(value: string | null, fallback: number) {
  if (value === null) {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams;
    const limit = parsePositiveInt(searchParams.get('limit'), 100);
    const offset = parsePositiveInt(searchParams.get('offset'), 0);
    const search = searchParams.get('q') ?? '';

    if (limit === null || offset === null) {
      return NextResponse.json(
        { message: 'Invalid paging parameters' },
        {
          status: 400,
          headers: { 'Cache-Control': 'no-store' },
        }
      );
    }

    const page = await getClientNames({ limit, offset, search });

    return clientsJson(page.data, page.hasMore, page.nextOffset, page.cacheStatus);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { message: 'Failed to fetch clients' },
      {
        status: 500,
        headers: { 'Cache-Control': 'no-store' },
      }
    );
  }
}
