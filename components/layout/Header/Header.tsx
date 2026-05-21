// components/layout/Header/Header.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import styles from './Header.module.css';

const CTA_HREF = '/contact';

export default function Header() {
  const t = useTranslations('common.header');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const dropdownId = 'header-language-dropdown';
  const languageRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  const [isMobileProductOpen, setIsMobileProductOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const productMenuRef = useRef<HTMLLIElement>(null);
  const navLinks = [
    { href: '/about-us', label: t('nav.aboutUs') },
    { href: '/references', label: t('nav.references') },
    { href: '/news', label: t('nav.news') },
  ] as const;
  const productSubLinks = [
    { href: '/', label: t('nav.productSub.renameDP'), external: false },
    { href: 'https://sigongtalk.com', label: t('nav.productSub.sigongtalk'), external: true },
    { href: '/products/manufacturing', label: t('nav.productSub.renameDX'), external: false },
  ] as const;
  const languageOptions = routing.locales.map((item) => ({
    locale: item,
    code: t(`language.short.${item}`),
    name: t(`language.options.${item}`),
    flagSrc: `/images/flags/${item}.svg`,
  }));

  const selectedLanguage =
    languageOptions.find((item) => item.locale === locale) ?? languageOptions[0];

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileProductOpen(false);
  };
  const toggleLanguageMenu = () => setIsLanguageMenuOpen((prev) => !prev);
  const closeLanguageMenu = () => setIsLanguageMenuOpen(false);
  const closeProductMenu = () => setIsProductMenuOpen(false);

  const handleLocaleChange = (nextLocale: Locale) => {
    if (nextLocale !== locale) {
      router.replace(pathname, { locale: nextLocale });
    }
    closeLanguageMenu();
  };

  useEffect(() => {
    const HIDE_THRESHOLD = 80;
    const SHOW_DELAY = 800;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const scrollingDown = currentY > lastScrollY.current;
      lastScrollY.current = currentY;

      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }

      if (scrollingDown && currentY > HIDE_THRESHOLD) {
        setIsHidden(true);
      } else if (!scrollingDown) {
        setIsHidden(false);
      }

      // 스크롤 멈추면 SHOW_DELAY ms 후 헤더 다시 표시
      hideTimer.current = setTimeout(() => {
        setIsHidden(false);
      }, SHOW_DELAY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  // 데스크톱 크기로 돌아가면 모바일 메뉴 자동 닫기
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isProductMenuOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!productMenuRef.current?.contains(event.target as Node)) {
        closeProductMenu();
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeProductMenu();
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isProductMenuOpen]);

  useEffect(() => {
    if (!isLanguageMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!languageRef.current?.contains(event.target as Node)) {
        closeLanguageMenu();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeLanguageMenu();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isLanguageMenuOpen]);

  return (
    <header className={`${styles.header} ${isHidden ? styles.headerHidden : ''}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logoLink} onClick={closeMobileMenu}>
          <Image
            src="/images/renamedp_logo_eng.svg"
            alt={t('logoAlt')}
            width={174}
            height={40}
            className={styles.logo}
            priority
          />
        </Link>

        {/* 데스크탑 / 태블릿 네비게이션 */}
        <nav className={styles.desktopNav} aria-label={t('aria.mainNav')}>
          <ul className={styles.navList}>
            <li className={styles.productMenuItem} ref={productMenuRef}>
              <button
                type="button"
                className={styles.navLink}
                aria-expanded={isProductMenuOpen}
                aria-haspopup="true"
                onClick={() => setIsProductMenuOpen((prev) => !prev)}
              >
                {t('nav.product')}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`${styles.productChevron} ${isProductMenuOpen ? styles.productChevronOpen : ''}`}
                  aria-hidden="true"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {isProductMenuOpen && (
                <ul className={styles.productDropdown}>
                  {productSubLinks.map(({ href, label, external }) => (
                    <li key={label}>
                      {external ? (
                        <a
                          href={href}
                          className={styles.productDropdownLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={closeProductMenu}
                        >
                          {label}
                        </a>
                      ) : (
                        <Link href={href} className={styles.productDropdownLink} onClick={closeProductMenu}>
                          {label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className={styles.navLink}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href={CTA_HREF} className={styles.ctaButton}>
            {t('cta')}
          </Link>
          <div className={styles.languageDropdown} ref={languageRef}>
            <span className={styles.languageLabel}>{t('language.label')}</span>
            <button
              type="button"
              className={styles.languageButton}
              aria-expanded={isLanguageMenuOpen}
              aria-controls={dropdownId}
              aria-haspopup="listbox"
              aria-label={t('language.aria.button')}
              onClick={toggleLanguageMenu}
            >
              <span className={styles.languageButtonContent}>
                <Image
                  src={selectedLanguage.flagSrc}
                  alt=""
                  width={36}
                  height={24}
                  className={styles.languageFlag}
                />
                <span className={styles.languageCode}>{selectedLanguage.code}</span>
              </span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`${styles.languageChevron} ${
                  isLanguageMenuOpen ? styles.languageChevronOpen : ''
                }`}
                aria-hidden="true"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {isLanguageMenuOpen && (
              <ul
                id={dropdownId}
                className={styles.languageList}
                role="listbox"
                aria-label={t('language.aria.list')}
              >
                {languageOptions.map((item) => (
                  <li key={item.locale}>
                    <button
                      type="button"
                      className={`${styles.languageOption} ${
                        item.locale === locale ? styles.languageOptionActive : ''
                      }`}
                      role="option"
                      aria-selected={item.locale === locale}
                      onClick={() => handleLocaleChange(item.locale)}
                    >
                      <Image
                        src={item.flagSrc}
                        alt=""
                        width={36}
                        height={24}
                        className={styles.languageFlag}
                      />
                      <span className={styles.languageCode}>{item.code}</span>
                      <span className={styles.srOnly}>{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>

        {/* 태블릿·모바일: CTA + 햄버거 */}
        <div className={styles.mobileActions}>
          <Link href={CTA_HREF} className={styles.mobileCtaInline} onClick={closeMobileMenu}>
            {t('cta')}
          </Link>
          <button
            className={styles.hamburger}
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? t('aria.menuClose') : t('aria.menuOpen')}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? (
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
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {isMobileMenuOpen && (
        <nav
          id="mobile-menu"
          className={styles.mobileNav}
          aria-label={t('aria.mobileNav')}
        >
          <div className={styles.mobileMenuContent}>
            <ul className={styles.mobileNavList}>
              <li>
                <button
                  type="button"
                  className={styles.mobileNavLink}
                  onClick={() => setIsMobileProductOpen((prev) => !prev)}
                  aria-expanded={isMobileProductOpen}
                >
                  {t('nav.product')}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`${styles.productChevron} ${isMobileProductOpen ? styles.productChevronOpen : ''}`}
                    aria-hidden="true"
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {isMobileProductOpen && (
                  <ul className={styles.mobileProductSubList}>
                    {productSubLinks.map(({ href, label, external }) => (
                      <li key={label}>
                        {external ? (
                          <a
                            href={href}
                            className={styles.mobileProductSubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={closeMobileMenu}
                          >
                            {label}
                          </a>
                        ) : (
                          <Link href={href} className={styles.mobileProductSubLink} onClick={closeMobileMenu}>
                            {label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              {navLinks.map(({ label, href }) => (
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
            </ul>

            <div className={styles.mobileLanguageDropdown} ref={languageRef}>
              <span className={styles.mobileLanguageLabel}>{t('language.label')}</span>
              <button
                type="button"
                className={styles.mobileLanguageButton}
                aria-expanded={isLanguageMenuOpen}
                aria-haspopup="listbox"
                aria-label={t('language.aria.button')}
                onClick={toggleLanguageMenu}
              >
                <span className={styles.languageButtonContent}>
                  <Image
                    src={selectedLanguage.flagSrc}
                    alt=""
                    width={36}
                    height={24}
                    className={styles.languageFlag}
                  />
                  <span className={styles.languageCode}>{selectedLanguage.code}</span>
                </span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`${styles.languageChevron} ${
                    isLanguageMenuOpen ? styles.languageChevronOpen : ''
                  }`}
                  aria-hidden="true"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {isLanguageMenuOpen && (
                <ul
                  className={styles.mobileLanguageList}
                  role="listbox"
                  aria-label={t('language.aria.list')}
                >
                  {languageOptions.map((item) => (
                    <li key={item.locale}>
                      <button
                        type="button"
                        className={`${styles.languageOption} ${
                          item.locale === locale ? styles.languageOptionActive : ''
                        }`}
                        role="option"
                        aria-selected={item.locale === locale}
                        onClick={() => handleLocaleChange(item.locale)}
                      >
                        <Image
                          src={item.flagSrc}
                          alt=""
                          width={36}
                          height={24}
                          className={styles.languageFlag}
                        />
                        <span className={styles.languageCode}>{item.code}</span>
                        <span className={styles.srOnly}>{item.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
