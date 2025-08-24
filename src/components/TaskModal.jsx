import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import '../CSS/TaskModal.css';

export default function TaskModal({ task, onClose , onSave, isNewTask}) {
  const [editedTask, setEditedTask] = useState({ 
    ...task,
    assigned_to: (task.assigned_to && task.assigned_to.length > 0) ? task.assigned_to[0].user.email : null,
    recurrence: task.recurrence || 'NONE',
  });
  const [groupMembers, setGroupMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    if (editedTask.group_id) {
      fetchGroupMembers(editedTask.group_id);
    }
  }, [editedTask.group_id]);

  const fetchGroupMembers = async (groupId) => {
    setLoadingMembers(true);
    try {
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          user_id,
          user:user_id ( email, displayed_name )
        `)
        .eq('group_id', groupId);
      
      if (error) throw error;
      setGroupMembers(data.map(member => member.user));
    } catch (error) {
      console.error('Error fetching group members:', error.message);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prevTask => ({
      ...prevTask,
      [name]: value,
    }));
  };


  const handleSave = () => {
    onSave(editedTask);
  };

  return (
    <div className="task-modal-overlay">
      <div className="task-modal">
        <div className="modal-header">
          <h2>{isNewTask ? 'Create New Task' : 'Edit Task'}</h2>
          <button onClick={onClose} className="close-button">
            &times;
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
            <label>Creator:</label>
            <input type="text" name="creator_id" value={task.creator?.email || ''} disabled />
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
            <label>Assigned to:</label>
            <select name="assigned_to" value={editedTask.assigned_to || ''} onChange={handleChange}>
              <option value="">None</option>
              {loadingMembers ? (
                <option disabled>Loading members...</option>
              ) : (
                groupMembers.map((member) => (
                  <option key={member.user_id} value={member.email}>
                    {member.email}
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
            <select name="recurrence" value={editedTask.recurrence} onChange={handleChange}>
              <option value="NONE">NONE</option>
              <option value="DAILY">DAILY</option>
              <option value="MONTHLY">MONTHLY</option>
              <option value="YEARLY">YEARLY</option>
            </select>
          </div>
          <div className="form-group">
            <label>Status:</label>
            <select value={editedTask.status || ''} onChange={handleChange}>
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
