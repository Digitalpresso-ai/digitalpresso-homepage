'use client';

import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  BellIcon,
  BuildingIcon,
  ChatIcon,
  ClipboardIcon,
  HardHatIcon,
  HomeIcon,
} from '../HomeBlueprintSection/icons';
import { DownloadIcon, LogoutIcon } from './icons';
import { BilledDonut, CostGauge, ProgressRings, TrendBars } from './charts';
import styles from './HomeScheduleSection.module.css';
import { ProductLogo } from '@/src/components/product/ProductLogo';
import { ProductAvatar } from '@/src/components/product/ProductAvatar';

/* The demo has three resting states and never advances on its own. */
type View = 'empty' | 'board' | 'detail';

const NAV_ICONS = [HomeIcon, ClipboardIcon, HardHatIcon, BuildingIcon];
const MENU = [0, 1, 2, 3, 4] as const;
const PROJECTS = [0] as const;
const ROWS = Array.from({ length: 14 }, (_, i) => i);

/* The schedule window: five months, each drawn as a fixed number of day
   columns so the header groups line up with the bar track. */
const MONTHS = [0, 1, 2, 3, 4] as const;
const DAYS_PER_MONTH = 30;
const SPAN_DAYS = MONTHS.length * DAYS_PER_MONTH;

/* Gantt bar geometry per row: [start day offset, length in days, colour].
   Offsets are days from 1 January. */
const BARS: [number, number, string][] = [
  [0, 41, '#1d4ed8'],
  [5, 38, '#38bdf8'],
  [21, 30, '#34d399'],
  [11, 48, '#a855f7'],
  [17, 13, '#1d4ed8'],
  [0, 41, '#1d4ed8'],
  [5, 38, '#38bdf8'],
  [34, 52, '#1d4ed8'],
  [48, 44, '#38bdf8'],
  [70, 36, '#34d399'],
  [62, 58, '#a855f7'],
  [88, 40, '#1d4ed8'],
  [104, 34, '#38bdf8'],
  [118, 30, '#34d399'],
];

/* The chart figures, kept next to the copy that labels them. */
const BILLED = 0.584;
const DONE = 0.55;
const PLAN = 0.4;
const COST_RATIO = 0.6636;

