const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({

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
        enum:  ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started'
    },
    progress: {
        type: Number,
        default: 0,
        validate: {
            validator: function(v) {
                return v >= 0 && v <= 100;
            },
            message: props => `${props.value} is not a valid progress percentage!`
        }
    },
});

// Static method to update a task
taskSchema.statics.updateTask = async function(taskId, status, progress, priority) {
    try {
        return await this.findByIdAndUpdate(taskId, { status, progress, priority }, { new: true });
    } catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
};

module.exports = mongoose.model('Task', taskSchema);
