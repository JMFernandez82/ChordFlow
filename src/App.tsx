import { useState, useCallback } from 'react';
import { Header } from './components/Header/Header';
import { KeyModeSelector } from './components/KeyModeSelector/KeyModeSelector';
import { TempoTimeSignature } from './components/TempoTimeSignature/TempoTimeSignature';
import { ChordPalette } from './components/ChordPalette/ChordPalette';
import { Timeline } from './components/Timeline/Timeline';
import { TransportControls } from './components/TransportControls/TransportControls';
import { Suggestions } from './components/Suggestions/Suggestions';
import { useProgression } from './hooks/useProgression';
import { useAudioEngine } from './hooks/useAudioEngine';
import type { ChordInfo } from './types';
import styles from './App.module.css';

export default function App() {
  const {
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
  } = useProgression();

  const { playbackState, previewChord, play, stop, updateBpm } = useAudioEngine();
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const isPlaying = playbackState.isPlaying;

  const handleChordTap = useCallback((chord: ChordInfo) => {
    previewChord(chord);
    if (selectedSlot !== null) {
      addChordToSlot(selectedSlot, chord);
      setSelectedSlot(null);
    } else {
      addChordToNext(chord);
    }
  }, [selectedSlot, previewChord, addChordToSlot, addChordToNext]);

  const handleSlotTap = useCallback((index: number) => {
    if (isPlaying) return;
    setSelectedSlot(prev => prev === index ? null : index);
  }, [isPlaying]);

  const handlePlay = useCallback(() => {
    play(progression.slots, progression.bpm, progression.timeSignature, false);
  }, [play, progression]);

  const handlePlayLoop = useCallback(() => {
    play(progression.slots, progression.bpm, progression.timeSignature, true);
  }, [play, progression]);

  const handleBpmChange = useCallback((bpm: number) => {
    setBpm(bpm);
    if (isPlaying) updateBpm(bpm);
  }, [setBpm, updateBpm, isPlaying]);

  const handleClear = useCallback(() => {
    clearAll();
    setSelectedSlot(null);
  }, [clearAll]);

  return (
    <div className={styles.app}>
      <Header />

      <main className={styles.main}>
        <section className={styles.section}>
          <KeyModeSelector
            currentKey={progression.key}
            currentMode={progression.mode}
            onKeyChange={setKey}
            onModeChange={setMode}
            disabled={isPlaying}
          />
        </section>

        <section className={styles.section}>
          <TempoTimeSignature
            bpm={progression.bpm}
            timeSignature={progression.timeSignature}
            onBpmChange={handleBpmChange}
            onTimeSignatureChange={setTimeSignature}
            disabled={isPlaying}
          />
        </section>

        <section className={styles.section}>
          <ChordPalette
            chords={diatonicChords}
            onChordTap={handleChordTap}
            onChordPreview={previewChord}
            disabled={false}
          />
        </section>

        <section className={`${styles.section} ${styles.timelineSection}`}>
          <Timeline
            slots={progression.slots}
            currentSlot={playbackState.currentSlot}
            selectedSlot={selectedSlot}
            onSlotTap={handleSlotTap}
            onSlotRemove={removeChordFromSlot}
          />
        </section>

        <section className={styles.section}>
          <TransportControls
            playbackState={playbackState}
            hasAnyChord={hasAnyChord}
            onPlay={handlePlay}
            onPlayLoop={handlePlayLoop}
            onStop={stop}
            onClear={handleClear}
          />
        </section>

        <section className={styles.section}>
          <Suggestions
            currentKey={progression.key}
            currentMode={progression.mode}
            onApply={loadProgression}
            disabled={isPlaying}
          />
        </section>
      </main>
    </div>
  );
}
