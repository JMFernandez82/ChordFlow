import type { NoteName, ModeName } from '../../types';
import { ALL_NOTES } from '../../lib/music';
import styles from './KeyModeSelector.module.css';

interface Props {
  currentKey: NoteName;
  currentMode: ModeName;
  onKeyChange: (key: NoteName) => void;
  onModeChange: (mode: ModeName) => void;
  disabled: boolean;
}

const MODES: { value: ModeName; label: string }[] = [
  { value: 'major', label: 'Mayor' },
  { value: 'minor', label: 'Menor' },
];

export function KeyModeSelector({ currentKey, currentMode, onKeyChange, onModeChange, disabled }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.group}>
        <label className={styles.label}>Tonalidad</label>
        <div className={styles.pills}>
          {ALL_NOTES.map(note => (
            <button
              key={note}
              className={`${styles.pill} ${note === currentKey ? styles.active : ''}`}
              onClick={() => onKeyChange(note)}
              disabled={disabled}
            >
              {note}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.group}>
        <label className={styles.label}>Modo</label>
        <div className={styles.pills}>
          {MODES.map(m => (
            <button
              key={m.value}
              className={`${styles.pill} ${styles.modePill} ${m.value === currentMode ? styles.active : ''}`}
              onClick={() => onModeChange(m.value)}
              disabled={disabled}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
