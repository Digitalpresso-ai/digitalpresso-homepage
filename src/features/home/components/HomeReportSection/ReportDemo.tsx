'use client';

import { Fragment, useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  BellIcon,
  BuildingIcon,
  ChatIcon,
  ClipboardIcon,
  HardHatIcon,
  HomeIcon,
} from '../HomeBlueprintSection/icons';
import {
  FileIcon,
  PlusIcon,
  SparkleIcon,
  XIcon,
} from '../HomeSafetySection/icons';
import { AlertCircleIcon, CalendarIcon, SaveIcon } from './icons';
import styles from './HomeReportSection.module.css';
import { ProductLogo } from '@/src/components/product/ProductLogo';
import { ProductAvatar } from '@/src/components/product/ProductAvatar';
import { useDemoScroll } from '@/src/hooks/useDemoScroll';

/* Steps of the demo, in order. Nothing advances on its own except the two
   modals, which resolve after the visitor has opted in. */
type Stage =
  | 'idle' // trade select invites a click
  | 'picking' // trade dropdown open
  | 'picked' // trade chosen; the name field invites a click
  | 'named' // report title written; AI 자동 작성 highlighted
  | 'confirm' // confirmation modal
  | 'loading' // "AI is writing" modal
  | 'filled'; // report body written

const ORDER: Stage[] = ['idle', 'picking', 'picked', 'named', 'confirm', 'loading', 'filled'];

const TRADES = [0, 1, 2, 3] as const;
const NAV_ICONS = [HomeIcon, ClipboardIcon, HardHatIcon, BuildingIcon];

