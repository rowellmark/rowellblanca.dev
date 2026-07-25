import Link from 'next/link';
import { FuzzyText } from '@/components/ui/fuzzy-text';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden text-center">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center space-y-4">
        
        {/* Animated Fuzzy 404 Header */}
        <div className="flex flex-col items-center">
          <FuzzyText fontSize={100} fontWeight={900} color="#F59E0B" align="center" baseIntensity={0.25} hoverIntensity={0.6}>
            404
          </FuzzyText>
          
          <FuzzyText fontSize={24} fontWeight={800} color="#FFFFFF" align="center" baseIntensity={0.12} hoverIntensity={0.35}>
            PAGE NOT FOUND
          </FuzzyText>
        </div>

        <p className="text-base text-slate-300 font-medium max-w-md mx-auto leading-relaxed pt-2">
          The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-amber hover:bg-brand-amber-h text-brand-navy font-extrabold text-sm shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <Home className="h-4 w-4" /> Back to Home
          </Link>

          <Link
            href="/mywork"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 hover:border-slate-600 transition-all"
          >
            <Compass className="h-4 w-4 text-brand-amber" /> View My Work
          </Link>
        </div>

      </div>
    </div>
  );
}
