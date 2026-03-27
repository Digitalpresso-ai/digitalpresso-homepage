// app/[locale]/contact/page.tsx

import { ContactInfoCard } from '@/src/features/contact/components/ContactInfoCard/ContactInfoCard';
import { ContactForm } from '@/src/features/contact/components/ContactForm/ContactForm';
import styles from './ContactPage.module.css';

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <ContactInfoCard />
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
