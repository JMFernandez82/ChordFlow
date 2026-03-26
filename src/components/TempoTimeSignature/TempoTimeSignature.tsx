import type { TimeSignature } from '../../types';
import styles from './TempoTimeSignature.module.css';

interface Props {
  bpm: number;
  timeSignature: TimeSignature;
  onBpmChange: (bpm: number) => void;
  onTimeSignatureChange: (ts: TimeSignature) => void;
  disabled: boolean;
}

const TIME_SIGNATURES: TimeSignature[] = ['4/4', '3/4', '6/8'];

export function TempoTimeSignature({ bpm, timeSignature, onBpmChange, onTimeSignatureChange, disabled }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.group}>
        <label className={styles.label}>Compás</label>
        <div className={styles.pills}>
          {TIME_SIGNATURES.map(ts => (
            <button
              key={ts}
              className={`${styles.pill} ${ts === timeSignature ? styles.active : ''}`}
              onClick={() => onTimeSignatureChange(ts)}
              disabled={disabled}
            >
              {ts}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <label className={styles.label}>Tempo — {bpm} BPM</label>
        <div className={styles.sliderRow}>
          <span className={styles.sliderLabel}>60</span>
          <input
            type="range"
            min={60}
            max={180}
            value={bpm}
            onChange={e => onBpmChange(Number(e.target.value))}
            className={styles.slider}
            disabled={disabled}
          />
          <span className={styles.sliderLabel}>180</span>
        </div>
      </div>
    </div>
  );
}
