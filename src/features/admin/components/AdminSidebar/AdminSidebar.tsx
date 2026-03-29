'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/src/features/admin/actions/auth.actions';
import styles from './AdminSidebar.module.css';

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: '대시보드', icon: '▦' },
  { href: '/admin/articles', label: '아티클 관리', icon: '✎' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoText}>Digitalpresso</span>
        <span className={styles.logoSub}>Admin</span>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${pathname.startsWith(item.href) ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <form action={signOut} className={styles.footer}>
        <button type="submit" className={styles.signOutBtn}>
          로그아웃
        </button>
      </form>
    </aside>
  );
}
