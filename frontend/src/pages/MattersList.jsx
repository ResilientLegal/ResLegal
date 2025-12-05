import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/MattersList.module.css';
import ChatBotWindow from '../components/ChatBotWindow';

export default function MattersList() {
  const [matters, setMatters] = useState([])
  const [summary, setSummary] = useState({})
  const navigate = useNavigate();
  
  const handleRowClick = (matterId) => {
        const targetUrl = `/matter/${matterId}`; 
        navigate(targetUrl);
  };

  useEffect(() => {
    fetch('http://localhost:8080/api/matters/')
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        const mattersTrans = data.map(m => {
          return {
            id: m.id,
            activity: m.title,
            date: new Date(m.date).toLocaleDateString(),
            status: m.state.toLowerCase() .replace('_', ' ').split(' ')
                           .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            assignee: m.assignee_detail?.username
          }
        });
        
        setMatters(mattersTrans);
      })
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
              {matters.map((m) => (
                <tr key={m.id} onClick={() => handleRowClick(m.id)}>
                  <td className={styles['col-checkbox']}>
                    <input type="checkbox" />
                  </td>
                  <td className={styles['col-activity']}>{m.activity}</td>
                  <td className={styles['col-date']}>{m.date}</td>
                  <td className={styles['col-status']}>
                    {m.status === 'Approved' ? (
                      <span className={`${styles['status-pill']} ${styles['status-completed']}`}>
                        Approved
                      </span>
                    ) : m.status === 'In Progress' ? (
                      <span className={`${styles['status-pill']} ${styles['status-in-progress']}`}>
                        In Progress
                      </span>
                    ) : m.status === 'Pending Approval' ? (
                      <span className={`${styles['status-pill']} ${styles['status-overdue']}`}>
                        Pending approval
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
