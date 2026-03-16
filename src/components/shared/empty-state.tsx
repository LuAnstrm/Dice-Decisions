import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] py-12">
      <Icon size={64} className="text-[var(--color-text-muted)] mb-4" />
      <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[var(--color-text-muted)] text-center max-w-[400px]">
        {description}
      </p>
      {action?.href ? (
        <Link href={action.href} className="mt-6">
          <Button>{action.label}</Button>
        </Link>
      ) : action?.onClick ? (
        <Button onClick={action.onClick} className="mt-6">
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}
