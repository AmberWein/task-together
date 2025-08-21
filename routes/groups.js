// const express = require('express')
// const router = express.Router()

// const authenticateUser = require('../middleware/authMiddleware')
// const { createGroup, getGroups, updateGroup, deleteGroup } = require('../controllers/groupsController')

// router.post('/', authenticateUser, createGroup)
// router.get('/my', authenticateUser, getGroups)
// router.put('/:group_id', authenticateUser, updateGroup)
// router.delete('/:group_id', authenticateUser, deleteGroup)

// module.exports = router
const express = require('express')
const router = express.Router()

const authenticateUser = require('../middleware/authMiddleware')
const { 
  createGroup, 
  getGroups, 
  updateGroup, 
  deleteGroup,
  addGroupMember,
  getGroupMembers
} = require('../controllers/groupsController')

// Group routes
router.post('/', authenticateUser, createGroup)
router.get('/', authenticateUser, getGroups)
router.put('/:group_id', authenticateUser, updateGroup)
router.delete('/:group_id', authenticateUser, deleteGroup)

// Member management routes
router.post('/:group_id/members', authenticateUser, addGroupMember)
router.get('/:group_id/members', authenticateUser, getGroupMembers)

module.exports = router
