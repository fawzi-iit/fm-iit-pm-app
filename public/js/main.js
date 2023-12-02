let currentProjectId = null;

document.addEventListener('DOMContentLoaded', function() {
    loadProjects();

    // Event listener for the 'Project Dashboard' link
    const dashboardLink = document.getElementById('dashboardLink');
    dashboardLink.addEventListener('click', function(event) {
        event.preventDefault();
        loadProjects();
        hideCreateProjectForm();
        hideCreateTaskForm(); // Hide task form as well if it's visible
    });

    // Event listener for the 'Create Project' link
    const createProjectLink = document.getElementById('createProjectLink');
    createProjectLink.addEventListener('click', function(event) {
        event.preventDefault();
        showCreateProjectForm();
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

function createTask(projectId) {
    const title = document.getElementById('newTaskTitle').value;
    const description = document.getElementById('newTaskDescription').value;

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

function showCreateTaskForm() {
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
    };
    projectsContainer.insertBefore(backButton, projectsContainer.firstChild);
}