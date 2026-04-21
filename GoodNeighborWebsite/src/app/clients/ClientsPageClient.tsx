'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card, GradientButton, ModernInput } from '@/components/ui';
import type { AuthUser } from '@/types';

type ClientNameRow = {
  ClientID: number;
  FullName: string;
  Suffix: string | null;
  DateOfBirth: string | null;
  EntryDate: string | null;
  MaidenName: string | null;
  FirstName: string | null;
  MiddleName: string | null;
  LastName: string | null;
  FullAddress: string;
  County: string | null;
  CellPhone1: string;
  CellPhone2: string;
  Email: string;
};

type ClientsPageClientProps = {
  initialClients: ClientNameRow[];
  initialHasMore: boolean;
  initialUser: AuthUser;
  initialError?: string | null;
};

export default function ClientsPageClient({
  initialClients,
  initialHasMore,
  initialUser,
  initialError = null,
}: ClientsPageClientProps) {
  const router = useRouter();
  const [clients, setClients] = useState<ClientNameRow[]>(initialClients);
  const [error, setError] = useState<string | null>(initialError);
  const [searchInput, setSearchInput] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [nextOffset, setNextOffset] = useState(initialClients.length);
  const [loadingAction, setLoadingAction] = useState<'search' | 'more' | null>(null);
  const [selectedAction, setSelectedAction] = useState('Search Neighbors');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const actions = [
    { key: 'Search Neighbors', label: 'Search Neighbors' },
    { key: 'Add Neighbor', label: 'Add Neighbor' },
    { key: 'Volunteer/Staff', label: 'Volunteer/Staff' },
    { key: 'Coaches', label: 'Coaches' },
    { key: 'Neighbors On Hold', label: 'On Hold' },
    { key: 'Volunteer Hours', label: 'Volunteer Hours' },
    { key: 'Generate Report', label: 'Generate Report' },
    { key: 'Settings', label: 'Settings' },
  ];

  const welcomeName = `${initialUser.firstName} ${initialUser.lastName}`;
  const accountType = initialUser.volunteer ? 'Volunteer' : 'Staff';

  async function fetchClientPage(options: {
    search: string;
    offset: number;
    replace: boolean;
    mode: 'search' | 'more';
  }) {
    setLoadingAction(options.mode);
    setError(null);

    try {
      const params = new URLSearchParams({
        limit: '100',
        offset: String(options.offset),
      });

      if (options.search) {
        params.set('q', options.search);
      }

      const response = await fetch(`/api/clients?${params.toString()}`, {
        credentials: 'include',
        cache: 'no-store',
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || 'Failed to fetch neighbors');
      }

      const pageClients = (payload.data ?? []) as ClientNameRow[];

      setClients((current) => (options.replace ? pageClients : [...current, ...pageClients]));
      setHasMore(Boolean(payload.hasMore));
      setNextOffset(Number(payload.nextOffset ?? options.offset + pageClients.length));

      if (options.replace) {
        setActiveSearch(options.search);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while loading neighbors');
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await fetchClientPage({
      search: searchInput.trim(),
      offset: 0,
      replace: true,
      mode: 'search',
    });
  }

  async function handleSeeMore() {
    await fetchClientPage({
      search: activeSearch,
      offset: nextOffset,
      replace: false,
      mode: 'more',
    });
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      router.push('/login');
    }
  };

  return (
    <div className="h-screen min-h-screen flex flex-col bg-slate-50">
      <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur-xl">
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-700 shadow-sm transition hover:bg-slate-200"
                aria-label="Toggle menu"
              >
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Clients Directory
                </h1>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                  <p>
                    Welcome, <span className="font-semibold text-slate-800">{welcomeName}</span>
                  </p>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      accountType === 'Volunteer'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {accountType}
                  </span>
                </div>
              </div>
            </div>
            <GradientButton onClick={logout} variant="danger">
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </GradientButton>
          </div>
        </div>
      </div>

      <div className="relative w-full flex-1 min-h-0 overflow-hidden px-0 py-0 sm:px-6 sm:py-6 lg:px-8">
        <div
          className={`lg:hidden fixed left-4 right-4 top-28 z-50 rounded-[1.75rem] border border-white/65 bg-white/75 p-4 shadow-xl backdrop-blur-sm transition duration-200 ${
            mobileMenuOpen
              ? 'translate-y-0 opacity-100'
              : 'pointer-events-none -translate-y-2 opacity-0'
          }`}
          aria-hidden={!mobileMenuOpen}
        >
          <div className="space-y-3">
            {actions.map((action) => (
              <button
                key={action.key}
                type="button"
                tabIndex={mobileMenuOpen ? 0 : -1}
                onClick={() => {
                  setSelectedAction(action.key);
                  setMobileMenuOpen(false);
                }}
                className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                  selectedAction === action.key
                    ? 'bg-emerald-600/90 text-white shadow'
                    : 'bg-white/65 text-slate-700 hover:bg-white/80'
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <Card className="border-red-500/50 bg-red-500/20 p-4">
            <div className="flex gap-3">
              <svg
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="text-red-200">{error}</div>
            </div>
          </Card>
        ) : (
          <div className="h-full min-h-0 overflow-hidden border-slate-200 bg-white/95 p-4 shadow-xl sm:rounded-[2.5rem] sm:border sm:p-6">
            <div className="grid h-full min-h-0 gap-6 lg:grid-cols-[280px_1fr]">
              <aside className="hidden h-full rounded-[1.75rem] bg-slate-50 p-6 lg:block">
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Dashboard GNBC
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-900">Navigation</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Select a function to see its content on the right.
                  </p>
                </div>
                <div className="space-y-3">
                  {actions.map((action) => (
                    <button
                      key={action.key}
                      type="button"
                      onClick={() => setSelectedAction(action.key)}
                      className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                        selectedAction === action.key
                          ? 'bg-emerald-600 text-white shadow-lg'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </aside>

              <main className="flex h-full min-h-0 flex-col overflow-hidden">
                <div className="flex h-full flex-col">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        Selected action
                      </p>
                      <h1 className="mt-2 text-2xl font-semibold text-slate-900">
                        {selectedAction}
                      </h1>
                    </div>
                    <div className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                      {clients.length} neighbors
                    </div>
                  </div>

                  <div className="mt-6 min-h-0 flex-1">
                    {selectedAction === 'Search Neighbors' ? (
                      <div className="flex h-full min-h-0 flex-col gap-5">
                        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
                          <ModernInput
                            placeholder="Search neighbors or ID..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full"
                          />

                          <div className="flex gap-3">
                            <button
                              type="submit"
                              disabled={loadingAction === 'search'}
                              className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {loadingAction === 'search' ? 'Searching...' : 'Search'}
                            </button>

                            {activeSearch && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSearchInput('');
                                  setActiveSearch('');
                                  void fetchClientPage({
                                    search: '',
                                    offset: 0,
                                    replace: true,
                                    mode: 'search',
                                  });
                                }}
                                className="inline-flex items-center justify-center rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                        </form>

                        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
                          <p>
                            {activeSearch
                              ? `Showing results for "${activeSearch}"`
                              : 'Showing the first page of neighbors'}
                          </p>
                          <p>{clients.length} loaded</p>
                        </div>

                        <div className="min-h-0 flex-1 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50">
                          <div className="h-full overflow-x-auto">
                            <table className="w-full text-left">
                              <thead className="bg-slate-100">
                                <tr>
                                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                                    Name
                                  </th>
                                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                                    Address
                                  </th>
                                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                                    Contact
                                  </th>
                                  <th className="w-16 px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                                    Open
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {clients.length > 0 ? (
                                  clients.map((client) => (
                                    <tr
                                      key={client.ClientID}
                                      className="border-b border-slate-200 last:border-0"
                                    >
                                      <td className="px-4 py-4 align-top">
                                        <div className="text-sm font-semibold text-slate-900">
                                          {client.FullName || 'Not available'}
                                        </div>
                                        <div className="mt-1 text-xs text-slate-500">
                                          ID {client.ClientID}
                                          {client.Suffix ? ` • ${client.Suffix}` : ''}
                                        </div>
                                        <div className="mt-1 text-xs text-slate-500">
                                          DOB: {client.DateOfBirth || 'Not available'}
                                        </div>
                                      </td>
                                      <td className="px-4 py-4 align-top text-sm text-slate-700">
                                        <div>{client.FullAddress || 'Not available'}</div>
                                        <div className="mt-1 text-xs text-slate-500">
                                          County: {client.County || 'Not available'}
                                        </div>
                                      </td>
                                      <td className="px-4 py-4 align-top text-sm text-slate-700">
                                        <div>Cell: {client.CellPhone1 || 'Not available'}</div>
                                        <div className="mt-1">Home: {client.CellPhone2 || 'Not available'}</div>
                                        <div className="mt-1 text-xs text-slate-500">
                                          Email: {client.Email || 'Not available'}
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 text-right">
                                        <button
                                          type="button"
                                          onClick={() => router.push(`/clients/${client.ClientID}`)}
                                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                          aria-label={`Open profile for ${
                                            [client.FirstName, client.LastName]
                                              .filter(Boolean)
                                              .join(' ') || `client ${client.ClientID}`
                                          }`}
                                        >
                                          <svg
                                            className="h-5 w-5"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            aria-hidden="true"
                                          >
                                            <circle cx="5" cy="12" r="1.8" />
                                            <circle cx="12" cy="12" r="1.8" />
                                            <circle cx="19" cy="12" r="1.8" />
                                          </svg>
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td
                                      colSpan={4}
                                      className="px-4 py-10 text-center text-sm text-slate-500"
                                    >
                                      No neighbors found.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm text-slate-500">
                            {hasMore
                              ? 'More neighbors are available.'
                              : 'You are at the end of the current results.'}
                          </p>
                          {hasMore && (
                            <button
                              type="button"
                              onClick={handleSeeMore}
                              disabled={loadingAction === 'more'}
                              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {loadingAction === 'more' ? 'Loading more...' : 'See More'}
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
                          <h2 className="text-lg font-semibold text-slate-900">{selectedAction}</h2>
                          <p className="mt-3 text-sm text-slate-600">
                            This area will display the selected dashboard function.
                          </p>
                        </div>
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
                          <p className="text-sm text-slate-500">
                            Use the buttons on the left to switch between Search Neighbors,
                            Add Neighbor, Volunteer/Staff, and the other dashboard tools.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </main>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
