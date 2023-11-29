const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// Update existing routes to handle tasks within the context of a project
// Example: GET route to list tasks for a specific project
router.get('/tasks/:projectId', async (req, res) => {
    try {
        const tasks = await Task.find({ projectId: req.params.projectId });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Modify other task routes accordingly

module.exports = router;
