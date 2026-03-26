import type { TimelineSlot, ChordInfo } from '../../types';
import styles from './Timeline.module.css';

interface Props {
  slots: TimelineSlot[];
  currentSlot: number;
  selectedSlot: number | null;
  onSlotTap: (index: number) => void;
  onSlotRemove: (index: number) => void;
}

export function Timeline({ slots, currentSlot, selectedSlot, onSlotTap, onSlotRemove }: Props) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>Timeline</label>
      <div className={styles.grid}>
        {slots.map((slot) => {
          const isActive = slot.index === currentSlot;
          const isSelected = slot.index === selectedSlot;
          return (
            <div
              key={slot.index}
              className={`${styles.slot} ${isActive ? styles.active : ''} ${isSelected ? styles.selected : ''} ${slot.chord ? styles.filled : ''}`}
              onClick={() => onSlotTap(slot.index)}
            >
              <span className={styles.slotNumber}>{slot.index + 1}</span>
              {slot.chord ? (
                <div className={styles.chordContent}>
                  <span className={styles.chordDegree}>{slot.chord.degreeRoman}</span>
                  <span className={styles.chordName}>{slot.chord.name}</span>
                  <button
                    className={styles.removeBtn}
                    onClick={(e) => { e.stopPropagation(); onSlotRemove(slot.index); }}
                    aria-label="Eliminar acorde"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <span className={styles.empty}>—</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
