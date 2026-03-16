'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Topbar } from '@/components/layout/topbar';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';

export default function CreateCampaignPage() {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError('You must be logged in to create a campaign.');
        setIsSubmitting(false);
        return;
      }

      const { error: insertError } = await supabase.from('campaigns').insert({
        name: name.trim(),
        description: description.trim() || null,
        dm_user_id: user.id,
      } as never);

      if (insertError) {
        setError(insertError.message);
        setIsSubmitting(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Topbar title="Create Campaign" />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg rounded-2xl border border-white/8 bg-black/20 p-8"
        >
          <div className="flex flex-col items-center mb-8">
            <Sparkles className="w-12 h-12 text-[var(--color-accent)] mb-3" />
            <h1 className="text-2xl font-bold text-white">New Campaign</h1>
            <p className="text-sm text-white/60 mt-1">
              Set up your adventure. You&apos;ll be the Dungeon Master.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label
                htmlFor="campaign-name"
                className="block text-sm font-medium text-white/80 mb-1.5"
              >
                Campaign Name <span className="text-red-400">*</span>
              </label>
              <input
                id="campaign-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. The Lost Mines of Phandelver"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-input)] px-4 py-2.5 text-white placeholder:text-white/30 focus:border-[#7c3aed] focus:outline-none focus:ring-1 focus:ring-[#7c3aed] transition-colors"
                maxLength={100}
              />
            </div>

            <div>
              <label
                htmlFor="campaign-desc"
                className="block text-sm font-medium text-white/80 mb-1.5"
              >
                Description <span className="text-white/40">(optional)</span>
              </label>
              <textarea
                id="campaign-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe your campaign setting or goals..."
                rows={4}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-input)] px-4 py-2.5 text-white placeholder:text-white/30 focus:border-[#7c3aed] focus:outline-none focus:ring-1 focus:ring-[#7c3aed] transition-colors resize-none"
                maxLength={500}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="w-full mt-8 bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-white font-semibold disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              'Create Campaign'
            )}
          </Button>
        </form>
      </div>
    </>
  );
}
