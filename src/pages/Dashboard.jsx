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
  const [isNewTask, setIsNewTask] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks') 
        .select('*')
        .order('task_id', { ascending: true });

      if (tasksError) throw tasksError;
 
      const { data: usersData, error: usersError } = await supabase
        .from('auth.users')
        .select('id, email, displayed_name');
 
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('taskassignments')
        .select('task_id, user_id');
 
      if (usersError || assignmentsError) throw (usersError || assignmentsError);
 
      const usersMap = usersData.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
       }, {});
 
      const assignmentsMap = assignmentsData.reduce((acc, assignment) => {
        if (!acc[assignment.task_id]) acc[assignment.task_id] = [];
        acc[assignment.task_id].push(assignment.user_id);
        return acc;
       }, {});
 
       // איחוד הנתונים
      const mergedTasks = tasksData.map(task => {
        const creator = usersMap[task.creator_id] || {};
        const assignedUserIds = assignmentsMap[task.task_id] || [];
        const assignedUsers = assignedUserIds.map(userId => usersMap[userId]).filter(Boolean);
 
        return {
          ...task,
          creator: { email: creator.email || 'N/A' },
          assigned_to: assignedUsers.map(user => ({ user: { email: user.email, displayed_name: user.displayed_name } })),
       };
      });
 
      setTasks(mergedTasks);
    }catch (error) {
      console.error('Error fetching tasks:', error.message);
      alert('Failed to fetch tasks: ' + error.message);
    }finally {
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

  const openTaskModal = (task, isNew = false) => {
    setSelectedTask(task);
    setIsNewTask(isNew);
  };

  const closeTaskModal = () => {
    setSelectedTask(null);
    setIsNewTask(false);
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
      let error = null;
      if (isNewTask) {
        const { error: insertError } = await supabase
          .from('tasks')
          .insert({
            ...updatedTask,
            creator_id: session.user.id,
          });
        error = insertError;
      } else {
        const { error: updateError } = await supabase
          .from('tasks')
          .update(updatedTask)
          .eq('task_id', updatedTask.task_id);
        error = updateError;
      }

      if (error) {
        if (error.message.includes('not permitted')) {
          alert('Error: You are not authorized to update this task.');
        } else {
          alert('Error updating task: ' + error.message);
        }
        throw error;
      }

      fetchTasks();
      closeTaskModal();
    } catch (error) {
      console.error('Error saving task:', error.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('task_id', taskId);

        if (error) {
          alert('Error deleting task: ' + error.message);
        } else {
          fetchTasks(); 
        }
      } catch (error) {
        console.error('Error deleting task:', error.message);
      }
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
            return task.assigned_to.some(a => a.user.email === supabase.auth.user().email);
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
        <button className="add-task-btn" onClick={() => openTaskModal({}, true)}>
          +
        </button>
      </div>
      <div className="task-list">        
        {displayedTasks.length > 0 ? (displayedTasks.map((task) => (
          <div key={task.task_id} onClick={() => openTaskModal(task)} style={{ position: 'relative' }}>
             <button 
                className="delete-task-btn" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  handleDeleteTask(task.task_id);
                }}
              ></button>
            <div onClick={() => openTaskModal(task)} style={{ cursor: 'pointer' }}>
                <TaskCard task={task} />
            </div>
          </div>
        ))
        ) : (
          <p className="no-tasks-message">No tasks to display based on your selection.</p>
        )}
      </div>

      {selectedTask && (
        <TaskModal task={selectedTask} onClose={closeTaskModal} onSave={handleSaveTask} isNewTask={isNewTask}/>
      )}
    </div>
  );
}

