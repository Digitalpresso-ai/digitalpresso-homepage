// components/legal/LegalDocument.tsx
//
// 개인정보 처리방침·이용약관 공용 서버 컴포넌트.
// 본문은 서버에서 HTML로 완성되므로 JavaScript 없이도 전문이 보인다.

import { renderLegalDocument, type LegalDocument as LegalDocumentName } from '@/lib/legal';
import styles from './LegalDocument.module.css';

interface LegalDocumentProps {
  document: LegalDocumentName;
}

export async function LegalDocument({ document }: LegalDocumentProps) {
  const { title, html } = await renderLegalDocument(document);

  return (
    <main>
      <section className={styles.section}>
        {/* 원문은 한국어로만 확정되어 모든 로케일에서 한국어 원문을 보여 준다. */}
        <article className={styles.container} lang="ko">
          <div className={styles.titleWrapper}>
            <h1 className={styles.title}>{title}</h1>
          </div>
          <div className={styles.body} dangerouslySetInnerHTML={{ __html: html }} />
        </article>
      </section>
    </main>
  );
}
