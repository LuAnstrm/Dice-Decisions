import React from 'react';
import { Play, FileText } from 'lucide-react';

interface HeroBannerProps {
  campaignName: string;
  sessionNumber: number;
  sessionTitle: string;
  heroImageUrl?: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  campaignName,
  sessionNumber,
  sessionTitle,
  heroImageUrl,
}) => {
  return (
    <section className="relative rounded-xl overflow-hidden border border-[var(--color-border)] group">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg-base)] via-[var(--color-bg-base)]/80 to-transparent z-10" />

      {/* Background image with hover zoom */}
      <div
        className="h-64 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{
          backgroundImage: heroImageUrl
            ? `url(${heroImageUrl})`
            : 'var(--theme-backdrop-image)',
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center p-10 z-20">
        <p className="text-[var(--color-accent)] font-bold uppercase tracking-[0.2em] text-xs mb-2">
          Current Campaign{sessionNumber > 0 ? ` · Session ${sessionNumber}` : ''}
        </p>
        <h3 className="font-[family-name:var(--font-display)] text-4xl font-bold text-[var(--color-text-primary)] mb-4">
          {campaignName}
        </h3>
        {sessionTitle && (
          <p className="text-[var(--color-text-secondary)] text-base mb-6 max-w-lg">
            {sessionTitle}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-[var(--color-glow)]"
            aria-label="Continue Session"
          >
            <Play size={16} />
            Continue Session
          </button>
          <button
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm px-6 py-2.5 rounded-lg text-sm font-bold border border-[var(--color-border)] transition-all"
            aria-label="Session Logs"
          >
            <FileText size={16} />
            Session Logs
          </button>
        </div>
      </div>
    </section>
  );
};
