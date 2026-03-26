export type NoteName = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export type ModeName = 'major' | 'minor';

export type TimeSignature = '4/4' | '3/4' | '6/8';

export type ChordQuality = 'major' | 'minor' | 'diminished' | 'augmented' | 'dominant7' | 'major7' | 'minor7';

export type HarmonicFunction = 'tonic' | 'predominant' | 'dominant';

export interface ChordInfo {
  name: string;         // e.g. "Dm"
  root: NoteName;
  quality: ChordQuality;
  degree: number;       // 1-7
  degreeRoman: string;  // e.g. "ii"
  harmonicFunction: HarmonicFunction;
  // Notes that form the chord (for Tone.js playback)
  notes: string[];
}

export interface TimelineSlot {
  index: number;        // 0-7
  chord: ChordInfo | null;
}

export interface Progression {
  key: NoteName;
  mode: ModeName;
  timeSignature: TimeSignature;
  bpm: number;
  slots: TimelineSlot[];
}

export interface PlaybackState {
  isPlaying: boolean;
  isLooping: boolean;
  currentSlot: number;  // -1 when stopped
}
