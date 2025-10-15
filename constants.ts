
import { WorkoutDay } from './types';

export const DEFAULT_ROUTINE: WorkoutDay[] = [
  {
    id: 'day1',
    day: 'Miércoles',
    title: 'Pecho / Espalda',
    exercises: [
      { id: 'd1e1', name: 'Calentamiento: 5-8 min cardio + movilidad', seriesReps: '—', rest: '—' },
      { id: 'd1e2', name: 'Press de banca (barra o DB)', seriesReps: '4 x 6-8', rest: '90-120 s' },
      { id: 'd1e3', name: 'Press inclinado con mancuernas', seriesReps: '3 x 8-10', rest: '75-90 s' },
      { id: 'd1e4', name: 'Remo con barra T / barra', seriesReps: '4 x 6-8', rest: '90 s' },
      { id: 'd1e5', name: 'Jalón prono / dominadas asistidas', seriesReps: '4 x 8-10', rest: '90 s' },
      { id: 'd1e6', name: 'Aperturas en banco plano / crossover', seriesReps: '3 x 12-15', rest: '60 s' },
      { id: 'd1e7', name: 'Pull-over en polea / mancuerna', seriesReps: '3 x 10-12', rest: '60 s' },
      { id: 'd1e8', name: 'Remo a 1 brazo', seriesReps: '3 x 8-10 / lado', rest: '75 s' },
      { id: 'd1e9', name: 'Flexiones diamante (finisher)', seriesReps: '3 x F', rest: '60 s' },
    ],
  },
  {
    id: 'day2',
    day: 'Viernes',
    title: 'Hombros / Brazos / Trapecio / Core',
    exercises: [
      { id: 'd2e1', name: 'Calentamiento: movilidad de hombro + sets ligeros', seriesReps: '—', rest: '—' },
      { id: 'd2e2', name: 'Press militar (barra o DB sentado)', seriesReps: '4 x 6-8', rest: '90-120 s' },
      { id: 'd2e3', name: 'Remo alto con barra / Face pulls', seriesReps: '4 x 10-12', rest: '75 s' },
      { id: 'd2e4', name: 'Elevaciones laterales (estricto)', seriesReps: '3 x 10-12', rest: '45-60 s' },
      { id: 'd2e5', name: 'Elevaciones posteriores (peck-deck o inclinado)', seriesReps: '3 x 12-15', rest: '45-60 s' },
      { id: 'd2e6', name: 'Fondos en paralelas', seriesReps: '3 x 6-10', rest: '90 s' },
      { id: 'd2e7', name: 'Curl bíceps alterno con mancuernas', seriesReps: '3 x 8-10', rest: '60-75 s' },
      { id: 'd2e8', name: 'Extensión tríceps en polea / press francés', seriesReps: '3 x 10-12', rest: '60-75 s' },
      { id: 'd2e9', name: 'Encogimientos de hombros (barra/DB)', seriesReps: '3 x 8-12', rest: '60-90 s' },
      { id: 'd2e10', name: 'Pallof press (anti-rotación)', seriesReps: '3 x 10-12 / lado', rest: '60 s' },
      { id: 'd2e11', name: 'Elevaciones de piernas colgado / crunch máquina', seriesReps: '3 x 12-15', rest: '60 s' },
    ],
  },
];

export const NOTES: string[] = [
  "Progresión 4 semanas: 3 semanas aumentar carga/volumen, 1 semana descarga.",
  "Proteína: 1.8-2.0 g/kg.",
  "Cardio: 2-3x/semana."
];
