
import React, { useState, useMemo } from 'react';
import { useWorkoutTracker } from './hooks/useWorkoutTracker';
import { WorkoutDay, Exercise } from './types';
import { NOTES } from './constants';

// --- ICONS ---
const DumbbellIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M21 10.5C21 11.3284 20.3284 12 19.5 12H18V13.5C18 14.3284 17.3284 15 16.5 15C15.6716 15 15 14.3284 15 13.5V12H9V13.5C9 14.3284 8.32843 15 7.5 15C6.67157 15 6 14.3284 6 13.5V12H4.5C3.67157 12 3 11.3284 3 10.5C3 9.67157 3.67157 9 4.5 9H6V7.5C6 6.67157 6.67157 6 7.5 6C8.32843 6 9 6.67157 9 7.5V9H15V7.5C15 6.67157 15.6716 6 16.5 6C17.3284 6 18 6.67157 18 7.5V9H19.5C20.3284 9 21 9.67157 21 10.5Z" /></svg>
);
const BrainIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M19.3496 9.65038C19.7829 9.21712 20.3831 9 21 9C21.6169 9 22.2171 9.21712 22.6504 9.65038C23.5501 10.5501 23.5501 11.9499 22.6504 12.8496C22.0496 13.4504 21.2494 13.7995 20.5 13.9292V15C20.5 16.3807 19.3807 17.5 18 17.5C16.6193 17.5 15.5 16.3807 15.5 15V14.5C15.5 14.2239 15.2761 14 15 14H9C8.72386 14 8.5 14.2239 8.5 14.5V15C8.5 16.3807 7.38071 17.5 6 17.5C4.61929 17.5 3.5 16.3807 3.5 15V13.9292C2.75059 13.7995 1.95042 13.4504 1.34962 12.8496C0.449918 11.9499 0.449918 10.5501 1.34962 9.65038C1.78288 9.21712 2.38305 9 3 9C3.61695 9 4.21712 9.21712 4.65038 9.65038C5.25119 10.2512 5.6003 11.0514 5.72998 11.8H5.9375C6.46782 11.8 6.91617 11.4583 7.12602 10.9859C7.81734 9.42831 9.28827 8.30398 11 8.05459V4C11 3.44772 11.4477 3 12 3C12.5523 3 13 3.44772 13 4V8.05459C14.7117 8.30398 16.1827 9.42831 16.874 10.9859C17.0838 11.4583 17.5322 11.8 18.0625 11.8H18.27C18.3997 11.0514 18.7488 10.2512 19.3496 9.65038ZM12 11C10.8954 11 10 11.8954 10 13V15H14V13C14 11.8954 13.1046 11 12 11Z" /></svg>
);
const CalendarIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H7V2C7 1.44772 7.44772 1 8 1C8.55228 1 9 1.44772 9 2V3H15V2C15 1.44772 15.4477 1 16 1C16.5523 1 17 1.44772 17 2V3ZM19 8H5V19H19V8Z"/></svg>
);
const EditIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M16.7071 5.29289C17.0976 4.90237 17.7308 4.90237 18.1213 5.29289L20.2426 7.41421C20.6331 7.80474 20.6331 8.4379 20.2426 8.82843L11.4571 17.6139C11.1238 17.9472 10.6587 18.1462 10.1685 18.1825L6.15852 18.4825C5.55839 18.5273 5.02734 18.0461 5.02734 17.444L5.32734 13.434C5.36365 12.9438 5.56265 12.4787 5.89596 12.1454L14.6815 3.36C15.072 2.96948 15.7052 2.96948 16.0957 3.36L16.7071 5.29289ZM18.8284 7.41421L17.4142 6L15.36 8.05426L16.7742 9.46852L18.8284 7.41421ZM14.6528 8.76142L13.2386 7.34716L7.00001 13.5858V16.4142H9.82844L16.067 10.1756L14.6528 8.76142Z"/></svg>
);
const CloseIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7984 4.42056 18.1652 4.42056 17.7747 4.81108L12 10.5858L6.2253 4.81108Z"/></svg>
);

