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
  PinIcon,
  SearchIcon,
  UserIcon,
} from '../HomeBlueprintSection/icons';
import { InfoCircleIcon, RefreshIcon, XIcon } from './icons';
import styles from './HomeTalkSection.module.css';
import { ProductLogo } from '@/src/components/product/ProductLogo';
import { ProductAvatar } from '@/src/components/product/ProductAvatar';
import { useDemoScroll } from '@/src/hooks/useDemoScroll';

/* One machine drives three screens: the chat room, the drawing, and the
   TBM detail page. */
type Stage =
  | 'chat' // idle chat room; + invites a click
  | 'attach' // attachment menu open
  | 'compose' // drawing screen with the message modal
  | 'composed' // modal carries text; 확인 waiting
  | 'placing' // toast: tap the drawing to place the marker
  | 'placed' // purple marker sits on the drawing
  | 'opened' // marker turned red, message card open
  | 'chatWithMsg' // back in chat, message has a "view on drawing" action
  | 'tbm' // TBM detail page
  | 'tbmSign' // signature modal, empty
  | 'tbmSigned'; // signature drawn

const NAV_ICONS = [HomeIcon, ClipboardIcon, HardHatIcon, BuildingIcon];
const MENU_INDEXES = [0, 1, 2, 3, 4] as const;
const SAFETY_INDEXES = [0, 1, 2, 3, 4] as const;
const MEMBER_INDEXES = [0, 1, 2, 3, 4] as const;
const PAGE_INDEXES = [0, 1, 2] as const;

/* Where the visitor's marker lands. */
const MARKER = { x: 42, y: 38 };

