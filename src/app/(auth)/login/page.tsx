'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { loginSchema } from '@/lib/validations/auth';
import { Loader2 } from 'lucide-react';
import { D20Logo } from '@/components/shared/d20-logo';

export default function LoginPage() {
  const { signIn, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setAuthError(null);

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    const { error } = await signIn(email, password);
    if (error) {
      setAuthError(error);
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!email) {
      setErrors({ email: 'Please enter your email address' });
      return;
    }
    setIsSubmitting(true);
    const { error } = await resetPassword(email);
    if (error) {
      setAuthError(error);
    } else {
      setResetSent(true);
    }
    setIsSubmitting(false);
  };

  const inputClassName = (field: string) =>
    `w-full rounded-lg border bg-[var(--color-surface-input)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
      errors[field]
        ? 'border-red-500 focus:border-red-500'
        : 'border-[var(--color-border)] focus:border-[#7c3aed]'
    }`;

  return (
    <>
      {/* Header */}
      <header className="mb-8 text-center">
        <div className="mb-3 flex justify-center">
          <D20Logo size={40} />
        </div>
        <h1 className="text-[22px] font-bold tracking-tight text-[var(--color-text-primary)]">
          Dice &amp; Decisions
        </h1>
        <p className="mt-1 text-[13px] text-[var(--color-text-muted)]">
          Probability-Powered Campaign Command
        </p>
      </header>

      {/* Card */}
      <section className="w-full max-w-[420px] rounded-xl border border-[var(--color-border)] border-t-purple-500/10 bg-[var(--color-bg-elevated)] p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
        {/* Tab bar */}
        <nav className="mb-8 flex border-b border-[var(--color-border)]">
          <span className="flex-1 border-b-2 border-[#7c3aed] pb-3 text-center text-sm font-medium text-[var(--color-text-primary)]">
            Sign In
          </span>
          <Link
            href="/signup"
            className="flex-1 pb-3 text-center text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-secondary)]"
          >
            Sign Up
          </Link>
        </nav>

        {/* Auth error */}
        {authError && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {authError}
          </div>
        )}

        {showForgotPassword ? (
          <form onSubmit={handleForgotPassword} className="space-y-5">
            {resetSent ? (
              <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-400">
                Check your email for a password reset link.
              </div>
            ) : (
              <>
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[var(--color-text-secondary)]">
                    Sanctum Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="wizard@citadel.com"
                    className={inputClassName('email')}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-[var(--color-accent)] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[var(--color-glow)] transition-all hover:bg-[var(--color-accent)]/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(false);
                setResetSent(false);
                setAuthError(null);
              }}
              className="w-full text-center text-xs text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent)]"
            >
              Back to Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[var(--color-text-secondary)]">
                Sanctum Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="wizard@citadel.com"
                className={inputClassName('email')}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-xs font-medium uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Secret Cypher
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent)]"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClassName('password')}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[var(--color-accent)] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[var(--color-glow)] transition-all hover:bg-[var(--color-accent)]/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
              ) : (
                'Enter the Tower'
              )}
            </button>

            {/* OR divider */}
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-[var(--color-border)]" />
              <span className="mx-4 shrink-0 text-xs font-medium uppercase tracking-widest text-[var(--color-text-muted)]">
                or
              </span>
              <div className="flex-grow border-t border-[var(--color-border)]" />
            </div>

            {/* Google (disabled) */}
            <button
              type="button"
              disabled
              className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-lg border border-[var(--color-border)] bg-transparent py-3 text-sm text-[var(--color-text-muted)] opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
            <p className="text-center text-[10px] text-[var(--color-text-muted)]">Coming soon</p>
          </form>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-8 text-center">
        <p className="text-xs font-medium italic tracking-wide text-[var(--color-text-muted)]">
          Built for DMs who think in probabilities
        </p>
      </footer>
    </>
  );
}
