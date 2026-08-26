'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './HomeSafetySection.module.css';
import { ProductLogo } from '@/src/components/product/ProductLogo';
import { ProductAvatar } from '@/src/components/product/ProductAvatar';
import { useDemoScroll } from '@/src/hooks/useDemoScroll';
import {
  BellIcon,
  BuildingIcon,
  ChatIcon,
  ClipboardIcon,
  HardHatIcon,
  HomeIcon,
} from '../HomeBlueprintSection/icons';
import {
  CameraIcon,
  ChecklistIcon,
  FileIcon,
  ImagePlaceholderIcon,
  InfoCircleIcon,
  PlusIcon,
  RefreshIcon,
  SparkleIcon,
  XIcon,
} from './icons';

/* The demo walks one item through the real product flow. Each stage decides
   what is highlighted, which overlay is open, and how much has been filled. */
type Stage =
  | 'idle' // nothing chosen yet — the 불량 chip invites a click
  | 'fail' // 불량 chosen; detail fields appear, 사진 첨부 highlighted
  | 'upload' // attach screen, no files yet
  | 'uploaded' // files listed, 확인 waiting
  | 'aiAsk' // back on the form; AI 자동 작성 highlighted
  | 'aiLoading' // "내용 자동 입력 중…"
  | 'filled' // detail + action written; 안전 점검 등록 highlighted
  | 'sign' // signature modal, empty canvas
  | 'signed'; // signature drawn

const GROUPS = [
  { key: 0, items: [0, 1] },
  { key: 1, items: [0, 1] },
] as const;

const OPTIONS = [0, 1, 2] as const;

/* Stage order, used to ask "have we got at least this far?" */
const ORDER: Stage[] = [
  'idle',
  'fail',
  'upload',
  'uploaded',
  'aiAsk',
  'aiLoading',
  'filled',
  'sign',
  'signed',
];
const NAV_ICONS = [HomeIcon, ClipboardIcon, HardHatIcon, BuildingIcon];

