import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TbCalendarCheck,
  TbClockHour4,
  TbMapPin,
  TbFilePlus,
  TbListCheck,
  TbArrowRight,
  TbSparkles,
  TbWand,
  TbAlertTriangle,
} from 'react-icons/tb';
import styles from '../styles/CalendarPage.module.css';
import { generatePlanRequest } from '../services/planningService';

const events = [
  {
    date: '2025-02-10',
    title: 'Draft discovery requests',
    matter: 'ACME vs. Northwind',
    owner: 'Alex',
    state: 'In Progress',
    location: 'Remote',
  },
  {
    date: '2025-02-11',
    title: 'Approval: Motion to compel',
    matter: 'State v. Jordan',
    owner: 'Priya',
    state: 'Pending Approval',
    location: 'Admin review',
  },
  {
    date: '2025-02-12',
    title: 'Hearing prep — witness list',
    matter: 'Lumen Compliance',
    owner: 'Sam',
    state: 'In Progress',
    location: 'Courtroom 3B',
  },
  {
    date: '2025-02-13',
    title: 'File amended complaint',
    matter: 'Nova IP',
    owner: 'Alex',
    state: 'Approved',
    location: 'E-filing',
  },
  {
    date: '2025-02-14',
    title: 'Client sync — settlement options',
    matter: 'ACME vs. Northwind',
    owner: 'Taylor',
    state: 'In Progress',
    location: 'Conference line',
  },
];

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return {
    weekday: dayNames[date.getDay()],
    day: date.getDate(),
    month: date.toLocaleString('default', { month: 'short' }),
  };
};

