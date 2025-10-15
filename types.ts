
export interface Exercise {
  id: string;
  name: string;
  seriesReps: string;
  rest: string;
}

export interface WorkoutDay {
  id: string;
  day: string; // e.g., 'Lunes', 'Martes'
  title: string;
  exercises: Exercise[];
}

export interface LogEntry {
  exerciseId: string;
  exerciseName: string;
  weight: number | null;
  seriesReps: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  entries: LogEntry[];
}

export interface CurrentWorkoutState {
  [exerciseId: string]: {
    weight: string;
  };
}

export interface AppData {
  routine: WorkoutDay[];
  logs: DailyLog[];
}

export interface AIAnalysis {
  analysis: string;
  suggestedRoutine?: WorkoutDay[];
}
