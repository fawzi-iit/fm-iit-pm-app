let currentProjectId = null;

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        loadProjects();
    } else if (window.location.pathname.includes('projects.html')) {
        loadProjectsForProjectsPage();
    } else if (window.location.pathname.includes('tasks.html')) {
        loadTasks();
    }
});


// New functions Dec 5th 11:50
function loadProjectsForIndex() {
    // Logic to load projects specifically for index.html
    // Use existing logic from loadProjects but adapt for index.html
}

function loadProjectsForProjectsPage() {
    // Logic to load projects specifically for projects.html
    // Use existing logic from loadProjects but adapt for projects.html
}

function loadProjectsForProjectsPage() {
    fetch('/projects')
        .then(response => response.json())
        .then(projects => {
            const projectsContainer = document.getElementById('projects');
            projectsContainer.innerHTML = '';

            projects.forEach(project => {
                const projectDiv = document.createElement('div');
                projectDiv.className = 'project';
                projectDiv.innerHTML = `
                    <h2><a href="#" data-projectid="${project._id}" class="project-link">${project.name}</a></h2>
                    <p>${project.description}</p>
                    <p>${project.status}</p>
                `;
                projectsContainer.appendChild(projectDiv);
            });
            attachProjectClickHandlers();
        })
        .catch(error => console.error('Error:', error));
}


// End of New functions Dec 5th 11:50

    // Event listener for the 'Project Dashboard' link
    const dashboardLink = document.getElementById('dashboardLink');
    if (dashboardLink) {
        dashboardLink.addEventListener('click', function(event) {
            event.preventDefault();
            loadProjects();
            hideCreateProjectForm();
            hideCreateTaskForm();
        });
    }
    
    const showCreateProjectFormButton = document.getElementById('showCreateProjectFormButton');
    if (showCreateProjectFormButton) {
        showCreateProjectFormButton.addEventListener('click', function() {
            document.getElementById('createProjectForm').classList.remove('hidden');
        });
    }

document.querySelectorAll('.task-priority, .task-status, .task-progress').forEach(element => {
    console.log("Attaching event listener to:", element);
    element.addEventListener('change', async (event) => {
        const taskId = event.target.dataset.taskId;
        let propertyName = '';
        if (event.target.classList.contains('task-priority')) {
            propertyName = 'priority';
        } else if (event.target.classList.contains('task-status')) {
            propertyName = 'status';
        } else if (event.target.classList.contains('task-progress')) {
            propertyName = 'progress';
        }

        const updatedValue = { [propertyName]: event.target.value };
        

        // Debugging: Log the data being sent
        console.log("Updating task:", taskId, "Property:", propertyName, "Value:", event.target.value);

        try {
            const response = await fetch(`/tasks/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedValue),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Debugging: Log the response
            console.log("Response:", response);

            // Handle successful response here, if needed
        } catch (error) {
            console.error('Fetch error:', error);
        }
    });
});

// New function to handle task updates
function handleTaskUpdate(e) {
    e.preventDefault();

    const taskId = this.getAttribute('data-task-id'); // Adjust as needed
    const formData = new FormData(this);
    const data = {
        status: formData.get('status'),
        progress: formData.get('progress'),
        priority: formData.get('priority')
    };

    fetch(`/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Handle success (e.g., update the UI or redirect)
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Event listener for Project List Button
document.addEventListener('DOMContentLoaded', function() {
    const projectListButton = document.getElementById('projectListButton');
    if (projectListButton) {
        projectListButton.addEventListener('click', function() {
            window.location.href = '/projects.html'; // Update the path if necessary
        });
    } else {
        console.log('Project List Button not found');
    }
});


// Event listener for navigating to the tasks page
document.addEventListener('DOMContentLoaded', function() {
const tasksPageButton = document.getElementById('tasksPageButton');
if (tasksPageButton) {
    tasksPageButton.addEventListener('click', function() {
        window.location.href = '/tasks.html';
    });
}

// Add event listener for task update form
document.addEventListener('DOMContentLoaded', function() {
    const updateForms = document.querySelectorAll('.task-update-form'); // Adjust selector as needed
    updateForms.forEach(form => form.addEventListener('submit', handleTaskUpdate));
    console.log("Event listener triggered for task update");
});

// Attach event listeners to delete buttons
const deleteButtons = document.querySelectorAll('.delete-task-button'); // Adjust the selector as needed
deleteButtons.forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        const taskId = this.getAttribute('data-task-id'); // Ensure you have a data attribute for task ID
        if (confirm("Are you sure you want to delete this task?")) {
            deleteTask(taskId);
        }
    });
});

});

// Event listener for the 'Show Create Task' button
// const showCreateTaskFormButton = document.getElementById('showCreateTaskFormButton');
// showCreateTaskFormButton.addEventListener('click', function() {
//    if (currentProjectId) {
//        document.getElementById('projectIdField').value = currentProjectId;
//        document.getElementById('createTaskForm').classList.remove('hidden');
//        }
//    });

// Function to confirm and delete a task
function confirmDelete(taskId) {
    if (confirm("Are you sure you want to delete this task?")) {
        deleteTask(taskId);
    }
}

// Function to handle task deletion
function deleteTask(taskId) {
    fetch(`/tasks/${taskId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // Handle successful deletion here, like removing the task from the DOM
        console.log("Task deleted:", taskId);
    })
    .catch(error => console.error('Error:', error));
}

function createProject() {
    const name = document.getElementById('newProjectName').value;
    const description = document.getElementById('newProjectDescription').value;
    document.getElementById('createProjectForm').classList.add('hidden');

    fetch('/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
    })
    .then(response => response.json())
    .then(project => {
        loadProjects();
    })
    .catch(error => console.error('Error:', error));
}

function createTask() {
    const title = document.getElementById('newTaskTitle').value;
    const description = document.getElementById('newTaskDescription').value;
    const projectId = document.getElementById('projectIdField').value;
    document.getElementById('createTaskForm').classList.add('hidden');
    
    // Log the data being sent to the server
    console.log("Creating task with the following data:");
    console.log("Title:", title);
    console.log("Description:", description);
    console.log("Project ID:", projectId);

    fetch(`/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, projectId })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(task => {
        fetchTasksForProject(projectId);
        hideCreateTaskForm(); // Hide the form after task creation
    })
    .catch(error => console.error('Error:', error));
}

function loadProjects() {
    fetch('/projects')
        .then(response => response.json())
        .then(projects => {
            const projectsContainer = document.getElementById('projects');
            projectsContainer.innerHTML = '';

            projects.forEach(project => {
                const projectDiv = document.createElement('div');
                projectDiv.className = 'project';
                projectDiv.innerHTML = `
                    <h2>${project.name}</h2>
                    <p>${project.description}</p>
                    <p>${project.status}</p>
                `;
                projectsContainer.appendChild(projectDiv);
            });
        })
        .catch(error => console.error('Error:', error));
}


function loadTasks() {
    fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
            const tasksContainer = document.getElementById('tasks');
            tasksContainer.innerHTML = '';

            tasks.forEach(task => {
                fetch(`/projects/${task.projectId}`)  // Fetch project details
                    .then(response => response.json())
                    .then(project => {
                        const taskDiv = document.createElement('div');
                        taskDiv.className = 'task';
                        taskDiv.innerHTML = `
                            <h3>${task.title}</h3>
                            <p>${task.description}</p>
							<p><strong>Project:</strong> ${project.name}</p>
							<p>Priority: <select class="task-priority" data-task-id="${task._id}">
								<option value="High" ${task.priority === 'High' ? 'selected' : ''}>High</option>
								<option value="Medium" ${task.priority === 'Medium' ? 'selected' : ''}>Medium</option>
								<option value="Low" ${task.priority === 'Low' ? 'selected' : ''}>Low</option>
                    </select></p>
                    <p>Status: <select class="task-status" data-task-id="${task._id}">
								<option value="Not Started" ${task.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
								<option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
								<option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        </select></p>
                        <p>Progress: <input type="range" class="task-progress" data-task-id="${task._id}" value="${task.progress}" min="0" max="100"></p>
                        `;
                        tasksContainer.appendChild(taskDiv);
                    })
                    .catch(error => console.error('Error fetching project:', error));
            });
        })
        .catch(error => console.error('Error:', error));
}

