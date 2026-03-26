import type { ChordInfo, ModeName } from '../types';
import { getDiatonicChords } from '../lib/music';
import type { NoteName } from '../types';

export interface Suggestion {
  label: string;
  description: string;
  getDegrees: (mode: ModeName) => number[];
}

// Suggestions defined by scale degrees (1-indexed)
export const SUGGESTIONS: Suggestion[] = [
  {
    label: 'Cadencia estable',
    description: 'IV → V → I — Resolución clásica',
    getDegrees: (mode) => mode === 'major' ? [4, 5, 1, 1, 4, 5, 1, 1] : [4, 5, 1, 1, 4, 5, 1, 1],
  },
  {
    label: 'Pop clásico',
    description: 'I → V → vi → IV — La progresión pop universal',
    getDegrees: (mode) => mode === 'major' ? [1, 5, 6, 4, 1, 5, 6, 4] : [1, 7, 6, 5, 1, 7, 6, 5],
  },
  {
    label: 'Más tensión',
    description: 'I → vi → IV → V — Tensión creciente',
    getDegrees: (mode) => mode === 'major' ? [1, 6, 4, 5, 1, 6, 4, 5] : [1, 6, 4, 5, 1, 6, 4, 5],
  },
  {
    label: 'Melancólica',
    description: 'vi → IV → I → V — Tono emotivo',
    getDegrees: (mode) => mode === 'major' ? [6, 4, 1, 5, 6, 4, 1, 5] : [1, 3, 4, 5, 1, 3, 4, 5],
  },
];

export function applySuggestion(suggestion: Suggestion, key: NoteName, mode: ModeName): (ChordInfo | null)[] {
  const chords = getDiatonicChords(key, mode);
  const degrees = suggestion.getDegrees(mode);
  return degrees.map(d => chords[d - 1] ?? null);
}
