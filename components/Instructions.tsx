
import React from 'react';
import { TuningResult, InstrumentInfo } from '../types';

interface Props {
  tuning: TuningResult | null;
  instrument: InstrumentInfo;
}

const Instructions: React.FC<Props> = ({ tuning, instrument }) => {
  if (!tuning) {
    return (
      <div className="w-full bg-slate-800/40 border border-slate-700 p-6 rounded-2xl text-center">
        <p className="text-slate-400 italic">Joue une note pour recevoir des conseils d'accordage.</p>
      </div>
    );
  }

  const { cents } = tuning;
  let message = "";
  let bgColor = "bg-slate-800/60";
  let textColor = "text-slate-300";
  let icon = null;

  if (Math.abs(cents) <= 5) {
    message = instrument.instructions.inTune;
    bgColor = "bg-emerald-900/40 border-emerald-500/50";
    textColor = "text-emerald-400";
    icon = (
      <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    );
  } else if (cents < 0) {
    message = instrument.instructions.flat;
    bgColor = "bg-amber-900/30 border-amber-500/50";
    textColor = "text-amber-300";
    icon = (
      <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
    );
  } else {
    message = instrument.instructions.sharp;
    bgColor = "bg-red-900/30 border-red-500/50";
    textColor = "text-red-300";
    icon = (
      <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
    );
  }

  return (
    <div className={`w-full flex items-center p-6 rounded-2xl border-2 shadow-inner transition-all duration-300 ${bgColor}`}>
      {icon}
      <div>
        <p className="text-xs uppercase font-bold text-slate-500 mb-1">Instruction</p>
        <p className={`text-xl font-semibold ${textColor}`}>{message}</p>
      </div>
    </div>
  );
};

export default Instructions;
