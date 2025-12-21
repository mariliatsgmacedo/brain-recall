import { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

type Mode = 'focus' | 'break';

const FOCUS_SECONDS = 15 * 60;
const BREAK_SECONDS = 5 * 60;

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function PomodoroTimer() {
  const [mode, setMode] = useState<Mode>('focus');
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_SECONDS);
  const intervalRef = useRef<number | null>(null);

  const progress = useMemo(() => {
    const total = mode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS;
    return 1 - secondsLeft / total;
  }, [mode, secondsLeft]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current > 1) return current - 1;

        // Cycle finished: switch mode and pause to keep user in control
        const nextMode = mode === 'focus' ? 'break' : 'focus';
        setMode(nextMode);
        setIsRunning(false);
        return nextMode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, mode]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setMode('focus');
    setSecondsLeft(FOCUS_SECONDS);
  };

  const percent = Math.round(progress * 100);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pomodoro</p>
          <p className="text-sm font-semibold text-slate-700">
            {mode === 'focus' ? 'Foco mínimo (15m)' : 'Pausa curta (5m)'}
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-500">Ciclo atual</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="text-3xl font-bold text-slate-800 tabular-nums">{formatTime(secondsLeft)}</div>
          <div className="mt-2 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
            <div
              className={`h-full ${mode === 'focus' ? 'bg-indigo-500' : 'bg-emerald-500'}`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {mode === 'focus' ? 'Faça um sprint de foco total.' : 'Respire e faça uma pausa curta.'}
          </p>
        </div>

        <div className="flex flex-col gap-2 w-28">
          {isRunning ? (
            <button
              onClick={handlePause}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors"
            >
              <Pause size={16} />
              Pausar
            </button>
          ) : (
            <button
              onClick={handleStart}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
            >
              <Play size={16} />
              Iniciar
            </button>
          )}
          <button
            onClick={handleReset}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white text-slate-600 font-semibold border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw size={16} />
            Resetar
          </button>
        </div>
      </div>
    </div>
  );
}
