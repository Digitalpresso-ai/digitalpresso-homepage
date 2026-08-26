'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './HomeBlueprintSection.module.css';
import { ProductLogo } from '@/src/components/product/ProductLogo';
import { ProductAvatar } from '@/src/components/product/ProductAvatar';
import {
  BellIcon,
  BuildingIcon,
  ChatIcon,
  ClipboardIcon,
  HardHatIcon,
  HomeIcon,
  ChevronIcon,
  CloseIcon,
  InfoIcon,
  JumpIcon,
  LayersIcon,
  PenIcon,
  PinIcon,
  SearchIcon,
} from './icons';

/* Positions are percentages of the drawing area, so they track any resize. */
const TAGS = [
  { id: 0, x: 55.5, y: 33 },
  { id: 1, x: 78, y: 62 },
  { id: 2, x: 30, y: 74 },
] as const;

const MARKERS = [{ id: 0, x: 43, y: 62, page: 1 }] as const;

const NAV_ICONS = [HomeIcon, ClipboardIcon, HardHatIcon, BuildingIcon];
const PAGE_INDEXES = [0, 1, 2] as const;

/** Which popover is open. */
type Open =
  | { kind: 'none' }
  | { kind: 'info' }
  | { kind: 'tag'; id: number }
  | { kind: 'marker'; id: number };

