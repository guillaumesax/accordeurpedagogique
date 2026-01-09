
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { InstrumentType, TuningResult } from './types';
import { INSTRUMENTS, NOTES } from './constants';
import { autoCorrelate, getNoteFromFrequency } from './services/pitchDetection';

// Components
import InstrumentSelector from './components/InstrumentSelector';
import TunerDisplay from './components/TunerDisplay';
import Instructions from './components/Instructions';

const App: React.FC = () => {
  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentType>(InstrumentType.VIOLIN);
  const [isListening, setIsListening] = useState(false);
  const [tuning, setTuning] = useState<TuningResult | null>(null);
  const [isReferencePlaying, setIsReferencePlaying] = useState(false);
  const [calibration, setCalibration] = useState<number>(440);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsListening(true);
      updateTuning();
    } catch (err) {
      console.error("Erreur d'accès au microphone:", err);
      alert("L'accès au microphone est nécessaire pour utiliser l'accordeur.");
    }
  };

  const stopListening = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    setIsListening(false);
    setTuning(null);
  };

  const toggleReference = () => {
    if (!isReferencePlaying) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = audioContextRef.current || new AudioContextClass();
      audioContextRef.current = ctx;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.frequency.setValueAtTime(calibration, ctx.currentTime);
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      oscillatorRef.current = osc;
      setIsReferencePlaying(true);
    } else {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      }
      setIsReferencePlaying(false);
    }
  };

  const updateTuning = useCallback(() => {
    if (!analyserRef.current || !audioContextRef.current) return;

    const buffer = new Float32Array(analyserRef.current.fftSize);
    analyserRef.current.getFloatTimeDomainData(buffer);
    
    const freq = autoCorrelate(buffer, audioContextRef.current.sampleRate);

    if (freq !== -1) {
      const { note, cents } = getNoteFromFrequency(freq, calibration);
      const noteIndex = note % 12;
      const octave = Math.floor(note / 12) - 1;
      const concertNoteName = NOTES[noteIndex];
      
      // Transposition logic
      const instrument = INSTRUMENTS[selectedInstrument];
      const transposedIndex = (noteIndex + instrument.transposition + 12) % 12;
      const transposedNoteName = NOTES[transposedIndex];

      setTuning({
        noteName: transposedNoteName,
        octave,
        cents,
        frequency: Math.round(freq * 10) / 10,
        concertNoteName
      });
    }

    animationFrameRef.current = requestAnimationFrame(updateTuning);
  }, [selectedInstrument, calibration]);

  useEffect(() => {
    // Restart logic if calibration changes while playing reference
    if (isReferencePlaying && oscillatorRef.current) {
      oscillatorRef.current.frequency.setValueAtTime(calibration, audioContextRef.current?.currentTime || 0);
    }
  }, [calibration, isReferencePlaying]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (oscillatorRef.current) oscillatorRef.current.stop();
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-6 lg:p-8">
      <header className="w-full max-w-3xl flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            J'apprends à m'accorder
          </h1>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest font-semibold">Outil pédagogique</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="hidden sm:flex bg-slate-800 p-1 rounded-xl border border-slate-700 mr-2">
             {[440, 442].map((hz) => (
               <button
                 key={hz}
                 onClick={() => setCalibration(hz)}
                 className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                   calibration === hz 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-300'
                 }`}
               >
                 {hz}Hz
               </button>
             ))}
           </div>

           <button
              onClick={isListening ? stopListening : startListening}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-md flex items-center gap-2 ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              {isListening ? "STOP" : "MIC"}
            </button>
            <button
              onClick={toggleReference}
              className={`p-2 rounded-xl transition-all shadow-md ${
                isReferencePlaying 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
              title={`Jouer La ${calibration}Hz`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.983 3.983 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" /></svg>
            </button>
        </div>
      </header>

      <main className="w-full max-w-3xl flex flex-col gap-6">
        <section className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 shadow-sm">
          <InstrumentSelector 
            current={selectedInstrument} 
            onChange={(type) => {
              setSelectedInstrument(type);
              setTuning(null);
            }} 
          />
          {/* Mobile calibration view */}
          <div className="flex sm:hidden items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Calibrage</span>
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700">
               {[440, 442].map((hz) => (
                 <button
                   key={hz}
                   onClick={() => setCalibration(hz)}
                   className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                     calibration === hz 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-500'
                   }`}
                 >
                   {hz}Hz
                 </button>
               ))}
             </div>
          </div>
        </section>

        <section className="flex flex-col items-center gap-6">
          <TunerDisplay 
            tuning={tuning} 
            isListening={isListening} 
            instrument={INSTRUMENTS[selectedInstrument]} 
          />
        </section>

        {isListening && (
          <Instructions tuning={tuning} instrument={INSTRUMENTS[selectedInstrument]} />
        )}
      </main>

      <footer className="mt-auto py-6 text-slate-600 text-[10px] uppercase tracking-[0.2em] text-center font-bold">
        Application développée par Guillaume Sax
      </footer>
    </div>
  );
};

export default App;
