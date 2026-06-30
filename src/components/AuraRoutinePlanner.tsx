import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, ShieldAlert, Sparkles, Trophy, Dumbbell, Heart, Coffee, Eye, Edit2 } from 'lucide-react';
import { PlannerRoutine } from '../types';
import { DEFAULT_PLANNER_ROUTINE } from '../data/mockData';

export default function AuraRoutinePlanner() {
  const [schedule, setSchedule] = useState<PlannerRoutine[]>(DEFAULT_PLANNER_ROUTINE);
  const [selectedDay, setSelectedDay] = useState<string>('Mon');

  // Find currently active day to show in editor
  const activeDayIndex = schedule.findIndex(item => item.day === selectedDay);
  const activeRoutine = schedule[activeDayIndex] || schedule[0];

  // Modify schedule items
  const updateActiveRoutine = (updates: Partial<PlannerRoutine>) => {
    setSchedule(prev => prev.map((item, idx) => {
      if (item.day === selectedDay) {
        return { ...item, ...updates };
      }
      return item;
    }));
  };

  // Calculate Autonomic Stress vs Adaptation Balance Score
  // Stress focuses: Strength, Cardio (High physical output)
  // Adaptation focuses: Recovery, Mindfulness, Rest
  const calculateBalance = () => {
    let stressMins = 0;
    let adaptationMins = 0;

    schedule.forEach(item => {
      if (item.focus === 'Strength' || item.focus === 'Cardio') {
        stressMins += item.duration;
      } else if (item.focus === 'Recovery' || item.focus === 'Mindfulness') {
        adaptationMins += item.duration;
      } else if (item.focus === 'Rest') {
        adaptationMins += 45; // Assign an effective credit of 45 mins of passive parasympathetic reset
      }
    });

    const totalMins = stressMins + adaptationMins;
    if (totalMins === 0) return { percentage: 50, status: 'Homeostasis', color: '#6366f1', desc: 'No active scheduling.' };

    const stressRatio = stressMins / totalMins;
    const adaptationRatio = adaptationMins / totalMins;

    // We want a balanced ratio of around 50-60% stress and 40-50% adaptation for elite training
    const recoveryPercentage = Math.round(adaptationRatio * 100);

    let status = 'Balanced';
    let color = '#6366f1'; // Indigo
    let desc = 'Your training stress and biological recovery are in perfect harmony. Ideal for progressive athletic gains and sustainable health.';
    let icon = <Trophy className="w-5 h-5 text-gold" />;

    if (recoveryPercentage < 35) {
      status = 'Sympathetic Dominant';
      color = '#EF4444'; // Red
      desc = 'High risk of overtraining and neural fatigue. Your nervous system is locked in high sympathetic flight. Replace a Strength session with Cryo or Spa Recovery.';
      icon = <ShieldAlert className="w-5 h-5 text-red-400" />;
    } else if (recoveryPercentage > 65) {
      status = 'Parasympathetic Heavy';
      color = '#38BDF8'; // Blue
      desc = 'High recovery buffer. Your body is fully recharged and ready for metabolic loading. Increase strength volume or cardiac intensity to hit progressive adaptation targets.';
      icon = <Sparkles className="w-5 h-5 text-sky-400" />;
    }

    return {
      percentage: recoveryPercentage,
      status,
      color,
      desc,
      icon,
      stressMins,
      adaptationMins
    };
  };

  const balance = calculateBalance();

  const focusIcons = {
    Strength: <Dumbbell className="w-4 h-4" />,
    Cardio: <Heart className="w-4 h-4" />,
    Recovery: <Sparkles className="w-4 h-4" />,
    Mindfulness: <Eye className="w-4 h-4" />,
    Rest: <Coffee className="w-4 h-4" />
  };

  const focusColors = {
    Strength: 'text-red-400 border-red-500/20 bg-red-500/5',
    Cardio: 'text-gold-bright border-gold/20 bg-gold/5',
    Recovery: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
    Mindfulness: 'text-sky-400 border-sky-500/20 bg-sky-500/5',
    Rest: 'text-slate-400 border-slate-500/20 bg-slate-500/5'
  };

  return (
    <div id="routine-planner-container" className="bg-obsidian border border-slate-metal/40 rounded-xl p-5">
      
      {/* Top Section / Autonomic Balance Guage */}
      <div className="flex flex-col lg:flex-row gap-5 items-center justify-between pb-6 border-b border-slate-metal/20 mb-6">
        <div className="flex-1">
          <span className="text-[10px] font-bold text-gold uppercase tracking-[0.15em] flex items-center gap-1.5 mb-1">
            <Calendar className="w-3.5 h-3.5" /> Neural Adaptation Planner
          </span>
          <h2 className="text-xl font-display font-semibold text-white tracking-tight mb-2">
            Autonomic Stress-to-Recovery Index
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-4 lg:mb-0">
            Customize your schedule below. Our algorithm calculates the biological equilibrium of your training blocks to guarantee long-term muscle synthesis and nervous system health.
          </p>
        </div>

        {/* Circular Gauge */}
        <div className="flex flex-col sm:flex-row items-center gap-5 bg-midnight/50 border border-slate-metal/30 p-4 rounded-xl max-w-xl w-full">
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            {/* SVG circular track */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="46"
                stroke="rgba(51, 65, 85, 0.25)"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r="46"
                stroke={balance.color}
                strokeWidth="7"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 46}
                strokeDashoffset={2 * Math.PI * 46 * (1 - balance.percentage / 100)}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-display font-light text-white tracking-tight leading-none">
                {balance.percentage}%
              </span>
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mt-1">
                Adaptation
              </span>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              {balance.icon}
              <span className="text-sm font-semibold text-white font-display">
                {balance.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-2.5">
              {balance.desc}
            </p>
            <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500">
              <div>
                Stress: <span className="text-slate-300 font-bold">{balance.stressMins}m</span>
              </div>
              <div>
                Adaptation: <span className="text-slate-300 font-bold">{balance.adaptationMins}m</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Routine Grid (Days of Week) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-6">
        {schedule.map((item) => {
          const isSelected = item.day === selectedDay;
          const focusStyle = focusColors[item.focus];
          return (
            <button
              key={item.day}
              id={`planner-day-${item.day}`}
              onClick={() => setSelectedDay(item.day)}
              className={`p-3.5 rounded-lg border text-left transition-all relative cursor-pointer ${
                isSelected 
                  ? 'bg-slate-metal/25 border-gold shadow-[0_0_10px_rgba(99,102,241,0.06)] scale-[1.02]' 
                  : 'bg-slate-metal/5 border-slate-metal/25 hover:border-slate-metal/40 hover:bg-slate-metal/10'
              }`}
            >
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase">{item.day}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-gold' : 'bg-transparent'}`} />
              </div>

              <div className="flex items-center gap-1.5 mb-1">
                <span className={item.focus === 'Rest' ? 'text-slate-500' : 'text-gold'}>
                  {focusIcons[item.focus]}
                </span>
                <span className="text-xs font-semibold text-white truncate max-w-[80px]">
                  {item.focus}
                </span>
              </div>

              <div className="text-xs text-slate-400">
                {item.focus === 'Rest' ? '--' : `${item.duration} min`}
              </div>

              <span className={`absolute bottom-2.5 right-2.5 text-[8px] font-mono px-1.5 py-0.5 rounded border ${focusStyle}`}>
                {item.intensity}
              </span>
            </button>
          );
        })}
      </div>

      {/* Day editor Form Panel */}
      <div className="bg-midnight/40 border border-slate-metal/30 p-5 rounded-lg">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-metal/20 pb-3">
          <Edit2 className="w-4 h-4 text-gold" />
          <h3 className="text-sm font-display font-medium text-white">
            Biological Parameters for <span className="text-gold font-bold">{selectedDay}day</span> Focus Block
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Focus Picker */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Focus Discipline
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {(['Strength', 'Cardio', 'Recovery', 'Mindfulness', 'Rest'] as const).map((type) => (
                <button
                  key={type}
                  id={`focus-type-${type}`}
                  onClick={() => {
                    const defaultDur = type === 'Rest' ? 0 : type === 'Mindfulness' ? 25 : 60;
                    const defaultInt = type === 'Rest' || type === 'Mindfulness' || type === 'Recovery' ? 'Low' as const : 'High' as const;
                    updateActiveRoutine({ focus: type, duration: defaultDur, intensity: defaultInt });
                  }}
                  className={`py-2 px-1.5 rounded-md border text-xs font-semibold transition-all text-center cursor-pointer ${
                    activeRoutine.focus === type
                      ? 'bg-gold text-midnight border-gold font-bold shadow-md'
                      : 'bg-slate-metal/5 border-slate-metal/20 text-slate-400 hover:border-slate-metal/40 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Slider / Intensity */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Duration (Minutes)
                </label>
                <span className="text-xs font-mono font-bold text-gold">
                  {activeRoutine.focus === 'Rest' ? '0 min' : `${activeRoutine.duration} min`}
                </span>
              </div>
              <input
                type="range"
                id="duration-slider"
                min="0"
                max="120"
                step="5"
                disabled={activeRoutine.focus === 'Rest'}
                value={activeRoutine.duration}
                onChange={(e) => updateActiveRoutine({ duration: parseInt(e.target.value) })}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-gold disabled:opacity-30 disabled:cursor-not-allowed mb-4"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Physical Intensity
              </label>
              <div className="flex bg-slate-metal/15 border border-slate-metal/30 p-1 rounded-lg">
                {(['Low', 'Medium', 'High'] as const).map((int) => (
                  <button
                    key={int}
                    id={`intensity-${int}`}
                    disabled={activeRoutine.focus === 'Rest'}
                    onClick={() => updateActiveRoutine({ intensity: int })}
                    className={`flex-1 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      activeRoutine.intensity === int && activeRoutine.focus !== 'Rest'
                        ? 'bg-slate-metal/30 text-white font-bold border border-slate-metal/50'
                        : 'text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed'
                    }`}
                  >
                    {int}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Target Notes */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Focus Outline / Muscle Group
            </label>
            <textarea
              id="focus-notes-input"
              rows={3}
              value={activeRoutine.notes}
              onChange={(e) => updateActiveRoutine({ notes: e.target.value })}
              placeholder="E.g., Quad loading, tempo rows, thermal treatment focus..."
              className="w-full bg-slate-metal/10 border border-slate-metal/30 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
