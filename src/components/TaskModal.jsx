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
            <label>Group ID:</label>
            <input type="text" name="group_id" value={editedTask.group_id || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Creator ID:</label>
            <input type="text" name="creator_id" value={editedTask.creator_id.name || ''} disabled />
          </div>
          <div className="form-group">
            <label>Created At:</label>
            <input type="text" name="created_at" value={editedTask.created_at || ''} disabled />
          </div>
          <div className="form-group">
            <label>Updated At:</label>
            <input type="text" name="updated_at" value={editedTask.updated_at || ''} disabled />
          </div>
          <div className="form-group">
            <label>Due Date:</label>
            <input type="date" name="due_date" value={editedTask.due_date ? editedTask.due_date.substring(0, 10) : ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Assignrd to:</label>
            <input type="text" name="members" value={editedTask.members ? editedTask.members.join(', ') : ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea name="description" value={editedTask.description || ''} onChange={handleChange}></textarea>
          </div>
          <div className="form-group">
            <label>Recurrence:</label>
            <input type="text" name="recurrence" value={editedTask.recurrence || ''} onChange={handleChange} />
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
