'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const roles = [
  { label: 'Director', value: 'Director' },
  { label: 'Coach', value: 'Coach' },
  { label: 'Reception/Intake', value: 'Reception/Intake' },
  { label: 'Data Entry / Volunteer', value: 'Data Entry/Volunteer' },
  { label: 'Community Partner', value: 'Community Partner' },
  { label: 'Viewer', value: 'Viewer' },
] as const;

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(roles[0].value);
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        cache: 'no-store',
        body: JSON.stringify({ username, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      router.push('/clients');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  }

  const loginForm = (
    <div className="mx-auto max-w-xl h-full overflow-hidden rounded-[2rem] bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-200 sm:p-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Sign In</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Welcome back</h2>
        <p className="mt-2 text-sm text-slate-600">
          Select your role, then sign in with your username and password.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <fieldset className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <legend className="text-sm font-semibold text-slate-900">Role</legend>
          <div className="grid gap-3 pt-2">
            {roles.map((item) => (
              <label
                key={item.value}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3 transition-all ${
                  role === item.value
                    ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={item.value}
                  checked={role === item.value}
                  onChange={() => setRole(item.value)}
                  className="h-4 w-4 accent-emerald-600"
                />
                <span className="text-sm font-medium text-slate-700">{item.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="space-y-4">
          <label htmlFor="username" className="block text-sm font-medium text-slate-700">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-colors duration-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            placeholder="Enter your username"
          />
        </div>

        <div className="space-y-4">
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-colors duration-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            id="showPassword"
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <label htmlFor="showPassword" className="text-sm text-slate-600">
            Show Password
          </label>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Need help? Contact your administrator.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#e4edd9] text-slate-900">
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-stretch lg:px-10">
        <div className="relative flex flex-1 flex-col overflow-hidden rounded-[2.5rem] bg-[#37522f] p-10 text-white shadow-2xl sm:p-12 lg:min-h-[640px]">
          <div className="absolute inset-y-0 right-0 hidden w-2/5 rounded-l-[2.5rem] bg-white/10 blur-2xl lg:block"></div>
          <div className="relative z-10 flex flex-1 flex-col justify-between gap-8">
            <div className="max-w-xl">
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-200/80">
                Neighbor Connect
              </p>
              <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">
                Welcome to Good Neighbors
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-emerald-100/85 sm:text-lg">
                A simple, secure portal for staff and partners to connect with community members and
                manage client services.
              </p>
            </div>

            <div className="relative mx-auto flex w-full max-w-md justify-center">
              <div className="relative w-full rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
                <div className="absolute -left-6 top-6 h-24 w-24 rounded-full bg-emerald-300/20 blur-2xl"></div>
                <div className="absolute -right-6 bottom-6 h-28 w-28 rounded-full bg-sky-300/20 blur-2xl"></div>
                <div className="grid gap-5">
                  <div className="grid grid-cols-3 gap-5">
                    <div className="flex justify-center">
                      <div className="h-16 w-16 rounded-full bg-slate-900 shadow-lg"></div>
                    </div>
                    <div className="flex justify-center">
                      <div className="h-20 w-20 rounded-full bg-slate-900 shadow-lg"></div>
                    </div>
                    <div className="flex justify-center">
                      <div className="h-16 w-16 rounded-full bg-slate-900 shadow-lg"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-5">
                    <div className="flex justify-center">
                      <div className="h-28 w-24 rounded-[2rem] bg-emerald-400 shadow-lg"></div>
                    </div>
                    <div className="flex justify-center">
                      <div className="h-36 w-24 rounded-[2rem] bg-amber-300 shadow-lg"></div>
                    </div>
                    <div className="flex justify-center">
                      <div className="h-28 w-24 rounded-[2rem] bg-fuchsia-400 shadow-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 text-sm text-emerald-100/80 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="font-semibold">Secure access</p>
                <p className="mt-2 text-sm leading-6 text-emerald-100/75">
                  Role-based sign in for your staff and community partners.
                </p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="font-semibold">Friendly dashboard</p>
                <p className="mt-2 text-sm leading-6 text-emerald-100/75">
                  Designed for easy navigation and fast case management.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 lg:flex lg:flex-col lg:justify-center">
          <div className="hidden lg:block h-full">{loginForm}</div>

          <div className="flex h-full flex-col items-center justify-center rounded-[2rem] bg-white p-8 text-center shadow-[0_30px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-200 sm:p-10 lg:hidden">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              Sign In
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Tap to login
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Open the login popup and enter your role, username, and password.
            </p>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Open Login
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-slate-900/80 p-4"
          onClick={() => setShowModal(false)}
        >
          <div className="relative w-full max-w-xl" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute right-0 top-0 rounded-full bg-white p-2 text-slate-600 shadow hover:bg-slate-100"
              aria-label="Close login popup"
            >
              ×
            </button>
            {loginForm}
          </div>
        </div>
      )}
    </div>
  );
}
