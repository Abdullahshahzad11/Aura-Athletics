import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Play, Square, Flame, Brain, Gauge, Sparkles, Heart } from 'lucide-react';
import { ActiveSessionMetrics } from '../types';

interface SensorProps {
  metrics: ActiveSessionMetrics;
  onChange: React.Dispatch<React.SetStateAction<ActiveSessionMetrics>>;
}

export default function BiometricSensorSandbox({ metrics, onChange }: SensorProps) {
  const [pulsePath, setPulsePath] = useState<number[]>(Array(40).fill(50));
  const animationFrameId = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const phaseRef = useRef(0);

  // Initialize and run ECG Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.parentElement?.clientWidth || 300;
    const height = canvas.height = 70;

    // Handle resizing
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (canvas) {
          width = canvas.width = entry.contentRect.width;
        }
      }
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const drawPulse = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint background grid
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.2)';
      ctx.lineWidth = 1;
      const gridSize = 15;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw active ECG path
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      
      // Determine stroke color based on heart rate level
      let strokeColor = 'rgba(99, 102, 241, 0.8)'; // Metallic Indigo for standard
      if (metrics.heartRate > 150) {
        strokeColor = 'rgba(239, 68, 68, 0.9)'; // Active Red for sprint
      } else if (metrics.heartRate < 80) {
        strokeColor = 'rgba(56, 189, 248, 0.8)'; // Light blue for deep recovery
      }
      
      ctx.strokeStyle = strokeColor;
      
      // Shadow / glow effect
      ctx.shadowBlur = 8;
      ctx.shadowColor = strokeColor;

      const points: {x: number, y: number}[] = [];
      const step = width / 50;

      for (let i = 0; i <= 50; i++) {
        const x = i * step;
        let y = height / 2;

        if (metrics.isSimulating) {
          // Heart rate controls speed of heartbeats
          // Map heart rate to heartbeat intervals
          const bpmInterval = (60 / metrics.heartRate) * 60; // frames per beat
          const currentFrame = (phaseRef.current + i * 0.4) % bpmInterval;
          
          // Generate realistic ECG PQRST complex shape
          if (currentFrame < 4) {
            // P wave
            y -= Math.sin((currentFrame / 4) * Math.PI) * 4;
          } else if (currentFrame >= 6 && currentFrame < 8) {
            // Q wave (dip)
            y += 5;
          } else if (currentFrame >= 8 && currentFrame < 11) {
            // R wave (main sharp spike up)
            y -= 25;
          } else if (currentFrame >= 11 && currentFrame < 14) {
            // S wave (sharp dip down)
            y += 18;
          } else if (currentFrame >= 17 && currentFrame < 23) {
            // T wave (medium broad wave)
            y -= Math.sin(((currentFrame - 17) / 6) * Math.PI) * 8;
          }
        }

        points.push({ x, y });
      }

      ctx.beginPath();
      if (points.length > 0) {
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset shadow for other renders

      // Update Phase
      if (metrics.isSimulating) {
        const delta = (metrics.heartRate / 60) * metrics.speedMultiplier * 0.5;
        phaseRef.current += delta;
      }

      animationFrameId.current = requestAnimationFrame(drawPulse);
    };

    drawPulse();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      resizeObserver.disconnect();
    };
  }, [metrics.isSimulating, metrics.heartRate, metrics.speedMultiplier]);

  // Handle live increments when simulation is active
  useEffect(() => {
    if (!metrics.isSimulating) return;

    const interval = setInterval(() => {
      onChange(prev => {
        // Increment time based on multiplier
        const newTime = prev.activeTime + (1 * prev.speedMultiplier);
        
        // Calculate calorie burn based on current heart rate
        // High HR burns significantly more calories
        const hrFactor = (prev.heartRate - 50) / 100; // 0 to ~1.3
        const caloriesPerSecond = (0.15 + (hrFactor * 0.35)) * prev.speedMultiplier;
        const newCalories = Math.round((prev.calories + caloriesPerSecond) * 10) / 10;

        // Drift HR slowly towards an equilibrium depending on state
        // If no target interval is active, drift towards a resting recovery or basic active
        let targetHR = 110; // Baseline gym pace
        let stressTarget = 45;

        // If HR has been spiked, slowly decay back to baseline unless active breathwork
        if (prev.heartRate > 150) {
          targetHR = 158; // sprint decaying slowly
          stressTarget = 85;
        } else if (prev.heartRate < 85) {
          targetHR = 65; // recovery cooling down
          stressTarget = 18;
        }

        const hrChange = (targetHR - prev.heartRate) * 0.05;
        const newHR = Math.max(50, Math.min(200, Math.round((prev.heartRate + hrChange + (Math.random() * 2 - 1)) * 10) / 10));

        const stressChange = (stressTarget - prev.stressLevel) * 0.08;
        const newStress = Math.max(5, Math.min(100, Math.round((prev.stressLevel + stressChange + (Math.random() * 1.5 - 0.75)) * 10) / 10));

        return {
          ...prev,
          activeTime: newTime,
          calories: newCalories,
          heartRate: newHR,
          stressLevel: newStress
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [metrics.isSimulating, onChange]);

  const toggleSimulation = () => {
    onChange(prev => {
      const isStarting = !prev.isSimulating;
      return {
        ...prev,
        isSimulating: isStarting,
        // Set realistic starting states
        heartRate: isStarting ? 112 : 72,
        stressLevel: isStarting ? 52 : 28,
        activeTime: isStarting ? 0 : prev.activeTime,
        calories: isStarting ? 0 : prev.calories
      };
    });
  };

  const handleSprintSpike = () => {
    if (!metrics.isSimulating) {
      // Force start first
      onChange(prev => ({ ...prev, isSimulating: true, heartRate: 110, stressLevel: 50, activeTime: 0, calories: 0 }));
    }
    // Instantly spike HR and stress to model anaerobic sprint
    onChange(prev => ({
      ...prev,
      heartRate: 178,
      stressLevel: 88
    }));
  };

  const handleDeepRecoveryBreath = () => {
    if (!metrics.isSimulating) {
      onChange(prev => ({ ...prev, isSimulating: true, heartRate: 90, stressLevel: 35, activeTime: 0, calories: 0 }));
    }
    // Instantly drop HR and stress to model recovery
    onChange(prev => ({
      ...prev,
      heartRate: 58,
      stressLevel: 12
    }));
  };

  const changeMultiplier = (mult: number) => {
    onChange(prev => ({ ...prev, speedMultiplier: mult }));
  };

  // Helper to format active duration
  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div id="sensor-sandbox-container" className="bg-obsidian border border-slate-metal/40 rounded-xl p-5 relative overflow-hidden gold-glow">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-[10px] font-bold text-gold uppercase tracking-[0.15em] flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Biometric Simulation Engine
          </span>
          <h2 className="text-xl font-display font-semibold text-white tracking-tight">
            Refined Live Performance Tracker
          </h2>
        </div>
        
        <div className="flex gap-1.5 bg-slate-metal/20 border border-slate-metal/40 p-1 rounded-lg">
          <button
            id="sim-speed-1x"
            onClick={() => changeMultiplier(1)}
            className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-all ${
              metrics.speedMultiplier === 1 
                ? 'bg-gold text-midnight shadow-md font-bold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1x
          </button>
          <button
            id="sim-speed-5x"
            onClick={() => changeMultiplier(5)}
            className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-all ${
              metrics.speedMultiplier === 5 
                ? 'bg-gold text-midnight shadow-md font-bold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            5x
          </button>
          <button
            id="sim-speed-10x"
            onClick={() => changeMultiplier(10)}
            className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-all ${
              metrics.speedMultiplier === 10 
                ? 'bg-gold text-midnight shadow-md font-bold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            10x
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-400 mb-5 leading-relaxed">
        Simulate an active cardiovascular, strength, or bio-recovery routine at the gym. Toggle your live sensor tracking and inject cardiac loads instantly to view dynamic dashboard updates.
      </p>

      {/* Main Live Biometrics Board */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        
        {/* Heart Rate Block */}
        <div className="bg-slate-metal/10 border border-slate-metal/20 p-4 rounded-lg relative overflow-hidden group">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-slate-400 font-medium font-sans">Heart Rate</span>
            <motion.div
              animate={metrics.isSimulating ? { scale: [1, 1.25, 1] } : {}}
              transition={{ repeat: Infinity, duration: 60 / metrics.heartRate, ease: "easeInOut" }}
            >
              <Heart className={`w-4.5 h-4.5 ${metrics.heartRate > 150 ? 'text-red-500 fill-red-500' : 'text-gold fill-gold/20'}`} />
            </motion.div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-display font-light text-white tracking-tight">
              {metrics.isSimulating ? metrics.heartRate : '--'}
            </span>
            <span className="text-xs text-slate-500 font-mono">BPM</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1.5 flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${
              !metrics.isSimulating ? 'bg-slate-600' :
              metrics.heartRate > 150 ? 'bg-red-500 animate-ping' :
              metrics.heartRate < 80 ? 'bg-sky-400' : 'bg-gold animate-pulse'
            }`} />
            {
              !metrics.isSimulating ? 'Sensor Offline' :
              metrics.heartRate > 150 ? 'Zone 5 Threshold' :
              metrics.heartRate < 80 ? 'Parasympathetic' : 'Zone 2 Conditioning'
            }
          </div>
        </div>

        {/* Calories Block */}
        <div className="bg-slate-metal/10 border border-slate-metal/20 p-4 rounded-lg relative overflow-hidden">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-slate-400 font-medium">Energy Burn</span>
            <Flame className="w-4.5 h-4.5 text-gold/80" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-display font-light text-white tracking-tight">
              {metrics.isSimulating ? Math.round(metrics.calories) : '--'}
            </span>
            <span className="text-xs text-slate-500 font-mono">kcal</span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono mt-1.5">
            {metrics.isSimulating ? `+${((metrics.heartRate - 50) / 100 * 3).toFixed(1)} kcal/min` : 'Cumulative Effort'}
          </p>
        </div>

        {/* Time Elapsed Block */}
        <div className="bg-slate-metal/10 border border-slate-metal/20 p-4 rounded-lg relative overflow-hidden">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-slate-400 font-medium">Session Time</span>
            <Activity className="w-4.5 h-4.5 text-gold/80" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-display font-light text-white tracking-tight font-mono">
              {metrics.isSimulating ? formatDuration(metrics.activeTime) : '00:00'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono mt-1.5">
            {metrics.isSimulating ? `Active @ ${metrics.speedMultiplier}x speed` : 'Sensor Standby'}
          </p>
        </div>

        {/* Stress Score Block */}
        <div className="bg-slate-metal/10 border border-slate-metal/20 p-4 rounded-lg relative overflow-hidden">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-slate-400 font-medium">Autonomic Stress</span>
            <Brain className="w-4.5 h-4.5 text-gold/80" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-display font-light text-white tracking-tight">
              {metrics.isSimulating ? Math.round(metrics.stressLevel) : '--'}
            </span>
            <span className="text-xs text-slate-500 font-mono">/100</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1.5 flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${
              !metrics.isSimulating ? 'bg-slate-600' :
              metrics.stressLevel > 70 ? 'bg-red-500' :
              metrics.stressLevel < 30 ? 'bg-emerald-400' : 'bg-gold'
            }`} />
            {
              !metrics.isSimulating ? 'Pending Biometrics' :
              metrics.stressLevel > 70 ? 'Sympathetic Spike' :
              metrics.stressLevel < 30 ? 'Deep Recovery State' : 'Homeostasis Balance'
            }
          </div>
        </div>

      </div>

      {/* Real-time ECG Canvas Trace */}
      <div className="bg-midnight border border-slate-metal/40 rounded-lg p-2.5 mb-5 relative">
        <div className="absolute top-2 left-3 flex items-center gap-1.5 z-10">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${metrics.isSimulating ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${metrics.isSimulating ? 'bg-emerald-500' : 'bg-slate-600'}`}></span>
          </span>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            {metrics.isSimulating ? 'Live Biometric Signal Oscillation' : 'Heart Rate Sensor Idle'}
          </span>
        </div>
        <canvas ref={canvasRef} className="w-full h-[70px] bg-midnight block rounded-md" />
      </div>

      {/* Control Actions & Simulation Injectors */}
      <div className="flex flex-col sm:flex-row gap-3">
        
        {/* Primary Start/Stop Simulation button */}
        <button
          id="toggle-sensor-btn"
          onClick={toggleSimulation}
          className={`flex-1 py-3 px-4 rounded-lg font-display font-medium text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            metrics.isSimulating
              ? 'bg-red-500/10 border border-red-500 text-red-400 hover:bg-red-500/20 active:scale-[0.98]'
              : 'bg-gold text-midnight hover:bg-gold-bright hover:shadow-lg font-bold hover:shadow-gold/10 active:scale-[0.98]'
          }`}
        >
          {metrics.isSimulating ? (
            <>
              <Square className="w-4.5 h-4.5 fill-current" /> Terminate Live Sync
            </>
          ) : (
            <>
              <Play className="w-4.5 h-4.5 fill-current" /> Connect Sensor & Sync
            </>
          )}
        </button>

        {/* Inject High Cardiac Load */}
        <button
          id="inject-sprint-btn"
          onClick={handleSprintSpike}
          className="py-3 px-4 rounded-lg bg-slate-metal/20 border border-slate-metal/40 hover:border-red-500/50 hover:bg-red-500/5 hover:text-red-400 text-slate-300 font-display font-medium text-sm flex items-center justify-center gap-2 transition-all cursor-pointer group active:scale-[0.98]"
        >
          <Flame className="w-4.5 h-4.5 text-red-400 group-hover:animate-bounce" /> Simulate High Sprint Peak
        </button>

        {/* Inject Parasympathetic Reset */}
        <button
          id="inject-recovery-btn"
          onClick={handleDeepRecoveryBreath}
          className="py-3 px-4 rounded-lg bg-slate-metal/20 border border-slate-metal/40 hover:border-sky-500/50 hover:bg-sky-500/5 hover:text-sky-400 text-slate-300 font-display font-medium text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
        >
          <Brain className="w-4.5 h-4.5 text-sky-400" /> Deep Cooldown Breath
        </button>

      </div>
    </div>
  );
}
