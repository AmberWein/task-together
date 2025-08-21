import React, { useState } from 'react';
import '../CSS/TaskModal.css';

export default function TaskModal({ task, onClose , onSave}) {
  const initialTaskState = {
    ...task,
    members: task.members || []
  };
  const [editedTask, setEditedTask] = useState(initialTaskState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prevTask => ({
      ...prevTask,
      ...(name === 'members' ? { [name]: value.split(',').map(s => s.trim()) } : { [name]: value }),
    }));
  };

  const handleStatusChange = (e) => {
    setEditedTask(prevTask => ({ ...prevTask, status: e.target.value }));
  };

  const handleSave = () => {
    onSave(editedTask);
  };

  return (
    <div className="task-modal-overlay">
      <div className="task-modal">
        <div className="modal-header">
          <h2>Edit Task</h2>
          <button onClick={onClose} className="close-button">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Title:</label>
            <input type="text" name="title" value={editedTask.title} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Group:</label>
            <input type="text" name="group" value={editedTask.group} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Manager:</label>
            <input type="text" name="manager" value={editedTask.manager} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Start Date:</label>
            <input type="date" name="startDate" value={editedTask.startDate} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>End Date:</label>
            <input type="date" name="endDate" value={editedTask.endDate} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Members (comma-separated):</label>
            <input type="text" name="members" value={editedTask.members ? editedTask.members.join(', ') : ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea name="description" value={editedTask.description} onChange={handleChange}></textarea>
          </div>
          <div className="form-group">
            <label>Status:</label>
            <select value={editedTask.status} onChange={handleStatusChange}>
              <option value="TO DO">TO DO</option>
              <option value="IN PROCESS">IN PROCESS</option>
              <option value="DONE">DONE</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={handleSave} className="save-button">Save Changes</button>
          <button onClick={onClose} className="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  );
}
