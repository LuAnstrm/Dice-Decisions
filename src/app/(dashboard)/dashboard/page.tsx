'use client';

import { Topbar } from '@/components/layout/topbar';
import { useCampaign } from '@/hooks/use-campaign';
import { useRole } from '@/hooks/use-role';
import { Sparkles, LayoutDashboard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const { campaign, isLoading } = useCampaign();
  const { role } = useRole();

  if (isLoading) {
    return (
      <>
        <Topbar title="Dashboard" />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent)]" />
        </div>
      </>
    );
  }

  if (!campaign) {
    return (
      <>
        <Topbar title="Dashboard" />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="flex flex-col items-center text-center max-w-md">
            <Sparkles className="w-16 h-16 text-[#7c3aed] mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Create Your First Campaign</h1>
            <p className="text-white/60 mb-8">
              Begin your adventure by creating a new campaign or joining an existing one.
            </p>
            <Link href="/campaign/create">
              <Button className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold">
                Create Campaign
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar title="Dashboard" />
      <div className="p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">{campaign.name}</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Role: {role === 'dm' ? 'Dungeon Master' : 'Player'} · Campaign active
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Characters"
            description="View and manage your party characters."
            href="/characters"
            icon={<LayoutDashboard className="w-8 h-8 text-[var(--color-accent)]" />}
          />
          <DashboardCard
            title="Campaign Maps"
            description="Explore maps and manage markers."
            href="/maps"
            icon={<LayoutDashboard className="w-8 h-8 text-[var(--color-accent)]" />}
          />
          <DashboardCard
            title="Encounters"
            description="Plan and run encounters."
            href="/campaign/encounters"
            icon={<LayoutDashboard className="w-8 h-8 text-[var(--color-accent)]" />}
          />
        </div>
      </div>
    </>
  );
}

function DashboardCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-white/8 bg-black/20 p-6 transition-all hover:border-white/15 hover:bg-black/30"
    >
      <div className="mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-[var(--color-text-secondary)]">{description}</p>
    </Link>
  );
}
