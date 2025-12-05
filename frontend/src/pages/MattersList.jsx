import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import styles from '../styles/MattersList.module.css';
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
          overdue: 0,
        });
      })
      .catch(error => console.error("Error:", error));
  }, []);

  const handleRowClick = (id) => {
    navigate(`/matter/${id}`);
  };

  return (
    <div className="page-bg">
      <div className="activities-card">
        <div className="activities-header">
          <h2>Activities</h2>
        </div>
        <div className="activities-filters">
          <button className="filter-tab active">
            <span>All</span>
            <span className="filter-count">{summary.all}</span>
          </button>
          <button className="filter-tab">
            <span>Completed</span>
            <span className="filter-count">{summary.completed}</span>
          </button>
          <button className="filter-tab">
            <span>Not Completed</span>
            <span className="filter-count">{summary.not_completed}</span>
          </button>
          <button className="filter-tab overdue-tab">
            <span>Overdue</span>
            <span className="filter-count">{summary.overdue}</span>
          </button>
        </div>
        <div className="activities-search-row">
          <input
            type="text"
            className="activities-search-input"
            placeholder="Search Activities ..."
            disabled
          />
        </div>
        <div className="activities-table-wrapper">
          <table className="activities-table">
            <thead>
              <tr>
                <th className="col-checkbox">
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
                  <td className="col-checkbox">
                    <input type="checkbox" onClick={(e) => e.stopPropagation()} />
                  </td>
                  <td className="col-activity">{m.title}</td>
                  <td className="col-date">{new Date(m.date).toLocaleDateString()}</td>
                  <td className="col-status">
                    {m.state === 'APPROVED' ? (
                      <span className="status-pill status-completed">Completed</span>
                    ) : m.state === 'IN_PROGRESS' ? (
                      <span className="status-pill status-in-progress">In Progress</span>
                    ) : m.state === 'PENDING_APPROVAL' ? (
                      <span className="status-pill status-overdue">Pending</span>
                    ) : (
                      <span className="status-pill">{m.state}</span>
                    )}
                  </td>
                  <td className="col-assignee">
                    <a href="#" onClick={(e) => e.stopPropagation()} className="assignee-link">
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
  )
}