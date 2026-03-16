import { Play, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroBannerProps {
  campaignName: string;
  sessionNumber: number;
  sessionTitle: string;
  heroImageUrl?: string;
}

export function HeroBanner({
  campaignName,
  sessionNumber,
  sessionTitle,
  heroImageUrl,
}: HeroBannerProps) {
  const bgStyle = heroImageUrl
    ? {
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.5), rgba(0,0,0,0)), url(${heroImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {
        background:
          'linear-gradient(135deg, rgba(15,15,35,1) 0%, rgba(30,20,60,0.8) 100%)',
      };

  return (
    <div
      className="w-full rounded-xl overflow-hidden shadow-lg mb-6 flex flex-col justify-center"
      style={{ ...bgStyle, height: '300px' }}
    >
      <div className="pl-10 md:pl-12">
        <p className="text-xs md:text-sm font-semibold uppercase tracking-widest text-[#7c3aed] mb-2">
          Current Campaign: {campaignName}
        </p>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 max-w-2xl">
          Session {sessionNumber} — {sessionTitle}
        </h1>
        <div className="flex gap-4">
          <Button
            size="lg"
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold"
          >
            <Play className="w-4 h-4 mr-2" />
            Continue Session
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <FileText className="w-4 h-4 mr-2" />
            Session Logs
          </Button>
        </div>
      </div>
    </div>
  );
}
