'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { GradientButton } from '@/components/ui';
import type {
  ClientProfileDashboard,
  ClientDetailField,
  ClientAlertRecord,
  ClientAssistanceRecord,
  ClientIndirectAssistanceRecord,
  ClientIndirectVisitRecord,
  ClientVisitRecord,
} from '@/lib/clientProfile';

type Section = 'overview' | 'details' | 'alerts' | 'assistances' | 'visits' | 'household' | 'relatives';

const sections: Array<{ id: Section; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'details', label: 'All Info' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'assistances', label: 'Assistances' },
  { id: 'visits', label: 'Visits' },
  { id: 'household', label: 'Household' },
  { id: 'relatives', label: 'Relatives' },
];

function groupBy<T extends ClientDetailField>(fields: T[]) {
  return fields.reduce<Record<string, T[]>>((acc, field) => {
    if (!acc[field.group]) {
      acc[field.group] = [];
    }

    acc[field.group].push(field);
    return acc;
  }, {});
}

function SectionCard({
  title,
  description,
  children,
  accentClassName = 'from-slate-500 to-slate-300',
}: {
  title: string;
  description?: string;
  children: ReactNode;
  accentClassName?: string;
}) {
  return (
    <section className="relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className={`absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r ${accentClassName}`} />
      <div className="mb-5 pt-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{title}</p>
        {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </section>
  );
}

function ListBlock({
  items,
  emptyText,
  renderItem,
}: {
  items: unknown[];
  emptyText: string;
  renderItem: (item: any, index: number) => React.ReactNode;
}) {
  if (!items.length) {
    return <p className="text-sm text-slate-500">{emptyText}</p>;
  }

  return <div className="space-y-3">{items.map(renderItem)}</div>;
}

export default function ClientProfilePage() {
  const params = useParams<{ id: string }>();
  const { user, loading: authLoading, logout } = useAuth();
  const [dashboard, setDashboard] = useState<ClientProfileDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section>('overview');

  useEffect(() => {
    if (authLoading || !user || !params.id) return;

    async function fetchClient() {
      try {
        setLoading(true);
        const response = await fetch(`/api/clients/${params.id}`, {
          credentials: 'include',
          cache: 'no-store',
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.message || 'Failed to fetch client profile');
        }

        setDashboard(payload.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchClient();
  }, [authLoading, params.id, user]);

  const welcomeName = user ? `${user.firstName} ${user.lastName}` : 'Loading...';
  const detailGroups = useMemo(
    () => (dashboard ? groupBy(dashboard.details) : {}),
    [dashboard]
  );

  if (!authLoading && !user) {
    return null;
  }

  const client = dashboard?.client;

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.10),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.08),_transparent_28%),linear-gradient(to_bottom,_#f8fafc,_#f1f5f9)] text-slate-900">
      <div className="border-b border-white/60 bg-white/80 backdrop-blur-xl">
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-slate-600">
                Welcome, <span className="font-semibold text-slate-800">{welcomeName}</span>
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <h1 className="truncate text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {client?.displayName || 'Client profile'}
                </h1>
                <GradientButton
                  onClick={logout}
                  disabled={authLoading || !user}
                  variant="danger"
                  className="shrink-0 whitespace-nowrap px-3 py-2 text-xs"
                >
                  Logout
                </GradientButton>
              </div>
              {dashboard && client && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      dashboard.eligibility.color === 'red'
                        ? 'bg-red-100 text-red-700'
                        : dashboard.eligibility.color === 'orange'
                          ? 'bg-amber-100 text-amber-700'
                          : dashboard.eligibility.color === 'green'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {dashboard.eligibility.message}
                  </span>
                  {client.isOnHold && (
                    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      On Hold
                    </span>
                  )}
                  {client.isDeceased && (
                    <span className="inline-flex rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                      Deceased
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/clients"
                className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:-translate-y-0.5 hover:bg-emerald-100"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                Back to Search Neighbors
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="flex min-h-0 flex-1 flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setSelectedSection(section.id)}
              className={`inline-flex shrink-0 items-center rounded-lg px-4 py-2 text-sm font-semibold transition ${
                selectedSection === section.id
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-white/75 text-slate-700 ring-1 ring-slate-200 hover:bg-white'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        <section className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden border-white/70 bg-white/90 shadow-xl shadow-slate-200/70 sm:rounded-[2rem] sm:border">
          {loading ? (
            <div className="flex min-h-72 items-center justify-center text-sm font-medium text-slate-500">
              Loading profile...
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : dashboard && client ? (
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 sm:p-6 lg:p-8">
              {selectedSection === 'overview' && (
                <div className="flex min-h-full flex-col gap-6">
                  <div className="grid items-stretch gap-4 xl:grid-cols-[1.4fr_1fr]">
                    <SectionCard
                      title="Neighbor Profile"
                      description="Core identity and file details."
                      accentClassName="from-sky-400 via-emerald-400 to-amber-300"
                    >
                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                            Full Name
                          </p>
                          <p className="mt-2 text-base font-semibold text-slate-900">{client.displayName}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                            Client ID
                          </p>
                          <p className="mt-2 text-base font-semibold text-slate-900">{client.clientId}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                            Entry Date
                          </p>
                          <p className="mt-2 text-base font-semibold text-slate-900">
                            {client.entryDate || 'Not available'}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                            DOB
                          </p>
                          <p className="mt-2 text-base font-semibold text-slate-900">
                            {client.dateOfBirth || 'Not available'}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                            Address
                          </p>
                          <p className="mt-2 text-base font-semibold text-slate-900">{client.fullAddress}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                            Contact
                          </p>
                          <p className="mt-2 text-base font-semibold text-slate-900">
                            {client.cellPhone1}
                          </p>
                        </div>
                      </div>
                    </SectionCard>

                    <SectionCard
                      title="Eligibility"
                      description="Household-based assistance status."
                      accentClassName="from-emerald-400 via-lime-300 to-amber-300"
                    >
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                              Household Help Status
                            </p>
                            <p className="mt-2 text-2xl font-bold text-slate-900">
                              {dashboard.eligibility.message}
                            </p>
                          </div>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              dashboard.eligibility.color === 'red'
                                ? 'bg-red-100 text-red-700'
                                : dashboard.eligibility.color === 'orange'
                                  ? 'bg-amber-100 text-amber-700'
                                  : dashboard.eligibility.color === 'green'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {dashboard.eligibility.color.toUpperCase()}
                          </span>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full rounded-full ${
                              dashboard.eligibility.color === 'red'
                                ? 'bg-red-500'
                                : dashboard.eligibility.color === 'orange'
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                            }`}
                            style={{
                              width: `${Math.max(0, Math.min(100, dashboard.eligibility.progress))}%`,
                            }}
                          />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                              Last assisted
                            </p>
                            <p className="mt-2 text-sm font-semibold text-slate-900">
                              {dashboard.eligibility.lastAssistedPerson}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {dashboard.eligibility.lastAssistanceDate || 'N/A'}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                              Assistance count
                            </p>
                            <p className="mt-2 text-sm font-semibold text-slate-900">
                              {dashboard.eligibility.totalAssistances} / {dashboard.eligibility.assistancesLimit || 'N/A'}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              Last amount: {dashboard.eligibility.lastAssistanceAmount.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                              })}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                              Next eligible
                            </p>
                            <p className="mt-2 text-sm font-semibold text-slate-900">
                              {dashboard.eligibility.nextEligibilityDate || 'N/A'}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                              Progress
                            </p>
                            <p className="mt-2 text-sm font-semibold text-slate-900">
                              {Math.round(dashboard.eligibility.progress)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </SectionCard>
                  </div>

                  <div className="grid items-stretch gap-4 lg:grid-cols-2 xl:grid-cols-4">
                    <SectionCard title="Counts" accentClassName="from-fuchsia-400 via-violet-300 to-sky-300">
                      <div className="grid gap-3 text-sm text-slate-700">
                        <p>Household: {dashboard.counts.householdMembers}</p>
                        <p>Relatives: {dashboard.counts.relativeCount}</p>
                        <p>Visits: {dashboard.counts.visitCount}</p>
                        <p>Assistance: {dashboard.counts.assistanceCount}</p>
                      </div>
                    </SectionCard>
                    <SectionCard
                      title="Recent Activity"
                      description="Latest item from each record type."
                      accentClassName="from-amber-400 via-rose-300 to-fuchsia-300"
                    >
                      <div className="flex gap-3 overflow-x-auto pb-1">
                        {[
                          {
                            label: 'Alert',
                            metaLabel: 'Date',
                            metaValue: dashboard.recent.alertDate,
                            primary: dashboard.recent.alertDescription,
                            secondary: dashboard.recent.hasAlert ? 'Most recent alert' : 'No alert',
                            tone: 'from-rose-50 to-rose-100 border-rose-200 text-rose-700',
                          },
                          {
                            label: 'No-Show',
                            metaLabel: 'Date',
                            metaValue: dashboard.recent.noShowDate,
                            primary: dashboard.recent.noShowDescription,
                            secondary: dashboard.recent.hasNoShow ? dashboard.recent.noShowAgentName : 'No no-show',
                            tone: 'from-amber-50 to-amber-100 border-amber-200 text-amber-700',
                          },
                          {
                            label: 'Visit',
                            metaLabel: 'Date',
                            metaValue: dashboard.recent.visitDate,
                            primary: dashboard.recent.visitDescription,
                            secondary: dashboard.recent.hasVisit ? dashboard.recent.visitAgentName : 'No visit',
                            tone: 'from-sky-50 to-sky-100 border-sky-200 text-sky-700',
                          },
                          {
                            label: 'Assistance',
                            metaLabel: 'Amount',
                            metaValue: dashboard.recent.hasAssistance ? dashboard.recent.assistanceAmount : null,
                            primary: dashboard.recent.assistanceName,
                            secondary: dashboard.recent.assistanceDescription,
                            tone: 'from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-700',
                          },
                          {
                            label: 'Note',
                            metaLabel: 'Agent',
                            metaValue: dashboard.recent.hasNote ? dashboard.recent.noteAgentName : null,
                            primary: dashboard.recent.noteDescription,
                            secondary: dashboard.recent.hasNote ? 'Most recent note' : 'No note',
                            tone: 'from-violet-50 to-violet-100 border-violet-200 text-violet-700',
                          },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className={`flex h-full min-w-[220px] max-w-[220px] flex-shrink-0 flex-col overflow-hidden rounded-2xl border bg-gradient-to-br p-4 ${item.tone}`}
                          >
                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                              {item.label}
                            </p>
                            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                              {item.metaLabel}
                            </p>
                            <p className="mt-1 break-words text-sm font-semibold leading-snug text-slate-900">
                              {item.metaValue || 'Not available'}
                            </p>
                            <p className="mt-2 break-words text-sm leading-snug text-slate-700">
                              {item.primary}
                            </p>
                            <p className="mt-1 break-words text-xs leading-snug text-slate-500">
                              {item.secondary}
                            </p>
                          </div>
                        ))}
                      </div>
                    </SectionCard>
                    <SectionCard title="Status" accentClassName="from-cyan-400 via-sky-300 to-emerald-300">
                      <div className="grid gap-3 text-sm text-slate-700">
                        <p>On Hold: {client.isOnHold ? 'Yes' : 'No'}</p>
                        <p>Deceased: {client.isDeceased ? 'Yes' : 'No'}</p>
                        <p>County: {client.county}</p>
                        <p>Agent: {client.agentFullName}</p>
                      </div>
                    </SectionCard>
                    <SectionCard title="Assessments" accentClassName="from-rose-400 via-amber-300 to-lime-300">
                      <div className="flex flex-wrap gap-2">
                        {dashboard.assessments.hasAssessment ? (
                          dashboard.assessments.items.map((item) => (
                            <span
                              key={item}
                              className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
                            >
                              {item}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-slate-500">No assessment flags.</span>
                        )}
                      </div>
                    </SectionCard>
                  </div>
                </div>
              )}

              {selectedSection === 'details' && (
                <div className="flex min-h-full flex-col gap-6">
                  {Object.entries(detailGroups).map(([groupName, fields]) => (
                    <SectionCard
                      key={groupName}
                      title={groupName}
                      accentClassName={
                        groupName === 'Identity'
                          ? 'from-sky-400 via-cyan-300 to-emerald-300'
                          : groupName === 'Address'
                            ? 'from-emerald-400 via-lime-300 to-amber-200'
                            : groupName === 'Contact'
                              ? 'from-fuchsia-400 via-violet-300 to-sky-300'
                              : groupName === 'Demographics'
                                ? 'from-amber-400 via-orange-300 to-rose-300'
                                : groupName === 'Income'
                                  ? 'from-emerald-400 via-teal-300 to-cyan-300'
                                  : groupName === 'Benefits'
                                    ? 'from-blue-400 via-sky-300 to-indigo-300'
                                    : groupName === 'Needs'
                                      ? 'from-rose-400 via-pink-300 to-fuchsia-300'
                                      : 'from-slate-400 via-slate-300 to-slate-200'
                      }
                    >
                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {fields.map((field) => (
                          <div key={`${groupName}-${field.label}`} className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                              {field.label}
                            </p>
                            <p className="mt-2 text-sm font-semibold text-slate-900">{field.value}</p>
                          </div>
                        ))}
                      </div>
                    </SectionCard>
                  ))}
                </div>
              )}

              {selectedSection === 'alerts' && (
                <SectionCard
                  title="Alerts"
                  description="All alerts for this neighbor."
                  accentClassName="from-rose-400 via-amber-300 to-orange-300"
                >
                  <ListBlock
                    items={dashboard.records.alerts}
                    emptyText="No alerts found."
                    renderItem={(alert: ClientAlertRecord) => (
                      <div key={alert.alertId} className="rounded-2xl bg-slate-50 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-semibold text-slate-900">{alert.alertDate}</p>
                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                            {alert.agentFullName}
                          </p>
                        </div>
                        <p className="mt-2 text-sm text-slate-700">{alert.alertDescription}</p>
                      </div>
                    )}
                  />
                </SectionCard>
              )}

              {selectedSection === 'assistances' && (
                <div className="grid min-h-full items-stretch gap-6 xl:grid-cols-2">
                  <SectionCard
                    title="Direct Assistance"
                    description="All direct assistance records."
                    accentClassName="from-emerald-400 via-lime-300 to-amber-200"
                  >
                    <ListBlock
                      items={dashboard.records.assistances}
                      emptyText="No direct assistance found."
                      renderItem={(assistance: ClientAssistanceRecord) => (
                        <div key={assistance.assistanceId} className="rounded-2xl bg-slate-50 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="font-semibold text-slate-900">{assistance.dateGranted}</p>
                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                              {assistance.agentFullName}
                            </p>
                          </div>
                          <p className="mt-2 text-sm text-slate-700">
                            {assistance.categoryName} for {assistance.amount}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">{assistance.description}</p>
                          <p className="mt-1 text-sm text-slate-600">Notes: {assistance.assistanceNote}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            Counts toward eligibility: {assistance.countsTowardEligibility ? 'Yes' : 'No'}
                          </p>
                        </div>
                      )}
                    />
                  </SectionCard>

                  <SectionCard
                    title="Indirect Assistance"
                    description="All indirect assistance records."
                    accentClassName="from-cyan-400 via-sky-300 to-indigo-300"
                  >
                    <ListBlock
                      items={dashboard.records.indirectAssistances}
                      emptyText="No indirect assistance found."
                      renderItem={(assistance: ClientIndirectAssistanceRecord) => (
                        <div key={assistance.indirectAssistanceId} className="rounded-2xl bg-slate-50 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="font-semibold text-slate-900">{assistance.dateGranted}</p>
                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                              {assistance.mainRecipient}
                            </p>
                          </div>
                          <p className="mt-2 text-sm text-slate-700">
                            {assistance.clientFullName} indirectly benefited from {assistance.assistanceCategory} assistance for {assistance.amount}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">{assistance.address}</p>
                        </div>
                      )}
                    />
                  </SectionCard>
                </div>
              )}

              {selectedSection === 'visits' && (
                <div className="grid min-h-full items-stretch gap-6 xl:grid-cols-2">
                  <SectionCard
                    title="Direct Visits"
                    description="All direct visit records."
                    accentClassName="from-sky-400 via-cyan-300 to-emerald-300"
                  >
                    <ListBlock
                      items={dashboard.records.visits}
                      emptyText="No direct visits found."
                      renderItem={(visit: ClientVisitRecord) => (
                        <div key={visit.visitId} className="rounded-2xl bg-slate-50 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="font-semibold text-slate-900">{visit.visitDate}</p>
                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                              {visit.agentName}
                            </p>
                          </div>
                          <p className="mt-2 text-sm text-slate-700">{visit.description}</p>
                          <p className="mt-1 text-sm text-slate-600">{visit.status}</p>
                        </div>
                      )}
                    />
                  </SectionCard>

                  <SectionCard
                    title="Indirect Visits"
                    description="All indirect visit records."
                    accentClassName="from-violet-400 via-fuchsia-300 to-rose-300"
                  >
                    <ListBlock
                      items={dashboard.records.indirectVisits}
                      emptyText="No indirect visits found."
                      renderItem={(visit: ClientIndirectVisitRecord) => (
                        <div key={visit.indirectVisitId} className="rounded-2xl bg-slate-50 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="font-semibold text-slate-900">{visit.visitDate}</p>
                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                              {visit.agentName}
                            </p>
                          </div>
                          <p className="mt-2 text-sm text-slate-700">
                            {visit.beneficiaryName} indirectly benefited from {visit.mainRecipient}&apos;s visit
                          </p>
                          <p className="mt-1 text-sm text-slate-600">{visit.address}</p>
                          <p className="mt-1 text-sm text-slate-600">{visit.status}</p>
                        </div>
                      )}
                    />
                  </SectionCard>
                </div>
              )}

              {selectedSection === 'household' && (
                <SectionCard
                  title="Household"
                  description="People living with this neighbor."
                  accentClassName="from-emerald-400 via-teal-300 to-cyan-300"
                >
                  <div className="grid min-h-full gap-6">
                    <div>
                      <h3 className="mb-3 text-lg font-semibold text-slate-900">Living With</h3>
                      <ListBlock
                        items={dashboard.household.livingWith}
                        emptyText="No other people are living with this neighbor."
                        renderItem={(member: ClientProfileDashboard['household']['livingWith'][number]) => (
                          <div key={member.clientId} className="rounded-2xl bg-slate-50 p-4">
                            <p className="font-semibold text-slate-900">{member.fullName}</p>
                            <p className="mt-1 text-sm text-slate-600">
                              {member.ageLabel}
                              {member.isDeceased ? ' - Deceased' : ''}
                            </p>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </SectionCard>
              )}

              {selectedSection === 'relatives' && (
                <SectionCard
                  title="Relatives"
                  description="Family connections in the household."
                  accentClassName="from-fuchsia-400 via-pink-300 to-rose-300"
                >
                  <ListBlock
                    items={dashboard.household.relatives}
                    emptyText="No relatives found."
                    renderItem={(group: ClientProfileDashboard['household']['relatives'][number]) => (
                      <div key={group.clientId} className="rounded-2xl bg-slate-50 p-4">
                        <p className="font-semibold text-slate-900">
                          {group.memberName}{' '}
                          <span className="text-slate-500">{group.memberExtraInfo}</span>
                        </p>
                        <div className="mt-3 space-y-2">
                          {group.relatives.length > 0 ? (
                            group.relatives.map((relative) => (
                              <div key={`${group.clientId}-${relative.relatedClientId ?? relative.relatedName}`} className="rounded-xl bg-white p-3">
                                <p className="font-semibold text-slate-900">{relative.relatedName}</p>
                                <p className="mt-1 text-sm text-slate-600">
                                  {relative.ageLabel}
                                  {relative.isDeceased ? ' - Deceased' : ''}
                                </p>
                                <p className="mt-1 text-sm text-slate-700">
                                  {relative.description} of {group.memberName}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-slate-500">No known relatives.</p>
                          )}
                        </div>
                      </div>
                    )}
                  />
                </SectionCard>
              )}
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
