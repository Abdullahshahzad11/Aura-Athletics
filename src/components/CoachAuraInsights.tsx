import React, { useState } from 'react';
import { Sparkles, Check, RefreshCw } from 'lucide-react';
import { COACH_RECOMMENDATIONS } from '../data/mockData';

export default function CoachAuraInsights() {
  const [acknowledged, setAcknowledged] = useState<Record<number, boolean>>({});

  const toggleAcknowledge = (index: number) => {
    setAcknowledged(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div id="coach-insights-container" className="bg-obsidian border border-slate-metal/40 rounded-xl p-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

      <div className="flex justify-between items-center mb-5">
        <div>
          <span className="text-[10px] font-bold text-gold uppercase tracking-[0.15em] flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" /> AI Coach Adaptation Engine
          </span>
          <h2 className="text-xl font-display font-semibold text-white tracking-tight">
            Verified Smart Coaching Insights
          </h2>
        </div>
        
        {/* Simple Reset */}
        {Object.keys(acknowledged).length > 0 && (
          <button
            id="reset-insights-btn"
            onClick={() => setAcknowledged({})}
            className="text-xs font-mono text-gold hover:text-gold-bright flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Reset Insights
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COACH_RECOMMENDATIONS.map((rec, index) => {
          const isAck = acknowledged[index];
          return (
            <div
              key={index}
              id={`insight-card-${index}`}
              className={`p-4 border rounded-lg transition-all duration-300 relative flex flex-col justify-between ${
                isAck 
                  ? 'bg-slate-900/40 border-slate-800 opacity-50 scale-[0.98]' 
                  : 'bg-slate-metal/5 border-slate-metal/20 hover:border-slate-metal/35 hover:bg-slate-metal/10'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2.5">
                  <span className="text-[9px] font-mono text-gold-bright uppercase tracking-wider bg-gold/10 px-2 py-0.5 rounded border border-gold/10">
                    {rec.badge}
                  </span>
                  
                  {isAck && (
                    <span className="text-emerald-400 flex items-center gap-0.5 text-[10px] font-mono font-bold uppercase">
                      <Check className="w-3 h-3" /> Integrated
                    </span>
                  )}
                </div>

                <h3 className={`text-sm font-semibold text-white tracking-tight mb-1.5 ${isAck ? 'line-through text-slate-500' : ''}`}>
                  {rec.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {rec.description}
                </p>
              </div>

              <button
                id={`insight-ack-btn-${index}`}
                onClick={() => toggleAcknowledge(index)}
                className={`w-full py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isAck
                    ? 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
                    : 'bg-gold/10 border border-gold/20 text-gold hover:bg-gold hover:text-midnight font-bold'
                }`}
              >
                {isAck ? 'Re-open' : 'Acknowledge & Integrate'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
