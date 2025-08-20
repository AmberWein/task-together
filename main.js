const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

async function getToken() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'SUPERBASE_EMAIL',
    password: SUPERBASE_PASSWORD
  })

  if (error) {
    console.log('Error:', error.message)
  } else {
    console.log('JWT Token:', data.session.access_token)
  }
}

getToken()