import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Flame, Clock, Heart, RefreshCw, BarChart3, TrendingUp } from 'lucide-react';
import { WEEKLY_CHART_DATA, MONTHLY_CHART_DATA } from '../data/mockData';
import { ChartDataPoint } from '../types';

interface ChartProps {
  currentLiveMetrics: {
    calories: number;
    heartRate: number;
    isSimulating: boolean;
  };
}

export default function AuraInteractiveCharts({ currentLiveMetrics }: ChartProps) {
  const [metric, setMetric] = useState<'calories' | 'duration' | 'heartRate' | 'recovery'>('calories');
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');

  // Dynamically inject live metrics into "Sun" data point if simulating is active
  const getProcessedData = (): ChartDataPoint[] => {
    const rawData = timeframe === 'weekly' ? WEEKLY_CHART_DATA : MONTHLY_CHART_DATA;
    if (timeframe === 'weekly' && currentLiveMetrics.isSimulating) {
      return rawData.map(point => {
        if (point.name === 'Sun') {
          return {
            ...point,
            calories: Math.max(point.calories, Math.round(currentLiveMetrics.calories)),
            heartRate: Math.max(point.heartRate, Math.round(currentLiveMetrics.heartRate)),
          };
        }
        return point;
      });
    }
    return rawData;
  };

  const currentData = getProcessedData();

  // Metric-specific visual configurations
  const metricConfigs = {
    calories: {
      label: 'Energy Burned',
      unit: 'kcal',
      icon: <Flame className="w-4.5 h-4.5" />,
      color: '#6366f1',
      gradientId: 'goldGradient',
      desc: 'Cumulative training calories measured by high-performance infrared monitors.'
    },
    duration: {
      label: 'Workout Duration',
      unit: 'min',
      icon: <Clock className="w-4.5 h-4.5" />,
      color: '#38BDF8',
      gradientId: 'blueGradient',
      desc: 'Active load and stress hours across cardio and weightlifting segments.'
    },
    heartRate: {
      label: 'Average Heart Rate',
      unit: 'bpm',
      icon: <Heart className="w-4.5 h-4.5" />,
      color: '#EF4444',
      gradientId: 'redGradient',
      desc: 'Average beats per minute calculated dynamically during peak work intervals.'
    },
    recovery: {
      label: 'Autonomic Recovery',
      unit: '%',
      icon: <RefreshCw className="w-4.5 h-4.5" />,
      color: '#34D399',
      gradientId: 'greenGradient',
      desc: 'Nervous system adaptation rating determined by HRV and parasympathetic metrics.'
    }
  };

  const activeConfig = metricConfigs[metric];

  // Custom polished Tooltip for the Recharts charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700/60 p-3 rounded-lg shadow-xl backdrop-blur-md">
          <p className="text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider">{label}</p>
          <div className="flex items-center gap-2">
            <span 
              className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]" 
              style={{ color: activeConfig.color, backgroundColor: activeConfig.color }} 
            />
            <span className="text-sm font-display font-bold text-white">
              {payload[0].value.toLocaleString()} {activeConfig.unit}
            </span>
          </div>
          {payload[0].payload.notes && (
            <p className="text-[10px] text-slate-400 mt-2 italic max-w-[150px]">
              {payload[0].payload.notes}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div id="interactive-charts-container" className="bg-obsidian border border-slate-metal/40 rounded-xl p-5 relative flex flex-col justify-between">
      
      {/* Top Banner Control */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <span className="text-[10px] font-bold text-gold uppercase tracking-[0.15em] flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3.5 h-3.5" /> Bio-Analytics Dashboard
            </span>
            <h2 className="text-xl font-display font-semibold text-white tracking-tight">
              Interactive Adaptation Trends
            </h2>
          </div>

          {/* Timeframe selector */}
          <div className="flex bg-midnight border border-slate-metal/40 p-1 rounded-lg self-stretch sm:self-auto justify-center">
            <button
              id="timeframe-weekly-btn"
              onClick={() => setTimeframe('weekly')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                timeframe === 'weekly' 
                  ? 'bg-gold text-midnight font-bold shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              7-Day Log
            </button>
            <button
              id="timeframe-monthly-btn"
              onClick={() => setTimeframe('monthly')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                timeframe === 'monthly' 
                  ? 'bg-gold text-midnight font-bold shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Focus
            </button>
          </div>
        </div>

        {/* Metric Picker Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-5">
          {(Object.keys(metricConfigs) as Array<keyof typeof metricConfigs>).map((key) => {
            const conf = metricConfigs[key];
            const isActive = metric === key;
            return (
              <button
                key={key}
                id={`metric-tab-${key}`}
                onClick={() => setMetric(key)}
                className={`py-3 px-3.5 rounded-lg border flex flex-col items-start gap-1 text-left transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? 'bg-slate-metal/20 text-white border-gold shadow-[0_0_12px_rgba(99,102,241,0.08)]' 
                    : 'bg-slate-metal/5 text-slate-400 border-slate-metal/20 hover:border-slate-metal/40 hover:bg-slate-metal/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span style={{ color: isActive ? conf.color : '#64748B' }}>
                    {conf.icon}
                  </span>
                  <span className="text-xs font-semibold tracking-wide font-sans">{conf.label}</span>
                </div>
                <div className="text-lg font-display font-light text-white leading-none">
                  {key === 'calories' && timeframe === 'weekly' 
                    ? `${currentData.reduce((acc, p) => acc + p.calories, 0).toLocaleString()} kcal`
                    : key === 'duration' && timeframe === 'weekly'
                    ? `${currentData.reduce((acc, p) => acc + p.duration, 0)} min`
                    : key === 'heartRate'
                    ? `${Math.round(currentData.reduce((acc, p) => acc + p.heartRate, 0) / currentData.length)} bpm`
                    : `${Math.round(currentData.reduce((acc, p) => acc + p.recovery, 0) / currentData.length)}%`
                  }
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  {timeframe === 'weekly' ? '7-Day Total' : 'Monthly Avg'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Graph Section */}
      <div className="flex-1 min-h-[240px] relative bg-midnight/30 border border-slate-metal/20 rounded-lg p-3">
        
        {/* Helper Metric Detail Text */}
        <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
          <p className="italic leading-normal max-w-lg">
            {activeConfig.desc}
          </p>
          {timeframe === 'weekly' && currentLiveMetrics.isSimulating && metric === 'calories' && (
            <span className="bg-gold/10 text-gold text-[10px] font-mono px-2 py-0.5 rounded-full animate-pulse border border-gold/20">
              Live Feed Connected
            </span>
          )}
        </div>

        <div className="w-full h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34D399" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#34D399" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(51, 65, 85, 0.2)" />
              <XAxis 
                dataKey="name" 
                stroke="#64748B" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                fontFamily="JetBrains Mono, monospace"
              />
              <YAxis 
                stroke="#64748B" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                fontFamily="JetBrains Mono, monospace"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey={metric} 
                stroke={activeConfig.color} 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill={`url(#${activeConfig.gradientId})`}
                activeDot={{ r: 6, strokeWidth: 0, fill: activeConfig.color }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
