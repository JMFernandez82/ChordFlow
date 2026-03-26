import { useCallback, useMemo } from 'react';
import type { NoteName, ModeName, TimeSignature, ChordInfo, Progression, TimelineSlot } from '../types';
import { getDiatonicChords } from '../lib/music';
import { useLocalStorage } from './useLocalStorage';

const TOTAL_SLOTS = 8;

function createEmptySlots(): TimelineSlot[] {
  return Array.from({ length: TOTAL_SLOTS }, (_, i) => ({ index: i, chord: null }));
}

const DEFAULT_PROGRESSION: Progression = {
  key: 'C',
  mode: 'major',
  timeSignature: '4/4',
  bpm: 120,
  slots: createEmptySlots(),
};

export function useProgression() {
  const [progression, setProgression] = useLocalStorage<Progression>('chordflow-progression', DEFAULT_PROGRESSION);

  const diatonicChords = useMemo(
    () => getDiatonicChords(progression.key, progression.mode),
    [progression.key, progression.mode]
  );

  const setKey = useCallback((key: NoteName) => {
    setProgression(prev => ({ ...prev, key, slots: createEmptySlots() }));
  }, [setProgression]);

  const setMode = useCallback((mode: ModeName) => {
    setProgression(prev => ({ ...prev, mode, slots: createEmptySlots() }));
  }, [setProgression]);

  const setTimeSignature = useCallback((timeSignature: TimeSignature) => {
    setProgression(prev => ({ ...prev, timeSignature }));
  }, [setProgression]);

  const setBpm = useCallback((bpm: number) => {
    setProgression(prev => ({ ...prev, bpm }));
  }, [setProgression]);

  const addChordToSlot = useCallback((slotIndex: number, chord: ChordInfo) => {
    setProgression(prev => ({
      ...prev,
      slots: prev.slots.map((s, i) => i === slotIndex ? { ...s, chord } : s),
    }));
  }, [setProgression]);

  // Add chord to the next empty slot
  const addChordToNext = useCallback((chord: ChordInfo) => {
    setProgression(prev => {
      const nextEmpty = prev.slots.findIndex(s => s.chord === null);
      if (nextEmpty === -1) return prev;
      return {
        ...prev,
        slots: prev.slots.map((s, i) => i === nextEmpty ? { ...s, chord } : s),
      };
    });
  }, [setProgression]);

  const removeChordFromSlot = useCallback((slotIndex: number) => {
    setProgression(prev => ({
      ...prev,
      slots: prev.slots.map((s, i) => i === slotIndex ? { ...s, chord: null } : s),
    }));
  }, [setProgression]);

  const clearAll = useCallback(() => {
    setProgression(prev => ({ ...prev, slots: createEmptySlots() }));
  }, [setProgression]);

  const loadProgression = useCallback((slots: (ChordInfo | null)[]) => {
    setProgression(prev => ({
      ...prev,
      slots: slots.map((chord, i) => ({ index: i, chord })),
    }));
  }, [setProgression]);

  const hasAnyChord = progression.slots.some(s => s.chord !== null);

  return {
    progression,
    diatonicChords,
    hasAnyChord,
    setKey,
    setMode,
    setTimeSignature,
    setBpm,
    addChordToSlot,
    addChordToNext,
    removeChordFromSlot,
    clearAll,
    loadProgression,
  };
}
