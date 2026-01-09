
import React from 'react';
import { TuningResult, InstrumentInfo } from '../types';

interface Props {
  tuning: TuningResult | null;
  isListening: boolean;
  instrument: InstrumentInfo;
}

const TunerDisplay: React.FC<Props> = ({ tuning, isListening, instrument }) => {
  const cents = tuning ? tuning.cents : 0;
  const noteName = tuning ? tuning.noteName : '--';
  const freq = tuning ? `${tuning.frequency} Hz` : (isListening ? 'Écoute...' : 'Micro éteint');
  
  // Calculate rotation for the needle: -50 to +50 cents maps to -90deg to +90deg
  // We use 1.8 because 50 * 1.8 = 90.
  const rotation = Math.max(-50, Math.min(50, cents)) * 1.8;
  
  const getStatusColor = () => {
    if (!tuning) return 'text-slate-600';
    if (Math.abs(cents) <= 5) return 'text-emerald-400';
    if (Math.abs(cents) <= 15) return 'text-amber-400';
    return 'text-red-400';
  };

  const getNeedleColor = () => {
    if (!tuning) return '#334155'; // slate-700
    if (Math.abs(cents) <= 5) return '#10b981'; // emerald-500
    if (Math.abs(cents) <= 15) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  return (
    <div className="flex flex-col items-center w-full bg-slate-900 rounded-3xl p-8 border border-slate-700 shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[100px] opacity-20 transition-colors duration-500 ${tuning ? (Math.abs(cents) <= 5 ? 'bg-emerald-500' : 'bg-red-500') : 'bg-blue-500'}`}></div>

      {/* Tuning Reference Badge */}
      <div className="absolute top-4 right-4 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl flex flex-col items-center">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Je joue un</span>
        <span className="text-blue-400 font-bold text-sm leading-none">{instrument.tuningNote}</span>
      </div>

      {/* Frequency display */}
      <div className="mono text-xs text-slate-500 mb-2 h-4">{freq}</div>

      {/* Note Display */}
      <div className="relative mb-8 h-24 flex items-center justify-center">
        <span className={`text-8xl font-black tracking-tighter transition-colors duration-200 ${getStatusColor()}`}>
          {noteName}
        </span>
        {tuning && (
          <span className="absolute -top-2 -right-8 text-2xl font-bold text-slate-500">
            {tuning.octave}
          </span>
        )}
      </div>

      {/* Gauge Container */}
      <div className="w-full h-40 relative flex items-end justify-center">
        {/* Scale background - Improved alignment */}
        <div className="absolute inset-0 flex items-end justify-between px-4 pb-4 opacity-20">
          {[-50, -25, 0, 25, 50].map((val) => (
            <div key={val} className="flex flex-col items-center w-8">
              <div className={`h-4 w-0.5 bg-slate-300 mb-1 ${val === 0 ? 'h-8 w-1 opacity-100' : ''}`}></div>
              <span className="text-[10px] mono text-slate-300 font-bold">{val}</span>
            </div>
          ))}
        </div>

        {/* Static Center Reference Line */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-8 h-24 w-px bg-emerald-500/10 rounded-full"></div>

        {/* Needle Wrapper - Positioned at exact center with 0 width to rotate from center */}
        <div 
          className="absolute bottom-8 left-1/2 w-0 h-24 origin-bottom transition-transform duration-200 ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Visual Needle - Centered relative to the 0-width wrapper */}
          <div 
            className="absolute top-0 -left-0.5 w-1 h-24 rounded-full transition-colors duration-200"
            style={{ backgroundColor: getNeedleColor() }}
          >
            {/* Pointer Tip */}
            <div 
              className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full shadow-lg transition-colors duration-200"
              style={{ backgroundColor: getNeedleColor() }}
            >
              {tuning && Math.abs(cents) <= 5 && (
                <div className="absolute inset-0 rounded-full animate-ping bg-inherit opacity-75"></div>
              )}
            </div>
          </div>
        </div>

        {/* Cents indicator text */}
        <div className={`absolute bottom-0 text-lg font-bold mono h-7 ${getStatusColor()}`}>
          {tuning ? (cents > 0 ? `+${cents}` : cents) : (isListening ? '0' : '')}
        </div>
      </div>

      {/* Concert Pitch Hint */}
      {tuning && instrument.transposition !== 0 && (
        <div className="mt-4 text-xs text-slate-500">
          Son réel (UT) : <span className="text-slate-300 font-semibold">{tuning.concertNoteName}</span>
        </div>
      )}
    </div>
  );
};

export default TunerDisplay;
