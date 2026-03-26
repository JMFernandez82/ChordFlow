import type { NoteName, ModeName, ChordQuality, ChordInfo, HarmonicFunction } from '../types';

const ALL_NOTES: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Intervals in semitones from root for each mode
const MODE_INTERVALS: Record<ModeName, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
};

// Chord quality for each degree in each mode
const MODE_QUALITIES: Record<ModeName, ChordQuality[]> = {
  major: ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished'],
  minor: ['minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major'],
};

// Roman numerals for display
const ROMAN_UPPER = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const ROMAN_LOWER = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'];

// Harmonic function mapping per mode
const HARMONIC_FUNCTIONS: Record<ModeName, HarmonicFunction[]> = {
  major: ['tonic', 'predominant', 'tonic', 'predominant', 'dominant', 'tonic', 'dominant'],
  minor: ['tonic', 'predominant', 'tonic', 'predominant', 'dominant', 'tonic', 'dominant'],
};

const QUALITY_SUFFIX: Record<ChordQuality, string> = {
  major: '',
  minor: 'm',
  diminished: 'dim',
  augmented: 'aug',
  dominant7: '7',
  major7: 'maj7',
  minor7: 'm7',
};

function noteIndex(note: NoteName): number {
  return ALL_NOTES.indexOf(note);
}

function noteAt(index: number): NoteName {
  return ALL_NOTES[((index % 12) + 12) % 12];
}

// Get the scale notes for a given key and mode
export function getScaleNotes(key: NoteName, mode: ModeName): NoteName[] {
  const root = noteIndex(key);
  return MODE_INTERVALS[mode].map(interval => noteAt(root + interval));
}

// Build chord notes (triad) from a root and quality, in a specific octave range
function buildChordNotes(root: NoteName, quality: ChordQuality): string[] {
  const r = noteIndex(root);
  const octave = 4;

  switch (quality) {
    case 'major':
      return [`${noteAt(r)}${octave}`, `${noteAt(r + 4)}${octave}`, `${noteAt(r + 7)}${octave}`];
    case 'minor':
      return [`${noteAt(r)}${octave}`, `${noteAt(r + 3)}${octave}`, `${noteAt(r + 7)}${octave}`];
    case 'diminished':
      return [`${noteAt(r)}${octave}`, `${noteAt(r + 3)}${octave}`, `${noteAt(r + 6)}${octave}`];
    case 'augmented':
      return [`${noteAt(r)}${octave}`, `${noteAt(r + 4)}${octave}`, `${noteAt(r + 8)}${octave}`];
    default:
      return [`${noteAt(r)}${octave}`, `${noteAt(r + 4)}${octave}`, `${noteAt(r + 7)}${octave}`];
  }
}

function getRoman(degree: number, quality: ChordQuality): string {
  const idx = degree - 1;
  const isUpper = quality === 'major' || quality === 'augmented';
  const roman = isUpper ? ROMAN_UPPER[idx] : ROMAN_LOWER[idx];
  if (quality === 'diminished') return roman + '\u00B0';
  return roman;
}

// Generate all diatonic chords for a key and mode
export function getDiatonicChords(key: NoteName, mode: ModeName): ChordInfo[] {
  const scaleNotes = getScaleNotes(key, mode);
  const qualities = MODE_QUALITIES[mode];
  const functions = HARMONIC_FUNCTIONS[mode];

  return scaleNotes.map((root, i) => {
    const quality = qualities[i];
    const degree = i + 1;
    return {
      name: root + QUALITY_SUFFIX[quality],
      root,
      quality,
      degree,
      degreeRoman: getRoman(degree, quality),
      harmonicFunction: functions[i],
      notes: buildChordNotes(root, quality),
    };
  });
}

// Group chords by harmonic function
export function groupByFunction(chords: ChordInfo[]): Record<HarmonicFunction, ChordInfo[]> {
  return {
    tonic: chords.filter(c => c.harmonicFunction === 'tonic'),
    predominant: chords.filter(c => c.harmonicFunction === 'predominant'),
    dominant: chords.filter(c => c.harmonicFunction === 'dominant'),
  };
}

// Calculate measure duration in seconds based on BPM and time signature
export function getMeasureDuration(bpm: number, timeSignature: string): number {
  const beatsPerMeasure = timeSignature === '6/8' ? 2 : parseInt(timeSignature);
  // For 6/8, we treat it as 2 dotted quarter beats
  if (timeSignature === '6/8') {
    const dotQuarterDuration = (60 / bpm) * 1.5;
    return dotQuarterDuration * beatsPerMeasure;
  }
  return (60 / bpm) * beatsPerMeasure;
}

export { ALL_NOTES };
