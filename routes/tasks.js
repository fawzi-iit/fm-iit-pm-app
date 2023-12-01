const express = require('express');
const router = express.Router();
const Task = require('../models/task'); // Adjust the path as necessary

// GET route to list all tasks (general)
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).send('Error fetching tasks: ' + error.message);
    }
});

// GET route to list tasks for a specific project
router.get('/project/:projectId', async (req, res) => {
    try {
        const tasks = await Task.find({ projectId: req.params.projectId });
        res.json(tasks);
    } catch (error) {
        res.status(500).send('Error fetching tasks for project: ' + error.message);
    }
});

// POST route to create a new task
router.post('/', async (req, res) => {
    const task = new Task({
        // Assuming your Task model has fields like title, description, projectId, etc.
        title: req.body.title,
        description: req.body.description,
        projectId: req.body.projectId,
        // ... other fields ...
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).send('Error creating task: ' + error.message);
    }
});

// Additional routes for updating and deleting tasks can also be added here

module.exports = router;
