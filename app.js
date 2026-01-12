// Kanban Board To-Do Application
class TodoApp {
    constructor() {
        this.tasks = [];
        this.groups = []; // Universal groups for all columns
        this.currentStatus = 'not-started';
        this.currentGroup = null;
        this.editingTaskId = null;
        this.token = localStorage.getItem('token');
        this.user = this.safeParseJson(localStorage.getItem('user')) || {};
        this.loadFromStorage();
        this.initializeElements();
        this.render();
    }

    safeParseJson(value) {
        if (!value) return null;
        try {
            return JSON.parse(value);
        } catch {
            return null;
        }
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

        // Optional standalone group modal (still present in index.html)
        this.groupModal = document.getElementById('groupModal');
        this.groupInput = document.getElementById('groupInput');

        // Optional profile display (present in index.html)
        this.updateProfileDisplay();
    }

    // Update profile display based on localStorage (token/user)
    updateProfileDisplay() {
        const profileSection = document.getElementById('profileSection');
        const signinPrompt = document.getElementById('signinPrompt');
        if (!profileSection || !signinPrompt) {
            return;
        }

        const user = this.user || {};
        const isLoggedIn = Boolean(user && user.username);

        if (isLoggedIn) {
            profileSection.style.display = 'block';
            signinPrompt.style.display = 'none';

            const profileName = document.getElementById('profileName');
            const profileEmail = document.getElementById('profileEmail');
            const profileAvatar = document.getElementById('profileAvatar');

            if (profileName) profileName.textContent = user.username;
            if (profileEmail) profileEmail.textContent = user.email || 'Signed in';
            if (profileAvatar) profileAvatar.textContent = user.username.charAt(0).toUpperCase();
        } else {
            profileSection.style.display = 'none';
            signinPrompt.style.display = 'block';
        }
    }

    // Add a new group
    addNewGroup(status) {
        this.currentStatus = status;
        if (!this.groupModal || !this.groupInput) {
            return;
        }

        this.groupInput.value = '';
        this.groupModal.classList.add('active');
        this.groupInput.focus();
    }

    // Save new group
    saveGroup() {
        if (!this.groupInput) {
            return;
        }

        const groupName = this.groupInput.value.trim();
        
        if (!groupName) {
            alert('Please enter a group name!');
            return;
        }

        if (this.groups.includes(groupName)) {
            alert('This group already exists!');
            return;
        }

        this.groups.push(groupName);
        this.saveToStorage();
        this.updateGroupSelect();
        this.closeGroupModal();
        this.render();
    }

    closeGroupModal() {
        this.groupModal?.classList.remove('active');
    }