export function TalkDemo() {
  const t = useTranslations('home.talkDemo');
  const [stage, setStage] = useState<Stage>('chat');
  const [signed, setSigned] = useState(false);
  const { sheetRef, scrollToTop } = useDemoScroll<HTMLDivElement>();

  const go = useCallback((next: Stage) => setStage(next), []);

  /* Entering the TBM detail screen always starts scrolled to the top,
     regardless of where the visitor left it last time. */
  const goToTbm = useCallback(() => {
    go('tbm');
    scrollToTop();
  }, [go, scrollToTop]);

  const onPlan = ['compose', 'composed', 'placing', 'placed', 'opened'].includes(stage);
  const onTbm = ['tbm', 'tbmSign', 'tbmSigned'].includes(stage);
  const hasSentMsg = stage === 'chatWithMsg' || onTbm || signed;

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
                  className={`${styles.railItem}${i === 0 ? ` ${styles.railActive}` : ''}`}
                >
                  <Icon />
                  {t(`ui.nav.${i}`)}
                </span>
              ))}
            </nav>
            <div className={styles.sideMenu}>
              {MENU_INDEXES.map((i) => (
                <span
                  key={i}
                  className={`${styles.menuItem}${i === 2 ? ` ${styles.menuActive}` : ''}`}
                >
                  {i === 2 ? '✓ ' : ''}
                  {t(`ui.menu.${i}`)}
                </span>
              ))}
            </div>
          </div>
          <div className={styles.logoutRow}>{t('ui.logout')}</div>
        </div>

        <div className={styles.main}>
          {/* ─── TBM detail ─── */}
          {onTbm ? (
            <>
              <p className={styles.breadcrumb}>
                {t('tbm.crumb.0')} <i>/</i> {t('tbm.crumb.1')} <i>/</i> {t('tbm.crumb.2')} <i>/</i>{' '}
                {t('tbm.crumb.3')} <i>/</i>
                <strong> {t('tbm.crumb.4')}</strong>
              </p>
              <p className={styles.sub}>{t('tbm.sub')}</p>

              <div className={styles.titleRow}>
                <h4 className={styles.docName}>{t('tbm.name')}</h4>
                <button
                  type="button"
                  className={`${styles.ghostBtn}${!signed ? ` ${styles.accentBtn} ${styles.pulse}` : ` ${styles.doneBtn}`}`}
                  onClick={() => !signed && go('tbmSign')}
                  disabled={signed}
                >
                  {signed ? `✓ ${t('tbm.signBtn')}` : t('tbm.signBtn')}
                </button>
              </div>

              <div className={styles.sheet} ref={sheetRef}>
                <section className={styles.block}>
                  <span className={styles.blockIcon}>
                    <InfoCircleIcon />
                  </span>
                  <div className={styles.blockBody}>
                    <h5 className={styles.blockTitle}>{t('tbm.overview')}</h5>
                    <dl className={styles.infoGrid}>
                      <div>
                        <dt>{t('tbm.projectLabel')}</dt>
                        <dd>{t('ui.project')}</dd>
                      </div>
                      <div>
                        <dt>{t('tbm.dateLabel')}</dt>
                        <dd>{t('tbm.date')}</dd>
                      </div>
                      <div>
                        <dt>{t('tbm.authorLabel')}</dt>
                        <dd>{t('tbm.author')}</dd>
                      </div>
                    </dl>
                  </div>
                </section>

                <hr className={styles.divider} />

                <section className={styles.block}>
                  <span className={styles.blockIcon}>
                    <HardHatIcon size={22} />
                  </span>
                  <div className={styles.blockBody}>
                    <h5 className={styles.blockTitle}>{t('tbm.worksTitle')}</h5>
                    <div className={styles.workList}>
                      {[0, 1].map((i) => (
                        <p key={i} className={styles.workRow}>
                          <em className={styles.workTag}>{t('tbm.workTag')}</em>
                          {t(`tbm.works.${i}`)}
                        </p>
                      ))}
                    </div>
                  </div>
                </section>

                <hr className={styles.divider} />

                <section className={styles.block}>
                  <span className={styles.blockIcon}>
                    <InfoCircleIcon />
                  </span>
                  <div className={styles.blockBody}>
                    <h5 className={styles.blockTitle}>{t('tbm.weatherTitle')}</h5>
                    <dl className={styles.infoGrid}>
                      <div>
                        <dt>{t('tbm.tempLabel')}</dt>
                        <dd>{t('tbm.temp')}</dd>
                      </div>
                      <div>
                        <dt>{t('tbm.rainLabel')}</dt>
                        <dd>{t('tbm.rain')}</dd>
                      </div>
                      <div>
                        <dt>{t('tbm.windLabel')}</dt>
                        <dd>{t('tbm.wind')}</dd>
                      </div>
                      <div>
                        <dt>{t('tbm.skyLabel')}</dt>
                        <dd>{t('tbm.sky')}</dd>
                      </div>
                    </dl>
                  </div>
                </section>

                <hr className={styles.divider} />

                <section className={styles.block}>
                  <span className={styles.blockIcon}>
                    <HardHatIcon size={22} />
                  </span>
                  <div className={styles.blockBody}>
                    <h5 className={styles.blockTitle}>{t('tbm.safetyTitle')}</h5>
                    <p className={styles.fieldNote}>{t('tbm.safetyLabel')}</p>
                    <ul className={styles.safetyList}>
                      {SAFETY_INDEXES.map((i) => (
                        <li key={i}>{t(`tbm.safety.${i}`)}</li>
                      ))}
                    </ul>
                  </div>
                </section>

                <hr className={styles.divider} />

                <section className={styles.block}>
                  <span className={styles.blockIcon}>
                    <RefreshIcon size={22} />
                  </span>
                  <div className={styles.blockBody}>
                    <h5 className={styles.blockTitle}>{t('tbm.signTitle')}</h5>
                    <ul className={styles.signList}>
                      {MEMBER_INDEXES.map((i) => (
                        <li key={i}>
                          <span className={styles.signWho}>
                            <span className={styles.personAvatar}>
                              <UserIcon size={13} />
                            </span>
                            {t(`tbm.members.${i}`)}
                          </span>
                          {i === 0 && signed ? (
                            <>
                              <span className={styles.signBox}>
                                <svg viewBox="0 0 220 90" className={styles.signature} aria-hidden>
                                  <path
                                    className={styles.signPath}
                                    d="M52 68c1-24 2-36 3-42 12-2 26 1 32 11 6 11 2 24-9 29-7 3-16 3-24 2"
                                  />
                                  <path
                                    className={styles.signPath}
                                    d="M104 72c2-26 3-38 4-44 11-2 24 0 28 9 4 10-6 17-17 18-5 1-9 1-11 1"
                                  />
                                  <path className={styles.signPath} d="M34 80c42 9 100 7 146-7" />
                                </svg>
                              </span>
                              {/* The timestamp row carries the way back, right-aligned. */}
                              <span className={styles.signedFoot}>
                                <span className={styles.signedAt}>{t('tbm.signedAt')}</span>
                                <button
                                  type="button"
                                  className={styles.backLink}
                                  onClick={() => go(hasSentMsg ? 'chatWithMsg' : 'chat')}
                                >
                                  ↩ {t('tbm.backToChat')}
                                </button>
                              </span>
                            </>
                          ) : (
                            <span className={styles.noSign}>{t('tbm.noSign')}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

              </div>
            </>
          ) : (
            <>
              <p className={styles.breadcrumb}>
                {onPlan ? (
                  <>
                    {t('ui.crumbPlan.0')} <i>/</i> {t('ui.crumbPlan.1')} <i>/</i>
                    <strong> {t('ui.crumbPlan.2')}</strong>
                  </>
                ) : (
                  <>
                    {t('ui.crumbChat.0')} <i>/</i>
                    <strong> {t('ui.crumbChat.1')}</strong>
                  </>
                )}
              </p>
              <p className={styles.sub}>{onPlan ? t('ui.subPlan') : t('ui.subChat')}</p>

              <div className={styles.titleRow}>
                <h4 className={styles.docName}>
                  {t('ui.project')} <em className={styles.chip}>{t('ui.status')}</em>
                </h4>
                {!onPlan && (
                  <span className={styles.actions}>
                    <span className={styles.ghostBtn}>
                      <SearchIcon /> {t('ui.search')}
                    </span>
                    <span className={styles.ghostBtn}>{t('ui.menuBtn')}</span>
                  </span>
                )}
                {onPlan && <span className={styles.ghostBtn}>+ {t('ui.addLocationMsg')}</span>}
              </div>

              {/* ─── Drawing screen ─── */}
              {onPlan ? (
                <div className={styles.planPanels}>
                  <aside className={styles.msgList}>
                    <p className={styles.panelTitle}>{t('ui.msgListTitle')}</p>
                    <span className={styles.search}>
                      <SearchIcon />
                      {t('ui.msgSearchPlaceholder')}
                    </span>
                    {stage === 'opened' && (
                      <div className={styles.msgRow}>
                        <p className={styles.msgWho}>
                          <strong>{t('chat.author')}</strong> <span>{t('chat.time')}</span>
                        </p>
                        <p className={styles.msgText}>{t('chat.locationMsg')}</p>
                      </div>
                    )}
                  </aside>

                  <section className={styles.planViewer}>
                    <p className={styles.pageTitle}>{t('ui.pageLabel')}</p>
                    <div
                      className={`${styles.canvas}${stage === 'placing' ? ` ${styles.canvasArmed}` : ''}`}
                      onClick={() => stage === 'placing' && go('placed')}
                    >
                      <span className={styles.planImage} aria-hidden />

                      {(stage === 'placed' || stage === 'opened') && (
                        <button
                          type="button"
                          className={`${styles.marker}${stage === 'opened' ? ` ${styles.markerOpen}` : ` ${styles.markerIdle}`}`}
                          style={{ left: `${MARKER.x}%`, top: `${MARKER.y}%` }}
                          aria-label={t('ui.locationMsgTitle')}
                          onClick={(e) => {
                            e.stopPropagation();
                            go(stage === 'opened' ? 'placed' : 'opened');
                          }}
                        >
                          <ChatIcon size={14} />
                        </button>
                      )}

                      {stage === 'opened' && (
                        <div
                          className={styles.msgCard}
                          style={{ left: `${MARKER.x}%`, top: `${MARKER.y}%` }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className={styles.msgCardHead}>
                            <strong>{t('ui.locationMsgTitle')}</strong>
                            <button
                              type="button"
                              className={styles.iconBtn}
                              onClick={() => go('placed')}
                            >
                              <XIcon size={13} />
                            </button>
                          </div>
                          <p className={styles.msgWho}>
                            <span className={styles.personAvatar}>
                              <UserIcon size={12} />
                            </span>
                            <strong>{t('chat.author')}</strong>
                          </p>
                          <p className={styles.msgBubble}>{t('chat.locationMsg')}</p>
                          <button
                            type="button"
                            className={`${styles.linkBtn} ${styles.pulse}`}
                            onClick={() => go('chatWithMsg')}
                          >
                            ↩ {t('ui.backToChat')}
                          </button>
                        </div>
                      )}

                      {stage === 'placing' && (
                        <span className={styles.toast}>
                          <span className={styles.toastText}>{t('ui.toast')}</span>
                          <button type="button" className={styles.toastBtn} onClick={() => go('chat')}>
                            {t('ui.toastCancel')}
                          </button>
                        </span>
                      )}

                      <ul className={styles.thumbs}>
                        {PAGE_INDEXES.map((i) => (
                          <li
                            key={i}
                            className={`${styles.thumb}${i === 0 ? ` ${styles.thumbActive}` : ''}`}
                          >
                            <span className={styles.thumbLabel}>{t(`ui.pages.${i}`)}</span>
                            <span className={styles.thumbImage} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </section>
                </div>
              ) : (
                /* ─── Chat room ─── */
                <div className={styles.chatPanel}>
                  <div className={styles.thread}>
                    {/* Pinned inside the thread, the way a chat app shows a notice. */}
                    <button
                      type="button"
                      className={`${styles.notice}${!signed ? ` ${styles.noticeIdle}` : ''}`}
                      onClick={() => goToTbm()}
                    >
                      <span className={styles.noticeIcon}>
                        <HardHatIcon size={15} />
                      </span>
                      <span className={styles.noticeText}>
                        <strong>{t('ui.tbmTitle')}</strong>
                        <span>{t('ui.tbmDate')}</span>
                      </span>
                      <span className={styles.noticeCaret} aria-hidden />
                    </button>

                    <div className={styles.msgIn}>
                      <span className={styles.personAvatar}>
                        <UserIcon size={16} />
                      </span>
                      <span className={styles.msgInBody}>
                        <span className={styles.msgAuthor}>{t('chat.author')}</span>
                        <span className={styles.msgRowLine}>
                          <span className={styles.bubbleIn}>{t('chat.intro')}</span>
                          <span className={styles.msgTime}>{t('chat.time')}</span>
                        </span>
                      </span>
                    </div>

                    {hasSentMsg && (
                      <div className={styles.msgOut}>
                        <span className={styles.msgRowLine}>
                          <span className={styles.msgTime}>{t('chat.time')}</span>
                          <span className={styles.bubbleOut}>{t('chat.locationMsg')}</span>
                        </span>
                        <button
                          type="button"
                          className={styles.viewOnPlan}
                          onClick={() => go('opened')}
                        >
                          <PinIcon size={13} /> {t('ui.viewOnPlan')} ›
                        </button>
                      </div>
                    )}
                  </div>

                  <div className={styles.composer}>
                    <span className={styles.plusWrap}>
                      {stage === 'chat' && !hasSentMsg && (
                        <span className={styles.startHint}>{t('ui.startHint')}</span>
                      )}
                      <button
                        type="button"
                        className={`${styles.plusBtn}${stage === 'attach' ? ` ${styles.plusOpen}` : ''}${stage === 'chat' && !hasSentMsg ? ` ${styles.pulse}` : ''}`}
                        onClick={() => go(stage === 'attach' ? 'chat' : 'attach')}
                        aria-label="+"
                      >
                        {stage === 'attach' ? <XIcon size={15} /> : '+'}
                      </button>

                      {stage === 'attach' && (
                        <ul className={styles.attachMenu}>
                          <li>
                            <button
                              type="button"
                              className={styles.attachItem}
                              onClick={() => go('compose')}
                            >
                              <PinIcon size={16} /> {t('ui.attachLocation')}
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className={styles.attachItem}
                              onClick={() => goToTbm()}
                            >
                              <HardHatIcon size={16} /> {t('ui.attachTbm')}
                            </button>
                          </li>
                        </ul>
                      )}
                    </span>

                    <span className={styles.input}>{t('ui.inputPlaceholder')}</span>
                    <span className={styles.sendBtn} aria-hidden>
                      →
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ─── Location message modal ─── */}
      {(stage === 'compose' || stage === 'composed') && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHead}>
              <strong>{t('modal.title')}</strong>
              <button type="button" className={styles.iconBtn} onClick={() => go('chat')}>
                <XIcon size={15} />
              </button>
            </div>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>{t('modal.label')}</span>
              <button
                type="button"
                className={`${styles.fieldBox}${stage === 'compose' ? ` ${styles.fieldIdle} ${styles.pulse}` : ''}`}
                onClick={() => go('composed')}
              >
                <span className={stage === 'composed' ? undefined : styles.empty}>
                  {stage === 'composed' ? t('chat.locationMsg') : t('modal.placeholder')}
                </span>
              </button>
            </label>
            <div className={styles.modalFoot}>
              <span className={styles.ghostBtn}>{t('modal.cancel')}</span>
              <button
                type="button"
                className={`${styles.primaryBtn}${stage === 'composed' ? ` ${styles.pulse}` : ''}`}
                onClick={() => stage === 'composed' && go('placing')}
                disabled={stage !== 'composed'}
              >
                {t('modal.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TBM signature modal ─── */}
      {(stage === 'tbmSign' || stage === 'tbmSigned') && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHead}>
              <strong>{t('sign.title')}</strong>
              <button type="button" className={styles.iconBtn} onClick={() => goToTbm()}>
                <XIcon size={15} />
              </button>
            </div>
            <p className={styles.modalDesc}>{t('sign.desc')}</p>

            <button
              type="button"
              className={`${styles.signPad}${stage === 'tbmSign' ? ` ${styles.pulse}` : ''}`}
              onClick={() => go('tbmSigned')}
            >
              {stage === 'tbmSigned' ? (
                <svg viewBox="0 0 220 90" className={styles.signature} aria-hidden>
                  <path
                    className={styles.signPath}
                    d="M52 68c1-24 2-36 3-42 12-2 26 1 32 11 6 11 2 24-9 29-7 3-16 3-24 2"
                  />
                  <path
                    className={styles.signPath}
                    d="M104 72c2-26 3-38 4-44 11-2 24 0 28 9 4 10-6 17-17 18-5 1-9 1-11 1"
                  />
                  <path className={styles.signPath} d="M34 80c42 9 100 7 146-7" />
                </svg>
              ) : (
                <span className={styles.signHint}>{t('sign.hint')}</span>
              )}
            </button>

            <button type="button" className={styles.resignBtn} onClick={() => go('tbmSign')}>
              <RefreshIcon size={13} /> {t('sign.resign')}
            </button>

            <div className={styles.modalFoot}>
              <span className={styles.ghostBtn}>{t('sign.cancel')}</span>
              <button
                type="button"
                className={`${styles.primaryBtn}${stage === 'tbmSigned' ? ` ${styles.pulse}` : ''}`}
                onClick={() => {
                  if (stage !== 'tbmSigned') return;
                  setSigned(true);
                  goToTbm();
                }}
                disabled={stage !== 'tbmSigned'}
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
