/* eslint-disable no-unused-vars */
const express = require('express')
const router = express.Router()
const  protect  = require('../middleware/authMiddleware')
const {createTask,getTasks,getTaskById,updateTask,deleteTask,assignTaskToUser,unassignTaskFromUser,getTaskAssignments} = require('../controllers/tasksController')

// CRUD endpoints for tasks
router.post('/', createTask)
router.get('/', protect, getTasks)
router.get('/:id', protect, getTaskById)
router.put('/:id', protect, updateTask)
router.delete('/:id', protect, deleteTask)

// Endpoints for task assignments
router.post('/:id/assignments', protect, assignTaskToUser)
router.delete('/:id/assignments/:userId', protect, unassignTaskFromUser)
router.get('/:id/assignments', protect, getTaskAssignments)
module.exports = router