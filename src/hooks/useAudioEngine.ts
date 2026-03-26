import { useState, useCallback, useRef, useEffect } from 'react';
import type { ChordInfo, TimelineSlot } from '../types';
import { initAudio, playChordPreview, startPlayback, stopPlayback, setPlaybackBpm, disposeAudio } from '../lib/audioEngine';
import type { PlaybackState } from '../types';

export function useAudioEngine() {
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    isLooping: false,
    currentSlot: -1,
  });

  const audioReady = useRef(false);

  const ensureAudio = useCallback(async () => {
    if (!audioReady.current) {
      await initAudio();
      audioReady.current = true;
    }
  }, []);

  const previewChord = useCallback(async (chord: ChordInfo) => {
    await ensureAudio();
    playChordPreview(chord);
  }, [ensureAudio]);

  const play = useCallback(async (
    slots: TimelineSlot[],
    bpm: number,
    timeSignature: string,
    loop: boolean,
  ) => {
    await ensureAudio();
    setPlaybackState({ isPlaying: true, isLooping: loop, currentSlot: 0 });

    startPlayback(
      slots,
      bpm,
      timeSignature,
      loop,
      (slotIndex) => setPlaybackState(prev => ({ ...prev, currentSlot: slotIndex })),
      () => setPlaybackState({ isPlaying: false, isLooping: false, currentSlot: -1 }),
    );
  }, [ensureAudio]);

  const stop = useCallback(() => {
    stopPlayback();
    setPlaybackState({ isPlaying: false, isLooping: false, currentSlot: -1 });
  }, []);

  const updateBpm = useCallback((bpm: number) => {
    setPlaybackBpm(bpm);
  }, []);

  useEffect(() => {
    return () => { disposeAudio(); };
  }, []);

  return {
    playbackState,
    previewChord,
    play,
    stop,
    updateBpm,
  };
}
