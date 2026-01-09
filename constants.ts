
import { InstrumentType, InstrumentInfo } from './types';

export const NOTES = ['Do', 'Do#', 'Ré', 'Ré#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];

export const INSTRUMENTS: Record<InstrumentType, InstrumentInfo> = {
  [InstrumentType.SAX_ALTO]: {
    id: InstrumentType.SAX_ALTO,
    name: 'Saxophone Alto (Mib)',
    transposition: -3,
    tuningNote: 'Fa#', // Concert A -> Transposed to Fa# for Eb instruments
    instructions: {
      flat: 'Enfonce légèrement le bec',
      sharp: 'Tire légèrement le bec',
      inTune: 'Accord correct'
    }
  },
  [InstrumentType.SAX_TENOR]: {
    id: InstrumentType.SAX_TENOR,
    name: 'Saxophone Ténor (Sib)',
    transposition: 2,
    tuningNote: 'Si', // Concert A -> Transposed to Si for Bb instruments
    instructions: {
      flat: 'Enfonce légèrement le bec',
      sharp: 'Tire légèrement le bec',
      inTune: 'Accord correct'
    }
  },
  [InstrumentType.TRUMPET]: {
    id: InstrumentType.TRUMPET,
    name: 'Trompette (Sib)',
    transposition: 2,
    tuningNote: 'Si', // Concert A -> Transposed to Si for Bb instruments
    instructions: {
      flat: 'Resserre légèrement la petite coulisse',
      sharp: 'Desserre légèrement la petite coulisse',
      inTune: 'Accord correct'
    }
  },
  [InstrumentType.VIOLIN]: {
    id: InstrumentType.VIOLIN,
    name: 'Violon (Ut)',
    transposition: 0,
    tuningNote: 'La', // Concert A -> La for C instruments
    instructions: {
      flat: 'Tourne la cheville vers le haut',
      sharp: 'Relâche légèrement la cheville',
      inTune: 'Accord correct'
    }
  },
  [InstrumentType.GUITAR]: {
    id: InstrumentType.GUITAR,
    name: 'Guitare (Ut)',
    transposition: 0,
    tuningNote: 'La',
    instructions: {
      flat: 'Resserre la mécanique correspondante',
      sharp: 'Desserre la mécanique correspondante',
      inTune: 'Accord correct'
    }
  },
  [InstrumentType.BASS]: {
    id: InstrumentType.BASS,
    name: 'Basse (Ut)',
    transposition: 0,
    tuningNote: 'La',
    instructions: {
      flat: 'Resserre la mécanique correspondante',
      sharp: 'Desserre la mécanique correspondante',
      inTune: 'Accord correct'
    }
  }
};
