const express = require('express')
const cors = require('cors')
require('dotenv').config()

const groupsRoutes = require('./routes/groups')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/groups', groupsRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))