import { supabase } from "../supabaseClient";
import { formatDistanceToNow, parseISO } from "date-fns";

/**
 * Fetch task stats for a user
 * Returns: { pending: number, completed: number }
 */
export async function getTaskStats(userId) {
  try {
    // 1. Get groups of the user
    const { data: userGroups, error: groupsError } = await supabase
      .from("group_members")
      .select("group_id")
      .eq("user_id", userId);

    if (groupsError) throw groupsError;

    const groupIds = userGroups.map(g => g.group_id);

    if (groupIds.length === 0) return { pending: 0, completed: 0 };

    // 2. Get all tasks in these groups
    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select("task_id, status")
      .in("group_id", groupIds);

    if (tasksError) throw tasksError;

    const pending = tasks.filter(t => t.status === "to-do").length;
    const completed = tasks.filter(t => t.status === "completed").length;

    return { pending, completed };
  } catch (error) {
    console.error("Error fetching task stats:", error);
    return { pending: 0, completed: 0 };
  }
}

/**
 * Fetch active groups for a user
 */
export async function getActiveGroups(userId) {
  const { data, error } = await supabase
    .from("group_members")
    .select("group_id, groups(group_name)")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching groups:", error);
    return [];
  }
  return data;
}

/**
 * Fetch recent activity for the homepage feed
 */
export async function getRecentActivity(userId) {
  const { data, error } = await supabase
    .from("tasks")
    .select(
      `
      task_id,
      title,
      status,
      updated_at,
      creator_id,
      taskassignments(user_id)
    `
    )
    .order("updated_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching activity:", error);
    return [];
  }

  return data.map((task) => ({
    user: task.creator_id,
    action: `updated '${task.title}'`,
    time: formatDistanceToNow(parseISO(task.updated_at), { addSuffix: true }),
    status: task.status,
  }));
}
