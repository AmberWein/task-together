const express = require('express')
const router = express.Router()
const tasksController = require('../controllers/tasksController')
const { protect } = require('../middleware/authMiddleware')

// CRUD endpoints for tasks
router.post('/', protect, tasksController.createTask)
router.get('/', protect, tasksController.getTasks)
router.get('/:id', protect, tasksController.getTaskById)
router.put('/:id', protect, tasksController.updateTask)
router.delete('/:id', protect, tasksController.deleteTask)

// Endpoints for task assignments
router.post('/:id/assignments', protect, tasksController.assignTaskToUser)
router.delete('/:id/assignments/:userId', protect, tasksController.unassignTaskFromUser)
router.get('/:id/assignments', protect, tasksController.getTaskAssignments)
module.exports = router