export function ScheduleDemo() {
  const t = useTranslations('home.scheduleDemo');
  const [view, setView] = useState<View>('empty');
  const [picking, setPicking] = useState(false);
  const [project, setProject] = useState<number | null>(null);

  const choose = useCallback((i: number) => {
    setProject(i);
    setPicking(false);
    setView('board');
  }, []);

  /* Everything below the picker stays laid out; it fills in once a project
     has been chosen. */
  const picked = project !== null;
  const trendValues = [14, 24, 35, 47, 58.4];
  const trendAxis = trendValues.map((_, i) => t(`charts.trend.axis.${i}`));

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
                  className={`${styles.railItem}${i === 0 ? ` ${styles.railActive}` : ''}`}
                >
                  <Icon />
                  {t(`ui.nav.${i}`)}
                </span>
              ))}
            </nav>
            <ul className={styles.sideMenu}>
              {MENU.map((i) => (
                <li key={i}>
                  <span className={i === 0 ? styles.sideMenuActive : styles.sideMenuItem}>
                    {i === 0 && '✓ '}
                    {t(`ui.menu.${i}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.logoutRow}>
            <LogoutIcon /> {t('ui.logout')}
          </div>
        </div>

        {/* ─── Schedule detail view ─── */}
        {view === 'detail' ? (
          <div className={styles.main}>
            <div className={styles.detailHead}>
              <p className={styles.breadcrumb}>
                {t('detailView.breadcrumb.0')} <i>/</i> {t('detailView.breadcrumb.1')} <i>/</i>
                <strong> {t('detailView.breadcrumb.2')}</strong>
              </p>
              <button type="button" className={styles.backBtn} onClick={() => setView('board')}>
                ← {t('ui.back')}
              </button>
            </div>
            <p className={styles.sub}>{t('detailView.sub')}</p>

            <div className={styles.detailTitleRow}>
              <h5 className={styles.detailTitle}>
                {project !== null ? t(`projects.${project}`) : ''}
                <span className={styles.chip}>{t('detailView.status')}</span>
              </h5>
              <span className={styles.ghostBtn}>
                <DownloadIcon /> {t('detailView.print')}
              </span>
            </div>

            <div className={styles.ganttWrap}>
              <Gantt />
            </div>
          </div>
        ) : (
          /* ─── Dashboard view ─── */
          <div className={styles.main}>
            <h5 className={styles.pageTitle}>{t('ui.title')}</h5>
            <p className={styles.sub}>{t('ui.sub')}</p>

            <div className={styles.dashGrid}>
              {/* Left column: attendance and notice board */}
              <div className={styles.dashLeft}>
                <section className={styles.card}>
                  <div className={styles.cardHead}>
                    <h6 className={styles.cardTitle}>{t('attendance.title')}</h6>
                    <span className={styles.cardLink}>{t('attendance.link')}</span>
                  </div>
                  <div className={styles.stampRow}>
                    <span className={styles.stamp}>{t('attendance.stamp')}</span>
                    <span className={styles.stateTag}>{t('attendance.state')}</span>
                  </div>
                  <div className={styles.clockBox}>
                    {(['in', 'out'] as const).map((k) => (
                      <div key={k} className={styles.clockCell}>
                        <span className={styles.clockLabel}>{t(`attendance.${k}`)}</span>
                        <span className={styles.clockValue}>–</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.clockBtns}>
                    <span className={styles.outlineBtn}>{t('attendance.checkIn')}</span>
                    <span className={styles.mutedBtn}>{t('attendance.checkOut')}</span>
                  </div>
                </section>

                <section className={styles.card}>
                  <div className={styles.cardHead}>
                    <h6 className={styles.cardTitle}>{t('board.title')}</h6>
                    <span className={styles.cardLink}>{t('board.link')}</span>
                  </div>
                  <p className={styles.boardEmpty}>{t('board.empty')}</p>
                  <p className={styles.pager}>
                    <span>‹</span> {t('board.page')} <span>›</span>
                  </p>
                </section>
              </div>

              {/* Right column: project picker, schedule, cash flow */}
              <div className={styles.dashRight}>
                <div className={styles.pickRow}>
                  <span className={styles.pickTitle}>{t('ui.projectLabel')}</span>
                  <div className={styles.selectWrap}>
                    {view === 'empty' && (
                      <span className={styles.startHint}>{t('ui.startHint')}</span>
                    )}
                    <span className={styles.fieldLabel}>{t('ui.projectLabel')}</span>
                    <button
                      type="button"
                      className={`${styles.select}${project === null ? ` ${styles.selectIdle}` : ''}`}
                      onClick={() => setPicking((p) => !p)}
                    >
                      <span className={project === null ? styles.placeholder : undefined}>
                        {project === null
                          ? t('ui.projectPlaceholder')
                          : t(`projects.${project}`)}
                      </span>
                      <span
                        className={`${styles.caret}${picking ? ` ${styles.caretUp}` : ''}`}
                        aria-hidden
                      />
                    </button>
                    {picking && (
                      <ul className={styles.dropdown}>
                        {PROJECTS.map((i) => (
                          <li key={i}>
                            <button
                              type="button"
                              className={styles.dropdownItem}
                              onClick={() => choose(i)}
                            >
                              {t(`projects.${i}`)}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* The section structure is the same before and after a
                    project is picked; only the contents of each block change. */}
                <div className={styles.boardBody}>
                  <div className={styles.blockHead}>
                    <h6 className={styles.blockTitle}>{t('ui.schedule')}</h6>
                    <button
                      type="button"
                      className={`${styles.linkBtn}${picked ? ` ${styles.pulseText}` : ''}`}
                      onClick={() => picked && setView('detail')}
                      disabled={!picked}
                    >
                      {t('ui.detail')}
                    </button>
                  </div>
                  {picked ? (
                    <div className={styles.ganttWrap}>
                      <Gantt />
                    </div>
                  ) : (
                    <p className={styles.placeholderBox}>{t('ui.empty')}</p>
                  )}

                  <h6 className={styles.blockTitle}>{t('ui.fund')}</h6>
                  {picked ? (
                    <div className={styles.chartGrid}>
                      {/* 기청구 금액 및 잔액 */}
                      <section className={styles.chartCard}>
                        <h6 className={styles.chartTitle}>{t('charts.billed.title')}</h6>
                        <p className={styles.chartTotal}>{t('charts.billed.total')}</p>
                        <BilledDonut billed={BILLED} billedPct={t('charts.billed.billedPct')} />
                        <ul className={styles.legend}>
                          <li>
                            <i className={styles.swatchBlue} /> {t('charts.billed.billedLabel')}
                          </li>
                          <li>
                            <i className={styles.swatchGrey} /> {t('charts.billed.restLabel')}
                          </li>
                        </ul>
                      </section>

                      {/* 프로젝트 진척도 */}
                      <section className={styles.chartCard}>
                        <h6 className={styles.chartTitle}>{t('charts.progress.title')}</h6>
                        {/* Keeps this donut vertically aligned with the billed
                            card's, whose title is followed by a .chartTotal
                            line before its donut. */}
                        <p className={styles.chartTotal} aria-hidden>
                          &nbsp;
                        </p>
                        <ProgressRings done={DONE} plan={PLAN} />
                        <ul className={styles.legend}>
                          <li>
                            <i className={styles.swatchBlue} /> {t('charts.progress.doneLabel')}
                          </li>
                          <li>
                            <i className={styles.swatchSky} /> {t('charts.progress.planLabel')}
                          </li>
                        </ul>
                      </section>

                      {/* 최근 회차별 누계기성 추이 */}
                      <section className={styles.chartCard}>
                        <h6 className={styles.chartTitle}>{t('charts.trend.title')}</h6>
                        <TrendBars
                          values={trendValues}
                          axis={trendAxis}
                          contract={t('charts.trend.contract')}
                        />
                      </section>

                      {/* 목표 원가 대비 공정률 */}
                      <section className={styles.chartCard}>
                        <h6 className={styles.chartTitle}>{t('charts.cost.title')}</h6>
                        <div className={styles.gaugeWrap}>
                          <span className={styles.gaugeMin}>{t('charts.cost.min')}</span>
                          <span className={styles.gaugeMid}>{t('charts.cost.mid')}</span>
                          <span className={styles.gaugeMax}>{t('charts.cost.max')}</span>
                          <CostGauge ratio={COST_RATIO} value={t('charts.cost.value')} />
                        </div>
                        <dl className={styles.costGrid}>
                          {[0, 1, 2, 3].map((i) => (
                            <div key={i} className={styles.costItem}>
                              <dt>{t(`charts.cost.rows.${i}.0`)}</dt>
                              <dd>{t(`charts.cost.rows.${i}.1`)}</dd>
                            </div>
                          ))}
                        </dl>
                      </section>
                    </div>
                  ) : (
                    <div className={styles.chartGrid}>
                      {[0, 1, 2, 3].map((i) => (
                        <p key={i} className={styles.placeholderCard}>
                          {t('ui.empty')}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* The gantt table, shared by the dashboard preview and the detail view.
   The whole table scrolls together — no columns are frozen. */
function Gantt() {
  const t = useTranslations('home.scheduleDemo');
  const DAY_STEP = 2;
  const perMonth = DAYS_PER_MONTH / DAY_STEP;
  const cols = MONTHS.length * perMonth;

  return (
    <table className={styles.gantt}>
      <thead>
        <tr>
          <th className={styles.gTrade} rowSpan={2} colSpan={2}>
            {t('table.trade')}
          </th>
          <th className={styles.gPlan} colSpan={3}>
            {t('table.plan')}
          </th>
          {MONTHS.map((m) => (
            <th key={m} className={styles.gMonth} colSpan={perMonth}>
              {t(`table.months.${m}`)}
            </th>
          ))}
        </tr>
        <tr>
          <th className={`${styles.gCell} ${styles.gDate} ${styles.gDateStart}`}>
            {t('table.start')}
          </th>
          <th className={`${styles.gCell} ${styles.gDate} ${styles.gDateEnd}`}>
            {t('table.end')}
          </th>
          <th className={`${styles.gCell} ${styles.gDate} ${styles.gDateDays}`}>
            {t('table.days')}
          </th>
          {MONTHS.flatMap((m) =>
            Array.from({ length: perMonth }, (_, i) => (
              <th key={`${m}-${i}`} className={styles.gDay}>
                {i * DAY_STEP + 1}
              </th>
            )),
          )}
        </tr>
      </thead>
      <tbody>
        {ROWS.map((r) => {
          const trade = t(`rows.${r}.trade`);
          /* How many rows this trade heading covers, counting the unnamed rows
             that follow it. */
          const groupSize = (start: number) => {
            let n = 1;
            while (start + n < ROWS.length && !t(`rows.${start + n}.trade`)) n += 1;
            return n;
          };
          const [offset, span, tone] = BARS[r];
          const left = (offset / SPAN_DAYS) * 100;
          const width = Math.min(100 - left, (span / SPAN_DAYS) * 100);
          return (
            <tr key={r}>
              {trade && (
                <th className={styles.gTradeCell} rowSpan={groupSize(r)}>
                  {trade}
                </th>
              )}
              <td className={styles.gName}>{t(`rows.${r}.name`)}</td>
              <td className={`${styles.gCellBody} ${styles.gDate} ${styles.gDateStart}`}>
                {t(`rows.${r}.start`)}
              </td>
              <td className={`${styles.gCellBody} ${styles.gDate} ${styles.gDateEnd}`}>
                {t(`rows.${r}.end`)}
              </td>
              <td className={`${styles.gCellBody} ${styles.gDate} ${styles.gDateDays}`}>
                {t(`rows.${r}.days`)}
              </td>
              <td className={styles.gTrack} colSpan={cols}>
                <div className={styles.gTrackInner}>
                  <span
                    className={styles.gBar}
                    style={
                      {
                        '--bar-left': `${left}%`,
                        '--bar-width': `${width}%`,
                        '--bar-tone': tone,
                      } as React.CSSProperties
                    }
                  >
                    {t(`rows.${r}.task`)}
                  </span>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
