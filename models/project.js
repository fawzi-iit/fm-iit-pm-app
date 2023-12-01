const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    startDate: Date,
    endDate: Date,
    status: { type: String, enum: ['Active', 'Completed', 'On Hold'], default: 'Active' }
});

const Project = mongoose.model('Project', projectSchema);
module.exports = mongoose.model('Project', projectSchema);
