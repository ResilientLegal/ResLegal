import { Link } from 'react-router-dom';
import {
  TbShieldCheck,
  TbFilePlus,
  TbTimelineEvent,
  TbArrowRight,
  TbMessageChatbot,
  TbListCheck,
  TbCalendarCheck,
} from 'react-icons/tb';
import styles from '../styles/HomePage.module.css';

const quickLinks = [
  { label: 'New matter intake', to: '/matter/-1', icon: TbFilePlus },
  { label: 'Open pipeline', to: '/matters', icon: TbListCheck },
  { label: 'Chat with assistant', to: '/matters', icon: TbMessageChatbot },
  { label: 'Calendar view', to: '/calendar', icon: TbCalendarCheck },
];

const updates = [
  { title: 'Approvals moving faster', detail: 'Avg. approval cycle 2.1 days (-12%) this week.' },
  { title: 'Ledger healthy', detail: 'ResilientDB endpoint responding in <120ms.' },
  { title: 'Two items stalled', detail: 'Matters needing approvals flagged in timeline.' },
];

export default function HomePage() {
  return (
    <div className={styles.shell}>
      <div className={styles.backdrop} />
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>ResLegal workspace</p>
          <h1 className={styles.title}>Move matters with clarity and confidence.</h1>
          <p className={styles.subtitle}>
            Track every step, keep approvals moving, and commit outcomes to the resilient ledger
            without leaving your desk.
          </p>
          <div className={styles.ctaRow}>
            <Link to="/matter/-1" className={styles.primaryCta}>
              Start a matter
              <TbFilePlus size={18} />
            </Link>
            <Link to="/matters" className={styles.secondaryCta}>
              View all work
              <TbArrowRight size={18} />
            </Link>
          </div>
          <div className={styles.metaRow}>
            <span className={styles.metaBadge}>Live ledger sync</span>
            <span className={styles.metaBadge}>JWT-secured sessions</span>
            <span className={styles.metaBadge}>Timeline-first view</span>
          </div>
        </div>

        <div className={styles.snapshotCard}>
          <div className={styles.snapshotHeader}>
            <TbShieldCheck size={22} />
            <div>
              <p className={styles.snapshotLabel}>ResilientDB status</p>
              <p className={styles.snapshotValue}>Online • api:18000/v1</p>
            </div>
          </div>
          <div className={styles.snapshotGrid}>
            <div className={styles.snapshotStat}>
              <span className={styles.statLabel}>Open matters</span>
              <strong className={styles.statValue}>14</strong>
              <p className={styles.statHint}>3 awaiting approval</p>
            </div>
            <div className={styles.snapshotStat}>
              <span className={styles.statLabel}>Ledger commits</span>
              <strong className={styles.statValue}>328</strong>
              <p className={styles.statHint}>Last 24 hours</p>
            </div>
            <div className={styles.snapshotStat}>
              <span className={styles.statLabel}>Assistant replies</span>
              <strong className={styles.statValue}>58</strong>
              <p className={styles.statHint}>This week</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.grid}>
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <TbTimelineEvent size={20} />
            <span>Today&apos;s priorities</span>
          </div>
          <ul className={styles.list}>
            {updates.map((item) => (
              <li key={item.title} className={styles.listItem}>
                <div className={styles.bullet} />
                <div>
                  <p className={styles.listTitle}>{item.title}</p>
                  <p className={styles.listDetail}>{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <TbListCheck size={20} />
            <span>Quick actions</span>
          </div>
          <div className={styles.actions}>
            {quickLinks.map(({ label, to, icon: Icon }) => {
              const IconComponent = Icon || TbCalendarCheck;
              return (
              <Link key={label} to={to} className={styles.actionCard}>
                <div className={styles.actionIcon}>
                  <IconComponent size={18} aria-hidden="true" />
                </div>
                <div>
                  <p className={styles.actionLabel}>{label}</p>
                  <span className={styles.actionHint}>Jump in and keep momentum</span>
                </div>
                <TbArrowRight className={styles.actionArrow} size={16} />
              </Link>
              );
            })}
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <TbMessageChatbot size={20} />
            <span>Assistant tips</span>
          </div>
          <div className={styles.tipBox}>
            <p className={styles.tipTitle}>Try asking:</p>
            <ul className={styles.tipList}>
              <li>“Summarize client risk for ACME vs. Northwind.”</li>
              <li>“Draft an approval request for the latest filings.”</li>
              <li>“List matters that changed state today.”</li>
            </ul>
            <Link to="/matters" className={styles.tipCta}>
              Open assistant
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
