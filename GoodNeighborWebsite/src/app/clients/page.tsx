import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIE_NAME, readAuthToken } from '@/lib/auth';
import { getClientNames } from '@/lib/clients';
import ClientsPageClient from './ClientsPageClient';

export const dynamic = 'force-dynamic';

export default async function ClientsPage() {
  const cookieStore = await cookies();
  const user = readAuthToken(cookieStore.get(AUTH_COOKIE_NAME)?.value);

  if (!user) {
    redirect('/login');
  }

  try {
    const { data, hasMore } = await getClientNames({ limit: 100, offset: 0 });

    return <ClientsPageClient initialClients={data} initialHasMore={hasMore} initialUser={user} />;
  } catch (error) {
    console.error('Error rendering clients page:', error);

    return (
      <ClientsPageClient
        initialClients={[]}
        initialHasMore={false}
        initialUser={user}
        initialError="Failed to fetch clients"
      />
    );
  }
}