export default function CalendarPage() {
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [isPlanning, setIsPlanning] = useState(false);
  const [planResult, setPlanResult] = useState(null);
  const [form, setForm] = useState({
    goal: 'Ship critical filings and approvals this week',
    hoursPerDay: 6,
    includeOverdue: true,
  });

  const runPlanner = async () => {
    setIsPlanning(true);
    const res = await generatePlanRequest(form);
    setPlanResult(res);
    setIsPlanning(false);
    setPlannerOpen(true);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Calendar & planning</p>
          <h1 className={styles.title}>Keep matters flowing this week.</h1>
          <p className={styles.subtitle}>
            See the critical hearings, filings, and approvals in one lane. Add tasks directly to
            matters and keep the ledger in sync.
          </p>
          <div className={styles.actions}>
            <Link to="/matter/-1" className={styles.primaryCta}>
              <TbFilePlus size={18} />
              New matter task
            </Link>
            <Link to="/matters" className={styles.secondaryCta}>
              <TbListCheck size={18} />
              View all matters
            </Link>
            <button type="button" className={styles.ghostCta} onClick={runPlanner} disabled={isPlanning}>
              <TbWand size={18} />
              {isPlanning ? 'Planning...' : 'Plan this week'}
            </button>
          </div>
        </div>
        <div className={styles.snapshot}>
          <div className={styles.snapshotTop}>
            <TbCalendarCheck size={24} />
            <div>
              <p className={styles.snapshotLabel}>This week</p>
              <p className={styles.snapshotValue}>5 key items</p>
            </div>
          </div>
          <div className={styles.snapshotStats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Approvals</span>
              <strong className={styles.statValue}>2</strong>
              <span className={styles.statHint}>Pending review</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Hearings</span>
              <strong className={styles.statValue}>1</strong>
              <span className={styles.statHint}>Midweek prep</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Client syncs</span>
              <strong className={styles.statValue}>1</strong>
              <span className={styles.statHint}>ACME settlement</span>
            </div>
          </div>
        </div>
      </div>

      {plannerOpen && (
        <div className={styles.plannerPanel}>
          <div className={styles.plannerHeader}>
            <div>
              <p className={styles.plannerLabel}>Agentic plan</p>
              <p className={styles.plannerTitle}>Suggested week</p>
            </div>
            <button type="button" className={styles.plannerClose} onClick={() => setPlannerOpen(false)}>
              ×
            </button>
          </div>
          <div className={styles.plannerForm}>
            <label>
              Goal
              <input
                value={form.goal}
                onChange={(e) => setForm((f) => ({ ...f, goal: e.target.value }))}
                placeholder="What do you want to achieve?"
              />
            </label>
            <label>
              Hours/day
              <input
                type="number"
                min="1"
                max="10"
                value={form.hoursPerDay}
                onChange={(e) => setForm((f) => ({ ...f, hoursPerDay: Number(e.target.value) }))}
              />
            </label>
            <label className={styles.switchRow}>
              <input
                type="checkbox"
                checked={form.includeOverdue}
                onChange={(e) => setForm((f) => ({ ...f, includeOverdue: e.target.checked }))}
              />
              Include overdue work
            </label>
            <button type="button" className={styles.primaryCta} onClick={runPlanner} disabled={isPlanning}>
              {isPlanning ? 'Re-planning...' : 'Regenerate plan'}
            </button>
          </div>

          {planResult && (
            <div className={styles.planSummary}>
              <div>
                <p className={styles.summaryLabel}>Goal</p>
                <p className={styles.summaryValue}>{planResult.goal}</p>
              </div>
              <div>
                <p className={styles.summaryLabel}>Hours planned</p>
                <p className={styles.summaryValue}>{planResult.summary.hoursPlanned}h</p>
              </div>
              <div>
                <p className={styles.summaryLabel}>Risks</p>
                <p className={styles.summaryValue}>{planResult.summary.risks}</p>
              </div>
            </div>
          )}

          <div className={styles.planList}>
            {(planResult?.plan || []).map((item) => (
              <div key={`${item.title}-${item.slot}`} className={styles.planItem}>
                <div className={styles.planDate}>{item.slot}</div>
                <div className={styles.planBody}>
                  <p className={styles.planTitle}>{item.title}</p>
                  <p className={styles.planMatter}>{item.matter}</p>
                  <div className={styles.planMeta}>
                    <span className={`${styles.pill} ${styles[item.state.replace(' ', '').toLowerCase()]}`}>
                      {item.state}
                    </span>
                    <span className={styles.metaItem}>{item.duration}h</span>
                    {item.risk && (
                      <span className={styles.riskPill}>
                        <TbAlertTriangle size={14} />
                        {item.risk}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.grid}>
        <div className={styles.weekStrip}>
          {events.map((event) => {
            const { weekday, day, month } = formatDate(event.date);
            return (
              <div key={event.title} className={styles.dayCard}>
                <div className={styles.dayMeta}>
                  <span className={styles.weekday}>{weekday}</span>
                  <span className={styles.dayNumber}>{day}</span>
                  <span className={styles.month}>{month}</span>
                </div>
                <div className={styles.dayContent}>
                  <p className={styles.eventTitle}>{event.title}</p>
                  <p className={styles.eventMatter}>{event.matter}</p>
                  <div className={styles.eventMeta}>
                    <span className={`${styles.pill} ${styles[event.state.replace(' ', '').toLowerCase()]}`}>
                      {event.state}
                    </span>
                    <span className={styles.metaItem}>
                      <TbClockHour4 size={14} />
                      {event.owner}
                    </span>
                    <span className={styles.metaItem}>
                      <TbMapPin size={14} />
                      {event.location}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.timeline}>
          <div className={styles.panelHeader}>
            <TbSparkles size={20} />
            <span>Timeline</span>
          </div>
          <ul className={styles.timelineList}>
            {events.map((event) => {
              const { weekday, day, month } = formatDate(event.date);
              return (
                <li key={`${event.title}-${event.date}`} className={styles.timelineItem}>
                  <div className={styles.timelineDate}>
                    <span className={styles.timelineDay}>{day}</span>
                    <span className={styles.timelineMonth}>{month}</span>
                    <span className={styles.timelineWeekday}>{weekday}</span>
                  </div>
                  <div className={styles.timelineBody}>
                    <p className={styles.timelineTitle}>{event.title}</p>
                    <p className={styles.timelineMatter}>{event.matter}</p>
                    <div className={styles.timelineMeta}>
                      <span className={`${styles.pill} ${styles[event.state.replace(' ', '').toLowerCase()]}`}>
                        {event.state}
                      </span>
                      <span className={styles.metaItem}>
                        <TbClockHour4 size={14} />
                        Owner: {event.owner}
                      </span>
                      <span className={styles.metaItem}>
                        <TbMapPin size={14} />
                        {event.location}
                      </span>
                    </div>
                    <div className={styles.timelineActions}>
                      <Link to="/matters" className={styles.link}>
                        Open matter <TbArrowRight size={14} />
                      </Link>
                      <Link to="/matter/-1" className={styles.link}>
                        Add task <TbArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
