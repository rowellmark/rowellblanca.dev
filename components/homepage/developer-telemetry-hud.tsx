'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Clock,
  ShieldCheck,
  Zap,
  Terminal,
  Code2,
  CheckCircle2,
  Cpu,
  Globe,
  Radio,
  User,
} from 'lucide-react';
import rowellbanner from '@/assets/images/rowellbanner.png';

interface TimezoneInfo {
  city: string;
  region: string;
  tz: string;
  overlap: string;
  flag: string;
}

const TIMEZONES: TimezoneInfo[] = [
  {
    city: 'London',
    region: 'UK / Europe (GMT)',
    tz: 'Europe/London',
    overlap: '4–5 hrs overlap',
    flag: '🇬🇧',
  },
  {
    city: 'New York',
    region: 'US East (EST)',
    tz: 'America/New_York',
    overlap: '3–4 hrs overlap',
    flag: '🇺🇸',
  },
  {
    city: 'Sydney',
    region: 'Australia (AEST)',
    tz: 'Australia/Sydney',
    overlap: 'Full day overlap',
    flag: '🇦🇺',
  },
];

export function DeveloperTelemetryHud({
  onOpenContact,
}: {
  onOpenContact?: () => void;
}) {
  const [viewMode, setViewMode] = useState<'telemetry' | 'profile'>('telemetry');
  const [currentTimeManila, setCurrentTimeManila] = useState('');
  const [selectedTz, setSelectedTz] = useState<number>(0);
  const [cityTimes, setCityTimes] = useState<Record<string, string>>({});

  useEffect(() => {
    const updateTimes = () => {
      try {
        const now = new Date();
        const mTime = new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Asia/Manila',
        }).format(now);
        setCurrentTimeManila(mTime);

        const newCityTimes: Record<string, string> = {};
        TIMEZONES.forEach((tz) => {
          newCityTimes[tz.city] = new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: tz.tz,
          }).format(now);
        });
        setCityTimes(newCityTimes);
      } catch (err) {
        // Fallback if timezone not supported in environment
      }
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Outer Card with Crisp 1px Border & Elevation */}
      <div className="relative bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        
        {/* Top Header Bar: Telemetry Controls */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700">
              Dev Telemetry HUD
            </span>
            <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 font-bold">
              LIVE
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-200/70 p-0.5 rounded-xl text-[11px] font-bold">
            <button
              onClick={() => setViewMode('telemetry')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                viewMode === 'telemetry'
                  ? 'bg-white text-[#0b1a30] shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3 h-3 text-amber-500" />
              <span>Metrics</span>
            </button>
            <button
              onClick={() => setViewMode('profile')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                viewMode === 'profile'
                  ? 'bg-white text-[#0b1a30] shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3 h-3 text-indigo-500" />
              <span>Profile</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          <AnimatePresence mode="wait">
            {viewMode === 'telemetry' ? (
              <motion.div
                key="telemetry"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* Status Strip */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                        System Availability
                      </span>
                      <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                    </div>
                    <div className="text-sm font-black text-[#0b1a30] mt-1">
                      Available (Q2/Q3)
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Direct Senior Contractor
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                        Local Time (UTC+8)
                      </span>
                      <Clock className="w-3 h-3 text-amber-500" />
                    </div>
                    <div className="text-sm font-mono font-black text-[#0b1a30] mt-1">
                      {currentTimeManila || '10:00:00 AM'}
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold">
                      Active Workstation
                    </span>
                  </div>
                </div>

                {/* Real-time Timezone Overlap Matrix */}
                <div className="p-3.5 rounded-2xl bg-slate-900 text-white shadow-inner">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-200">
                        Global Client Overlap
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      Tap city to inspect
                    </span>
                  </div>

                  {/* City selector pills */}
                  <div className="grid grid-cols-3 gap-1.5 mb-3">
                    {TIMEZONES.map((tz, idx) => {
                      const isSelected = selectedTz === idx;
                      return (
                        <button
                          key={tz.city}
                          onClick={() => setSelectedTz(idx)}
                          className={`px-2.5 py-1.5 rounded-xl text-left border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-slate-800 border-amber-400/80 text-white'
                              : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs">{tz.flag}</span>
                            <span className="text-[10px] font-mono font-bold text-amber-400">
                              {cityTimes[tz.city] || '--:--'}
                            </span>
                          </div>
                          <div className="text-[11px] font-black tracking-tight mt-0.5">
                            {tz.city}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Overlap Details for Selected City */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{TIMEZONES[selectedTz].region}:</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                      {TIMEZONES[selectedTz].overlap}
                    </span>
                  </div>
                </div>

                {/* Live Core Web Vitals & Code Specs Strip */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-amber-900 font-bold">
                      Web Vitals
                    </span>
                    <span className="text-lg font-black text-amber-700 leading-tight">
                      99/100
                    </span>
                    <span className="block text-[9px] text-amber-800/80 font-mono">
                      Sub-160ms TTFB
                    </span>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-indigo-50 border border-indigo-200/60">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-indigo-900 font-bold">
                      TypeScript
                    </span>
                    <span className="text-lg font-black text-indigo-700 leading-tight">
                      Strict
                    </span>
                    <span className="block text-[9px] text-indigo-800/80 font-mono">
                      100% Type-Safe
                    </span>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200/60">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-emerald-900 font-bold">
                      Experience
                    </span>
                    <span className="text-lg font-black text-emerald-700 leading-tight">
                      12+ Yrs
                    </span>
                    <span className="block text-[9px] text-emerald-800/80 font-mono">
                      Production Dev
                    </span>
                  </div>
                </div>

                {/* Git & Architecture Specs Footer */}
                <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-[10px] font-mono text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Terminal className="w-3 h-3 text-slate-500" />
                    <span>Next.js 14 · NeonDB · PHP 8.2</span>
                  </div>
                  <span className="text-slate-400">Zero Agency Overhead</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* Photo & Bio Card */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 shadow-inner group">
                  <Image
                    src={rowellbanner}
                    alt="Rowell Mark Blanca — Senior Software Engineer"
                    fill
                    priority
                    className="object-cover object-top group-hover:scale-103 transition-transform duration-500"
                    sizes="(max-width: 768px) 320px, 400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-3 left-3 right-3 text-white flex items-end justify-between">
                    <div>
                      <h4 className="text-sm font-black tracking-tight leading-tight">
                        Rowell Mark Blanca
                      </h4>
                      <p className="text-[11px] font-bold text-amber-400">
                        Senior Full-Stack & Next.js Engineer
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Top Rated
                    </span>
                  </div>
                </div>

                {/* Specialties Badges */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    Core Specializations
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Next.js 14 App Router',
                      'High-Scale WordPress & PHP',
                      'Serverless PostgreSQL / NeonDB',
                      'Custom Gutenberg Blocks',
                      'Sub-second Web Vitals',
                    ].map((spec) => (
                      <span
                        key={spec}
                        className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/70"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action button */}
                {onOpenContact && (
                  <button
                    onClick={onOpenContact}
                    className="w-full py-2.5 rounded-xl bg-[#0b1a30] hover:bg-amber-500 text-white hover:text-slate-950 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Check Availability & Book Call</span>
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
