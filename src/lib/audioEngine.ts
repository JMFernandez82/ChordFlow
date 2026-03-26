import * as Tone from 'tone';
import type { ChordInfo, TimelineSlot } from '../types';
import { getMeasureDuration } from './music';

let synth: Tone.PolySynth | null = null;
let scheduledEvents: number[] = [];
let isInitialized = false;

// Ensure AudioContext is started (requires user gesture)
export async function initAudio(): Promise<void> {
  if (isInitialized) return;
  await Tone.start();
  isInitialized = true;
}

function getSynth(): Tone.PolySynth {
  if (!synth) {
    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle4' as const },
      envelope: {
        attack: 0.05,
        decay: 0.3,
        sustain: 0.4,
        release: 0.8,
      },
      volume: -8,
    }).toDestination();
    synth.maxPolyphony = 8;
  }
  return synth;
}

export function playChordPreview(chord: ChordInfo): void {
  const s = getSynth();
  s.releaseAll();
  s.triggerAttackRelease(chord.notes, '4n');
}

export function stopPlayback(): void {
  Tone.getTransport().stop();
  Tone.getTransport().cancel();
  scheduledEvents = [];
  getSynth().releaseAll();
}

export function startPlayback(
  slots: TimelineSlot[],
  bpm: number,
  timeSignature: string,
  loop: boolean,
  onSlotChange: (index: number) => void,
  onFinish: () => void,
): void {
  stopPlayback();

  const transport = Tone.getTransport();
  transport.bpm.value = bpm;

  const measureDuration = getMeasureDuration(bpm, timeSignature);
  const totalDuration = measureDuration * slots.length;

  // Sustain slightly less than the full measure for a natural feel
  const sustainDuration = measureDuration * 0.85;

  const s = getSynth();

  slots.forEach((slot, i) => {
    const time = i * measureDuration;
    const eventId = transport.schedule((t) => {
      // Use Tone.getDraw for visual sync on the main thread
      Tone.getDraw().schedule(() => onSlotChange(i), t);

      if (slot.chord) {
        s.triggerAttackRelease(slot.chord.notes, sustainDuration, t);
      }
    }, time);
    scheduledEvents.push(eventId);
  });

  if (loop) {
    transport.loop = true;
    transport.loopStart = 0;
    transport.loopEnd = totalDuration;
  } else {
    transport.loop = false;
    // Schedule end callback
    const endId = transport.schedule(() => {
      Tone.getDraw().schedule(() => {
        stopPlayback();
        onSlotChange(-1);
        onFinish();
      }, Tone.now());
    }, totalDuration);
    scheduledEvents.push(endId);
  }

  transport.start();
}

export function setPlaybackBpm(bpm: number): void {
  Tone.getTransport().bpm.value = bpm;
}

export function disposeAudio(): void {
  stopPlayback();
  if (synth) {
    synth.dispose();
    synth = null;
  }
  isInitialized = false;
}