// --- UI COMPONENTS ---
const Header = () => (
    <header className="text-center p-4 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-20 border-b border-gray-700/50">
        <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 flex items-center justify-center gap-3">
            <DumbbellIcon className="w-8 h-8" />
            <span>Workout Tracker AI</span>
        </h1>
        <p className="text-gray-400 mt-1 text-sm">Registra tu progreso. Supera tus límites con IA.</p>
    </header>
);

const Nav = ({ activeTab, setActiveTab }) => (
    <nav className="p-2 flex justify-center bg-gray-900">
        <div className="flex space-x-2 bg-gray-800 p-1 rounded-lg">
            {['Dashboard', 'Rutina'].map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                >
                    {tab}
                </button>
            ))}
        </div>
    </nav>
);

// FIX: Added explicit types for the component props to resolve the TypeScript error related to the 'key' prop.
const ExerciseRow = ({ exercise, value, onChange }: { exercise: Exercise, value: string, onChange: (weight: string) => void }) => {
    const isWarmup = exercise.seriesReps === '—';
    return (
        <tr className="border-b border-gray-700">
            <td className="p-3 text-gray-300">{exercise.name}</td>
            <td className="p-3 text-center text-gray-400">{exercise.seriesReps}</td>
            <td className="p-3 text-center text-gray-400">{exercise.rest}</td>
            <td className="p-3 w-32">
                {!isWarmup && (
                    <div className="relative">
                        <input type="number" value={value} onChange={e => onChange(e.target.value)} placeholder="0" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-center text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">kg</span>
                    </div>
                )}
            </td>
        </tr>
    );
};

const WorkoutSession = ({ workoutDay, onBack, currentWorkoutState, onWeightChange, onSave }) => (
    <div className="bg-gray-800/50 rounded-xl shadow-lg backdrop-blur-lg overflow-hidden border border-gray-700 animate-fade-in">
        <div className="p-4 bg-gray-900/50 flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-white"><span className="text-cyan-400">{workoutDay.day}</span> - {workoutDay.title}</h2>
                <p className="text-sm text-gray-400">Ingresa el peso levantado para cada ejercicio.</p>
            </div>
            <button onClick={onBack} className="text-gray-400 hover:text-white transition">
                <CloseIcon />
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-900/50 text-gray-400 uppercase text-sm">
                    <tr><th className="p-3">Ejercicio</th><th className="p-3 text-center">Series x Reps</th><th className="p-3 text-center">Descanso</th><th className="p-3 text-center">Peso</th></tr>
                </thead>
                <tbody>
                    {workoutDay.exercises.map(exercise => (
                        <ExerciseRow key={exercise.id} exercise={exercise} value={currentWorkoutState[exercise.id]?.weight || ''} onChange={weight => onWeightChange(exercise.id, weight)} />
                    ))}
                </tbody>
            </table>
        </div>
        <div className="p-4 bg-gray-900/50 flex justify-between items-center">
            <button onClick={onBack} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-all">Cancelar</button>
            <button onClick={onSave} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg transition-all transform hover:scale-105 shadow-md">Guardar Entrenamiento</button>
        </div>
    </div>
);

const Dashboard = ({ routine, onStartWorkout, onGetAIAnalysis }) => {
    const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const todayName = dayNames[new Date().getDay()];
    const todaysWorkout = routine.find(day => day.day === todayName);

    return (
        <div className="space-y-8">
            <div className="bg-gray-800/50 rounded-xl shadow-lg p-6 border border-gray-700 text-center">
                <h2 className="text-2xl font-bold text-white">Hoy es <span className="text-cyan-400">{todayName}</span></h2>
                {todaysWorkout ? (
                    <div className="mt-4">
                        <p className="text-lg text-gray-300">Tu entrenamiento de hoy es: <span className="font-semibold">{todaysWorkout.title}</span></p>
                        <button onClick={() => onStartWorkout(todaysWorkout.id)} className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg text-lg">
                            Empezar Entrenamiento
                        </button>
                    </div>
                ) : (
                    <p className="mt-4 text-lg text-gray-400">Hoy es día de descanso. ¡A recuperar!</p>
                )}
            </div>
            <AISuggestionCard onFetch={onGetAIAnalysis} />
            <NotesCard />
        </div>
    );
};

