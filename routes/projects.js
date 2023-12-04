const express = require('express');
const router = express.Router();
const Project = require('../models/project'); // Adjust the path as necessary

// GET route to list all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find(); // Fetch all projects
        res.json(projects); // Send the projects as a JSON response
    } catch (error) {
        res.status(500).send('Error fetching projects: ' + error.message);
    }
});

// POST route to create a new project
router.post('/', async (req, res) => {
    const project = new Project({
        name: req.body.name,
        description: req.body.description,
    });

    try {
        const newProject = await project.save();
        res.status(201).json(newProject);
    } catch (error) {
        res.status(400).send('Error creating project: ' + error.message);
    }
});

// GET route to fetch a single project by ID
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).send('Project not found');
        }
        res.json(project);
    } catch (error) {
        res.status(500).send('Error fetching project: ' + error.message);
    }
});

module.exports = router;
