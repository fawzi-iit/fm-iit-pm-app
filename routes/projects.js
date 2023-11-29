const express = require('express');
const router = express.Router();
const Project = require('../models/project');

// Add routes for creating, viewing, updating, and deleting projects
// Example: GET route to list all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add other routes (POST, PUT, DELETE) here

module.exports = router;
