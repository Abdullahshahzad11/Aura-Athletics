import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dumbbell, Sparkles, Coffee, Clock, Plus, ChevronDown, ChevronUp, User, Flame, CheckCircle2 } from 'lucide-react';
import { ClubVisit } from '../types';
import { RECENT_CLUB_VISITS } from '../data/mockData';

export default function LuxuryActivityList() {
  const [visits, setVisits] = useState<ClubVisit[]>(RECENT_CLUB_VISITS);
  const [expandedId, setExpandedId] = useState<string | null>('visit-1');
  
  // State for the log form toggle and form parameters
  const [isAdding, setIsAdding] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<'workout' | 'recovery' | 'spa'>('workout');
  const [formDuration, setFormDuration] = useState('45 min');
  const [formCoach, setFormCoach] = useState('');
  const [formMetricLabel, setFormMetricLabel] = useState('Focus');
  const [formMetricValue, setFormMetricValue] = useState('Aerobic Base');

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newVisit: ClubVisit = {
      id: `visit-${Date.now()}`,
      title: formTitle,
      type: formType,
      time: 'Just now',
      duration: formDuration,
      coach: formCoach || undefined,
      metrics: [
        { label: formMetricLabel || 'Focus', value: formMetricValue || 'General Conditioning', glow: true }
      ]
    };

    if (formType === 'workout') {
      newVisit.peakHeartRate = 168;
      newVisit.caloriesBurned = 450;
      newVisit.metrics.push({ label: 'Avg HR', value: '138 bpm' });
    } else if (formType === 'recovery') {
      newVisit.metrics.push({ label: 'HRV Gain', value: '+12 ms' });
    }

    setVisits(prev => [newVisit, ...prev]);
    setExpandedId(newVisit.id);
    setIsAdding(false);
    
    // Reset Form
    setFormTitle('');
    setFormCoach('');
    setFormMetricLabel('Focus');
    setFormMetricValue('Aerobic Base');
  };

  const getIcon = (type: ClubVisit['type']) => {
    switch (type) {
      case 'workout':
        return <Dumbbell className="w-4 h-4 text-red-400" />;
      case 'recovery':
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 'spa':
        return <Coffee className="w-4 h-4 text-sky-400" />;
    }
  };

  const badgeStyles = {
    workout: 'bg-red-500/10 text-red-400 border-red-500/20',
    recovery: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    spa: 'bg-sky-500/10 text-sky-400 border-sky-500/20'
  };

  return (
    <div id="activity-list-container" className="bg-obsidian border border-slate-metal/40 rounded-xl p-5">
      
      {/* Header with Log New Button */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <span className="text-[10px] font-bold text-gold uppercase tracking-[0.15em] flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Luxury Activity Registry
          </span>
          <h2 className="text-xl font-display font-semibold text-white tracking-tight">
            Club Visit & Spa History
          </h2>
        </div>

        <button
          id="log-session-toggle-btn"
          onClick={() => setIsAdding(!isAdding)}
          className="bg-gold text-midnight font-display font-semibold text-xs py-2 px-3.5 rounded-lg flex items-center gap-1.5 hover:bg-gold-bright transition-all cursor-pointer active:scale-[0.98]"
        >
          {isAdding ? 'Close Log' : 'Log New Session'}
          <Plus className={`w-3.5 h-3.5 transition-transform duration-300 ${isAdding ? 'rotate-45' : ''}`} />
        </button>
      </div>

      {/* Log Session Drawer / Inline Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            id="log-session-form"
            onSubmit={handleLogSubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-5 p-4 bg-midnight/55 border border-gold/25 rounded-lg"
          >
            <h3 className="text-xs font-bold text-gold uppercase tracking-wider mb-4 border-b border-slate-metal/20 pb-2">
              Add Verified Studio Session
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Discipline Type</label>
                <div className="flex bg-slate-metal/10 p-1 border border-slate-metal/20 rounded-md">
                  {(['workout', 'recovery', 'spa'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      id={`form-type-${t}`}
                      onClick={() => setFormType(t)}
                      className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all cursor-pointer ${
                        formType === t 
                          ? 'bg-gold text-midnight' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Session Title</label>
                <input
                  type="text"
                  id="form-title-input"
                  required
                  placeholder="e.g. Hyperbaric Chamber, Heavy Squats"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-metal/15 border border-slate-metal/30 rounded-md px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Coach or Therapist (Optional)</label>
                <input
                  type="text"
                  id="form-coach-input"
                  placeholder="e.g. Elena Rostova"
                  value={formCoach}
                  onChange={(e) => setFormCoach(e.target.value)}
                  className="w-full bg-slate-metal/15 border border-slate-metal/30 rounded-md px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Duration</label>
                <input
                  type="text"
                  id="form-duration-input"
                  required
                  value={formDuration}
                  onChange={(e) => setFormDuration(e.target.value)}
                  className="w-full bg-slate-metal/15 border border-slate-metal/30 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Primary Metric Label</label>
                <input
                  type="text"
                  id="form-metric-label-input"
                  placeholder="e.g. Load Volume, Skin Temp"
                  value={formMetricLabel}
                  onChange={(e) => setFormMetricLabel(e.target.value)}
                  className="w-full bg-slate-metal/15 border border-slate-metal/30 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Metric Value</label>
                <input
                  type="text"
                  id="form-metric-value-input"
                  placeholder="e.g. 14,250 kg, 38.5 °C"
                  value={formMetricValue}
                  onChange={(e) => setFormMetricValue(e.target.value)}
                  className="w-full bg-slate-metal/15 border border-slate-metal/30 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <button
              type="submit"
              id="form-submit-btn"
              className="w-full bg-gold hover:bg-gold-bright text-midnight font-semibold font-display text-xs py-2 px-4 rounded-md transition-all cursor-pointer shadow-md shadow-gold/10"
            >
              Log Verified Visit
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* History List */}
      <div className="space-y-3">
        {visits.map((visit) => {
          const isExpanded = expandedId === visit.id;
          return (
            <div
              key={visit.id}
              id={`activity-item-${visit.id}`}
              className={`border rounded-lg transition-all duration-300 ${
                isExpanded 
                  ? 'bg-slate-metal/10 border-gold/40 shadow-[0_0_12px_rgba(99,102,241,0.04)]' 
                  : 'bg-slate-metal/5 border-slate-metal/20 hover:border-slate-metal/35'
              }`}
            >
              {/* Header block (clickable) */}
              <div
                onClick={() => toggleExpand(visit.id)}
                className="p-3.5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-9 h-9 rounded-md border border-slate-metal/30 flex items-center justify-center bg-midnight`}>
                    {getIcon(visit.type)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white tracking-tight">{visit.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase font-semibold ${badgeStyles[visit.type]}`}>
                        {visit.type}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" /> {visit.time}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-medium text-slate-400">{visit.duration}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {/* Expandable Parameters Panel */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-slate-metal/20 bg-midnight/30 px-4 py-4"
                  >
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      {visit.metrics.map((met, i) => (
                        <div key={i} className="bg-slate-metal/5 border border-slate-metal/20 p-2.5 rounded-md">
                          <span className="block text-[9px] font-mono text-slate-500 uppercase">{met.label}</span>
                          <span className={`text-xs font-semibold ${met.glow ? 'text-gold font-bold' : 'text-white'}`}>
                            {met.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Detailed stats if physical workout */}
                    {visit.type === 'workout' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-slate-metal/10 text-xs">
                        <div className="flex justify-between items-center text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <Flame className="w-4 h-4 text-gold-bright" /> Calories Consumed
                          </span>
                          <span className="font-mono text-white font-semibold">{visit.caloriesBurned} kcal</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <ChevronUp className="w-4 h-4 text-red-400" /> Peak Cardiac Rate
                          </span>
                          <span className="font-mono text-white font-semibold">{visit.peakHeartRate} BPM</span>
                        </div>
                      </div>
                    )}

                    {/* Coach Reference */}
                    {visit.coach && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-3 border-t border-slate-metal/10 mt-3">
                        <User className="w-3.5 h-3.5 text-gold-dim" />
                        <span>Therapist / Trainer:</span>
                        <span className="text-white font-medium">{visit.coach}</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
