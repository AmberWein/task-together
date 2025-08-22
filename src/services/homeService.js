import { supabase } from '../supabaseClient';
import { formatDistanceToNow, parseISO } from 'date-fns';


/**
 * Fetch task stats for a user
 * Returns: { pending: number, completed: number }
 */
export async function getTaskStats(userId) {
  // Pending tasks
  const { count: pending } = await supabase
    .from('taskassignments')
    .select('task_id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'to-do'); // will need to join tasks to filter status

  // Completed tasks
  const { count: completed } = await supabase
    .from('taskassignments')
    .select('task_id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'completed'); // same as above

  return {
    pending: pending || 0,
    completed: completed || 0,
  };
}

/**
 * Fetch active groups for a user
 */
export async function getActiveGroups(userId) {
  const { data, error } = await supabase
    .from('group_members')
    .select('group_id, groups(group_name)')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching groups:', error);
    return [];
  }
  return data;
}

/**
 * Fetch recent activity for the homepage feed
 */
export async function getRecentActivity(userId) {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      task_id,
      title,
      status,
      updated_at,
      creator_id,
      taskassignments(user_id)
    `)
    .order('updated_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching activity:', error);
    return [];
  }

  return data.map((task) => ({
    user: task.creator_id,
    action: `updated '${task.title}'`,
    time: formatDistanceToNow(parseISO(task.updated_at), { addSuffix: true }), 
    status: task.status,
  }));
}
