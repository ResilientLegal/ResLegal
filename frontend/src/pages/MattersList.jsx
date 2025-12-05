import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TbFilter, TbSearch, TbListCheck, TbCalendar } from 'react-icons/tb';
import styles from '../styles/MattersList.module.css';
import ChatBotWindow from '../components/ChatBotWindow';

const DUMMY_DATA = {
  matters: [
    { activity: 'Retainer Agreement Signed', date: '7/4/2020', status: 'Completed', assignee: 'Joanna Miles' },
    { activity: 'Setup Mediation', date: '7/2/2020', status: 'In Progress', assignee: 'Steve Miller' },
    { activity: 'Draft Documents', date: '6/30/2020', status: 'Overdue', assignee: 'Joe Smith' },
  ],
  summary: {
    all: 3,
    completed: 1,
    not_completed: 2,
    overdue: 1,
  },
};

export default function MattersList() {
  const [data] = useState(DUMMY_DATA);
  const { matters, summary } = data;

  useEffect(() => {
    fetch('http://localhost:8080/api/matters/')
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error('Error:', error));
  }, []);

  return (
    <div className={styles.shell}>
      <div className={styles.backdrop} />
      <div className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Matter pipeline</p>
          <h1 className={styles.title}>Activities, approvals, and owners in one view.</h1>
          <p className={styles.subtitle}>
            Track every matter step, keep approvals moving, and route tasks to the right owner.
            Drill in or switch to the calendar with a click.
          </p>
          <div className={styles.actions}>
            <Link to="/matter/-1" className={styles.primaryCta}>
              <TbListCheck size={18} />
              New matter task
            </Link>
            <Link to="/calendar" className={styles.secondaryCta}>
              <TbCalendar size={18} />
              Calendar view
            </Link>
          </div>
        </div>
        <div className={styles.snapshotGrid}>
          <div className={styles.snapshotCard}>
            <p className={styles.snapshotLabel}>All</p>
            <p className={styles.snapshotValue}>{summary.all}</p>
            <span className={styles.snapshotHint}>Total tracked</span>
          </div>
          <div className={styles.snapshotCard}>
            <p className={styles.snapshotLabel}>Completed</p>
            <p className={styles.snapshotValue}>{summary.completed}</p>
            <span className={styles.snapshotHint}>Filed/closed</span>
          </div>
          <div className={styles.snapshotCard}>
            <p className={styles.snapshotLabel}>In flight</p>
            <p className={styles.snapshotValue}>{summary.not_completed}</p>
            <span className={styles.snapshotHint}>In progress</span>
          </div>
          <div className={styles.snapshotCard}>
            <p className={styles.snapshotLabel}>Overdue</p>
            <p className={styles.snapshotValue}>{summary.overdue}</p>
            <span className={styles.snapshotHint}>Needs attention</span>
          </div>
        </div>
      </div>

      <section className={styles.panel}>
        <div className={styles.panelHead}>
          <div className={styles.filters}>
            <button className={`${styles.filterChip} ${styles.active}`}>
              All <span className={styles.count}>{summary.all}</span>
            </button>
            <button className={styles.filterChip}>
              Completed <span className={styles.count}>{summary.completed}</span>
            </button>
            <button className={styles.filterChip}>
              In Progress <span className={styles.count}>{summary.not_completed}</span>
            </button>
            <button className={`${styles.filterChip} ${styles.overdue}`}>
              Overdue <span className={styles.count}>{summary.overdue}</span>
            </button>
          </div>
          <div className={styles.searchBox}>
            <TbSearch size={16} />
            <input placeholder="Search activities..." aria-label="Search activities" />
            <button className={styles.filterButton} type="button">
              <TbFilter size={16} />
              Filters
            </button>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.colCheckbox}>
                  <input type="checkbox" disabled />
                </th>
                <th>Activity</th>
                <th>Date</th>
                <th>Status</th>
                <th>Assigned to</th>
              </tr>
            </thead>
            <tbody>
              {matters.map((m, idx) => (
                <tr key={idx}>
                  <td className={styles.colCheckbox}>
                    <input type="checkbox" />
                  </td>
                  <td className={styles.colActivity}>{m.activity}</td>
                  <td className={styles.colDate}>{m.date}</td>
                  <td className={styles.colStatus}>
                    <span
                      className={`${styles.statusPill} ${
                        m.status === 'Completed'
                          ? styles.statusCompleted
                          : m.status === 'In Progress'
                          ? styles.statusInProgress
                          : m.status === 'Overdue'
                          ? styles.statusOverdue
                          : ''
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className={styles.colAssignee}>
                    <a href="#" className={styles.assigneeLink}>
                      {m.assignee}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <ChatBotWindow />
    </div>
  );
}