export function ReportDemo() {
  const t = useTranslations('home.reportDemo');
  const [stage, setStage] = useState<Stage>('idle');
  const [trade, setTrade] = useState(0);
  const [started, setStarted] = useState(false);
  const { sheetRef, scrollToTop } = useDemoScroll<HTMLDivElement>();

  /* The loading modal resolves itself once the "AI" has finished — once the
     report body fills in below the fold, scroll back to the top so the
     visitor sees it fill in from the start instead of wherever they'd
     scrolled to while it was loading. */
  useEffect(() => {
    if (stage !== 'loading') return;
    const id = window.setTimeout(() => {
      setStage('filled');
      scrollToTop();
    }, 1900);
    return () => window.clearTimeout(id);
  }, [stage, scrollToTop]);

  const go = useCallback((next: Stage) => {
    setStarted(true);
    setStage(next);
  }, []);

  /* Registering the report sends the demo back to where it started. */
  const reset = useCallback(() => {
    setStage('idle');
    setTrade(0);
    setStarted(false);
  }, []);

  const choose = useCallback((i: number) => {
    setStarted(true);
    setTrade(i);
    setStage('picked');
  }, []);

  const reached = (s: Stage) => ORDER.indexOf(stage) >= ORDER.indexOf(s);
  const hasTrade = reached('picked');
  const hasName = reached('named');
  const filled = stage === 'filled';

  /* Until the AI pass has run, written cells show the product's own
     placeholder text. */
  const ph = (key: string) => t(`placeholders.${key}`);

  return (
    <div className={styles.app}>
      <header className={styles.appBar}>
        <ProductLogo className={styles.appLogo} />
        <span className={styles.appBarIcons}>
          <span className={styles.badgeWrap}>
            <BellIcon />
            <em className={styles.badge}>4</em>
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
            <i>/</i>
            <strong> {t('ui.breadcrumb.3')}</strong>
          </p>
          <p className={styles.sub}>{t('ui.sub')}</p>

          {/* ─── Toolbar: trade select + actions ─── */}
          <div className={styles.toolbar}>
            <div className={styles.selectWrap}>
              {!started && <span className={styles.startHint}>{t('ui.startHint')}</span>}
              <span className={styles.fieldLabel}>{t('ui.tradeLabel')}</span>
              <button
                type="button"
                className={`${styles.select}${hasTrade ? '' : ` ${styles.selectIdle}`}`}
                onClick={() => go(stage === 'picking' ? 'idle' : 'picking')}
              >
                <span className={hasTrade ? undefined : styles.placeholder}>
                  {hasTrade ? t(`trades.${trade}`) : t('ui.tradePlaceholder')}
                </span>
                <span
                  className={`${styles.caret}${stage === 'picking' ? ` ${styles.caretUp}` : ''}`}
                  aria-hidden
                />
              </button>

              {stage === 'picking' && (
                <ul className={styles.dropdown}>
                  {TRADES.map((i) => (
                    <li key={i}>
                      <button
                        type="button"
                        className={styles.dropdownItem}
                        onClick={() => choose(i)}
                      >
                        {t(`trades.${i}`)}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={styles.actions}>
              <span className={styles.ghostBtn}>
                <XIcon size={12} /> {t('ui.cancel')}
              </span>
              <span className={styles.ghostBtn}>
                <SaveIcon /> {t('ui.save')}
              </span>
              <button
                type="button"
                className={`${styles.aiBtn}${stage === 'named' ? ` ${styles.pulse}` : ''}`}
                onClick={() => hasName && go('confirm')}
                disabled={!hasName}
              >
                <SparkleIcon size={13} /> {t('ui.autoWrite')}
              </button>
              <button
                type="button"
                className={`${styles.primaryBtn}${filled ? ` ${styles.pulse}` : ''}`}
                onClick={() => filled && reset()}
                disabled={!filled}
              >
                <PlusIcon size={12} /> {t('ui.submit')}
              </button>
            </div>
          </div>

          {/* ─── Report sheet ─── */}
          <div className={styles.sheet} ref={sheetRef}>
            <div className={styles.sheetHead}>
              <div className={styles.nameWrap}>
                <span className={styles.fieldLabel}>{t('ui.nameLabel')}</span>
                <button
                  type="button"
                  className={`${styles.nameField}${hasTrade && !hasName ? ` ${styles.selectIdle}` : ''}`}
                  onClick={() => hasTrade && !hasName && go('named')}
                >
                  <span className={hasName ? undefined : styles.placeholder}>
                    {hasName ? t('ui.reportName') : t('ui.namePlaceholder')}
                  </span>
                </button>
              </div>

              <table className={styles.signTable}>
                <tbody>
                  <tr>
                    <th>{t('ui.signOwner')}</th>
                    <th>{t('ui.signCheck')}</th>
                  </tr>
                  <tr>
                    <td>{t('ui.signOwnerName')}</td>
                    <td>{t('ui.signCheckName')}</td>
                  </tr>
                  <tr>
                    <td />
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.dropZone}>
              <p>{t('ui.dropText')}</p>
              <p className={styles.formats}>{t('ui.formats')}</p>
              <span className={styles.primaryBtn}>
                <FileIcon /> {t('ui.pick')}
              </span>
            </div>

            <div className={filled ? styles.report : undefined}>
              {/* 1. 작업 사항 */}
              <h6 className={styles.sectionTitle}>1. {t('sections.work')}</h6>
              <table className={styles.grid}>
                <tbody>
                  <tr>
                    <th className={styles.gridHead}>{t('fields.project')}</th>
                    <td className={styles.gridCell}>
                      <span className={styles.box}>{t('header.project')}</span>
                    </td>
                    <th className={styles.gridHead}>{t('fields.date')}</th>
                    <td className={styles.gridCell}>
                      <span className={`${styles.box} ${styles.dateBox}`}>
                        <span>{t('header.date')}</span>
                        <CalendarIcon />
                      </span>
                    </td>
                    <th className={styles.gridHead}>{t('fields.weather')}</th>
                    <td className={styles.gridCell}>
                      <span className={styles.box}>{t('header.weather')}</span>
                    </td>
                  </tr>
                  <tr>
                    <th className={styles.gridHead}>{t('fields.today')}</th>
                    <td className={styles.gridCell}>
                      <span
                        className={`${styles.box} ${styles.tall}${filled ? '' : ` ${styles.empty}`}`}
                      >
                        {filled ? t(`mock.${trade}.today`) : ph('today')}
                      </span>
                    </td>
                    <th className={styles.gridHead}>{t('fields.tomorrow')}</th>
                    <td className={styles.gridCell} colSpan={3}>
                      <span
                        className={`${styles.box} ${styles.tall}${filled ? '' : ` ${styles.empty}`}`}
                      >
                        {filled ? t(`mock.${trade}.tomorrow`) : ph('tomorrow')}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* 2. 투입 인원 현황 */}
              <h6 className={styles.sectionTitle}>2. {t('sections.labor')}</h6>
              <table className={styles.grid}>
                <tbody>
                  <tr>
                    {(['prev', 'cur', 'total'] as const).map((k) => (
                      <Fragment key={k}>
                        <th className={styles.gridHead}>{t(`fields.${k}`)}</th>
                        <td className={styles.gridCell}>
                          <span className={`${styles.box}${filled ? '' : ` ${styles.empty}`}`}>
                            {filled ? t(`mock.${trade}.labor.${k}`) : ph(k)}
                          </span>
                        </td>
                      </Fragment>
                    ))}
                  </tr>
                </tbody>
              </table>

              {/* 3. 자재 투입 현황 */}
              <h6 className={styles.sectionTitle}>3. {t('sections.material')}</h6>
              <table className={styles.grid}>
                <tbody>
                  <tr>
                    <th className={styles.gridHead}>{t('fields.item')}</th>
                    <td className={styles.gridCell}>
                      <span className={`${styles.box}${filled ? '' : ` ${styles.empty}`}`}>
                        {filled ? t(`mock.${trade}.material.item`) : ph('item')}
                      </span>
                    </td>
                    <th className={`${styles.gridHead} ${styles.qtyHead}`} rowSpan={3}>
                      {t('fields.qty')}
                    </th>
                    <th className={styles.gridHead}>{t('fields.prev')}</th>
                    <td className={styles.gridCell}>
                      <span className={`${styles.box}${filled ? '' : ` ${styles.empty}`}`}>
                        {filled ? t(`mock.${trade}.material.prev`) : ph('mPrev')}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th className={styles.gridHead}>{t('fields.spec')}</th>
                    <td className={styles.gridCell}>
                      <span className={`${styles.box}${filled ? '' : ` ${styles.empty}`}`}>
                        {filled ? t(`mock.${trade}.material.spec`) : ph('spec')}
                      </span>
                    </td>
                    <th className={styles.gridHead}>{t('fields.cur')}</th>
                    <td className={styles.gridCell}>
                      <span className={`${styles.box}${filled ? '' : ` ${styles.empty}`}`}>
                        {filled ? t(`mock.${trade}.material.cur`) : ph('mCur')}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th className={styles.gridHead}>{t('fields.unit')}</th>
                    <td className={styles.gridCell}>
                      <span className={`${styles.box}${filled ? '' : ` ${styles.empty}`}`}>
                        {filled ? t(`mock.${trade}.material.unit`) : ph('unit')}
                      </span>
                    </td>
                    <th className={styles.gridHead}>{t('fields.total')}</th>
                    <td className={styles.gridCell}>
                      <span className={`${styles.box}${filled ? '' : ` ${styles.empty}`}`}>
                        {filled ? t(`mock.${trade}.material.total`) : ph('mTotal')}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className={styles.addRow}>
                <span className={styles.addBtn}>
                  <PlusIcon size={11} /> {t('ui.addMaterial')}
                </span>
              </p>

              {/* 4. 장비 투입 현황 */}
              <h6 className={styles.sectionTitle}>4. {t('sections.equip')}</h6>
              <table className={styles.grid}>
                <tbody>
                  <tr>
                    <th className={styles.gridHead}>{t('fields.equipName')}</th>
                    <td className={styles.gridCell}>
                      <span className={`${styles.box}${filled ? '' : ` ${styles.empty}`}`}>
                        {filled ? t(`mock.${trade}.equip.name`) : ph('equipName')}
                      </span>
                    </td>
                    <th className={styles.gridHead}>{t('fields.prev')}</th>
                    <td className={styles.gridCell}>
                      <span className={`${styles.box}${filled ? '' : ` ${styles.empty}`}`}>
                        {filled ? t(`mock.${trade}.equip.prev`) : ph('ePrev')}
                      </span>
                    </td>
                    <th className={`${styles.gridHead} ${styles.qtyHead}`} rowSpan={3}>
                      {t('fields.equipWork')}
                    </th>
                    <td className={styles.gridCell} rowSpan={3}>
                      <span
                        className={`${styles.box} ${styles.tall}${filled ? '' : ` ${styles.empty}`}`}
                      >
                        {filled ? t(`mock.${trade}.equip.work`) : ph('equipWork')}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th className={styles.gridHead} rowSpan={2}>
                      {t('fields.spec')}
                    </th>
                    <td className={styles.gridCell} rowSpan={2}>
                      <span className={`${styles.box}${filled ? '' : ` ${styles.empty}`}`}>
                        {filled ? t(`mock.${trade}.equip.spec`) : ph('spec')}
                      </span>
                    </td>
                    <th className={styles.gridHead}>{t('fields.cur')}</th>
                    <td className={styles.gridCell}>
                      <span className={`${styles.box}${filled ? '' : ` ${styles.empty}`}`}>
                        {filled ? t(`mock.${trade}.equip.cur`) : ph('eCur')}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th className={styles.gridHead}>{t('fields.total')}</th>
                    <td className={styles.gridCell}>
                      <span className={`${styles.box}${filled ? '' : ` ${styles.empty}`}`}>
                        {filled ? t(`mock.${trade}.equip.total`) : ph('eTotal')}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className={styles.addRow}>
                <span className={styles.addBtn}>
                  <PlusIcon size={11} /> {t('ui.addEquip')}
                </span>
              </p>

              {/* 5. 특기사항 */}
              <h6 className={styles.sectionTitle}>5. {t('sections.note')}</h6>
              <table className={styles.grid}>
                <tbody>
                  <tr>
                    <th className={styles.gridHead}>{t('fields.note')}</th>
                    <td className={styles.gridCell} colSpan={5}>
                      <span
                        className={`${styles.box} ${styles.tall}${filled ? '' : ` ${styles.empty}`}`}
                      >
                        {filled ? t(`mock.${trade}.note`) : ph('note')}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Confirmation modal ─── */}
      {stage === 'confirm' && (
        <div className={styles.overlay}>
          <div className={styles.confirmCard}>
            <div className={styles.loadHead}>
              <strong className={styles.confirmTitle}>
                <AlertCircleIcon /> {t('confirm.title')}
              </strong>
              <button type="button" className={styles.iconBtn} onClick={() => go('named')}>
                <XIcon size={15} />
              </button>
            </div>
            <p className={styles.loadDesc}>{t('confirm.desc')}</p>
            <div className={styles.confirmFoot}>
              <button type="button" className={styles.ghostBtn} onClick={() => go('named')}>
                {t('confirm.cancel')}
              </button>
              <button
                type="button"
                className={`${styles.primaryBtn} ${styles.pulse}`}
                onClick={() => go('loading')}
              >
                {t('confirm.ok')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Loading modal ─── */}
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