export function SafetyDemo() {
  const t = useTranslations('home.safetyDemo');
  const [stage, setStage] = useState<Stage>('idle');
  const [started, setStarted] = useState(false);
  const { sheetRef, scrollToElement } = useDemoScroll<HTMLDivElement>();
  const detailRef = useRef<HTMLDivElement>(null);

  /* The AI-writing modal resolves itself once "writing" finishes. */
  useEffect(() => {
    if (stage !== 'aiLoading') return;
    const id = window.setTimeout(() => setStage('filled'), 1600);
    return () => window.clearTimeout(id);
  }, [stage]);

  const go = useCallback((next: Stage) => {
    setStarted(true);
    setStage(next);
  }, []);

  /* Choosing 불량 reveals the detail fields below the fold — bring just
     that card into view (not the sheet's actual bottom, which runs past it
     into the rest of the checklist). */
  const chooseFail = useCallback(() => {
    go('fail');
    scrollToElement(detailRef.current);
  }, [go, scrollToElement]);

  const reached = (s: Stage) => ORDER.indexOf(stage) >= ORDER.indexOf(s);

  const failChosen = reached('fail');
  const hasFiles = reached('uploaded');
  const isFilled = reached('filled');

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
            <em className={styles.badge}>1</em>
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
            <i>/</i>
            <strong> {t('ui.breadcrumb.3')}</strong>
          </p>
          <p className={styles.sub}>{t('ui.sub')}</p>

          <div className={styles.titleRow}>
            <h4 className={styles.docName}>
              {t('ui.name')} <em className={styles.chip}>{t('ui.status')}</em>
            </h4>
            <span className={styles.actions}>
              <span className={styles.ghostBtn}>
                <XIcon /> {t('ui.cancel')}
              </span>
              <button
                type="button"
                className={`${styles.primaryBtn}${isFilled && stage !== 'sign' && stage !== 'signed' ? ` ${styles.pulse}` : ''}`}
                onClick={() => go('sign')}
              >
                <PlusIcon /> {t('ui.register')}
              </button>
            </span>
          </div>

          <div className={styles.sheet} ref={sheetRef}>
            {/* ─── Assignment info ─── */}
            <section className={styles.block}>
              <span className={styles.blockIcon}>
                <InfoCircleIcon />
              </span>
              <div className={styles.blockBody}>
                <h5 className={styles.blockTitle}>{t('ui.infoTitle')}</h5>
                <dl className={styles.infoGrid}>
                  <div>
                    <dt>{t('ui.formLabel')}</dt>
                    <dd>{t('ui.formValue')}</dd>
                  </div>
                  <div>
                    <dt>{t('ui.assignLabel')}</dt>
                    <dd>{t('ui.assignValue')}</dd>
                  </div>
                </dl>
              </div>
            </section>

            <hr className={styles.divider} />

            {/* ─── Checklist ─── */}
            <section className={styles.block}>
              <span className={styles.blockIcon}>
                <ChecklistIcon />
              </span>
              <div className={styles.blockBody}>
                <h5 className={styles.blockTitle}>{t('ui.writeTitle')}</h5>
                <p className={styles.blockDesc}>{t('ui.writeDesc')}</p>

                {GROUPS.map((group) => (
                  <div key={group.key} className={styles.group}>
                    <h6 className={styles.groupTitle}>{t(`groups.${group.key}.title`)}</h6>
                    {group.items.map((item) => {
                      /* Only the first item of the first group is interactive. */
                      const live = group.key === 0 && item === 0;
                      return (
                        <div key={item} className={styles.item}>
                          <p className={styles.question}>{t(`groups.${group.key}.items.${item}`)}</p>
                          <div className={styles.itemRow}>
                            <div className={styles.options}>
                              {live && !started && (
                                <span className={styles.startHint}>{t('ui.startHint')}</span>
                              )}
                              {OPTIONS.map((o) => {
                                /* Starts on 양호; picking 불량 moves the fill
                                   across and leaves 양호 grey. */
                                const active = live
                                  ? (failChosen ? o === 1 : o === 0)
                                  : o === 0;
                                const invite = live && !failChosen && o === 1;
                                return (
                                  <button
                                    key={o}
                                    type="button"
                                    className={`${styles.option}${active ? ` ${styles.optionOn}` : ''}${invite ? ` ${styles.pulse}` : ''}`}
                                    onClick={() => live && (o === 1 ? chooseFail() : go('idle'))}
                                    disabled={!live}
                                  >
                                    {t(`options.${o}`)}
                                  </button>
                                );
                              })}
                            </div>
                            <button
                              type="button"
                              className={`${styles.photoBtn}${live && failChosen && !hasFiles ? ` ${styles.photoBtnOn} ${styles.pulse}` : ''}`}
                              onClick={() => live && failChosen && go('upload')}
                              disabled={!live}
                            >
                              <CameraIcon /> {t('ui.photo')}
                            </button>
                          </div>

                          {/* Detail fields appear once 불량 is chosen */}
                          {live && failChosen && (
                            <div className={styles.detail} ref={detailRef}>
                              {hasFiles && (
                                <div className={styles.thumbs}>
                                  <span className={styles.thumb}>
                                    <ImagePlaceholderIcon size={20} />
                                  </span>
                                  <span className={styles.thumb}>
                                    <ImagePlaceholderIcon size={20} />
                                  </span>
                                </div>
                              )}
                              <label className={styles.field}>
                                <span className={styles.fieldLabel}>{t('ui.detailLabel')}</span>
                                <span
                                  className={`${styles.fieldBox}${isFilled ? '' : ` ${styles.fieldEmpty}`}`}
                                >
                                  {isFilled ? t('ai.detail') : t('ui.detailPlaceholder')}
                                </span>
                              </label>
                              <label className={styles.field}>
                                <span className={styles.fieldLabel}>{t('ui.actionLabel')}</span>
                                <span
                                  className={`${styles.fieldBox}${isFilled ? '' : ` ${styles.fieldEmpty}`}`}
                                >
                                  {isFilled ? t('ai.action') : t('ui.actionPlaceholder')}
                                </span>
                              </label>
                              <p className={styles.hint}>{t('ui.hint')}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* ─── Overlays ─── */}
      {(stage === 'upload' || stage === 'uploaded') && (
        <div className={styles.overlay}>
          <div className={styles.uploadCard}>
            <div className={styles.uploadHead}>
              <span className={styles.blockIcon}>
                <CameraIcon size={22} />
              </span>
              <div>
                <h5 className={styles.blockTitle}>{t('upload.title')}</h5>
                <p className={styles.blockDesc}>{t('upload.desc')}</p>
              </div>
            </div>
            <p className={styles.uploadItemLabel}>{t('upload.itemLabel')}</p>
            <p className={styles.uploadItem}>{t('groups.0.items.0')}</p>

            <div className={styles.dropZone}>
              <p>{t('upload.dropText')}</p>
              <p className={styles.formats}>{t('upload.formats')}</p>
              <button
                type="button"
                className={`${styles.primaryBtn}${stage === 'upload' ? ` ${styles.pulse}` : ''}`}
                onClick={() => go('uploaded')}
              >
                <FileIcon /> {t('upload.pick')}
              </button>
            </div>

            {stage === 'uploaded' && (
              <ul className={styles.fileList}>
                {[0, 1].map((f) => (
                  <li key={f}>
                    <span>{t(`upload.files.${f}`)}</span>
                    <XIcon size={12} />
                  </li>
                ))}
              </ul>
            )}

            <div className={styles.cardFoot}>
              <span className={styles.ghostBtn}>
                <XIcon /> {t('upload.cancel')}
              </span>
              <button
                type="button"
                className={`${styles.primaryBtn}${stage === 'uploaded' ? ` ${styles.pulse}` : ''}`}
                onClick={() => go('aiAsk')}
              >
                {t('upload.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {stage === 'aiAsk' && (
        <div className={styles.overlay}>
          <div className={styles.askCard}>
            <div className={styles.askHead}>
              <strong>{t('ai.askTitle')}</strong>
              <button type="button" className={styles.iconBtn} onClick={() => go('filled')}>
                <XIcon size={15} />
              </button>
            </div>
            <p className={styles.askDesc}>{t('ai.askDesc')}</p>
            <div className={styles.cardFoot}>
              <button type="button" className={styles.ghostBtn} onClick={() => go('filled')}>
                {t('ai.manual')}
              </button>
              <button
                type="button"
                className={`${styles.primaryBtn} ${styles.pulse}`}
                onClick={() => go('aiLoading')}
              >
                <SparkleIcon /> {t('ai.auto')}
              </button>
            </div>
          </div>
        </div>
      )}

      {stage === 'aiLoading' && (
        <div className={styles.overlay}>
          <div className={styles.loadCard}>
            <div className={styles.loadHead}>
              <strong className={styles.loadTitle}>
                <SparkleIcon size={15} /> {t('ai.loadingTitle')}
              </strong>
              <span className={styles.iconBtn}>
                <XIcon size={15} />
              </span>
            </div>
            <p className={styles.loadDesc}>{t('ai.loadingDesc')}</p>
          </div>
        </div>
      )}

      {(stage === 'sign' || stage === 'signed') && (
        <div className={styles.overlay}>
          <div className={styles.signCard}>
            <div className={styles.askHead}>
              <strong>{t('sign.title')}</strong>
              <button type="button" className={styles.iconBtn} onClick={() => go('filled')}>
                <XIcon size={15} />
              </button>
            </div>
            <p className={styles.askDesc}>{t('sign.desc')}</p>

            <button
              type="button"
              className={`${styles.signPad}${stage === 'sign' ? ` ${styles.pulse}` : ''}`}
              onClick={() => go('signed')}
            >
              {stage === 'signed' ? (
                <svg viewBox="0 0 220 90" className={styles.signature} aria-hidden>
                  {/* D */}
                  <path
                    className={styles.signPath}
                    d="M52 68c1-24 2-36 3-42 12-2 26 1 32 11 6 11 2 24-9 29-7 3-16 3-24 2"
                  />
                  {/* P */}
                  <path
                    className={styles.signPath}
                    d="M104 72c2-26 3-38 4-44 11-2 24 0 28 9 4 10-6 17-17 18-5 1-9 1-11 1"
                  />
                  {/* underline flourish */}
                  <path className={styles.signPath} d="M34 80c42 9 100 7 146-7" />
                </svg>
              ) : (
                <span className={styles.signHint}>{t('sign.hint')}</span>
              )}
            </button>

            <button type="button" className={styles.resignBtn} onClick={() => go('sign')}>
              <RefreshIcon /> {t('sign.resign')}
            </button>

            <div className={styles.cardFoot}>
              <span className={styles.ghostBtn}>{t('sign.cancel')}</span>
              <button
                type="button"
                className={`${styles.primaryBtn}${stage === 'signed' ? ` ${styles.pulse}` : ''}`}
                onClick={() => go('idle')}
              >
                {t('sign.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
