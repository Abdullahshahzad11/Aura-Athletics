import { ChartDataPoint, ClubVisit, PlannerRoutine } from '../types';

export const WEEKLY_CHART_DATA: ChartDataPoint[] = [
  { name: 'Mon', calories: 420, duration: 45, heartRate: 135, recovery: 72 },
  { name: 'Tue', calories: 680, duration: 60, heartRate: 142, recovery: 64 },
  { name: 'Wed', calories: 250, duration: 30, heartRate: 110, recovery: 88 },
  { name: 'Thu', calories: 710, duration: 75, heartRate: 148, recovery: 51 },
  { name: 'Fri', calories: 510, duration: 50, heartRate: 138, recovery: 78 },
  { name: 'Sat', calories: 820, duration: 90, heartRate: 152, recovery: 40 },
  { name: 'Sun', calories: 300, duration: 40, heartRate: 95,  recovery: 92 },
];

export const MONTHLY_CHART_DATA: ChartDataPoint[] = [
  { name: 'Week 1', calories: 2890, duration: 290, heartRate: 132, recovery: 75 },
  { name: 'Week 2', calories: 3450, duration: 350, heartRate: 138, recovery: 68 },
  { name: 'Week 3', calories: 4120, duration: 410, heartRate: 141, recovery: 62 },
  { name: 'Week 4', calories: 3200, duration: 320, heartRate: 134, recovery: 81 },
];

export const RECENT_CLUB_VISITS: ClubVisit[] = [
  {
    id: 'visit-1',
    title: 'Elite Power Hypertrophy',
    type: 'workout',
    time: 'Yesterday, 18:30',
    duration: '65 min',
    peakHeartRate: 172,
    caloriesBurned: 620,
    coach: 'Marcus Vance',
    metrics: [
      { label: 'Avg HR', value: '144 bpm' },
      { label: 'Primary Focus', value: 'Neural Drive', glow: true },
      { label: 'Load Volume', value: '14,250 kg' }
    ]
  },
  {
    id: 'visit-2',
    title: 'Hyperbaric Cryo-Restoration',
    type: 'recovery',
    time: '2 days ago, 15:00',
    duration: '45 min',
    metrics: [
      { label: 'Chamber Temp', value: '-110 °C' },
      { label: 'N2 Saturation', value: 'Optimal', glow: true },
      { label: 'HRV Delta', value: '+14 ms' }
    ]
  },
  {
    id: 'visit-3',
    title: 'Infrared Bio-Therapy & Spa',
    type: 'spa',
    time: '4 days ago, 09:15',
    duration: '50 min',
    metrics: [
      { label: 'Skin Temp', value: '38.5 °C' },
      { label: 'Detox Score', value: '9.4/10' },
      { label: 'Stress Relief', value: 'High', glow: true }
    ]
  },
  {
    id: 'visit-4',
    title: 'High-Intensity Zone 4 Engine',
    type: 'workout',
    time: '5 days ago, 07:00',
    duration: '45 min',
    peakHeartRate: 184,
    caloriesBurned: 580,
    coach: 'Elena Rostova',
    metrics: [
      { label: 'Avg HR', value: '161 bpm' },
      { label: 'VO2 Max Target', value: '88%', glow: true },
      { label: 'Anaerobic Time', value: '18 min' }
    ]
  }
];

export const DEFAULT_PLANNER_ROUTINE: PlannerRoutine[] = [
  { day: 'Mon', focus: 'Strength', duration: 60, intensity: 'High', notes: 'Lower body power + core load' },
  { day: 'Tue', focus: 'Cardio', duration: 45, intensity: 'High', notes: 'Zone 4 row intervals + sprints' },
  { day: 'Wed', focus: 'Recovery', duration: 30, intensity: 'Low', notes: 'Infrared sauna + active mobility' },
  { day: 'Thu', focus: 'Strength', duration: 75, intensity: 'Medium', notes: 'Upper push/pull complex' },
  { day: 'Fri', focus: 'Mindfulness', duration: 25, intensity: 'Low', notes: 'Guided sensory breathwork' },
  { day: 'Sat', focus: 'Strength', duration: 90, intensity: 'High', notes: 'Full-body metabolic conditioning' },
  { day: 'Sun', focus: 'Rest', duration: 0, intensity: 'Low', notes: 'Parasympathetic reset' }
];

export const COACH_RECOMMENDATIONS = [
  {
    category: 'Recovery',
    title: 'Nervous System Adaptation',
    description: 'Your Heart Rate Variability (HRV) rose by 14% after your Cryo-Restoration session. Incorporate post-workout sub-zero cold therapy twice weekly to accelerate muscle recovery.',
    badge: 'Cryotherapy'
  },
  {
    category: 'Load Volume',
    title: 'Strength Progressive Load',
    description: 'You completed 14,250 kg of total lift volume in your upper push/pull complex yesterday. Push for a 2.5% weight progression on squats for Monday\'s lower body focus.',
    badge: 'Strength'
  },
  {
    category: 'Cardiovascular',
    title: 'Zone 2 Fat Oxidation Optimization',
    description: 'During your last cardiovascular workout, you spent 28 minutes in Zone 3/4. Dedicate Thursday morning to strict Zone 2 steady-state running for efficient aerobic conditioning.',
    badge: 'Aerobic Base'
  }
];
