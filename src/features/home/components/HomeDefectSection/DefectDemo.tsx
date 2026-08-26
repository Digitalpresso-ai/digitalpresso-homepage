'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  BellIcon,
  BuildingIcon,
  ChatIcon,
  ClipboardIcon,
  HardHatIcon,
  HomeIcon,
  UserIcon,
} from '../HomeBlueprintSection/icons';
import {
  CameraIcon,
  FileIcon,
  ImagePlaceholderIcon,
  InfoCircleIcon,
  SparkleIcon,
  XIcon,
} from '../HomeSafetySection/icons';
import { SearchIcon } from '../HomeBlueprintSection/icons';
import styles from './HomeDefectSection.module.css';
import { ProductLogo } from '@/src/components/product/ProductLogo';
import { ProductAvatar } from '@/src/components/product/ProductAvatar';
import { useDemoScroll } from '@/src/hooks/useDemoScroll';

/* Steps of the demo, in order. */
type Stage =
  | 'idle' // 파일선택 invites a click
  | 'files' // two photos attached; 다음 highlighted
  | 'loading' // step 2 with the "AI is writing" modal
  | 'filled' // content written; assignee still empty
  | 'assigning' // person list open
  | 'assigned'; // owner chosen; 하자보수 요청 추가 highlighted

const ORDER: Stage[] = ['idle', 'files', 'loading', 'filled', 'assigning', 'assigned'];

const NAV_ICONS = [HomeIcon, ClipboardIcon, HardHatIcon, BuildingIcon];
const PEOPLE = [0, 1] as const;

