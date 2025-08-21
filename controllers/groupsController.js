// const { supabase } = require('../supabaseClient')

// // Create group
// async function createGroup(req, res) {
//   const { group_name } = req.body
//   const user = req.user
//   console.log('Authenticated user:', user)
//   console.log('Group name:', group_name)

//   if (!group_name) return res.status(400).json({ error: "group_name is required" })

//   try {
//     console.log('Creating group with:', { group_name, creator_id: user.id });
//     const { data: group, error: groupErr } = await supabase
//       .from('groups')
//       .insert([{ group_name, creator_id: user.id }])
//       .select()
//       .single()
//     if (groupErr) throw groupErr

//     const { data: member, error: memberErr } = await supabase
//       .from('group_members')
//       .insert([{ group_id: group.group_id, user_id: user.id, role: 'manager' }])
//       .select()
//       .single()
//     if (memberErr) throw memberErr

//     res.json({ group, member })
//   } catch (err) {
//     res.status(400).json({ error: err.message })
//   }
// }

// // Get all groups the user belongs to
// async function getGroups(req, res) {
//   const user = req.user
//   try {
//     const { data, error } = await supabase
//       .from('groups')
//       .select('*, group_members!inner(*)')
//       .eq('group_members.user_id', user.id)
//     if (error) throw error

//     res.json(data)
//   } catch (err) {
//     res.status(400).json({ error: err.message })
//   }
// }

// // Update group (only manager allowed by RLS)
// async function updateGroup(req, res) {
//   const { group_id } = req.params
//   const { group_name } = req.body
//   if (!group_name) return res.status(400).json({ error: "group_name is required" })

//   try {
//     const { data, error } = await supabase
//       .from('groups')
//       .update({ group_name })
//       .eq('group_id', group_id)
//       .select()
//       .single()
//     if (error) throw error

//     res.json(data)
//   } catch (err) {
//     res.status(400).json({ error: err.message })
//   }
// }

// // Delete group (only manager allowed by RLS)
// async function deleteGroup(req, res) {
//   const { group_id } = req.params
//   try {
//     const { error } = await supabase
//       .from('groups')
//       .delete()
//       .eq('group_id', group_id)
//     if (error) throw error

//     res.json({ success: true })
//   } catch (err) {
//     res.status(400).json({ error: err.message })
//   }
// }

// module.exports = { createGroup, getGroups, updateGroup, deleteGroup }


// Create group and assign creator as manager
async function createGroup(req, res) {
  const { group_name } = req.body
  const user = req.user

  if (!group_name) return res.status(400).json({ error: 'group_name is required' })

  try {
    const supabaseAuth = req.supabase

    // Create group
    const { data: group, error: groupErr } = await supabaseAuth
      .from('groups')
      .insert([{ group_name, creator_id: user.id }])
      .select()
      .single()
    if (groupErr) throw groupErr

    console.log('Creating group with:', { group_name, creator_id: user.id })

    // Add creator as manager
    const { data: member, error: memberErr } = await supabaseAuth
      .from('group_members')
      .insert([{ group_id: group.group_id, user_id: user.id, role: 'manager' }])
      .select()
      .single()
    if (memberErr) throw memberErr

    res.json({ group, member })
  } catch (err) {
    console.error('Create group error:', err)
    res.status(400).json({ error: err.message })
  }
}

// Get all groups the user belongs to
async function getGroups(req, res) {
  const user = req.user

  try {
    const supabaseAuth = req.supabase

    const { data, error } = await supabaseAuth
      .from('group_members')
      .select(`
        role,
        created_at,
        groups (
          group_id,
          group_name,
          creator_id,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', user.id)
    if (error) return res.status(400).json({ error: error.message })

    const groups = data.map(item => ({
      ...item.groups,
      user_role: item.role,
      joined_at: item.created_at
    }))

    res.json(groups)
  } catch (err) {
    console.error('Get groups error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Update group (only managers allowed)
async function updateGroup(req, res) {
  const { group_id } = req.params
  const { group_name } = req.body
  const user = req.user

  if (!group_name) return res.status(400).json({ error: "group_name is required" })

  try {
    const supabaseAuth = req.supabase

    const { data: membership, error: memberError } = await supabaseAuth
      .from('group_members')
      .select('role')
      .eq('group_id', group_id)
      .eq('user_id', user.id)
      .single()

    if (memberError || !membership)
      return res.status(403).json({ error: 'Not a member of this group' })

    if (membership.role !== 'manager')
      return res.status(403).json({ error: 'Only managers can update groups' })

    const { data, error } = await supabaseAuth
      .from('groups')
      .update({ group_name, updated_at: new Date().toISOString() })
      .eq('group_id', group_id)
      .select()
      .single()

    if (error) return res.status(400).json({ error: error.message })

    res.json(data)
  } catch (err) {
    console.error('Update group error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Delete group (only managers allowed)
async function deleteGroup(req, res) {
  const { group_id } = req.params
  const user = req.user

  try {
    const supabaseAuth = req.supabase

    const { data: membership, error: memberError } = await supabaseAuth
      .from('group_members')
      .select('role')
      .eq('group_id', group_id)
      .eq('user_id', user.id)
      .single()

    if (memberError || !membership)
      return res.status(403).json({ error: 'Not a member of this group' })

    if (membership.role !== 'manager')
      return res.status(403).json({ error: 'Only managers can delete groups' })

    const { error: membersError } = await supabaseAuth
      .from('group_members')
      .delete()
      .eq('group_id', group_id)
    if (membersError) return res.status(400).json({ error: membersError.message })

    const { error: groupError } = await supabaseAuth
      .from('groups')
      .delete()
      .eq('group_id', group_id)
    if (groupError) return res.status(400).json({ error: groupError.message })

    res.json({ success: true })
  } catch (err) {
    console.error('Delete group error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Add member (only managers)
async function addGroupMember(req, res) {
  const { group_id } = req.params
  const { user_id, role = 'member' } = req.body
  const user = req.user

  if (!user_id) return res.status(400).json({ error: "user_id is required" })

  try {
    const supabaseAuth = req.supabase

    const { data: membership, error: memberError } = await supabaseAuth
      .from('group_members')
      .select('role')
      .eq('group_id', group_id)
      .eq('user_id', user.id)
      .single()

    if (memberError || !membership || membership.role !== 'manager')
      return res.status(403).json({ error: 'Only managers can add members' })

    const { data, error } = await supabaseAuth
      .from('group_members')
      .insert([{ group_id: parseInt(group_id), user_id, role }])
      .select()
      .single()
    if (error) return res.status(400).json({ error: error.message })

    res.json(data)
  } catch (err) {
    console.error('Add member error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Get group members (only members can view)
async function getGroupMembers(req, res) {
  const { group_id } = req.params
  const user = req.user

  try {
    const supabaseAuth = req.supabase

    const { data: membership, error: memberError } = await supabaseAuth
      .from('group_members')
      .select('role')
      .eq('group_id', group_id)
      .eq('user_id', user.id)
      .single()

    if (memberError || !membership)
      return res.status(403).json({ error: 'Not a member of this group' })

    const { data, error } = await supabaseAuth
      .from('group_members')
      .select('*')
      .eq('group_id', group_id)
    if (error) return res.status(400).json({ error: error.message })

    res.json(data)
  } catch (err) {
    console.error('Get members error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { 
  createGroup, 
  getGroups, 
  updateGroup, 
  deleteGroup,
  addGroupMember,
  getGroupMembers
}