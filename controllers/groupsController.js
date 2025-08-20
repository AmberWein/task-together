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

// Get all groups the user belongs to
async function getGroups(req, res) {
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

// Get single group by id
async function getGroupById(req, res) {
  const { id } = req.params
  const user = req.user

  try {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('group_id', id)
      .single()

    if (error) throw error

    // validate user is member
    const { data: membership, error: memErr } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', id)
      .eq('user_id', user.id)
      .single()

    if (memErr || !membership) return res.status(403).json({ error: "Not authorized" })

    res.json({ group: data, role: membership.role })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

//  Update group (only manager allowed by RLS)
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

// Delete group (only manager allowed by RLS)
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

module.exports = { createGroup, getGroups, getGroupById, updateGroup, deleteGroup }
