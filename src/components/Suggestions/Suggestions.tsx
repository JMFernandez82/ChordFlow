import type { NoteName, ModeName } from '../../types';
import { SUGGESTIONS, applySuggestion } from '../../data/suggestions';
import type { ChordInfo } from '../../types';
import styles from './Suggestions.module.css';

interface Props {
  currentKey: NoteName;
  currentMode: ModeName;
  onApply: (slots: (ChordInfo | null)[]) => void;
  disabled: boolean;
}

export function Suggestions({ currentKey, currentMode, onApply, disabled }: Props) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>Sugerencias</label>
      <div className={styles.cards}>
        {SUGGESTIONS.map(suggestion => (
          <button
            key={suggestion.label}
            className={styles.card}
            onClick={() => onApply(applySuggestion(suggestion, currentKey, currentMode))}
            disabled={disabled}
          >
            <span className={styles.cardTitle}>{suggestion.label}</span>
            <span className={styles.cardDesc}>{suggestion.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
