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
    <div
      className="relative w-full h-80 rounded-lg overflow-hidden"
      style={{
        backgroundImage: heroImageUrl ? `url(${heroImageUrl})` : 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center items-start px-8 py-12">
        <p className="text-white/60 text-sm uppercase tracking-widest mb-2">
          Session {sessionNumber}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          {campaignName}
        </h1>
        <p className="text-xl text-white/80 mb-8">
          {sessionTitle}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            className="flex items-center gap-2 px-6 py-3 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold rounded-lg transition-colors duration-200"
            aria-label="Continue Session"
          >
            <Play size={18} />
            Continue Session
          </button>
          <button
            className="flex items-center gap-2 px-6 py-3 border border-white/20 hover:border-white/40 text-white font-semibold rounded-lg transition-colors duration-200"
            aria-label="Session Logs"
          >
            <FileText size={18} />
            Session Logs
          </button>
        </div>
      </div>
    </div>
  );
};
