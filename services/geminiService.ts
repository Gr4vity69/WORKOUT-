
import { GoogleGenAI, Type } from "@google/genai";
import { DailyLog, WorkoutDay, AIAnalysis } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const formatHistoryForPrompt = (history: DailyLog[]): string => {
  if (history.length === 0) {
    return "No hay datos de entrenamiento registrados todavía.";
  }

  return history
    .slice(0, 10) // Limit to the 10 most recent logs to keep the prompt concise
    .map(log => {
      const entries = log.entries
        .filter(entry => entry.weight !== null && entry.weight > 0)
        .map(entry => `  - ${entry.exerciseName} (${entry.seriesReps}): ${entry.weight} kg`)
        .join('\n');
      return `Fecha: ${log.date}\n${entries}`;
    })
    .join('\n\n');
};

export const getAIAnalysisAndSuggestion = async (
  history: DailyLog[],
  currentRoutine: WorkoutDay[],
  userFeedback: string = ''
): Promise<AIAnalysis | null> => {
  if (!API_KEY) {
    throw new Error("Error: La clave de API de Gemini no está configurada.");
  }
  if (history.length === 0) {
    return {
      analysis: "No hay suficientes datos para generar una sugerencia. ¡Completa al menos un entrenamiento para empezar!"
    };
  }

  const formattedHistory = formatHistoryForPrompt(history);
  const routineString = JSON.stringify(currentRoutine, null, 2);

  const prompt = `
    Eres un experto entrenador personal de IA. Un usuario está buscando mejorar su rutina de gimnasio.

    HISTORIAL DE ENTRENAMIENTO RECIENTE (peso en kg):
    ${formattedHistory}

    RUTINA ACTUAL:
    ${routineString}

    FEEDBACK DEL USUARIO:
    "${userFeedback || 'Sin feedback adicional.'}"

    INSTRUCCIONES:
    Analiza el historial, la rutina actual y el feedback del usuario. Tu objetivo es ayudarle a aplicar la sobrecarga progresiva y a mantenerse motivado.
    1.  **Análisis (analysis):** Escribe un análisis motivador y útil en ESPAÑOL.
        - Comenta su progreso.
        - Identifica ejercicios donde pueda aumentar el peso.
        - Señala posibles estancamientos y ofrece consejos (ej. mejorar forma, cambiar tempo, variar ejercicios).
        - Si el usuario ha dado feedback, tenlo en cuenta en tu respuesta.
        - Utiliza markdown para dar formato (listas, negritas, etc.).
    2.  **Sugerencia de Rutina (suggestedRoutine):** Si crees que un cambio en la estructura de la rutina es beneficioso, proporciona una rutina de entrenamiento COMPLETA y modificada.
        - Puedes cambiar series/repeticiones, sustituir un ejercicio por otro similar, o añadir/quitar un ejercicio.
        - NO cambies drásticamente la rutina, haz ajustes sutiles y justificados.
        - Si la rutina actual es buena y solo necesita aumentar peso, NO propongas una nueva rutina (deja el campo 'suggestedRoutine' fuera del JSON).
        - Los IDs de los ejercicios y días deben ser únicos.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                analysis: { type: Type.STRING },
                suggestedRoutine: {
                    type: Type.ARRAY,
                    // FIX: Removed `nullable: true` as it's not a standard property in the Gemini API schema.
                    // The property is optional because it is not in the `required` array.
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            day: { type: Type.STRING },
                            title: { type: Type.STRING },
                            exercises: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        id: { type: Type.STRING },
                                        name: { type: Type.STRING },
                                        seriesReps: { type: Type.STRING },
                                        rest: { type: Type.STRING },
                                    },
                                    required: ["id", "name", "seriesReps", "rest"]
                                }
                            }
                        },
                        required: ["id", "day", "title", "exercises"]
                    }
                }
            },
            required: ["analysis"]
        }
      }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as AIAnalysis;

  } catch (error) {
    console.error("Error fetching suggestions from Gemini API:", error);
    return {
      analysis: "Hubo un error al contactar a la IA. Por favor, revisa la consola para más detalles e inténtalo de nuevo más tarde."
    };
  }
};
