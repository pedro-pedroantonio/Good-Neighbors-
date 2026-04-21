export default function ClientsLoading() {
  return (
    <div className="h-screen min-h-screen bg-slate-50 flex flex-col">
      <div className="border-b border-slate-200 bg-white/85 backdrop-blur-xl">
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="lg:hidden h-11 w-11 rounded-full bg-slate-100" />
              <div className="min-w-0">
                <div className="h-8 w-56 rounded-lg bg-slate-200" />
                <div className="mt-2 h-4 w-40 rounded bg-slate-200" />
              </div>
            </div>
            <div className="h-10 w-28 rounded-xl bg-red-100" />
          </div>
        </div>
      </div>

      <div className="relative w-full flex-1 min-h-0 overflow-hidden px-0 py-0 sm:px-6 sm:py-6 lg:px-8">
        <div className="h-full min-h-0 overflow-hidden border-slate-200 bg-white/95 p-4 shadow-xl sm:rounded-[2.5rem] sm:border sm:p-6">
          <div className="grid h-full min-h-0 gap-6 lg:grid-cols-[280px_1fr]">
            <aside className="hidden h-full rounded-[1.75rem] bg-slate-50 p-6 lg:block">
              <div className="h-4 w-40 rounded bg-slate-200" />
              <div className="mt-4 h-8 w-36 rounded bg-slate-200" />
              <div className="mt-6 space-y-3">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="h-11 rounded-2xl bg-white" />
                ))}
              </div>
            </aside>

            <main className="flex h-full min-h-0 flex-col overflow-hidden">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="h-4 w-44 rounded bg-slate-200" />
                  <div className="mt-3 h-8 w-28 rounded bg-slate-200" />
                </div>
                <div className="h-9 w-28 rounded-full bg-emerald-100" />
              </div>

              <div className="mt-6 h-12 rounded-xl border border-slate-200 bg-white" />
              <div className="mt-6 min-h-0 flex-1 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50">
                <div className="h-12 bg-slate-100" />
                <div className="divide-y divide-slate-200">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="grid grid-cols-[64px_1fr_1fr_64px] gap-4 px-4 py-4">
                      <div className="h-4 rounded bg-slate-200" />
                      <div className="h-4 rounded bg-slate-200" />
                      <div className="h-4 rounded bg-slate-200" />
                      <div className="h-4 rounded bg-slate-200" />
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