export function DefectDemo() {
  const t = useTranslations('home.defectDemo');
  const [stage, setStage] = useState<Stage>('idle');
  const [person, setPerson] = useState(0);
  const { sheetRef, scrollToTop, scrollToBottom } = useDemoScroll<HTMLDivElement>();

  /* The loading modal resolves itself once the "AI" has finished. */
  useEffect(() => {
    if (stage !== 'loading') return;
    const id = window.setTimeout(() => setStage('filled'), 1700);
    return () => window.clearTimeout(id);
  }, [stage]);

  const go = useCallback((next: Stage) => setStage(next), []);

  /* Moving to step 2 (the AI-write screen) always starts scrolled to the
     top, regardless of where the visitor left step 1's card. */
  const goToStep2 = useCallback(() => {
    go('loading');
    scrollToTop();
  }, [go, scrollToTop]);

  /* Attaching a file adds content below the fold — bring it into view
     instead of leaving it hidden. */
  const attachFiles = useCallback(() => {
    go('files');
    scrollToBottom();
  }, [go, scrollToBottom]);

  const choose = useCallback((i: number) => {
    setPerson(i);
    setStage('assigned');
  }, []);

  const reached = (s: Stage) => ORDER.indexOf(stage) >= ORDER.indexOf(s);
  const onStep2 = reached('loading');
  const filled = reached('filled');
  const hasOwner = reached('assigned');

  return (
    <div className={styles.app}>
      <header className={styles.appBar}>
        <ProductLogo className={styles.appLogo} />
        <span className={styles.appBarIcons}>
          <span className={styles.badgeWrap}>
            <BellIcon />
            <em className={styles.badge}>1</em>
          </span>
          <span className={styles.badgeWrap}>
            <ChatIcon />
            <em className={styles.badge}>2</em>
          </span>
          <ProductAvatar className={styles.avatar} />
        </span>
      </header>

      <div className={styles.appBody}>
        <div className={styles.leftCols}>
          <div className={styles.leftBody}>
            <nav className={styles.rail}>
              {NAV_ICONS.map((Icon, i) => (
                <span
                  key={i}
                  className={`${styles.railItem}${i === 1 ? ` ${styles.railActive}` : ''}`}
                >
                  <Icon />
                  {t(`ui.nav.${i}`)}
                </span>
              ))}
            </nav>
            <div className={styles.sideMenu}>
              <span className={styles.sideMenuActive}>✓ {t('ui.projectMenu')}</span>
            </div>
          </div>
          <div className={styles.logoutRow}>{t('ui.logout')}</div>
        </div>

        <div className={styles.main}>
          <p className={styles.breadcrumb}>
            {t('ui.breadcrumb.0')} <i>/</i> {t('ui.breadcrumb.1')} <i>/</i> {t('ui.breadcrumb.2')}{' '}
            <i>/</i> {t('ui.breadcrumb.3')} <i>/</i>
            <strong> {t('ui.breadcrumb.4')}</strong>
          </p>
          <p className={styles.sub}>{t('ui.sub')}</p>

          <p className={styles.path}>
            {t('ui.path.0')} <i>/</i> {t('ui.path.1')} <i>/</i>
            <strong> {t('ui.path.2')}</strong>
          </p>

          <ol className={styles.stepper}>
            {[0, 1].map((i) => (
              <li key={i} className={styles.stepperItem}>
                <span
                  className={`${styles.stepDot}${(i === 0 ? !onStep2 : onStep2) ? ` ${styles.stepDotOn}` : ''}`}
                >
                  {i + 1}
                </span>
                <span className={styles.stepLabel}>{t(`ui.stepNames.${i}`)}</span>
                {i === 0 && <span className={styles.stepLine} aria-hidden />}
              </li>
            ))}
          </ol>

          <div className={styles.sheet} ref={sheetRef}>
            <section className={styles.block}>
              <span className={styles.blockIcon}>
                {onStep2 ? <InfoCircleIcon /> : <CameraIcon size={22} />}
              </span>
              <div className={styles.blockBody}>
                <h5 className={styles.blockTitle}>
                  {onStep2 ? t('ui.infoTitle') : t('ui.photoTitle')}
                </h5>
                <p className={styles.blockDesc}>
                  {onStep2 ? t('ui.infoDesc') : t('ui.photoDesc')}
                </p>

                {/* ─── Step 1 ─── */}
                {!onStep2 && (
                  <>
                    <div className={styles.dropZone}>
                      <p>{t('ui.dropText')}</p>
                      <p className={styles.formats}>{t('ui.formats')}</p>
                      <span className={styles.pickWrap}>
                        {stage === 'idle' && (
                          <span className={styles.startHint}>{t('ui.startHint')}</span>
                        )}
                        <button
                          type="button"
                          className={`${styles.primaryBtn}${stage === 'idle' ? ` ${styles.pulse}` : ''}`}
                          onClick={() => attachFiles()}
                        >
                          <FileIcon /> {t('ui.pick')}
                        </button>
                      </span>
                    </div>

                    {reached('files') && (
                      <ul className={styles.fileList}>
                        {[0, 1].map((f) => (
                          <li key={f}>
                            <span>{t(`ui.files.${f}`)}</span>
                            <XIcon size={12} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}

                {/* ─── Step 2 ─── */}
                {onStep2 && (
                  <div className={styles.form}>
                    <div className={styles.thumbs}>
                      {[0, 1].map((i) => (
                        <span key={i} className={styles.thumb}>
                          <ImagePlaceholderIcon size={20} />
                        </span>
                      ))}
                    </div>

                    {/* Assignee: empty until the visitor picks someone. */}
                    <div className={styles.assignWrap}>
                      {filled && !hasOwner && stage !== 'assigning' && (
                        <span className={styles.assignHint}>{t('ui.assignHint')}</span>
                      )}
                      <span className={styles.fieldLabel}>{t('fields.assign')}</span>
                      <button
                        type="button"
                        className={`${styles.assignBox}${filled && !hasOwner ? ` ${styles.assignIdle} ${styles.pulse}` : ''}`}
                        onClick={() => go(stage === 'assigning' ? 'filled' : 'assigning')}
                      >
                        <SearchIcon />
                        <span className={hasOwner ? undefined : styles.empty}>
                          {hasOwner ? t(`people.${person}.name`) : t('fields.assignPlaceholder')}
                        </span>
                      </button>

                      {stage === 'assigning' && (
                        <ul className={styles.people}>
                          {PEOPLE.map((i) => (
                            <li key={i}>
                              <button
                                type="button"
                                className={styles.personRow}
                                onClick={() => choose(i)}
                              >
                                <span className={styles.personAvatar}>
                                  <UserIcon size={14} />
                                </span>
                                <span className={styles.personText}>
                                  <strong>{t(`people.${i}.name`)}</strong>
                                  <span>{t(`people.${i}.email`)}</span>
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* The chosen owner stays visible as a card under the
                        search field, as the product does. */}
                    {hasOwner && (
                      <div className={styles.ownerCard}>
                        <span className={styles.personAvatar}>
                          <UserIcon size={16} />
                        </span>
                        <span className={styles.personText}>
                          <strong>{t(`people.${person}.name`)}</strong>
                          <span>{t(`people.${person}.email`)}</span>
                        </span>
                      </div>
                    )}

                    <label className={styles.field}>
                      <span className={styles.fieldLabel}>{t('fields.name')}</span>
                      <span className={`${styles.fieldBox}${filled ? '' : ` ${styles.empty}`}`}>
                        {filled ? t('mock.name') : ''}
                      </span>
                    </label>

                    <label className={styles.field}>
                      <span className={styles.fieldLabel}>{t('fields.type')}</span>
                      <span className={`${styles.fieldBox}${filled ? '' : ` ${styles.empty}`}`}>
                        {filled ? t('mock.type') : ''}
                      </span>
                    </label>

                    <label className={styles.field}>
                      <span className={styles.fieldLabel}>{t('fields.content')}</span>
                      <span
                        className={`${styles.fieldBox} ${styles.tall}${filled ? '' : ` ${styles.empty}`}`}
                      >
                        {filled ? t('mock.content') : ''}
                      </span>
                    </label>

                    <label className={styles.field}>
                      <span className={styles.fieldLabel}>{t('fields.note')}</span>
                      <span className={`${styles.fieldBox} ${styles.tall} ${styles.empty}`}>
                        {t('fields.notePlaceholder')}
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className={styles.footer}>
            <span className={styles.ghostBtn}>
              <XIcon /> {t('ui.cancel')}
            </span>
            {onStep2 ? (
              <>
                <button type="button" className={styles.ghostBtn} onClick={() => go('idle')}>
                  {t('ui.prev')}
                </button>
                <button
                  type="button"
                  className={`${styles.primaryBtn}${hasOwner ? ` ${styles.pulse}` : ''}`}
                  onClick={() => go('idle')}
                  disabled={!hasOwner}
                >
                  {t('ui.add')}
                </button>
              </>
            ) : (
              <button
                type="button"
                className={`${styles.primaryBtn}${stage === 'files' ? ` ${styles.pulse}` : ''}`}
                onClick={() => reached('files') && goToStep2()}
                disabled={!reached('files')}
              >
                {t('ui.next')}
              </button>
            )}
          </div>
        </div>
      </div>

      {stage === 'loading' && (
        <div className={styles.overlay}>
          <div className={styles.loadCard}>
            <div className={styles.loadHead}>
              <strong className={styles.loadTitle}>
                <SparkleIcon size={15} /> {t('loading.title')}
              </strong>
              <span className={styles.iconBtn}>
                <XIcon size={15} />
              </span>
            </div>
            <p className={styles.loadDesc}>{t('loading.desc')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
