import styles from './loading.module.css';

export default function ArticleLoading() {
  return (
    <main>
      <div className={styles.container}>
        {/* Header skeleton */}
        <div className={styles.header}>
          <div className={styles.title} />
          <div className={styles.category} />
        </div>

        {/* Body skeleton */}
        <div className={styles.body}>
          <div className={styles.image} />
          <div className={styles.paragraph} />
          <div className={styles.paragraphShort} />
          <div className={styles.paragraph} />
          <div className={styles.paragraphMedium} />
          <div className={styles.paragraph} />
        </div>

        {/* Navigation skeleton */}
        <div className={styles.navigation}>
          <div className={styles.navLink} />
          <div className={styles.navLink} />
          <div className={styles.listButton} />
        </div>
      </div>
    </main>
  );
}
