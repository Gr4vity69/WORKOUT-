
import { AppData, DailyLog, WorkoutDay } from '../types';
import { DEFAULT_ROUTINE } from '../constants';

const STORAGE_KEY = 'workoutTrackerData';

export const saveData = (data: AppData): void => {
  try {
    const dataToStore = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, dataToStore);
  } catch (error) {
    console.error("Error saving data to localStorage", error);
  }
};

export const loadData = (): AppData => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData) as AppData;
      // Basic validation
      if (parsedData.routine && parsedData.logs) {
        return parsedData;
      }
    }
  } catch (error) {
    console.error("Error loading data from localStorage", error);
  }
  // Return default structure if nothing is stored or data is invalid
  return {
    routine: DEFAULT_ROUTINE,
    logs: [],
  };
};
