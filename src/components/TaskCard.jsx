import React from 'react';
import '../CSS/TaskCard.css';

export default function TaskCard({ task }) {
  const getStatusClass = (status) => {
    switch (status) {
      case 'TO DO':
        return 'status-todo';
      case 'IN PROCESS':
        return 'status-in-process';
      case 'DONE':
        return 'status-done';
      default:
        return '';
    }
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <span className={`task-status ${getStatusClass(task.status)}`}>
          {task.status}
        </span>
      </div>
      <p className="task-description">{task.description}</p>
      <div className="task-details">
        <div className="task-group">
          <strong>Group:</strong> {task.group}
        </div>
        <div className="task-manager">
          <strong>Manager:</strong> {task.manager}
        </div>
        {task.startDate && (
          <div className="task-dates">
            <strong>Dates:</strong> {task.startDate} - {task.endDate || 'N/A'}
          </div>
        )}
        <div className="task-members">
          <strong>Members:</strong> {task.members ? task.members.join(', ') : 'N/A'}
        </div>
      </div>
    </div>
  );
}