import { useEffect, useState } from 'react';
import { requireAuth } from '../lib/requireAuth';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { supabase } from '../lib/supabaseClient'; 
import '../CSS/Dashboard.css';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks') 
        .select('*')
        .order('task_id', { ascending: true });

      if (error) throw error;
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
      alert('Failed to fetch tasks: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requireAuth(); 
    fetchTasks();
  }, []);

  const openTaskModal = (task) => {
    setSelectedTask(task);
  };

  const closeTaskModal = () => {
    setSelectedTask(null);
  };

  const handleSaveTask = async (updatedTask) => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        alert('You must be logged in to update a task.');
        return;
      }
      const user = session.user;
      if (!user) {
        alert('You must be logged in to update a task.');
        return;
      }

      const { data, error } = await supabase
        .from('tasks')
        .update(updatedTask)
        .eq('task_id', updatedTask.task_id);

      if (error) {
        if (error.message.includes('not permitted')) {
          alert('Error: You are not authorized to update this task.');
        } else {
          alert('Error updating task: ' + error.message);
        }
        throw error;
      }

      setTasks(tasks.map(task => (task.task_id === updatedTask.task_id ? updatedTask : task)));
      closeTaskModal();
    } catch (error) {
      console.error('Error saving task:', error.message);
    }
  };

  if (loading) {
    return <div className="loading-state">Loading tasks...</div>;
  }

  return (
    <div className={`dashboard-container ${selectedTask ? 'modal-open' : ''}`}>
      <h1 className="dashboard-title">Task Management Board</h1>
      <div className="task-list">
        {tasks.map((task) => (
          <div key={task.task_id} onClick={() => openTaskModal(task)} style={{ cursor: 'pointer' }}>
            <TaskCard task={task} />
          </div>
        ))}
      </div>

      {selectedTask && (
        <TaskModal task={selectedTask} onClose={closeTaskModal} onSave={handleSaveTask}/>
      )}
    </div>
  );
}

