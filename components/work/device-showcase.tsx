'use client';

import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { Maximize2, Pause, Play } from 'lucide-react';
import { ProjectModal, type PortfolioProject } from '@/components/ui/portfolio-card';
import { canOptimizeImage, resolveValidImageSrc } from '@/lib/image-utils';

const SCROLL_PX_PER_SEC = 90; // Laptop screen scroll speed during the auto-tour
const END_PAUSE_MS = 1400;
const RESUME_AFTER_MS = 3500;

const REDUCED_MQ = () => window.matchMedia('(prefers-reduced-motion: reduce)');
function subscribeReducedMotion(cb: () => void) {
  const mq = REDUCED_MQ();
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

/**
 * A project's full-page screenshots inside a laptop and a phone. While on screen it gives a slow,
 * synced auto-tour of the whole page; scrolling inside either screen takes over, and the tour picks
 * up from there a few seconds later. No auto-tour under prefers-reduced-motion.
 */
export function DeviceShowcase({ project }: { project: PortfolioProject }) {
  const desktopSrc = resolveValidImageSrc(project.fullDesktopImage || project.image);
  const mobileRaw = project.fullMobileImage || project.mobileImage;
  const mobileSrc = mobileRaw ? resolveValidImageSrc(mobileRaw) : null;

  const stageRef = useRef<HTMLDivElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  // Tour runs by default, except for people who asked for reduced motion (unless they press Play).
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, () => REDUCED_MQ().matches, () => false);
  const [userPlaying, setUserPlaying] = useState<boolean | null>(null);
  const playing = userPlaying ?? !reducedMotion;
  const [modalOpen, setModalOpen] = useState(false);

  const tour = useRef({ t: 0, dir: 1, holdUntil: 0, inView: false });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const io = new IntersectionObserver(([entry]) => (tour.current.inView = entry.isIntersecting), { threshold: 0.35 });
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  // The person scrolled a screen: hand control over and continue from where they left it.
  const takeOver = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    tour.current.holdUntil = performance.now() + RESUME_AFTER_MS;
    if (max > 0) tour.current.t = el.scrollTop / max;
  }, []);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      const s = tour.current;
      const laptop = laptopRef.current;
      const phone = phoneRef.current;
      if (laptop && s.inView && now >= s.holdUntil) {
        const lapMax = laptop.scrollHeight - laptop.clientHeight;
        if (lapMax > 4) {
          s.t += (s.dir * SCROLL_PX_PER_SEC * dt) / 1000 / lapMax;
          if (s.t >= 1 || s.t <= 0) {
            s.t = Math.max(0, Math.min(1, s.t));
            s.dir *= -1;
            s.holdUntil = now + END_PAUSE_MS;
          }
          laptop.scrollTop = s.t * lapMax;
          if (phone) phone.scrollTop = s.t * (phone.scrollHeight - phone.clientHeight);
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const take = (e: React.SyntheticEvent<HTMLDivElement>) => takeOver(e.currentTarget);
  const userEvents = {
    onWheel: take,
    onTouchStart: take,
    onPointerDown: take,
    onKeyDown: take,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      // Programmatic scrolls happen outside a hold; only track scrolls the person is making.
      if (performance.now() < tour.current.holdUntil) takeOver(e.currentTarget);
    },
  };

  const screenClass =
    'h-full overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden bg-slate-950';

  return (
    <div className="relative bg-[radial-gradient(120%_90%_at_50%_0%,#1b2440_0%,#0b1020_55%,#070a14_100%)] text-white">
      <div
        ref={stageRef}
        className={`relative mx-auto px-4 sm:px-10 pt-10 sm:pt-14 ${mobileSrc ? 'pb-12 sm:pb-16 max-w-[1180px]' : 'pb-8 max-w-[1040px]'}`}
      >
        <div className={`relative ${mobileSrc ? 'pr-[18%] sm:pr-[16%]' : ''}`}>
          {/* Laptop */}
          <figure className="m-0">
            <div className="rounded-t-[14px] sm:rounded-t-[20px] bg-[#0d1117] p-[1.4%] pb-[2.2%] border border-white/10 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)]">
              <div className="mx-auto mb-[0.8%] h-1.5 w-1.5 rounded-full bg-white/15" aria-hidden="true" />
              <div
                ref={laptopRef}
                data-lenis-prevent
                tabIndex={0}
                aria-label={`${project.sitename} desktop screenshot, scrollable`}
                className={`aspect-[16/10] rounded-[4px] ${screenClass}`}
                {...userEvents}
              >
                <Image
                  src={desktopSrc}
                  alt={`${project.sitename} on desktop`}
                  width={1440}
                  height={4000}
                  sizes="(min-width: 1180px) 960px, 82vw"
                  className="block w-full h-auto"
                  unoptimized={!canOptimizeImage(desktopSrc)}
                />
              </div>
            </div>
            {/* Base */}
            <div className="relative mx-[-4%] h-3 sm:h-4 rounded-b-[14px] bg-gradient-to-b from-[#c9ced8] to-[#7d8494]" aria-hidden="true">
              <div className="absolute left-1/2 top-0 h-1.5 w-[14%] -translate-x-1/2 rounded-b-md bg-[#a3a9b6]" />
            </div>
          </figure>

          {/* Phone */}
          {mobileSrc && (
            <figure className="m-0 absolute right-0 bottom-[-6%] w-[24%] sm:w-[21%] min-w-[96px]">
              <div className="relative rounded-[22px] sm:rounded-[34px] bg-[#0d1117] p-[5%] border border-white/15 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95)]">
                <div
                  className="absolute left-1/2 top-[3.2%] z-10 h-[2.4%] w-[30%] -translate-x-1/2 rounded-full bg-black"
                  aria-hidden="true"
                />
                <div
                  ref={phoneRef}
                  data-lenis-prevent
                  tabIndex={0}
                  aria-label={`${project.sitename} mobile screenshot, scrollable`}
                  className={`aspect-[9/19.5] rounded-[16px] sm:rounded-[26px] ${screenClass}`}
                  {...userEvents}
                >
                  <Image
                    src={mobileSrc}
                    alt={`${project.sitename} on mobile`}
                    width={430}
                    height={2400}
                    sizes="(min-width: 1180px) 230px, 22vw"
                    className="block w-full h-auto"
                    unoptimized={!canOptimizeImage(mobileSrc)}
                  />
                </div>
              </div>
            </figure>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 sm:px-8 py-4">
        <p className="m-0 font-mono text-[11px] sm:text-xs uppercase tracking-[0.08em] text-slate-400">
          {playing ? 'Touring the full page' : 'Paused'} · scroll inside a screen to explore
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setUserPlaying(!playing)}
            aria-pressed={!playing}
            className="inline-flex items-center gap-2 min-h-[40px] px-4 rounded-full border border-white/20 hover:border-white/50 text-sm font-semibold"
          >
            {playing ? <Pause className="w-4 h-4" aria-hidden="true" /> : <Play className="w-4 h-4" aria-hidden="true" />}
            {playing ? 'Pause tour' : 'Play tour'}
          </button>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 min-h-[40px] px-4 rounded-full bg-white text-brand-ink hover:bg-amber-400 text-sm font-bold"
          >
            <Maximize2 className="w-4 h-4" aria-hidden="true" /> Full screen
          </button>
        </div>
      </div>

      {modalOpen && <ProjectModal project={project} onClose={() => setModalOpen(false)} />}
    </div>
  );
}
