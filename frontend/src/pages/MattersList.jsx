import React, { useState, useEffect } from 'react'
import styles from '../styles/MattersList.module.css';

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
}

export default function MattersList() {
  // Use embedded dummy data instead of fetching from API
  const [data] = useState(DUMMY_DATA)
  const { matters, summary } = data
  
  useEffect(() => {
    fetch("http://localhost:8000/api/matters/1")
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error("Error:", error));
  }, []);

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
              {matters.map((m, idx) => (
                <tr key={idx}>
                  <td className="col-checkbox">
                    <input type="checkbox" />
                  </td>
                  <td className="col-activity">{m.activity}</td>
                  <td className="col-date">{m.date}</td>
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
                    <a href="#" className="assignee-link">{m.assignee}</a>
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
