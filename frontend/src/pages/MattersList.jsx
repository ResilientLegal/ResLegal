import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/MattersList.module.css';
import ChatBotWindow from '../components/ChatBotWindow';
import DJANGO_PORT from '../services/setting.js';

export default function MattersList() {
  const [matters, setMatters] = useState([]);
  const [summary, setSummary] = useState({
    all: 0,
    completed: 0,
    not_completed: 0,
    overdue: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${DJANGO_PORT}/api/matters/`)
      .then(response => response.json())
      .then(data => {
        setMatters(data);
        setSummary({
          all: data.length,
          completed: data.filter(m => m.state === 'APPROVED').length,
          not_completed: data.filter(m => m.state !== 'APPROVED').length,
          overdue: data.filter(m => m.state === 'PENDING_APPROVAL').length,
        });
      })
      .catch(error => console.error('Error:', error));
  }, []);

  const handleRowClick = (id) => {
    navigate(`/matter/${id}`);
  };

  return (
    <div className={styles['page-bg']}>
      <ChatBotWindow />
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
            <span>Pending Approval</span>
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
              {matters.map((m) => (
                <tr 
                  key={m.id}
                  onClick={() => handleRowClick(m.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td className={styles['col-checkbox']}>
                    <input 
                      type="checkbox" 
                      onClick={(e) => e.stopPropagation()} 
                    />
                  </td>
                  <td className={styles['col-activity']}>{m.title}</td>
                  <td className={styles['col-date']}>{new Date(m.date).toLocaleDateString()}</td>
                  <td className={styles['col-status']}>
                    {m.state === 'APPROVED' ? (
                      <span className={`${styles['status-pill']} ${styles['status-completed']}`}>
                        Completed
                      </span>
                    ) : m.state === 'IN_PROGRESS' ? (
                      <span className={`${styles['status-pill']} ${styles['status-in-progress']}`}>
                        In Progress
                      </span>
                    ) : m.state === 'PENDING_APPROVAL' ? (
                      <span className={`${styles['status-pill']} ${styles['status-overdue']}`}>
                        Pending Approval
                      </span>
                    ) : (
                      <span className={styles['status-pill']}>{m.state}</span>
                    )}
                  </td>
                  <td className={styles['col-assignee']}>
                    <a 
                      href="#" 
                      onClick={(e) => e.stopPropagation()} 
                      className={styles['assignee-link']}
                    >
                      {m.assignee_detail?.username || '-'}
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