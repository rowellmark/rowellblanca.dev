'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = () => window.matchMedia('(pointer: fine)').matches;

// Site-wide pointer and in-view effects for the public site:
// - `data-inview` elements get `is-inview` once they scroll into view (drives split-text reveals)
// - `.motion-magnetic` elements lean toward the pointer
// - a small cursor follower that grows over `[data-cursor="view"]` targets
export function MotionEffects() {
    const pathname = usePathname();
    const dotRef = useRef<HTMLDivElement>(null);

    // Mark JS-driven motion as available so hidden start states only apply when JS runs.
    useEffect(() => {
        if (prefersReducedMotion()) return;
        document.documentElement.classList.add('js-motion');
        return () => document.documentElement.classList.remove('js-motion');
    }, []);

    // In-view observer, re-run on client-side navigation.
    useEffect(() => {
        const targets = document.querySelectorAll<HTMLElement>('[data-inview]:not(.is-inview)');
        if (!targets.length) return;
        if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
            targets.forEach((el) => el.classList.add('is-inview'));
            return;
        }
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-inview');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: '0px 0px -12% 0px' }
        );
        targets.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [pathname]);

    // Magnetic buttons (uses the independent `translate` property so hover transforms still compose).
    useEffect(() => {
        if (prefersReducedMotion() || !hasFinePointer()) return;
        let active: HTMLElement | null = null;

        const onMove = (e: PointerEvent) => {
            const el = (e.target as Element | null)?.closest<HTMLElement>('.motion-magnetic') ?? null;
            if (active && active !== el) {
                active.style.translate = '';
                active = null;
            }
            if (!el) return;
            active = el;
            const rect = el.getBoundingClientRect();
            const x = e.clientX - (rect.left + rect.width / 2);
            const y = e.clientY - (rect.top + rect.height / 2);
            el.style.translate = `${x * 0.22}px ${y * 0.32}px`;
        };
        const onLeave = () => {
            if (active) active.style.translate = '';
            active = null;
        };

        window.addEventListener('pointermove', onMove, { passive: true });
        document.addEventListener('pointerleave', onLeave);
        return () => {
            window.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerleave', onLeave);
        };
    }, []);

    // Cursor follower with eased trailing.
    useEffect(() => {
        const dot = dotRef.current;
        if (!dot || prefersReducedMotion() || !hasFinePointer()) return;

        let x = -100, y = -100, tx = -100, ty = -100, raf = 0;
        // Eases towards the pointer and stops once it has caught up (no idle RAF loop).
        const loop = () => {
            x += (tx - x) * 0.18;
            y += (ty - y) * 0.18;
            dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.2 ? requestAnimationFrame(loop) : 0;
        };
        const kick = () => {
            if (!raf) raf = requestAnimationFrame(loop);
        };
        const updateTarget = (el: Element | null) => {
            dot.classList.toggle('is-view', Boolean(el?.closest('[data-cursor="view"]')));
        };
        const onMove = (e: PointerEvent) => {
            tx = e.clientX;
            ty = e.clientY;
            updateTarget(e.target as Element | null);
            dot.classList.add('is-visible');
            kick();
        };
        const onLeave = () => dot.classList.remove('is-visible');
        // Content moves under a still pointer while scrolling, so re-check what is beneath it.
        let scrollQueued = false;
        const onScroll = () => {
            if (scrollQueued) return;
            scrollQueued = true;
            requestAnimationFrame(() => {
                scrollQueued = false;
                updateTarget(document.elementFromPoint(tx, ty));
            });
        };

        window.addEventListener('pointermove', onMove, { passive: true });
        window.addEventListener('scroll', onScroll, { passive: true });
        document.addEventListener('pointerleave', onLeave);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('scroll', onScroll);
            document.removeEventListener('pointerleave', onLeave);
        };
    }, []);

    return (
        <div ref={dotRef} className="motion-cursor" aria-hidden="true">
            <span className="motion-cursor-dot" />
            <span className="motion-cursor-label">View</span>
        </div>
    );
}
