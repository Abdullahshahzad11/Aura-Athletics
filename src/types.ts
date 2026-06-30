/**
 * Aura Athletics - Shared Types
 */

export interface ChartDataPoint {
  name: string;      // Date or Label (e.g., "Mon", "Tue")
  calories: number;  // Energy burned in kcal
  duration: number;  // Workout length in minutes
  heartRate: number; // Average heart rate in bpm
  recovery: number;  // Recovery percentage (0-100)
}

export interface ClubVisit {
  id: string;
  title: string;
  type: 'workout' | 'recovery' | 'spa';
  time: string;
  duration: string;
  metrics: {
    label: string;
    value: string;
    glow?: boolean;
  }[];
  peakHeartRate?: number;
  caloriesBurned?: number;
  coach?: string;
}

export interface PlannerRoutine {
  day: string; // "Mon", "Tue", etc.
  focus: 'Strength' | 'Cardio' | 'Recovery' | 'Rest' | 'Mindfulness';
  duration: number; // minutes
  intensity: 'Low' | 'Medium' | 'High';
  notes: string;
}

export interface ActiveSessionMetrics {
  heartRate: number;
  calories: number;
  activeTime: number; // in seconds
  stressLevel: number;
  isSimulating: boolean;
  speedMultiplier: number; // speed up simulation
}