    // Delete a group
    deleteGroup(groupName) {
        if (confirm(`Delete group "${groupName}" and move all tasks to ungrouped?`)) {
            // Move all tasks in this group to no group
            this.tasks.forEach(task => {
                if (task.group === groupName) {
                    task.group = null;
                }
            });
            this.groups = this.groups.filter(g => g !== groupName);
            this.saveToStorage();
            this.render();
        }
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

    // Create new group from modal
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
            this.saveToStorage();
        } else {
            alert('This group already exists!');
        }
    }

    // Edit a task
    editTask(id) {
        const task = this.tasks.find(t => t.id === id);
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
    saveTask() {
        const text = this.taskInput.value.trim();
        const groupValue = this.groupSelect.value || null;
        
        if (!text) {
            alert('Please enter a task name!');
            return;
        }

        if (this.editingTaskId !== null) {
            // Edit existing task
            const task = this.tasks.find(t => t.id === this.editingTaskId);
            if (task) {
                task.text = text;
                task.emoji = this.taskEmoji.value.trim();
                task.group = groupValue;
            }
        } else {
            // Add new task
            const task = {
                id: Date.now(),
                text: text,
                emoji: this.taskEmoji.value.trim() || '📝',
                status: this.currentStatus,
                group: groupValue,
                createdAt: new Date()
            };
            this.tasks.push(task);
        }

        this.saveToStorage();
        this.render();
        this.closeModal();
    }

    // Move task to different status
    moveTask(id, newStatus) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.status = newStatus;
            this.saveToStorage();
            this.render();
        }
    }

    // Delete a task
    deleteTask(id) {
        if (confirm('Delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.saveToStorage();
            this.render();
        }
    }

    // Close modal
    closeModal() {
        this.modal.classList.remove('active');
        this.editingTaskId = null;
        this.hideNewGroupInput();
    }

    // Get tasks by status and group
    getTasksByStatusAndGroup(status, group = null) {
        return this.tasks.filter(t => t.status === status && t.group === group);
    }

    // Render a single card
    renderCard(task) {
        const otherStatuses = ['not-started', 'in-progress', 'done'].filter(s => s !== task.status);
        
        return `
            <div class="task-card" draggable="true" data-task-id="${task.id}" ondragstart="app.dragStart(event)" ondragend="app.dragEnd(event)" ondblclick="app.editTask(${task.id})">
                <span class="task-emoji">${this.escapeHtml(task.emoji)}</span>
                <span class="task-text">${this.escapeHtml(task.text)}</span>
                <div class="task-actions">
                    <button class="action-btn move-${otherStatuses[0]}" onclick="app.moveTask(${task.id}, '${otherStatuses[0]}')", title="Move to ${otherStatuses[0].replace('-', ' ')}"></button>
                    <button class="action-btn move-${otherStatuses[1]}" onclick="app.moveTask(${task.id}, '${otherStatuses[1]}')", title="Move to ${otherStatuses[1].replace('-', ' ')}"></button>
                    <button class="action-btn delete-btn" onclick="app.deleteTask(${task.id})" title="Delete"></button>
                </div>
            </div>
        `;
    }

    // Get status icon
    getStatusIcon(status) {
        switch (status) {
            case 'not-started': return '←';
            case 'in-progress': return '→';
            case 'done': return '✓';
            default: return '→';
        }
    }

    // Render all cards
    render() {
        const statuses = ['not-started', 'in-progress', 'done'];
        
        statuses.forEach(status => {
            const columnId = status === 'not-started' ? 'notStartedCards' : 
                            status === 'in-progress' ? 'inProgressCards' : 'doneCards';
            const container = document.getElementById(columnId);
            
            if (container) {
                let html = '';
                
                // Render ungrouped tasks
                const ungroupedTasks = this.getTasksByStatusAndGroup(status, null);
                if (ungroupedTasks.length > 0) {
                    ungroupedTasks.forEach(task => {
                        html += this.renderCard(task);
                    });
                }
                
                // Render grouped tasks
                this.groups.forEach(groupName => {
                    const groupTasks = this.getTasksByStatusAndGroup(status, groupName);
                    if (groupTasks.length > 0) {
                        html += `
                            <div class="task-group">
                                <div class="group-header">
                                    <span class="group-name">${this.escapeHtml(groupName)}</span>
                                    <button class="group-delete-btn" onclick="app.deleteGroup('${groupName.replace(/'/g, "\\'")}');" title="Delete group"></button>
                                </div>
                                <div class="group-tasks">
                                    ${groupTasks.map(task => this.renderCard(task)).join('')}
                                </div>
                            </div>
                        `;
                    }
                });
                
                container.innerHTML = html;
                // Add drag over listener to container
                container.addEventListener('dragover', (e) => this.dragOver(e));
                container.addEventListener('drop', (e) => this.drop(e, status));
            }
        });

        this.updateCounts();
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

    // Escape HTML special characters
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Save tasks to localStorage
    saveToStorage() {
        localStorage.setItem('kanban-tasks', JSON.stringify(this.tasks));
        localStorage.setItem('kanban-groups', JSON.stringify(this.groups));
    }

    // Load tasks from localStorage
    loadFromStorage() {
        const stored = localStorage.getItem('kanban-tasks');
        const storedGroups = localStorage.getItem('kanban-groups');
        this.tasks = stored ? JSON.parse(stored) : [];
        this.groups = storedGroups ? JSON.parse(storedGroups) : [];
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
            this.moveTask(parseInt(taskId), status);
        }
    }

    // Drag end handler
    dragEnd(event) {
        event.target.style.opacity = '1';
    }
}

// Initialize the app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TodoApp();
    
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

    // Standalone group modal (optional)
    document.getElementById('saveGroupModalBtn')?.addEventListener('click', () => {
        app.saveGroup();
    });

    document.getElementById('cancelGroupModalBtn')?.addEventListener('click', () => {
        app.closeGroupModal();
    });
});

