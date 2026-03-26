import type { ChordInfo } from '../../types';
import { groupByFunction } from '../../lib/music';
import styles from './ChordPalette.module.css';

interface Props {
  chords: ChordInfo[];
  onChordTap: (chord: ChordInfo) => void;
  onChordPreview: (chord: ChordInfo) => void;
  disabled: boolean;
}

const FUNCTION_LABELS = {
  tonic: 'Tónica',
  predominant: 'Predominante',
  dominant: 'Dominante',
} as const;

const FUNCTION_COLORS = {
  tonic: 'var(--fn-tonic)',
  predominant: 'var(--fn-predominant)',
  dominant: 'var(--fn-dominant)',
} as const;

export function ChordPalette({ chords, onChordTap, onChordPreview, disabled }: Props) {
  const grouped = groupByFunction(chords);

  return (
    <div className={styles.container}>
      <label className={styles.sectionLabel}>Acordes disponibles</label>
      {(['tonic', 'predominant', 'dominant'] as const).map(fn => (
        <div key={fn} className={styles.functionGroup}>
          <span className={styles.functionLabel} style={{ color: FUNCTION_COLORS[fn] }}>
            {FUNCTION_LABELS[fn]}
          </span>
          <div className={styles.chords}>
            {grouped[fn].map(chord => (
              <button
                key={chord.degree}
                className={styles.chordChip}
                style={{ borderColor: FUNCTION_COLORS[fn] }}
                onClick={() => onChordTap(chord)}
                onContextMenu={(e) => { e.preventDefault(); onChordPreview(chord); }}
                onTouchStart={() => {
                  // Long press preview handled via separate timer if needed
                }}
                disabled={disabled}
                title={`${chord.degreeRoman} — Mantén para escuchar`}
              >
                <span className={styles.degree}>{chord.degreeRoman}</span>
                <span className={styles.name}>{chord.name}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
      <p className={styles.hint}>
        Pulsa para añadir al siguiente compás libre. Clic derecho para escuchar.
      </p>
    </div>
  );
}
