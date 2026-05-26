import styles from './loading.module.css';

export default function NewsLoading() {
  return (
    <main>
      {/* Hero skeleton */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroLabel} />
          <div className={styles.heroHeading} />
          <div className={styles.heroSubtitle} />
        </div>
      </div>

      {/* Filter bar skeleton */}
      <div className={styles.filterBar}>
        <div className={styles.tabs}>
          <div className={styles.tab} />
          <div className={styles.tab} />
          <div className={styles.tab} />
        </div>
        <div className={styles.searchBox} />
      </div>

      {/* Grid skeleton */}
      <div className={styles.grid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.cardImage} />
            <div className={styles.cardContent}>
              <div className={styles.cardTitle} />
              <div className={styles.cardDesc} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
