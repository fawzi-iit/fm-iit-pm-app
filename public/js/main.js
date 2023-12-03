let currentProjectId = null;

document.addEventListener('DOMContentLoaded', function() {
    loadProjects();

    // Event listener for the 'Project Dashboard' link
    const dashboardLink = document.getElementById('dashboardLink');
    dashboardLink.addEventListener('click', function(event) {
        event.preventDefault();
        loadProjects();
        hideCreateProjectForm();
    });

    // Event listener for the 'Create Project' link
    const createProjectLink = document.getElementById('createProjectLink');
    createProjectLink.addEventListener('click', function(event) {
        event.preventDefault();
        showCreateProjectForm();
    });

    
    /* Event listener for the 'Create Task' link
    const createTaskLink = document.getElementById('createTaskLink');
    createTaskLink.addEventListener('click', function(event) {
        event.preventDefault();
        showCreateTaskForm();
    }); */
    
    document.querySelectorAll('.task-priority, .task-status, .task-progress').forEach(element => {
        element.addEventListener('change', (event) => {
            const taskId = event.target.dataset.taskId;
            const updatedValue = { [event.target.className]: event.target.value };
            // Send PATCH request to server
            // ...
        });
    });

    document.querySelectorAll('.task-priority, .task-status, .task-progress').forEach(element => {
        element.addEventListener('change', async (event) => {
            const taskId = event.target.dataset.taskId;
            const updatedValue = { [event.target.className.split('-')[1]]: event.target.value };
    
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
    
                // Handle successful response here, if needed
            } catch (error) {
                console.error('Fetch error:', error);
            }
        });
    });
});

function createProject() {
    const name = document.getElementById('newProjectName').value;
    const description = document.getElementById('newProjectDescription').value;

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

    fetch(`/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, projectId })
    })
    .then(response => response.json())
    .then(task => {
        fetchTasksForProject(projectId);
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

function attachProjectClickHandlers() {
    document.querySelectorAll('.project-link').forEach(projectLink => {
        projectLink.addEventListener('click', function(event) {
            event.preventDefault();
            currentProjectId = this.getAttribute('data-projectid');
            fetchTasksForProject(currentProjectId);
            showCreateTaskForm();
            showBackButton();
        });
    });
}

function fetchTasksForProject(projectId) {
    fetch(`/tasks/project/${projectId}`)
        .then(response => response.json())
        .then(tasks => {
            const projectsContainer = document.getElementById('projects');
            projectsContainer.innerHTML = '';

            // Add a 'Back' button
            const backButton = document.createElement('button');
            backButton.textContent = 'Back to Projects';
            backButton.onclick = loadProjects; // Load projects when clicked
            projectsContainer.appendChild(backButton);

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
    document.getElementById('projectIdField').value = projectId;
    document.getElementById('createTaskForm').classList.remove('hidden');
}

function hideCreateTaskForm() {
    document.getElementById('createTaskForm').classList.add('hidden');
}

function showBackButton() {
    const projectsContainer = document.getElementById('projects');
    const backButton = document.createElement('button');
    backButton.textContent = 'Back to Projects';
    backButton.onclick = function() {
        loadProjects();
        hideCreateTaskForm();
        hideCreateProjectForm();
    };
    projectsContainer.insertBefore(backButton, projectsContainer.firstChild);
}