const RoutineEditor = ({ routine, setRoutine }) => {
  const handleExerciseChange = (dayId, exerciseId, field, value) => {
    const newRoutine = routine.map(day => {
      if (day.id === dayId) {
        const newExercises = day.exercises.map(ex => {
          if (ex.id === exerciseId) {
            return { ...ex, [field]: value };
          }
          return ex;
        });
        return { ...day, exercises: newExercises };
      }
      return day;
    });
    setRoutine(newRoutine);
  };

  return (
    <div className="space-y-6">
      <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <EditIcon /> <span>Editor de Rutina</span>
        </h2>
        <p className="text-gray-400 mt-1">Aquí puedes personalizar tu plan de entrenamiento.</p>
      </div>
      {routine.map(day => (
        <div key={day.id} className="bg-gray-800/50 rounded-xl shadow-lg overflow-hidden border border-gray-700">
          <div className="p-4 bg-gray-900/50">
            <h3 className="text-xl font-bold text-cyan-400">{day.day} - {day.title}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-900/50 text-gray-400 uppercase">
                <tr>
                  <th className="p-2">Ejercicio</th>
                  <th className="p-2">Series x Reps</th>
                  <th className="p-2">Descanso</th>
                </tr>
              </thead>
              <tbody>
                {day.exercises.map(ex => (
                  <tr key={ex.id} className="border-b border-gray-700">
                    <td className="p-2"><input type="text" value={ex.name} onChange={e => handleExerciseChange(day.id, ex.id, 'name', e.target.value)} className="w-full bg-transparent p-1 rounded-md focus:bg-gray-700"/></td>
                    <td className="p-2"><input type="text" value={ex.seriesReps} onChange={e => handleExerciseChange(day.id, ex.id, 'seriesReps', e.target.value)} className="w-24 bg-transparent p-1 rounded-md focus:bg-gray-700"/></td>
                    <td className="p-2"><input type="text" value={ex.rest} onChange={e => handleExerciseChange(day.id, ex.id, 'rest', e.target.value)} className="w-24 bg-transparent p-1 rounded-md focus:bg-gray-700"/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

const AIAnalysisModal = ({ analysis, onAccept, onClose, workoutLogs }) => (
  <div className="fixed inset-0 bg-black/70 z-30 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
    <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
      <div className="p-4 sticky top-0 bg-gray-800 z-10 flex justify-between items-center border-b border-gray-700">
          <h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2"><BrainIcon/> Sugerencias de la IA</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition"><CloseIcon /></button>
      </div>
      <div className="p-6">
        <div className="bg-gray-900/50 p-4 rounded-lg text-gray-300 whitespace-pre-wrap prose prose-invert prose-p:my-2 prose-headings:text-cyan-300 prose-strong:text-white"
             dangerouslySetInnerHTML={{ __html: analysis.analysis.replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>').replace(/\n/g, '<br />') }} />

        {analysis.suggestedRoutine && (
          <div className="mt-6 border-t border-purple-500/50 pt-4">
            <h4 className="text-lg font-semibold text-purple-400">Propuesta de cambio de rutina:</h4>
            <p className="text-sm text-gray-400 mb-4">La IA ha sugerido ajustar tu rutina para optimizar tu progreso. Revisa los cambios y acéptalos si estás de acuerdo.</p>
            <div className="bg-gray-900/50 p-4 rounded-lg max-h-60 overflow-y-auto text-sm">
                {analysis.suggestedRoutine.map(day => (
                    <div key={day.id} className="mb-3">
                        <p className="font-bold text-cyan-400">{day.day} - {day.title}</p>
                        <ul className="list-disc list-inside text-gray-300">
                            {day.exercises.map(ex => <li key={ex.id}>{ex.name} ({ex.seriesReps})</li>)}
                        </ul>
                    </div>
                ))}
            </div>
             <button onClick={onAccept} className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105">
                Aceptar y Actualizar mi Rutina
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

const AISuggestionCard = ({ onFetch }) => {
    const { workoutLogs, aiAnalysis, isGeneratingSuggestion, fetchAiSuggestion, updateRoutine } = useWorkoutTracker();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userFeedback, setUserFeedback] = useState('');

    const handleFetch = () => {
        fetchAiSuggestion(userFeedback);
        setIsModalOpen(true);
    };

    const handleAcceptRoutine = () => {
        if (aiAnalysis?.suggestedRoutine) {
            updateRoutine(aiAnalysis.suggestedRoutine);
        }
        setIsModalOpen(false);
    };

    return (
      <>
        <div className="bg-gray-800/50 rounded-xl shadow-lg p-6 border border-gray-700">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2"><BrainIcon/><span>Análisis de IA</span></h3>
                    <p className="text-gray-400 text-sm">Recibe feedback personalizado sobre tu progreso.</p>
                </div>
                <button onClick={handleFetch} disabled={isGeneratingSuggestion || workoutLogs.length === 0} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-5 rounded-lg transition-all transform hover:scale-105 shadow-md disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100">
                    {isGeneratingSuggestion ? 'Analizando...' : 'Generar'}
                </button>
            </div>
             <textarea value={userFeedback} onChange={e => setUserFeedback(e.target.value)} placeholder="¿Cómo te sientes? Añade notas para la IA (opcional)..."
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition mb-2 text-sm"
              rows="2"
            ></textarea>
            <p className="text-xs text-gray-500 text-center">
              {workoutLogs.length > 0 ? "Haz clic en 'Generar' para recibir consejos." : "Guarda al menos un entrenamiento para poder recibir sugerencias."}
            </p>
        </div>
        {isModalOpen && !isGeneratingSuggestion && aiAnalysis && <AIAnalysisModal analysis={aiAnalysis} onAccept={handleAcceptRoutine} onClose={() => setIsModalOpen(false)} workoutLogs={workoutLogs} />}
        {isModalOpen && isGeneratingSuggestion && (
          <div className="fixed inset-0 bg-black/70 z-30 flex items-center justify-center p-4">
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl text-center">
              <p className="text-white text-lg animate-pulse">Generando nuevas sugerencias...</p>
            </div>
          </div>
        )}
      </>
    );
};


const NotesCard = () => (
    <div className="bg-gray-800/50 rounded-xl shadow-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-cyan-400 mb-3">Notas Importantes</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
            {NOTES.map((note, index) => <li key={index}>{note}</li>)}
        </ul>
    </div>
);

export default function App() {
    const tracker = useWorkoutTracker();
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null);

    const activeWorkoutDay = useMemo(() => {
        if (!activeWorkoutId) return null;
        return tracker.routine.find(day => day.id === activeWorkoutId);
    }, [activeWorkoutId, tracker.routine]);

    const handleSaveWorkout = () => {
        if (activeWorkoutDay) {
            tracker.saveWorkout(activeWorkoutDay.id, activeWorkoutDay);
            setActiveWorkoutId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 font-sans text-white">
            <Header />
            {!activeWorkoutDay && <Nav activeTab={activeTab} setActiveTab={setActiveTab} />}
            
            <main className="container mx-auto p-4 md:p-6 lg:p-8">
                {tracker.lastSaved && (
                    <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-lg relative mb-6 text-center" role="alert">
                        <span>{tracker.lastSaved}</span>
                    </div>
                )}

                {activeWorkoutDay ? (
                    <WorkoutSession
                        workoutDay={activeWorkoutDay}
                        onBack={() => setActiveWorkoutId(null)}
                        currentWorkoutState={tracker.currentWorkouts[activeWorkoutDay.id] || {}}
                        onWeightChange={(exerciseId, weight) => tracker.handleWeightChange(activeWorkoutDay.id, exerciseId, weight)}
                        onSave={handleSaveWorkout}
                    />
                ) : (
                    <>
                        {activeTab === 'Dashboard' && <Dashboard routine={tracker.routine} onStartWorkout={setActiveWorkoutId} onGetAIAnalysis={tracker.fetchAiSuggestion} />}
                        {activeTab === 'Rutina' && <RoutineEditor routine={tracker.routine} setRoutine={tracker.updateRoutine} />}
                    </>
                )}
            </main>
        </div>
    );
}