function attachProjectClickHandlers() {
    console.log("Attaching project click handlers");
    document.querySelectorAll('.project-link').forEach(projectLink => {
        projectLink.addEventListener('click', function(event) {
            event.preventDefault();
            const projectId = this.getAttribute('data-projectid');
            currentProjectId = projectId; // Store the selected project ID
            // showCreateTaskForm(projectId); // Pass projectId to the function
            document.getElementById('showCreateTaskFormButton').disabled = false; // Enable the button
            console.log("Clicked project ID:", projectId);
            fetchTasksForProject(projectId);
        });
    });
}

function fetchTasksForProject(projectId) {
    fetch(`/tasks/project/${projectId}`)
        .then(response => response.json())
        .then(tasks => {
            const projectsContainer = document.getElementById('projects');
            projectsContainer.innerHTML = '';

            // Display tasks for the selected project
            tasks.forEach(task => {
                const taskDiv = document.createElement('div');
                taskDiv.className = 'task';
                taskDiv.innerHTML = `
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <select class="task-priority" data-task-id="${task._id}">
                        <option value="High" ${task.priority === 'High' ? 'selected' : ''}>High</option>
                        <option value="Medium" ${task.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                        <option value="Low" ${task.priority === 'Low' ? 'selected' : ''}>Low</option>
                    </select>
                    <select class="task-status" data-task-id="${task._id}">
                        <option value="Not Started" ${task.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
                        <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    </select>
                    <input type="range" class="task-progress" data-task-id="${task._id}" value="${task.progress}" min="0" max="100">
                    <!-- ... other task details ... -->
                `;
                projectsContainer.appendChild(taskDiv);
            });
        })
        .catch(error => console.error('Error:', error));
}

function showCreateProjectForm() {
    document.getElementById('createProjectForm').classList.remove('hidden');
}

function hideCreateProjectForm() {
    document.getElementById('createProjectForm').classList.add('hidden');
}

function showCreateTaskForm(projectId) {
    console.log("Setting project ID in form:", projectId);
    document.getElementById('projectIdField').value = projectId;
    document.getElementById('createTaskForm').classList.remove('hidden');
}

function hideCreateTaskForm() {
    const form = document.getElementById('createTaskForm');
    if (form) {
        form.classList.add('hidden');
            }
        }
