import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  Flame, 
  Sparkles, 
  Compass, 
  MapPin, 
  User, 
  Bell, 
  Clock, 
  ShieldCheck, 
  Sliders, 
  Maximize2,
  CalendarDays,
  HeartHandshake
} from 'lucide-react';

import BiometricSensorSandbox from './components/BiometricSensorSandbox';
import AuraInteractiveCharts from './components/AuraInteractiveCharts';
import AuraRoutinePlanner from './components/AuraRoutinePlanner';
import LuxuryActivityList from './components/LuxuryActivityList';
import CoachAuraInsights from './components/CoachAuraInsights';
import { ActiveSessionMetrics } from './types';

export default function App() {
  // Global simulation states to bridge the Biometrics sensor and the summary metrics
  const [liveMetrics, setLiveMetrics] = useState<ActiveSessionMetrics>({
    heartRate: 72,
    calories: 0,
    activeTime: 0,
    stressLevel: 28,
    isSimulating: false,
    speedMultiplier: 1
  });

  // Calculate dynamic HR Zone metadata
  const getHRZone = (hr: number) => {
    if (!liveMetrics.isSimulating) return { name: 'Resting / Idle', range: '50-80 BPM', style: 'text-slate-400 border-slate-800 bg-slate-800/10', color: '#64748b' };
    if (hr < 80) return { name: 'Zone 1: Active Recovery', range: '50-99 BPM', style: 'text-sky-400 border-sky-500/20 bg-sky-500/5', color: '#38bdf8' };
    if (hr < 120) return { name: 'Zone 2: Aerobic Base', range: '100-119 BPM', style: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', color: '#34d399' };
    if (hr < 145) return { name: 'Zone 3: Cardio / Tempo', range: '120-144 BPM', style: 'text-gold border-gold/20 bg-gold/5', color: '#6366f1' };
    if (hr < 165) return { name: 'Zone 4: Threshold Energy', range: '145-164 BPM', style: 'text-orange-400 border-orange-500/20 bg-orange-500/5', color: '#f97316' };
    return { name: 'Zone 5: Maximum VO2 Peak', range: '165-200 BPM', style: 'text-red-400 border-red-500/20 bg-red-500/5', color: '#ef4444' };
  };

  const hrZone = getHRZone(liveMetrics.heartRate);

  // Daily target calorie parameters
  const calorieTarget = 850;
  const currentTotalCalories = 420 + liveMetrics.calories; // 420 is baseline day burn
  const caloriePercentage = Math.min(100, Math.round((currentTotalCalories / calorieTarget) * 100));

  return (
    <div className="min-h-screen bg-midnight text-on-surface font-sans antialiased selection:bg-gold/30 selection:text-white">
      
      {/* Top Thin Luxury Bar */}
      <div className="bg-slate-900 border-b border-slate-metal/20 text-[10px] py-1.5 px-4 sm:px-8 flex justify-between items-center font-mono tracking-widest text-slate-400 uppercase">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-gold" />
          <span>AURA CLUB • WEST HOLLYWOOD</span>
        </div>
        <div className="flex items-center gap-4">
          <span>SECURE TELEMETRY ACCESS</span>
          <span className="hidden sm:inline">• STATUS: ACTIVE</span>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Navigation & Brand Header */}
        <header id="main-header" className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-metal/25 mb-8">
          <div className="flex items-center gap-3.5">
            {/* Logo Mark */}
            <div className="w-12 h-12 bg-midnight border border-gold rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.15)]">
              <span className="font-display font-bold text-lg text-gold tracking-tight">A</span>
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-white tracking-[0.2em] uppercase">
                Aura Athletics
              </h1>
              <span className="text-[10px] font-mono font-semibold tracking-widest text-gold uppercase">
                REFINED ATHLETIC PERFORMANCE
              </span>
            </div>
          </div>

          {/* User Profile & Client Badge */}
          <div className="flex items-center gap-3 bg-obsidian border border-slate-metal/30 py-2 px-4 rounded-xl">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-gold/30 flex items-center justify-center text-gold font-bold">
                AS
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-midnight rounded-full" />
            </div>
            
            <div className="text-left">
              <div className="text-xs font-semibold text-white tracking-tight flex items-center gap-1">
                Abdullah Shahzad
              </div>
              <span className="text-[8px] font-mono font-bold text-gold uppercase tracking-wider bg-gold/10 px-1.5 py-0.5 rounded border border-gold/20">
                ELITE BLACK CARD CLUB
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Key Metric Widgets Row (Bento Style) */}
        <section id="key-metrics-grid" className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          
          {/* Active Calories Ring Widget */}
          <div className="bg-obsidian border border-slate-metal/40 rounded-xl p-5 flex items-center justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-1">
                <Flame className="w-3.5 h-3.5 text-gold-bright" /> Daily Energy Target
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-display font-light text-white tracking-tight">
                  {currentTotalCalories}
                </span>
                <span className="text-xs text-slate-400 font-mono">/ {calorieTarget} kcal</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 font-mono">
                {caloriePercentage}% Completed • {calorieTarget - currentTotalCalories > 0 ? `${calorieTarget - currentTotalCalories} kcal remaining` : 'Target reached!'}
              </p>
            </div>

            {/* Circular Progress Gauge */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="rgba(51, 65, 85, 0.2)"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="#6366f1"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 26}
                  strokeDashoffset={2 * Math.PI * 26 * (1 - caloriePercentage / 100)}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                />
              </svg>
              <span className="absolute text-xs font-mono font-semibold text-white">
                {caloriePercentage}%
              </span>
            </div>
          </div>

          {/* Dynamic HR Zone Meter */}
          <div className="bg-obsidian border border-slate-metal/40 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-1">
                  <Activity className="w-3.5 h-3.5 text-red-400" /> Cardiac Zone Matrix
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-display font-light text-white tracking-tight">
                    {liveMetrics.isSimulating ? liveMetrics.heartRate : '--'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">BPM</span>
                </div>
              </div>

              {/* Status Badge */}
              <span className={`text-[9px] font-mono font-bold px-2 py-1 rounded border uppercase ${hrZone.style}`}>
                {liveMetrics.isSimulating ? 'Active Tracking' : 'Sensor Offline'}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-xs text-white font-semibold flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: hrZone.color }} />
                {hrZone.name}
              </p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
                {/* Visual bar tracking HR range dynamically */}
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: liveMetrics.isSimulating ? `${Math.min(100, ((liveMetrics.heartRate - 50) / 150) * 100)}%` : '0%',
                    backgroundColor: hrZone.color 
                  }}
                />
              </div>
              <div className="flex justify-between items-center text-[9px] text-slate-500 mt-1.5 font-mono">
                <span>Range: {hrZone.range}</span>
                {liveMetrics.isSimulating && <span>Live Ticker</span>}
              </div>
            </div>
          </div>

          {/* Nervous System HRV Metric */}
          <div className="bg-obsidian border border-slate-metal/40 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden">
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Autonomic Homeostasis
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-display font-light text-white tracking-tight">
                  {liveMetrics.isSimulating ? Math.round(82 - (liveMetrics.stressLevel * 0.4)) : '82'}
                </span>
                <span className="text-xs text-slate-400 font-mono">ms</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 leading-normal">
                Heart Rate Variability (HRV) determines biological stress load tolerance. Higher scores indicate deep recovery buffer.
              </p>
            </div>

            <div className="mt-2.5 pt-2.5 border-t border-slate-metal/15 flex justify-between items-center text-xs">
              <span className="text-slate-400">Stress Balance:</span>
              <span className={`font-mono font-semibold ${
                liveMetrics.stressLevel > 70 ? 'text-red-400' :
                liveMetrics.stressLevel < 30 ? 'text-emerald-400' : 'text-gold'
              }`}>
                {liveMetrics.isSimulating ? `${Math.round(100 - liveMetrics.stressLevel)}% HRV Power` : 'Stable (Ready)'}
              </span>
            </div>
          </div>

        </section>

        {/* Main Columns Grid Layout */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SECTION (Column span 7) - Charts & Routine Planner */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Recharts Analytics Charts */}
            <AuraInteractiveCharts currentLiveMetrics={liveMetrics} />

            {/* Routine Planner with balance score */}
            <AuraRoutinePlanner />

          </div>

          {/* RIGHT SECTION (Column span 5) - Biometric simulator & histories */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Biometrics simulator controller */}
            <BiometricSensorSandbox metrics={liveMetrics} onChange={setLiveMetrics} />

            {/* Club check-ins & treatment log history */}
            <LuxuryActivityList />

          </div>

        </main>

        {/* Full-width bottom section: Coach Smart Recommendations */}
        <section id="coaching-section" className="mt-8 mb-4">
          <CoachAuraInsights />
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-slate-metal/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          <div>
            © {new Date().getFullYear()} Aura Athletics. All rights reserved.
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gold transition-colors">Privacy Charter</a>
            <span>•</span>
            <a href="#" className="hover:text-gold transition-colors">Client Guidelines</a>
            <span>•</span>
            <a href="#" className="hover:text-gold transition-colors">Club Concierge</a>
          </div>
        </footer>

      </div>
    </div>
  );
}
