// Kanban Board To-Do Application (Backend Version)
const API_URL = 'http://localhost:5000/api'; // Change to your backend URL

class TodoApp {
    constructor() {
        this.tasks = [];
        this.groups = [];
        this.currentStatus = 'not-started';
        this.currentGroup = null;
        this.editingTaskId = null;
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || '{}');

        // Redirect to login if no token
        if (!this.token) {
            window.location.href = 'login.html';
            return;
        }

        this.initializeElements();
        this.loadTasks();
    }

    // Initialize DOM elements
    initializeElements() {
        this.modal = document.getElementById('taskModal');
        this.taskInput = document.getElementById('taskInput');
        this.taskEmoji = document.getElementById('taskEmoji');
        this.modalTitle = document.getElementById('modalTitle');
        this.groupSelect = document.getElementById('groupSelect');
        this.newGroupBtn = document.getElementById('newGroupBtn');
        this.newGroupInput = document.getElementById('newGroupInput');
        this.newGroupName = document.getElementById('newGroupName');
        this.groupModal = document.getElementById('groupModal');
        this.groupInput = document.getElementById('groupInput');

        // Initialize profile display
        this.updateProfileDisplay();
    }

    // Update profile display
    updateProfileDisplay() {
        const profileSection = document.getElementById('profileSection');
        const signinPrompt = document.getElementById('signinPrompt');
        
        if (this.user && this.user.username) {
            // User is logged in - show profile
            profileSection.style.display = 'block';
            signinPrompt.style.display = 'none';
            
            // Update profile info
            const profileName = document.getElementById('profileName');
            const profileEmail = document.getElementById('profileEmail');
            const profileAvatar = document.getElementById('profileAvatar');
            
            profileName.textContent = this.user.username;
            profileEmail.textContent = this.user.email || 'user@example.com';
            
            // Set avatar initial (first letter of username)
            const initial = this.user.username.charAt(0).toUpperCase();
            profileAvatar.textContent = initial;
        } else {
            // User is not logged in - show sign in prompt
            profileSection.style.display = 'none';
            signinPrompt.style.display = 'block';
        }
    }

    // Load tasks from backend
    async loadTasks() {
        try {
            const response = await fetch(`${API_URL}/tasks`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });

            if (response.status === 401) {
                this.logout();
                return;
            }

            if (response.ok) {
                this.tasks = await response.json();
                this.extractGroups();
                this.render();
            }
        } catch (err) {
            console.error('Error loading tasks:', err);
            alert('Failed to load tasks. Check backend connection.');
        }
    }

    // Extract unique groups from tasks
    extractGroups() {
        const groupSet = new Set();
        this.tasks.forEach(task => {
            if (task.group) groupSet.add(task.group);
        });
        this.groups = Array.from(groupSet);
    }

    // Add a new task
    addNewTask(status, group = null) {
        this.currentStatus = status;
        this.currentGroup = group;
        this.editingTaskId = null;
        this.taskInput.value = '';
        this.taskEmoji.value = '';
        this.modalTitle.textContent = 'Add New Task';
        this.updateGroupSelect();
        if (group) {
            this.groupSelect.value = group;
        } else {
            this.groupSelect.value = '';
        }
        this.hideNewGroupInput();
        this.modal.classList.add('active');
        this.taskInput.focus();
    }

    // Update group select dropdown
    updateGroupSelect() {
        this.groupSelect.innerHTML = '<option value="">No Group</option>';
        this.groups.forEach(group => {
            const option = document.createElement('option');
            option.value = group;
            option.textContent = group;
            this.groupSelect.appendChild(option);
        });
    }

    // Show new group input
    showNewGroupInput() {
        this.newGroupInput.style.display = 'block';
        this.newGroupName.focus();
    }

    // Hide new group input
    hideNewGroupInput() {
        this.newGroupInput.style.display = 'none';
        this.newGroupName.value = '';
    }

    // Create new group
    createNewGroup() {
        const groupName = this.newGroupName.value.trim();

        if (!groupName) {
            alert('Please enter a group name!');
            return;
        }

        if (!this.groups.includes(groupName)) {
            this.groups.push(groupName);
            this.updateGroupSelect();
            this.groupSelect.value = groupName;
            this.hideNewGroupInput();
        } else {
            alert('This group already exists!');
        }
    }

    // Edit a task
    editTask(id) {
        const task = this.tasks.find(t => t._id === id);
        if (task) {
            this.editingTaskId = id;
            this.currentStatus = task.status;
            this.currentGroup = task.group;
            this.taskInput.value = task.text;
            this.taskEmoji.value = task.emoji;
            this.modalTitle.textContent = 'Edit Task';
            this.updateGroupSelect();
            if (task.group) {
                this.groupSelect.value = task.group;
            } else {
                this.groupSelect.value = '';
            }
            this.hideNewGroupInput();
            this.modal.classList.add('active');
            this.taskInput.focus();
        }
    }

    // Save task (add or edit)
    async saveTask() {
        const text = this.taskInput.value.trim();
        const groupValue = this.groupSelect.value || null;

        if (!text) {
            alert('Please enter a task name!');
            return;
        }

        try {
            if (this.editingTaskId !== null) {
                // Edit existing task
                const response = await fetch(`${API_URL}/tasks/${this.editingTaskId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    },
                    body: JSON.stringify({
                        text,
                        emoji: this.taskEmoji.value.trim(),
                        status: this.currentStatus,
                        group: groupValue
                    })
                });

                if (response.ok) {
                    this.loadTasks();
                } else {
                    alert('Failed to update task');
                }
            } else {
                // Add new task
                const response = await fetch(`${API_URL}/tasks`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    },
                    body: JSON.stringify({
                        text,
                        emoji: this.taskEmoji.value.trim() || '📝',
                        status: this.currentStatus,
                        group: groupValue
                    })
                });

                if (response.ok) {
                    this.loadTasks();
                } else {
                    alert('Failed to create task');
                }
            }

            this.closeModal();
        } catch (err) {
            console.error('Error saving task:', err);
            alert('Error saving task');
        }
    }

    // Delete a task
    async deleteTask(id) {
        if (confirm('Delete this task?')) {
            try {
                const response = await fetch(`${API_URL}/tasks/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${this.token}` }
                });

                if (response.ok) {
                    this.loadTasks();
                } else {
                    alert('Failed to delete task');
                }
            } catch (err) {
                console.error('Error deleting task:', err);
                alert('Error deleting task');
            }
        }
    }

    // Move task to different status
    async moveTask(id, newStatus) {
        const task = this.tasks.find(t => t._id === id);
        if (task) {
            try {
                const response = await fetch(`${API_URL}/tasks/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    },
                    body: JSON.stringify({ status: newStatus })
                });

                if (response.ok) {
                    this.loadTasks();
                }
            } catch (err) {
                console.error('Error moving task:', err);
            }
        }
    }

    // Close modal
    closeModal() {
        this.modal.classList.remove('active');
        this.editingTaskId = null;
        this.hideNewGroupInput();
    }

    // Drag start handler
    dragStart(event) {
        const taskId = event.target.closest('.task-card')?.dataset.taskId;
        if (taskId) {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('taskId', taskId);
            event.target.closest('.task-card').style.opacity = '0.5';
        }
    }

    // Drag over handler
    dragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }

    // Drop handler
    drop(event, status) {
        event.preventDefault();
        const taskId = event.dataTransfer.getData('taskId');
        if (taskId) {
            this.moveTask(taskId, status);
        }
    }

    // Drag end handler
    dragEnd(event) {
        event.target.style.opacity = '1';
    }

    // Render a single card
    renderCard(task) {
        const otherStatuses = ['not-started', 'in-progress', 'done'].filter(s => s !== task.status);

        return `
            <div class="task-card" draggable="true" data-task-id="${task._id}" ondragstart="app.dragStart(event)" ondragend="app.dragEnd(event)" ondblclick="app.editTask('${task._id}')">
                <span class="task-emoji">${this.escapeHtml(task.emoji)}</span>
                <span class="task-text">${this.escapeHtml(task.text)}</span>
                <div class="task-actions">
                    <button class="action-btn move-${otherStatuses[0]}" onclick="app.moveTask('${task._id}', '${otherStatuses[0]}')" title="Move to ${otherStatuses[0].replace('-', ' ')}"></button>
                    <button class="action-btn move-${otherStatuses[1]}" onclick="app.moveTask('${task._id}', '${otherStatuses[1]}')" title="Move to ${otherStatuses[1].replace('-', ' ')}"></button>
                    <button class="action-btn delete-btn" onclick="app.deleteTask('${task._id}')" title="Delete"></button>
                </div>
            </div>
        `;
    }

    // Escape HTML special characters
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text ?? '';
        return div.innerHTML;
    }

    // Update counts
    updateCounts() {
        const notStartedCount = this.tasks.filter(t => t.status === 'not-started').length;
        const inProgressCount = this.tasks.filter(t => t.status === 'in-progress').length;
        const doneCount = this.tasks.filter(t => t.status === 'done').length;

        document.getElementById('notStartedCount').textContent = notStartedCount.toString();
        document.getElementById('inProgressCount').textContent = inProgressCount.toString();
        document.getElementById('doneCount').textContent = doneCount.toString();
    }

    // Render all cards
    render() {
        const statuses = ['not-started', 'in-progress', 'done'];
        const statusNames = { 'not-started': 'notStarted', 'in-progress': 'inProgress', 'done': 'done' };

        statuses.forEach(status => {
            const container = document.getElementById(`${statusNames[status]}Cards`);
            if (!container) return;

            let html = '';

            // Ungrouped tasks
            const ungroupedTasks = this.tasks.filter(t => t.status === status && !t.group);
            if (ungroupedTasks.length > 0) {
                ungroupedTasks.forEach(task => {
                    html += this.renderCard(task);
                });
            }

            // Grouped tasks
            this.groups.forEach(groupName => {
                const groupTasks = this.tasks.filter(t => t.status === status && t.group === groupName);
                if (groupTasks.length > 0) {
                    html += `
                        <div class="task-group">
                            <div class="group-header">
                                <span class="group-name">${this.escapeHtml(groupName)}</span>
                            </div>
                            <div class="group-tasks">
                                ${groupTasks.map(task => this.renderCard(task)).join('')}
                            </div>
                        </div>
                    `;
                }
            });

            container.innerHTML = html;
            container.addEventListener('dragover', (e) => this.dragOver(e));
            container.addEventListener('drop', (e) => this.drop(e, status));
        });

        this.updateCounts();
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }
}

// Initialize the app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TodoApp();

    if (!app.token) return; // Exit if no token

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            app.closeModal();
        }
    });

    // Close modal when clicking outside
    document.getElementById('taskModal')?.addEventListener('click', (e) => {
        if (e.target === document.getElementById('taskModal')) {
            app.closeModal();
        }
    });

    // Submit on Enter key
    document.getElementById('taskInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            app.saveTask();
        }
    });

    // Add event listeners for "New task" buttons
    document.querySelectorAll('.new-page-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const status = btn.getAttribute('data-status');
            app.addNewTask(status);
        });
    });

    // Add event listeners for modal buttons
    document.getElementById('saveTaskBtn')?.addEventListener('click', () => {
        app.saveTask();
    });

    document.getElementById('cancelTaskBtn')?.addEventListener('click', () => {
        app.closeModal();
    });

    document.getElementById('newGroupBtn')?.addEventListener('click', () => {
        app.showNewGroupInput();
    });

    document.getElementById('createGroupBtn')?.addEventListener('click', () => {
        app.createNewGroup();
    });

    document.getElementById('cancelGroupBtn')?.addEventListener('click', () => {
        app.hideNewGroupInput();
    });
});
