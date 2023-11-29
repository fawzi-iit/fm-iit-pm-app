const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    // ... existing fields ...
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assuming a User model exists
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    deadline: Date,
    progress: { type: Number, default: 0 } // Percentage of task completion
});

module.exports = mongoose.model('Task', taskSchema);
