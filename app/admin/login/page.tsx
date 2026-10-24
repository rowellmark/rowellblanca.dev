'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { AnimatedLogo } from '@/components/ui/animated-logo';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from '@/components/admin/ui';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-zinc-50 font-sans">
      {/* Brand panel */}
      <aside className="relative hidden lg:flex flex-col justify-between bg-brand-ink text-white p-12 overflow-hidden">
        <div className="flex items-center gap-3">
          <AnimatedLogo className="h-10 w-10" title="Rowell Mark Blanca" tone="dark" />
          <span className="flex flex-col leading-none gap-1">
            <span className="font-extrabold">Rowell Blanca</span>
            <span className="text-xs font-medium text-slate-400">Portfolio CRM</span>
          </span>
        </div>
        <div className="flex flex-col gap-6 max-w-[520px]">
          <p className="m-0 font-extrabold tracking-[-0.045em] leading-[0.95] text-[clamp(40px,4.4vw,64px)]">
            Leads, projects &amp; invoices<span className="text-amber-500">.</span>
          </p>
          <p className="m-0 text-slate-300 text-lg leading-relaxed">
            One back office for the pipeline behind rowellblanca.dev — CRM leads, client projects, testimonials, blog and billing.
          </p>
        </div>
        <p className="m-0 font-mono text-xs text-slate-500">© {new Date().getFullYear()} Rowell Mark Blanca</p>
      </aside>

      {/* Sign-in */}
      <main className="flex items-center justify-center px-4 py-16 sm:px-8">
        <div className="w-full max-w-[400px] flex flex-col gap-6">
          <div className="flex lg:hidden items-center justify-center">
            <AnimatedLogo className="h-12 w-12" title="Rowell Mark Blanca" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sign in</CardTitle>
              <CardDescription>Enter your admin email and password to continue.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="flex flex-col gap-5">
                {error && (
                  <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@rowellblanca.dev"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" size="lg" disabled={loading} className="w-full mt-1">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                    </>
                  ) : (
                    <>
                      Sign in <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="m-0 flex items-center justify-center gap-1.5 text-xs text-zinc-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> httpOnly session cookie · PBKDF2 password hashing
          </p>
        </div>
      </main>
    </div>
  );
}
