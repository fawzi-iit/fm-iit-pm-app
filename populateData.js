const mongoose = require('mongoose');
const Task = require('./models/task');
const Project = require('./models/project');

mongoose.connect('mongodb://localhost:27017/iitappdb', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

async function populateData() {
  try {
    // Create a new project
    const project = new Project({
      name: 'Project 1',
      description: 'Sample Project',
    });
    await project.save();

    // Create tasks associated with the project
    const tasks = [
      new Task({ title: 'Task 3', description: 'Description 3', status: 'Open', projectId: project._id }),
      new Task({ title: 'Task 4', description: 'Description 4', status: 'In Progress', projectId: project._id }),
      // Add more tasks as needed
    ];

    for (const task of tasks) {
      await task.save();
    }

    console.log('Data populated successfully');
  } catch (error) {
    console.error('Error populating data:', error);
  } finally {
    mongoose.connection.close();
  }
}

populateData();
