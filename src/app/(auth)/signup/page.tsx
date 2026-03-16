'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { signupSchema } from '@/lib/validations/auth';
import { Loader2 } from 'lucide-react';
import { D20Logo } from '@/components/shared/d20-logo';

export default function SignUpPage() {
  const { signUp } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setAuthError(null);

    const result = signupSchema.safeParse({
      display_name: displayName,
      email,
      password,
    });
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
    const { error } = await signUp(email, password, displayName);
    if (error) {
      setAuthError(error);
      setIsSubmitting(false);
    } else {
      setSignupSuccess(true);
      setIsSubmitting(false);
    }
  };

  const inputClassName = (field: string) =>
    `w-full rounded-lg border bg-[#16161f] px-4 py-3 text-sm text-[#f1f5f9] placeholder:text-[#475569] focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
      errors[field]
        ? 'border-red-500 focus:border-red-500'
        : 'border-[#1e1e2e] focus:border-[#7c3aed]'
    }`;

  return (
    <>
      {/* Header */}
      <header className="mb-8 text-center">
        <div className="mb-3 flex justify-center">
          <D20Logo size={40} />
        </div>
        <h1 className="text-[22px] font-bold tracking-tight text-[#f1f5f9]">
          Dice &amp; Decisions
        </h1>
        <p className="mt-1 text-[13px] text-[#475569]">
          Probability-Powered Campaign Command
        </p>
      </header>

      {/* Card */}
      <section className="w-full max-w-[420px] rounded-xl border border-[#1e1e2e] border-t-purple-500/10 bg-[#111119] p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
        {/* Tab bar */}
        <nav className="mb-8 flex border-b border-[#1e1e2e]">
          <Link
            href="/login"
            className="flex-1 pb-3 text-center text-sm font-medium text-[#475569] transition-colors hover:text-[#94a3b8]"
          >
            Sign In
          </Link>
          <span className="flex-1 border-b-2 border-[#7c3aed] pb-3 text-center text-sm font-medium text-[#f1f5f9]">
            Sign Up
          </span>
        </nav>

        {/* Auth error */}
        {authError && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {authError}
          </div>
        )}

        {/* Success message */}
        {signupSuccess && (
          <div className="mb-4 rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-400">
            Check your email to verify your account before signing in.
          </div>
        )}

        {!signupSuccess && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#94a3b8]">
                Hero Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Gandalf the Grey"
                className={inputClassName('display_name')}
              />
              {errors.display_name && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.display_name}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#94a3b8]">
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
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#94a3b8]">
                Secret Cypher
              </label>
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
              className="w-full rounded-lg bg-[#7c3aed] py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-900/20 transition-all hover:bg-[#6d28d9] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
              ) : (
                'Begin Your Quest'
              )}
            </button>

            {/* OR divider */}
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-[#1e1e2e]" />
              <span className="mx-4 shrink-0 text-xs font-medium uppercase tracking-widest text-[#475569]">
                or
              </span>
              <div className="flex-grow border-t border-[#1e1e2e]" />
            </div>

            {/* Google (disabled) */}
            <button
              type="button"
              disabled
              className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-lg border border-[#1e1e2e] bg-transparent py-3 text-sm text-[#475569] opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
            <p className="text-center text-[10px] text-[#475569]">Coming soon</p>
          </form>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-8 text-center">
        <p className="text-xs font-medium italic tracking-wide text-[#475569]">
          Built for DMs who think in probabilities
        </p>
      </footer>
    </>
  );
}
