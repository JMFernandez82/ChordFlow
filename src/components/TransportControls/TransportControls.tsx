import type { PlaybackState } from '../../types';
import styles from './TransportControls.module.css';

interface Props {
  playbackState: PlaybackState;
  hasAnyChord: boolean;
  onPlay: () => void;
  onPlayLoop: () => void;
  onStop: () => void;
  onClear: () => void;
}

export function TransportControls({ playbackState, hasAnyChord, onPlay, onPlayLoop, onStop, onClear }: Props) {
  const { isPlaying, isLooping } = playbackState;

  return (
    <div className={styles.container}>
      {!isPlaying ? (
        <>
          <button
            className={`${styles.btn} ${styles.playBtn}`}
            onClick={onPlay}
            disabled={!hasAnyChord}
            title="Reproducir"
          >
            <span className={styles.icon}>▶</span>
            Play
          </button>
          <button
            className={`${styles.btn} ${styles.loopBtn}`}
            onClick={onPlayLoop}
            disabled={!hasAnyChord}
            title="Reproducir en loop"
          >
            <span className={styles.icon}>🔁</span>
            Loop
          </button>
        </>
      ) : (
        <button
          className={`${styles.btn} ${styles.stopBtn}`}
          onClick={onStop}
          title="Detener"
        >
          <span className={styles.icon}>⏹</span>
          Stop
        </button>
      )}
      <button
        className={`${styles.btn} ${styles.clearBtn}`}
        onClick={onClear}
        disabled={!hasAnyChord || isPlaying}
        title="Limpiar todo"
      >
        <span className={styles.icon}>🗑</span>
        Limpiar
      </button>
    </div>
  );
}
