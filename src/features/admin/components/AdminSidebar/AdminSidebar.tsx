'use client';

import Image from 'next/image';
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
      <Link href="/admin/dashboard" className={styles.logo}>
        <Image
          src="/images/logos/dp_logo_kor.svg"
          alt="Digitalpresso"
          width={150}
          height={22}
          className={styles.logoImage}
          priority
        />
        <span className={styles.logoSub}>Admin</span>
      </Link>

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
