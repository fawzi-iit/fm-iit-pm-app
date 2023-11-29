const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Import routes
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/index'); // Assuming this is your task route file
// Add other route imports as necessary

const app = express();

// Connect to MongoDB
mongoose.connect('your_mongodb_connection_string', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Set view engine to Pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);
// Add other app.use() for additional routes

// Basic error handling
app.use((req, res, next) => {
  res.status(404).send('Sorry, that route does not exist!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

