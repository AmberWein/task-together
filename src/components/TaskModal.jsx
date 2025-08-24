import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import '../CSS/TaskModal.css';

export default function TaskModal({ task, onClose, onSave, isNewTask }) {
  const [editedTask, setEditedTask] = useState(task);
  const [profiles, setProfiles] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  useEffect(() => {
    setEditedTask(task);
    const fetchProfiles = async () => {
      setLoadingProfiles(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, displayed_name');
      if (error) {
        console.error('Error fetching profiles:', error);
      } else {
        setProfiles(data);
      }
      setLoadingProfiles(false);
    };
    fetchProfiles();
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prevTask => ({ ...prevTask, [name]: value }));
  };
  
  const handleAssignedToChange = (e) => {
    const selectedUserId = e.target.value;
    if (selectedUserId) {
        const selectedProfile = profiles.find(p => p.id === selectedUserId);
        setEditedTask(prevTask => ({
            ...prevTask,
            assigned_to: [{ user: selectedProfile }]
        }));
    } else {
        setEditedTask(prevTask => ({
            ...prevTask,
            assigned_to: []
        }));
    }
  };

  const handleSave = () => {
    onSave(editedTask);
  };

  const assignedUserId = editedTask.assigned_to && editedTask.assigned_to.length > 0 
    ? editedTask.task_id ? editedTask.assigned_to[0].user_id : editedTask.assigned_to[0].user.id
    : '';

  return (
    <div className="task-modal-overlay" onClick={onClose}>
      <div className="task-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isNewTask ? 'Create New Task' : 'Edit Task'}</h2>
          <button onClick={onClose} className="close-button"> &times; </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Title:</label>
            <input type="text" name="title" value={editedTask.title || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Group ID:</label>
            <input type="text" name="group_id" value={editedTask.group_id || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Creator:</label>
            <input type="text" value={task.creator?.email || ''} disabled />
          </div>
          <div className="form-group">
            <label>Created At:</label>
            <input type="text" value={editedTask.created_at || ''} disabled />
          </div>
          <div className="form-group">
            <label>Updated At:</label>
            <input type="text" value={editedTask.updated_at || ''} disabled />
          </div>
          <div className="form-group">
            <label>Due Date:</label>
            <input type="date" name="due_date" value={editedTask.due_date ? editedTask.due_date.substring(0, 10) : ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Assigned to:</label>
            <select name="assigned_to" value={assignedUserId} onChange={handleAssignedToChange}>
              <option value="">None</option>
              {loadingProfiles ? (
                <option disabled>Loading members...</option>
              ) : (
                profiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.email}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea name="description" value={editedTask.description || ''} onChange={handleChange}></textarea>
          </div>
          <div className="form-group">
            <label>Recurrence:</label>
            <select name="recurrence" value={editedTask.recurrence || 'NONE'} onChange={handleChange}>
              <option value="NONE">NONE</option>
              <option value="DAILY">DAILY</option>
              <option value="MONTHLY">MONTHLY</option>
              <option value="YEARLY">YEARLY</option>
            </select>
          </div>
          <div className="form-group">
            <label>Status:</label>
            <select name="status" value={editedTask.status || ''} onChange={handleChange}>
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