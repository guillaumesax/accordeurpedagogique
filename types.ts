
export enum InstrumentType {
  SAX_ALTO = 'SAX_ALTO',
  SAX_TENOR = 'SAX_TENOR',
  TRUMPET = 'TRUMPET',
  VIOLIN = 'VIOLIN',
  GUITAR = 'GUITAR',
  BASS = 'BASS'
}

export interface InstrumentInfo {
  id: InstrumentType;
  name: string;
  transposition: number; // Semitones relative to C (Concert Pitch)
  tuningNote: string; // The note the student should play to tune (transposed)
  instructions: {
    flat: string;
    sharp: string;
    inTune: string;
  };
}

export interface TuningResult {
  noteName: string;
  octave: number;
  cents: number;
  frequency: number;
  concertNoteName: string;
}
