const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, tasksController.createTask); // Create a new task
router.get('/', protect, tasksController.getTasks); // Get all tasks
router.get('/:id', protect, tasksController.getTaskById); // Get a single task by ID
router.put('/:id', protect, tasksController.updateTask); // Update a task
router.delete('/:id', protect, tasksController.deleteTask); // Delete a task

module.exports = router;