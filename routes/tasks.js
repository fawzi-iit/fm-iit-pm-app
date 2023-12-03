const express = require('express');
const router = express.Router();
const Task = require('../models/task');

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
        //const tasks = await Task.find({ projectId: req.params.projectId });
        const tasks = await Task.find({ projectId: req.params.projectId }).populate('assignee');
        res.json(tasks);
    } catch (error) {
        res.status(500).send('Error fetching tasks for project: ' + error.message);
    }
});

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find().populate('assignee');
        res.render('taskList', { tasks: tasks });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/tasks/create', (req, res) => {
    const projectId = req.query.projectId;
    res.render('createTask', { projectId });
});

// POST route to create a new task
router.post('/', async (req, res) => {
    // Validate projectId
    if (!req.body.projectId) {
        return res.status(400).send('Project ID is required');
    }

    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        projectId: req.body.projectId,
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Task creation error:', error); // Added for better error logging
        res.status(400).send('Error creating task: ' + error.message);
    }
});

// Update a task
router.put('/tasks/:id', async (req, res) => {
    try {
        const { status, progress, priority } = req.body;
        const updatedTask = await Task.updateTask(req.params.id, status, progress, priority);
        res.json(updatedTask);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.patch('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const update = {};

        // Validate and set the fields if they exist in the request body
        if (req.body.priority) update.priority = req.body.priority;
        if (req.body.status) update.status = req.body.status;
        if (req.body.progress) update.progress = req.body.progress;

        // Log the incoming update for debugging
        console.log("PATCH request received for task ID:", req.params.id);
        console.log("Request body:", req.body);

        const updatedTask = await Task.findByIdAndUpdate(id, update, { new: true });

        if (!updatedTask) {
            return res.status(404).send('Task not found');
        }

        res.json(updatedTask);
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(500).send(err);
    }
});

module.exports = router;
