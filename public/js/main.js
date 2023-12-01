let currentProjectId = null;

document.addEventListener('DOMContentLoaded', function() {
    loadProjects();

    const dashboardLink = document.getElementById('dashboardLink');
    dashboardLink.addEventListener('click', function(event) {
        event.preventDefault();
        loadProjects();
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
            document.getElementById('createTaskForm').style.display = 'block';
        });
    });
}

function fetchTasksForProject(projectId) {
    fetch(`/tasks/project/${projectId}`)
        .then(response => response.json())
        .then(tasks => {
            console.log(tasks);
            const projectsContainer = document.getElementById('projects');
            projectsContainer.innerHTML = '';

            tasks.forEach(task => {
                const taskDiv = document.createElement('div');
                taskDiv.className = 'task';
                taskDiv.innerHTML = `
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                `;
                projectsContainer.appendChild(taskDiv);
            });
        })
        .catch(error => console.error('Error:', error));
}
