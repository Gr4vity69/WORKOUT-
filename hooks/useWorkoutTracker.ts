
import { useState, useEffect, useCallback } from 'react';
import { DailyLog, CurrentWorkoutState, WorkoutDay, LogEntry, AppData, AIAnalysis } from '../types';
import { saveData, loadData } from '../services/storageService';
import { getAIAnalysisAndSuggestion } from '../services/geminiService';

export const useWorkoutTracker = () => {
  const [routine, setRoutine] = useState<WorkoutDay[]>([]);
  const [workoutLogs, setWorkoutLogs] = useState<DailyLog[]>([]);
  const [currentWorkouts, setCurrentWorkouts] = useState<{ [dayId: string]: CurrentWorkoutState }>({});
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    const { routine: loadedRoutine, logs: loadedLogs } = loadData();
    setRoutine(loadedRoutine);
    setWorkoutLogs(loadedLogs);
  }, []);

  const updateAndSaveData = (updatedData: Partial<AppData>) => {
    const newAppData: AppData = {
      routine: updatedData.routine !== undefined ? updatedData.routine : routine,
      logs: updatedData.logs !== undefined ? updatedData.logs : workoutLogs,
    };
    if(updatedData.routine) setRoutine(updatedData.routine);
    if(updatedData.logs) setWorkoutLogs(updatedData.logs);
    saveData(newAppData);
  };
  
  const updateRoutine = (newRoutine: WorkoutDay[]) => {
    updateAndSaveData({ routine: newRoutine });
  };

  const handleWeightChange = useCallback((dayId: string, exerciseId: string, weight: string) => {
    setCurrentWorkouts(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        [exerciseId]: { weight },
      },
    }));
  }, []);

  const saveWorkout = useCallback((dayId: string, workoutDay: WorkoutDay) => {
    const today = new Date().toISOString().split('T')[0];
    const currentWorkoutState = currentWorkouts[dayId] || {};
    
    const entries: LogEntry[] = workoutDay.exercises
      .filter(ex => {
        const weightStr = currentWorkoutState[ex.id]?.weight;
        return weightStr && !isNaN(parseFloat(weightStr)) && isFinite(Number(weightStr));
      })
      .map(ex => ({
        exerciseId: ex.id,
        exerciseName: ex.name,
        weight: parseFloat(currentWorkoutState[ex.id].weight),
        seriesReps: ex.seriesReps,
      }));

    if (entries.length === 0) {
      setLastSaved(`No se guardaron datos para ${workoutDay.day} - no se ingresaron pesos.`);
      setTimeout(() => setLastSaved(null), 3000);
      return;
    }

    const newLog: DailyLog = { date: today, entries };
    
    const otherDaysLogs = workoutLogs.filter(log => log.date !== today);
    const todayLog = workoutLogs.find(log => log.date === today);

    const updatedTodayEntries = todayLog ? [...todayLog.entries] : [];
    entries.forEach(newEntry => {
        const existingEntryIndex = updatedTodayEntries.findIndex(e => e.exerciseId === newEntry.exerciseId);
        if (existingEntryIndex > -1) {
            updatedTodayEntries[existingEntryIndex] = newEntry;
        } else {
            updatedTodayEntries.push(newEntry);
        }
    });
    
    const updatedLogForToday = { date: today, entries: updatedTodayEntries };
    const updatedLogs = [...otherDaysLogs, updatedLogForToday];
    updatedLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    updateAndSaveData({ logs: updatedLogs });

    setLastSaved(`¡Entrenamiento de ${workoutDay.day} guardado para hoy!`);
    setTimeout(() => setLastSaved(null), 3000);
    // Clear current workout state after saving
    setCurrentWorkouts(prev => ({...prev, [dayId]: {}}));
  }, [currentWorkouts, workoutLogs, routine]);

  const fetchAiSuggestion = useCallback(async (userFeedback: string) => {
    setIsGeneratingSuggestion(true);
    setAiAnalysis(null);
    try {
      const result = await getAIAnalysisAndSuggestion(workoutLogs, routine, userFeedback);
      setAiAnalysis(result);
    } catch (error) {
      console.error(error);
      setAiAnalysis({ analysis: 'Error al obtener la sugerencia.' });
    } finally {
      setIsGeneratingSuggestion(false);
    }
  }, [workoutLogs, routine]);

  return {
    routine,
    workoutLogs,
    currentWorkouts,
    aiAnalysis,
    isGeneratingSuggestion,
    lastSaved,
    handleWeightChange,
    saveWorkout,
    fetchAiSuggestion,
    updateRoutine,
  };
};
