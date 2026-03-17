// components/layout/Header/Header.tsx
'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import styles from './Header.module.css';

const NAV_LINKS = [
  { label: '제품 소개', href: '/products' },
  { label: '회사 소개', href: '/about-us' },
  { label: '고객 사례', href: '/references' },
  { label: '소식', href: '/news' },
] as const;

const CTA_HREF = '/contact';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logoLink} onClick={closeMobileMenu}>
          {/* TODO: 실제 로고 파일로 교체 예정 — 현재는 Figma 로컬 서버 URL 사용 */}
          <img
            src="http://localhost:3845/assets/060d2d3361ff5f66a7cbef9231f9b362119d5819.png"
            alt="digitalPresso 로고"
            width={174}
            height={40}
            className={styles.logo}
          />
        </Link>

        {/* 데스크탑 / 태블릿 네비게이션 */}
        <nav className={styles.desktopNav} aria-label="주요 네비게이션">
          <ul className={styles.navList}>
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className={styles.navLink}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href={CTA_HREF} className={styles.ctaButton}>
            문의하기
          </Link>
        </nav>

        {/* 모바일 햄버거 버튼 */}
        <button
          className={styles.hamburger}
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMobileMenuOpen ? (
            // 닫기 아이콘 (✕)
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            // 메뉴 아이콘 (☰)
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M3 12H21M3 6H21M3 18H21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {isMobileMenuOpen && (
        <nav
          id="mobile-menu"
          className={styles.mobileNav}
          aria-label="모바일 네비게이션"
        >
          <ul className={styles.mobileNavList}>
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={styles.mobileNavLink}
                  onClick={closeMobileMenu}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={CTA_HREF}
                className={styles.mobileCtaButton}
                onClick={closeMobileMenu}
              >
                문의하기
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
