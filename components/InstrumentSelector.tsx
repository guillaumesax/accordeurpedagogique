
import React from 'react';
import { InstrumentType } from '../types';
import { INSTRUMENTS } from '../constants';

interface Props {
  current: InstrumentType;
  onChange: (type: InstrumentType) => void;
}

const InstrumentSelector: React.FC<Props> = ({ current, onChange }) => {
  return (
    <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex flex-col">
        <label htmlFor="instrument-select" className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1 px-1">
          Instrument
        </label>
        <div className="relative group">
          <select
            id="instrument-select"
            value={current}
            onChange={(e) => onChange(e.target.value as InstrumentType)}
            className="appearance-none w-full md:w-64 bg-slate-900 border border-slate-700 text-slate-200 py-3 px-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all cursor-pointer font-medium hover:border-slate-500"
          >
            {Object.values(InstrumentType).map((type) => (
              <option key={type} value={type} className="bg-slate-900 text-slate-200">
                {INSTRUMENTS[type].name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 group-hover:text-slate-300">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
      
      <div className="hidden md:block text-right">
        <span className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">Mode</span>
        <div className="text-blue-400 text-sm font-semibold">Accordage Temps Réel</div>
      </div>
    </div>
  );
};

export default InstrumentSelector;