// Logout helper for the sidebar profile UI
function logout() {
    if (!confirm('Are you sure you want to logout?')) {
        return;
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    if (typeof app !== 'undefined' && app) {
        app.token = null;
        app.user = {};
        app.updateProfileDisplay?.();
    }
}

/*

                                                            ::::::::::::::::::::                              
                                                -::::::::::::::::::::::::::::::-                        
                                         ::::::::::::::::::::::::::::::::::::::-                    
                                    :::::-+%@@+::::::::::::::::::::::-%#+-::::::-                 
                             :::::=%@@@@@@@-:::::::::::::::::::::%@@@@@%=:::::-               
                         :::::#@@@@@@@@#::::-*%@@@@@@@@@@@*-:::*@@@@@@@@@=::::-             
                     ::::-%@@@@@@@@=:::*@@@@@@@@@@@@@@@@@@@@*:::#@@@@@@@@+::::-           
                 :::::#@@@@@@@@+::-%@@@@@@@@@@@@@@@@@@@@@@@@%-:-#@@@@@@@@+::::=         
                ::::+@@@@@@@@%-:-%@@@@@@@@@@@@@@@@@@@@@@@@@@@@%-:=%@@@@@@@%-:::-        
             ::::*@@@@@@@@*::+@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@+::#@@@@@@@@+::::+      
         ::::-%@@@@@@@@*::*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*::%@@@@@@@@#::::=     
        :::::%@@@@@@@@#::+@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@+::#@@@@@@@@#::::=    
        ::::%@@@@@@@@@-:=@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@=:=@@@@@@@@@#::::@   
     ::::*@@@@@@@@@*::*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#::*@@@@@@@@@+::::+  
    ::::+@@@@@@@@@@-::%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%::-@@@@@@@@@@=:::-  
 :::::%@@@@@@@@@%-::@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@-::%@@@@@@@@@#::::+ 
 ::::+@@@@@@@@@@%-::@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@:::%@@@@@@@@@@=:::: 
:::::@@@@@@@@@@@%-::%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%:::%@@@@@@@@@@%::::-
::::=@@@@@@@@@@@@-::*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#::-%@@@@@@@@@@@=:::=
::::+@@@@@@@@@@@@*::=@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@=::+@@@@@@@@@@@@*:::=
::::*@@@@@@@@@@@@@-::+@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@+:::%@@@@@@@@@@@@#:::-
::::#@@@@@@@@@@@@@*:::*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*:::+@@@@@@@@@@@@@#::::
::::#@@@@@@@@@@@@@@=:::=@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@+::::%@@@@@@@@@@@@@#::::
::::*@@@@@@@@@@@@@@@-::::#@@@@@@@@@@@@@@@@@@@@@@@@@@@@%:::::%@@@@@@@@@@@@@@#:::-
::::+@@@@@@@@@@@@%-:::::::-%@@@@@@@@@@@@@@@@@@@@@@@@%-:::::::*@@@@@@@@@@@@@*:::-
::::=@@@@@@@@@%=:::::::::::::+@@@@@@@@@@@@@@@@@@@@@@@%-::::::::-#@@@@@@@@@@+:::=
:::::%@@@@@@+:::::::::::::::::::-+%@@@@@@@@@@%+-:=%@@@@%-:::::::::=%@@@@@@@::::=
 ::::-%@@#-::::::::::::::::::::::::::::::::::::::::=%@@@@%+:::::::::-+%@@@+::::#
 -::::==::::::::::::-#-::::::::::::::::::::::::::::::-#@@@@@*::::::::::-##::::+ 
    ::::::::::::::::=@@@@@#-::::::::::::::::::::::::::::::*@@@@@#-:::::::::::::-  
     :::::::::::::*@@@@@@@@@@@*-:::::::::::::::::::=*:::::::+%@@@@%-:::::::::::*  
        :::::::::-%@@@@@*::+%@@@@@@@@%#+-:::::-=*%%@@@@@#:::::::-%@@@@%=::::::::%   
        -::::::+%@@@@%=:::::::-+%@@@@@@@@@@@@@@@@@@@@@%=::::::::::-#@@@@@*:::::=    
         -:::*@@@@@#-::::::::::::::-=+#%@@@@@@@%#*=-:::::::::::::::#@@@@*:::::+     
            -*@@@@@*::::::::::::::::::::::::::::::::::::::::::::::-#@@@@%-::::-*      
                #@%=:::::::::--:::::::::::::::::::::::::::::::::::=%@@@@%=:::::-        
                 :::::::::::#@@@#-:::::::::::::::::::::::::::::=%@@@@@%=::::::+         
                     -:::::::=@@@@@@@@%+:::::::::::::::::::::+%@@@@@@@%-::::::=           
                         :::::::::=%@@@@@@@@@%%%#**+++**#%%%@@@@@@@@@%=:::::::=             
                             -::::::::::=*%@@@@@@@@@@@@@@@@@@@@@@@@%+-::::::::=               
                                 =:::::::::::::-=+*#%%@@@@@@%%#*+=-::::::::::-+                 
                                        =-::::::::::::::::::::::::::::::::::::-+                    
                                                =-::::::::::::::::::::::::::::-*                        
                                                            +-::::::::::::::::-+                              

*/
