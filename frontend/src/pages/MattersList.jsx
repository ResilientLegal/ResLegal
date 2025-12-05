import React, { useState, useEffect } from 'react';
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
    <div className={styles['page-bg']}>
      <ChatBotWindow/>
      <div className={styles['activities-card']}>
        <div className={styles['activities-header']}>
          <h2>Activities</h2>
        </div>

        <div className={styles['activities-filters']}>
          <button className={`${styles['filter-tab']} ${styles['active']}`}>
            <span>All</span>
            <span className={styles['filter-count']}>{summary.all}</span>
          </button>
          <button className={styles['filter-tab']}>
            <span>Completed</span>
            <span className={styles['filter-count']}>{summary.completed}</span>
          </button>
          <button className={styles['filter-tab']}>
            <span>Not Completed</span>
            <span className={styles['filter-count']}>{summary.not_completed}</span>
          </button>
          <button className={`${styles['filter-tab']} ${styles['overdue-tab']}`}>
            <span>Overdue</span>
            <span className={styles['filter-count']}>{summary.overdue}</span>
          </button>
        </div>

        <div className={styles['activities-search-row']}>
          <input
            type="text"
            className={styles['activities-search-input']}
            placeholder="Search Activities ..."
            
          />
        </div>

        <div className={styles['activities-table-wrapper']}>
          <table className={styles['activities-table']}>
            <thead>
              <tr>
                <th className={styles['col-checkbox']}>
                  <input type="checkbox" disabled />
                </th>
                <th>Activity</th>
                <th>Date</th>
                <th>Status</th>
                <th>Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {matters.map((m, idx) => (
                <tr key={idx}>
                  <td className={styles['col-checkbox']}>
                    <input type="checkbox" />
                  </td>
                  <td className={styles['col-activity']}>{m.activity}</td>
                  <td className={styles['col-date']}>{m.date}</td>
                  <td className={styles['col-status']}>
                    {m.status === 'Completed' ? (
                      <span className={`${styles['status-pill']} ${styles['status-completed']}`}>
                        Completed
                      </span>
                    ) : m.status === 'In Progress' ? (
                      <span className={`${styles['status-pill']} ${styles['status-in-progress']}`}>
                        In Progress
                      </span>
                    ) : m.status === 'Overdue' ? (
                      <span className={`${styles['status-pill']} ${styles['status-overdue']}`}>
                        Overdue
                      </span>
                    ) : (
                      <span className={styles['status-pill']}>{m.status}</span>
                    )}
                  </td>
                  <td className={styles['col-assignee']}>
                    <a href="#" className={styles['assignee-link']}>
                      {m.assignee}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
