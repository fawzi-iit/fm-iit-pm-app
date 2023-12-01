const express = require('express');
const router = express.Router();

// Example: GET route to list tasks for a specific project
router.get('/tasks/:projectId', (req, res) => {
    const projectId = req.params.projectId;
    // Logic to fetch tasks for the given projectId
    // For now, sending a placeholder response
    res.send(`Tasks for project ID: ${projectId}`);
});

module.exports = router;
