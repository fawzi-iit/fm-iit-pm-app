const mongoose = require('mongoose');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const projectsRouter = require('./routes/projects');
const tasksRouter = require('./routes/tasks');

const app = express();

// MongoDB connection
const mongoDB = 'mongodb://fm-iit-app-server:YRYYtrpKhIjh9BqTgLU1ZCeuXF0LRT9pPvTG4qnf0tMumcMUv4Xip8oXfkFWj9o428VSvIiLFrQ4ACDbInpNlg==@fm-iit-app-server.mongo.cosmos.azure.com:10255/fm-iit-app-database?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@fm-iit-app-server@';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// MongoDB connection
//const { getConnectionInfo } = require('./config/connection');

//async function init() {
//  try {
//    await getConnectionInfo();
//	}
//  	catch (error) {
//    console.error('Failed to initialize application:', error);
//    process.exit(1); // Exit if initialization fails
//  }
//}

// init();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Logger middleware
app.use(logger('dev'));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cookie parsing middleware
app.use(cookieParser());

// Static file serving middleware
app.use(express.static(path.join(__dirname, 'public')));

// Route handlers
app.use('/', indexRouter);
app.use('/projects', projectsRouter);
app.use('/tasks', tasksRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Set the port to the environment variable PORT, or 3000 if it's not set
const port = process.env.PORT || 3000;

// Start the server on the specified port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
