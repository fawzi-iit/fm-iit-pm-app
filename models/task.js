const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    // ... existing fields ...
    title: {
        type: String,
        required: true // Assuming each task should have a title
    },
    description: {
        type: String,
        required: true // Assuming each task should have a description
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true // Assuming each task is associated with a project
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming a User model exists
        required: false // Set to true if every task must have an assignee
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started'
    },
    deadline: Date,
    progress: {
        type: Number,
        default: 0 // Percentage of task completion
    }
    // Add any other fields as necessary
});

module.exports = mongoose.model('Task', taskSchema);
