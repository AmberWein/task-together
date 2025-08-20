const express = require('express')
const router = express.Router()
const authenticateUser = require('../middleware/authMiddleware')
const { createGroup } = require('../controllers/groupsController')

// CREATE GROUP + ADD MANAGER
router.post('/', authenticateUser, createGroup)

module.exports = router