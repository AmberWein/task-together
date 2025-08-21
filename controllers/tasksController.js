const { supabase } = require('../supabaseClient')

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
    const { title, description, due_date, group_id } = req.body
    const creator_id = req.user.id
    const { data, error } = await supabase
        .from('tasks')
        .insert([{ title, description, due_date, group_id, creator_id }])

    if (error) {
        return res.status(400).json({ error: error.message })
    }
    res.status(201).json(data[0])
}

// @desc    Get all tasks for the authenticated user's groups
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
    const userId = req.user.id
    const { data, error } = await supabase
        .from('tasks')
        .select(`
            *,
            group_members(user_id)
        `)
        .eq('group_members.user_id', userId);

    if (error) {
        return res.status(400).json({ error: error.message })
    }
    res.status(200).json(data)
}

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
    const { id } = req.params
    const { title, description, due_date, status } = req.body
    const { data, error } = await supabase
        .from('tasks')
        .update({ title, description, due_date, status })
        .eq('task_id', id)

    if (error) {
        return res.status(400).json({ error: error.message })
    }
    res.status(200).json(data[0])
}

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
    const { id } = req.params

    const { data, error } = await supabase
        .from('tasks')
        .delete()
        .eq('task_id', id)

    if (error) {
        return res.status(400).json({ error: error.message })
    }
    res.status(200).json({ message: 'Task deleted successfully' })
}

// @desc    Assign a task to a user
// @route   POST /api/tasks/:taskId/assign
// @access  Private
exports.assignTaskToUser = async (req, res) => {
    const { taskId } = req.params
    const { userId } = req.body

    const { data, error } = await supabase
        .from('taskassignments')
        .insert([{ task_id: taskId, user_id: userId }])

    if (error) {
        return res.status(400).json({ error: error.message })
    }
    res.status(201).json(data[0])
}

// @desc    Unssign a task from a user
// @route   DELETE /api/tasks/:taskId/assign
// @access  Private
exports.assignTaskToUser = async (req, res) => {
    const { id, userId } = req.params

    const { data, error } = await supabase
        .from('taskassignments')
        .delete()
        .eq('task_id', id)
        .eq('user_id', userId)

    if (error) {
        return res.status(400).json({ error: error.message })
    }
    res.status(201).json({ message: 'Task unassigned successfully' })
}

// @desc    Get all users assigned to a specific task
// @route   GET /api/tasks/:id/assignments
// @access  Private
exports.getTaskAssignments = async (req, res) => {
    const { id } = req.params

    const { data, error } = await supabase
        .from('taskassignments')
        .select(`
            user_id,
            users(email)
        `)
        .eq('task_id', id)

    if (error) {
        return res.status(400).json({ error: error.message })
    }
    res.status(200).json(data)
}