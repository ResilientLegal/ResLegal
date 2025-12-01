import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/MattersList.module.css';

export default function MattersList() {
  const navigate = useNavigate();
  const [matters, setMatters] = useState([]);
  const [loading, setLoading] = useState(true);

  const summary = {
    all: matters.length,
    completed: matters.filter(m => m.status === 'Completed').length,
    not_completed: matters.filter(m => m.status !== 'Completed').length,
    overdue: matters.filter(m => m.status === 'Overdue').length,
  };

  useEffect(() => {
    fetch("http://localhost:8000/api/matters/")
      .then(response => response.json())
      .then(data => {
        setMatters(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, []);

  const handleRowClick = (matterId) => {
    navigate(`/matter/${matterId}`);
  };

  if (loading) {
    return <div className="page-bg"><p>Loading...</p></div>;
  }

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
                  <td className="col-activity">{m.activity}</td>
                  <td className="col-date">{new Date(m.date).toLocaleDateString()}</td>
                  <td className="col-status">
                    {m.status === 'Completed' ? (
                      <span className="status-pill status-completed">Completed</span>
                    ) : m.status === 'In Progress' ? (
                      <span className="status-pill status-in-progress">In Progress</span>
                    ) : m.status === 'Overdue' ? (
                      <span className="status-pill status-overdue">Overdue</span>
                    ) : (
                      <span className="status-pill">{m.status}</span>
                    )}
                  </td>
                  <td className="col-assignee">
                    <span className="assignee-link">{m.assignee}</span>
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