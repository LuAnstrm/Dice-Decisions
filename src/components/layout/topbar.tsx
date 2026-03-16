'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { Bell } from 'lucide-react';

interface Breadcrumb {
  label: string;
  href?: string;
  active?: boolean;
}

interface TopbarProps {
  title: string;
  breadcrumbs?: Breadcrumb[];
  actions?: ReactNode;
  hasNotifications?: boolean;
}

export function Topbar({ title, breadcrumbs, actions, hasNotifications = false }: TopbarProps) {
  return (
    <header className="sticky top-0 z-40 h-16 flex flex-col justify-center px-6 border-b border-[var(--color-border)] bg-[rgba(10,10,15,0.8)] backdrop-blur-lg">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] font-display">
            {title}
          </h2>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-2 text-sm mt-1">
              {breadcrumbs.map((crumb, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {crumb.href && !crumb.active ? (
                    <Link href={crumb.href} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={crumb.active ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}>
                      {crumb.label}
                    </span>
                  )}
                  {idx < breadcrumbs.length - 1 && (
                    <span className="text-[var(--color-text-muted)]">/</span>
                  )}
                </div>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4 ml-6">
          {actions}
          <button
            type="button"
            title="Notifications"
            className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Bell size={20} className="text-[var(--color-text-muted)]" />
            {hasNotifications && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
