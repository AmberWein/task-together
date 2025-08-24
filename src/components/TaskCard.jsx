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

  const assignedUserEmail = task.assigned_to && task.assigned_to.length > 0
    ? task.assigned_to.map(a => a.user.email).join(', ')
    : 'None';

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
          <strong>Group ID:</strong> {task.group_id || 'N/A'}
        </div>
        <div className="task-creator">
          <strong>Creator Email:</strong> {task.creator?.email || 'N/A'}
        </div>
        {task.startDate && (
          <div className="task-dates">
            <strong>Dates:</strong> {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}
          </div>
        )}
        <div className="task-assigned">
            <strong>Assigned To:</strong> {assignedUserEmail}
        </div>
      </div>
    </div>
  );
}