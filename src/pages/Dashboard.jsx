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
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('none');
  const [currentUserId, setCurrentUserId] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks') 
        .select('*,  creator:creator_id ( email )')
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
    const fetchUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
        if (session) {
          setCurrentUserId(session.user.id);
      }
    };
    fetchUser();
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

  const getFilteredAndSortedTasks = () => {
    let filteredTasks = tasks;

    // Filtering logic
    if (filter !== 'all') {
      filteredTasks = filteredTasks.filter(task => {
        switch (filter) {
          case 'assigned-to-me':
            return task.assigned_to === currentUserId; 
          case 'completed':
            return task.status === 'DONE';
          case 'to-do':
            return task.status === 'TO DO';
          case 'in-progress':
            return task.status === 'IN PROCESS';
          case 'overdue':
            if (!task.due_date) return false;
            const dueDate = new Date(task.due_date);
            const now = new Date();
            return dueDate < now;
          case 'no-dates':
            return !task.due_date;
          default:
            return true;
        }
      });
    }

    if (sortBy === 'due-date') {
      filteredTasks.sort((a, b) => {
        if (!a.due_date && !b.due_date) return 0;
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date) - new Date(b.due_date);
      });
    }

    return filteredTasks;
  };

  const displayedTasks = getFilteredAndSortedTasks();

  return (
    <div className={`dashboard-container ${selectedTask ? 'modal-open' : ''}`}>
      <h1 className="dashboard-title">Task Management Board</h1>
      <div className="controls-bar">
        <div className="filter-group">
          <label htmlFor="filter">Filter By:</label>
          <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Tasks</option>
            <option value="assigned-to-me">Assigned to me</option>
            <option value="completed">Completed</option>
            <option value="to-do">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="overdue">Overdue</option>
            <option value="no-dates">No Dates</option>
          </select>
        </div>
        <div className="sort-group">
          <label htmlFor="sort">Sort By:</label>
          <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="none">None</option>
            <option value="due-date">Due Date</option>
          </select>
        </div>
      </div>
      <div className="task-list">        
        {displayedTasks.length > 0 ? (displayedTasks.map((task) => (
          <div key={task.task_id} onClick={() => openTaskModal(task)} style={{ cursor: 'pointer' }}>
            <TaskCard task={task} />
          </div>
        ))
        ) : (
          <p className="no-tasks-message">No tasks to display based on your selection.</p>
        )}
      </div>

      {selectedTask && (
        <TaskModal task={selectedTask} onClose={closeTaskModal} onSave={handleSaveTask}/>
      )}
    </div>
  );
}

