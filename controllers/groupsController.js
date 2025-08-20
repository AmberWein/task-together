const { supabase } = require('../supabaseClient')

// Create group
async function createGroup(req, res) {
  const { group_name } = req.body
  const user = req.user

  if (!group_name) return res.status(400).json({ error: "group_name is required" })

  try {
    const { data: group, error: groupErr } = await supabase
      .from('groups')
      .insert([{ group_name, creator_id: user.id }])
      .select()
      .single()
    if (groupErr) throw groupErr

    const { data: member, error: memberErr } = await supabase
      .from('group_members')
      .insert([{ group_id: group.group_id, user_id: user.id, role: 'manager' }])
      .select()
      .single()
    if (memberErr) throw memberErr

    res.json({ group, member })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// Read groups (All groups the user is a member of
async function getMyGroups(req, res) {
  const user = req.user
  try {
    const { data, error } = await supabase
      .from('groups')
      .select('*, group_members!inner(role)')
      .eq('group_members.user_id', user.id)
    if (error) throw error

    res.json(data)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

//  Update group (only a manager can)
async function updateGroup(req, res) {
  const { group_id } = req.params
  const { group_name } = req.body

  if (!group_name) return res.status(400).json({ error: "group_name is required" })

  try {
    const { data, error } = await supabase
      .from('groups')
      .update({ group_name })
      .eq('group_id', group_id)
      .select()
      .single()
    if (error) throw error

    res.json(data)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// Delete group (only a manager can)
async function deleteGroup(req, res) {
  const { group_id } = req.params
  try {
    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('group_id', group_id)
    if (error) throw error

    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

module.exports = { createGroup, getMyGroups, updateGroup, deleteGroup }
