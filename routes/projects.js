const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const Task = require('../models/task');

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

const mongoose = require('mongoose');

// DELETE route to delete a project by ID
router.delete('/:id', async (req, res) => {
    try {
        const projectId = mongoose.Types.ObjectId(req.params.id);
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).send('Project not found');
        }

        // Delete related tasks
        await Task.deleteMany({ projectId: projectId });

        await project.remove();
        res.status(200).send(`Project ${projectId} and related tasks deleted successfully`);
    } catch (error) {
        console.error('Error deleting project:', error); // Enhanced error logging
        res.status(500).send('Error deleting project: ' + error.message);
    }
});

// PUT route to update a project's status
router.put('/:id/status', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).send('Project not found');
        }
        project.status = req.body.status;
        await project.save();
        res.status(200).json(project);
    } catch (error) {
        res.status(500).send('Error updating project status: ' + error.message);
    }
});

module.exports = router;
