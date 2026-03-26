import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        <span className={styles.accent}>Chord</span>Flow
      </h1>
      <p className={styles.subtitle}>Explora progresiones de acordes</p>
    </header>
  );
}
