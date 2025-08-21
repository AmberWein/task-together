const { supabase } = require('../supabaseClient')

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

module.exports = { createGroup }