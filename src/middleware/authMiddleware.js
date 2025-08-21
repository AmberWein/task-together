const { supabase } = require('../supabaseClient')

// Middleware for user identification using JWT
async function authenticateUser(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1] // Bearer <token>
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return res.status(401).json({ error: 'Unauthorized' })

  req.user = user
  next()
}

module.exports = authenticateUser