export function BlueprintDemo() {
  const t = useTranslations('home.blueprintDemo');
  const [open, setOpen] = useState<Open>({ kind: 'none' });
  const [page, setPage] = useState(2);
  const [tab, setTab] = useState<'tag' | 'marker'>('tag');
  /* Each highlight clears on its own, so using one target does not stop the
     others from inviting a click. */
  const [usedInfo, setUsedInfo] = useState(false);
  const [usedPin, setUsedPin] = useState(false);
  const [usedMarker, setUsedMarker] = useState(false);

  const interact = useCallback((next: Open) => {
    setOpen(next);
  }, []);

  const toggle = useCallback(
    (next: Open) => {
      setOpen((prev) => {
        const sameKind = prev.kind === next.kind;
        const sameId =
          'id' in prev && 'id' in next ? prev.id === (next as { id: number }).id : true;
        return sameKind && sameId ? { kind: 'none' } : next;
      });
    },
    [],
  );

  /* The card's "시공 기록" action takes the visitor to the record section
     further down the page, mirroring how the product links the two. */
  const goToRecord = useCallback(() => {
    setOpen({ kind: 'none' });
    document
      .getElementById('construction-record')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const goToDefect = useCallback(() => {
    setOpen({ kind: 'none' });
    document
      .getElementById('defect-request')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const jumpPage = useCallback((to: number) => {
    setPage(to);
    setOpen({ kind: 'none' });
  }, []);

  /* Selecting a tab also swaps which overlay stays open. */
  const selectTab = useCallback((next: 'tag' | 'marker') => {
    setTab(next);
    setOpen({ kind: 'none' });
  }, []);

  return (
    <div
      className={styles.app}
      onClick={() => interact({ kind: 'none' })}
    >
      {/* ─── Product chrome ─── */}
      <div className={styles.window}>
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
            {t('ui.breadcrumb.0')} <i>/</i> {t('ui.breadcrumb.1')} <i>/</i>
            <strong> {t('ui.breadcrumb.2')}</strong>
          </p>

          <div className={styles.titleRow}>
            <h4 className={styles.projectName}>
              {t('ui.projectName')} <em className={styles.chip}>{t('ui.status')}</em>
            </h4>
            <span className={styles.ghostBtn}>
              <PenIcon /> {t('ui.manageBtn')}
            </span>
          </div>

          <div className={styles.panels}>
            {/* ─── Tag list ─── */}
            <aside className={styles.listPanel}>
              <p className={styles.panelTitle}>{t('ui.listTitle')}</p>
              <div className={styles.radios}>
                <button
                  type="button"
                  className={tab === 'tag' ? styles.radioOn : styles.radioOff}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectTab('tag');
                  }}
                >
                  <i /> {t('ui.tabTag')}
                </button>
                <button
                  type="button"
                  className={tab === 'marker' ? styles.radioOn : styles.radioOff}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectTab('marker');
                  }}
                >
                  <i /> {t('ui.tabMarker')}
                </button>
              </div>
              <span className={styles.search}>
                <SearchIcon />
                {tab === 'tag' ? t('ui.searchPlaceholder') : t('ui.searchMarkerPlaceholder')}
              </span>
              <ul className={styles.tagList}>
                {tab === 'tag'
                  ? TAGS.map((tag) => (
                      <li key={tag.id}>
                        <button
                          type="button"
                          className={`${styles.tagRow}${open.kind === 'tag' && open.id === tag.id ? ` ${styles.tagRowActive}` : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggle({ kind: 'tag', id: tag.id });
                          }}
                        >
                          <strong>{t(`tags.${tag.id}.name`)}</strong>
                          <span>{t(`tags.${tag.id}.page`)}</span>
                        </button>
                      </li>
                    ))
                  : MARKERS.map((m) => (
                      <li key={m.id}>
                        <button
                          type="button"
                          className={`${styles.tagRow}${open.kind === 'marker' && open.id === m.id ? ` ${styles.tagRowActive}` : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggle({ kind: 'marker', id: m.id });
                          }}
                        >
                          <strong>{t(`markers.${m.id}.name`)}</strong>
                          <span>{t(`markers.${m.id}.target`)}</span>
                        </button>
                      </li>
                    ))}
              </ul>
            </aside>

            {/* ─── Drawing viewer ─── */}
            <section className={styles.viewerPanel}>
              <div className={styles.viewerHead}>
                <p className={styles.fileName}>{t('ui.fileName')}</p>
                <span className={styles.viewerActions}>
                  <button
                    type="button"
                    className={`${styles.infoBtn}${usedInfo ? '' : ` ${styles.infoIdle}`}`}
                    aria-label={t('ui.infoLabel')}
                    onClick={(e) => {
                      e.stopPropagation();
                      setUsedInfo(true);
                      toggle({ kind: 'info' });
                    }}
                  >
                    <InfoIcon />
                  </button>
                  <span className={styles.ghostBtn}>
                    <LayersIcon /> {t('ui.versionBtn')}
                  </span>
                </span>
              </div>

              <div className={styles.canvas}>
                <span className={styles.sheet}>
                  <Image
                    src="/images/main-blueprint.webp"
                    alt={t('ui.blueprintAlt')}
                    fill
                    sizes="(max-width: 799px) 100vw, (max-width: 1279px) 70vw, 900px"
                    quality={80}
                    placeholder="blur"
                    blurDataURL="data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADQAQCdASoUAAsAPpE8mUiloyKhMAgAsBIJZQDE7AC0f8/wOqL8QAD+/oGP//9OgAynEOaEwWkE0GjeaFsQ/vX9nviyd8/6bfr5vv9BcNVA"
                    className={styles.blueprint}
                  />
                </span>

                <span className={styles.pager}>
                  <ChevronIcon dir="left" />
                  <em>
                    <b>{page}</b>/3
                  </em>
                  <ChevronIcon dir="right" />
                </span>

                {/* Location pins */}
                {TAGS.map((tag) => {
                  const active = open.kind === 'tag' && open.id === tag.id;
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      className={`${styles.pin}${active ? ` ${styles.pinActive}` : ''}${!usedPin && tag.id === 0 ? ` ${styles.pinIdle}` : ''}`}
                      style={{ left: `${tag.x}%`, top: `${tag.y}%` }}
                      aria-label={t(`tags.${tag.id}.name`)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setUsedPin(true);
                        toggle({ kind: 'tag', id: tag.id });
                      }}
                    >
                      <PinIcon />
                    </button>
                  );
                })}

                {/* Page-jump markers */}
                {MARKERS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`${styles.marker}${open.kind === 'marker' && open.id === m.id ? ` ${styles.markerActive}` : ''}${usedMarker ? '' : ` ${styles.markerIdle}`}`}
                    style={{ left: `${m.x}%`, top: `${m.y}%` }}
                    aria-label={t(`markers.${m.id}.name`)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setUsedMarker(true);
                      toggle({ kind: 'marker', id: m.id });
                    }}
                  >
                    <JumpIcon />
                  </button>
                ))}

                {!usedPin && (
                  <span
                    className={styles.startHint}
                    style={{ left: `${TAGS[0].x}%`, top: `${TAGS[0].y}%` }}
                  >
                    {t('ui.startHint')}
                  </span>
                )}

                {/* Tag popover */}
                {open.kind === 'tag' && (
                  <div
                    className={`${styles.popover} ${TAGS[open.id].x > 50 ? styles.popLeft : styles.popRight}`}
                    style={{
                      left: `${TAGS[open.id].x}%`,
                      top: `${TAGS[open.id].y}%`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className={styles.popHead}>
                      <strong>{t(`tags.${open.id}.name`)}</strong>
                      <button
                        type="button"
                        className={styles.popClose}
                        aria-label={t('modal.close')}
                        onClick={() => interact({ kind: 'none' })}
                      >
                        <CloseIcon size={14} />
                      </button>
                    </div>
                    <p className={styles.popMeta}>
                      {t('tagCard.addedBy')}: <em>{t('tagCard.author')}</em>
                    </p>
                    <button type="button" className={styles.popBtn} onClick={goToRecord}>
                      {t('tagCard.record')}
                    </button>
                    <button type="button" className={styles.popBtn} onClick={goToDefect}>
                      {t('tagCard.repair')}
                    </button>
                    <span className={styles.popBtn}>{t('tagCard.trade')}</span>
                  </div>
                )}

                {/* Marker popover */}
                {open.kind === 'marker' && (
                  <div
                    className={`${styles.popover} ${MARKERS[open.id].x > 50 ? styles.popMarkerLeft : styles.popMarkerRight}`}
                    style={{
                      left: `${MARKERS[open.id].x}%`,
                      top: `${MARKERS[open.id].y}%`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className={styles.popHead}>
                      <strong>{t(`markers.${open.id}.name`)}</strong>
                      <button
                        type="button"
                        className={styles.popClose}
                        aria-label={t('modal.close')}
                        onClick={() => interact({ kind: 'none' })}
                      >
                        <CloseIcon size={14} />
                      </button>
                    </div>
                    <button
                      type="button"
                      className={styles.popJump}
                      onClick={() => jumpPage(MARKERS[open.id].page)}
                    >
                      <JumpIcon size={14} />{' '}
                      {t('markerCard.move', { page: t(`markers.${open.id}.target`) })}
                    </button>
                  </div>
                )}

                {/* Page thumbnails */}
                <ul className={styles.thumbs}>
                  {PAGE_INDEXES.map((i) => (
                    <li
                      key={i}
                      className={`${styles.thumb}${i === page - 1 ? ` ${styles.thumbActive}` : ''}`}
                    >
                      <span className={styles.thumbLabel}>{t(`ui.pages.${i}`)}</span>
                      <span className={styles.thumbImage} />
                    </li>
                  ))}
                </ul>

                {/* Drawing-info modal */}
                {open.kind === 'info' && (
                  <div className={styles.modalLayer} onClick={() => interact({ kind: 'none' })}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                      <div className={styles.modalHead}>
                        <strong>{t('modal.title')}</strong>
                        <button
                          type="button"
                          className={styles.popClose}
                          aria-label={t('modal.close')}
                          onClick={() => interact({ kind: 'none' })}
                        >
                          <CloseIcon size={16} />
                        </button>
                      </div>
                      <dl className={styles.modalList}>
                        <dt>{t('modal.nameLabel')}</dt>
                        <dd>{t('ui.fileName')}</dd>
                        <dt>{t('modal.timeLabel')}</dt>
                        <dd>{t('modal.time')}</dd>
                        <dt>{t('modal.reasonLabel')}</dt>
                        <dd>{t('modal.reason')}</dd>
                      </dl>
                      <div className={styles.modalFoot}>
                        <button
                          type="button"
                          className={styles.primaryBtn}
                          onClick={() => interact({ kind: 'none' })}
                        >
                          {t('modal.confirm')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
