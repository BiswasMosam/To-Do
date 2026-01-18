// Interactive Tutorial System for TO-DO Board
// Shows step-by-step guidance for new users

class TutorialSystem {
    constructor(app) {
        this.app = app;
        this.currentStep = 0;
        this.isActive = false;
        this.overlay = null;
        this.dialog = null;
        
        this.steps = [
            {
                title: "Welcome to TO-DO Board! 👋",
                description: "Let's take a quick tour to help you get started. You can skip this at any time.",
                target: null,
                action: null,
                highlightClass: null,
                position: 'center'
            },
            {
                title: "Board View",
                description: "This is your Kanban board with three columns: Not Started, In Progress, and Done. Tasks move through these stages as you work on them.",
                target: ".board",
                action: null,
                highlightClass: "board",
                position: 'center'
            },
            {
                title: "Create Your First Task",
                description: "Click the '+ New task' button in any column to create a task. Try clicking it now!",
                target: ".new-page-btn[data-status='not-started']",
                action: "waitForModal",
                highlightClass: "new-page-btn",
                position: 'bottom'
            },
            {
                title: "Task Details",
                description: "Give your task a name and optionally add an emoji. You can also organize tasks into groups. Fill in the task name and click 'Save' to continue.",
                target: "#taskModal",
                action: "waitForTaskCreation",
                highlightClass: "modal-content",
                position: 'center'
            },
            {
                title: "Manage Your Tasks",
                description: "Great! You can now drag and drop tasks between columns, click to edit them, or delete them using the × button.",
                target: ".card",
                action: null,
                highlightClass: "card",
                position: 'top'
            },
            {
                title: "Task Groups",
                description: "Organize your tasks by creating groups. Tasks from the same group are displayed together with a colored indicator.",
                target: "#groupSelect",
                action: null,
                highlightClass: "groupSelect",
                position: 'bottom'
            },
            {
                title: "Workflow View",
                description: "Switch to Workflow view to visualize task dependencies and create flowcharts. Click here to switch views.",
                target: "#workflowViewBtn",
                action: "waitForWorkflowView",
                highlightClass: "view-option",
                position: 'right'
            },
            {
                title: "Workflow Canvas",
                description: "In Workflow view, you can create tasks and connect them to show dependencies. Use the toolbar to add tasks and create connections.",
                target: ".workflow-toolbar",
                action: null,
                highlightClass: "workflow-toolbar",
                position: 'bottom'
            },
            {
                title: "You're All Set! 🎉",
                description: "That's it! You now know the basics. Your tasks are automatically synced to the cloud, so you can access them from anywhere.",
                target: null,
                action: null,
                highlightClass: null,
                position: 'center'
            }
        ];
        
        this.initializeElements();
    }
    
    // Initialize tutorial overlay and dialog elements
    initializeElements() {
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.id = 'tutorialOverlay';
        this.overlay.className = 'tutorial-overlay';
        
        // Create dialog
        this.dialog = document.createElement('div');
        this.dialog.id = 'tutorialDialog';
        this.dialog.className = 'tutorial-dialog';
        this.dialog.innerHTML = `
            <div class="tutorial-header">
                <h3 id="tutorialTitle"></h3>
                <button class="tutorial-close" id="tutorialSkip">Skip</button>
            </div>
            <div class="tutorial-content">
                <p id="tutorialDescription"></p>
                <div class="tutorial-progress">
                    <div class="tutorial-progress-bar">
                        <div class="tutorial-progress-fill" id="tutorialProgress"></div>
                    </div>
                    <span class="tutorial-step-counter" id="tutorialStepCounter"></span>
                </div>
            </div>
            <div class="tutorial-footer">
                <button class="tutorial-btn tutorial-btn-secondary" id="tutorialPrev">Previous</button>
                <button class="tutorial-btn tutorial-btn-primary" id="tutorialNext">Next</button>
            </div>
        `;
        
        document.body.appendChild(this.overlay);
        document.body.appendChild(this.dialog);
        
        // Add event listeners
        document.getElementById('tutorialSkip').addEventListener('click', () => this.skip());
        document.getElementById('tutorialPrev').addEventListener('click', () => this.previousStep());
        document.getElementById('tutorialNext').addEventListener('click', () => this.nextStep());
        
        // Hide initially
        this.overlay.style.display = 'none';
        this.dialog.style.display = 'none';
    }
    
    // Check if user should see tutorial
    shouldShowTutorial() {
        const tutorialCompleted = localStorage.getItem('tutorialCompleted');
        const isNewUser = localStorage.getItem('isNewUser');
        
        // Show tutorial if:
        // 1. Never completed tutorial before
        // 2. User just registered (isNewUser flag set)
        return !tutorialCompleted || isNewUser === 'true';
    }
    
    // Start the tutorial
    start(force = false) {
        if (!force && !this.shouldShowTutorial()) {
            return;
        }
        
        this.isActive = true;
        this.currentStep = 0;
        this.overlay.style.display = 'block';
        this.dialog.style.display = 'block';
        this.showStep(0);
        
        // Remove the new user flag
        localStorage.removeItem('isNewUser');
    }

    // Hide overlay/dialog + remove highlights (no persistence)
    hide() {
        this.isActive = false;

        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });

        if (this.overlay) this.overlay.style.display = 'none';
        if (this.dialog) this.dialog.style.display = 'none';
    }
    
    // Show a specific step
    showStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.steps.length) {
            return;
        }
        
        this.currentStep = stepIndex;
        const step = this.steps[stepIndex];
        
        // Update dialog content
        document.getElementById('tutorialTitle').textContent = step.title;
        document.getElementById('tutorialDescription').textContent = step.description;
        document.getElementById('tutorialStepCounter').textContent = `${stepIndex + 1} of ${this.steps.length}`;
        
        // Update progress bar
        const progress = ((stepIndex + 1) / this.steps.length) * 100;
        document.getElementById('tutorialProgress').style.width = `${progress}%`;
        
        // Update button states
        const prevBtn = document.getElementById('tutorialPrev');
        const nextBtn = document.getElementById('tutorialNext');
        
        prevBtn.disabled = stepIndex === 0;
        prevBtn.style.opacity = stepIndex === 0 ? '0.5' : '1';
        
        if (stepIndex === this.steps.length - 1) {
            nextBtn.textContent = 'Finish';
        } else {
            nextBtn.textContent = 'Next';
        }
        
        // Remove previous highlights
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });
        
        // Highlight target element
        if (step.target) {
            const targetEl = document.querySelector(step.target);
            if (targetEl) {
                targetEl.classList.add('tutorial-highlight');
                this.positionDialog(targetEl, step.position);
                
                // Scroll target into view
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            // Center the dialog
            this.positionDialog(null, 'center');
        }
        
        // Handle step-specific actions
        if (step.action) {
            this.handleStepAction(step.action);
        }
    }
    
    // Position dialog relative to target
    positionDialog(targetEl, position) {
        const dialog = this.dialog;
        
        if (!targetEl || position === 'center') {
            // Center dialog
            dialog.style.position = 'fixed';
            dialog.style.top = '50%';
            dialog.style.left = '50%';
            dialog.style.transform = 'translate(-50%, -50%)';
            dialog.style.maxWidth = '500px';
            return;
        }
        
        const rect = targetEl.getBoundingClientRect();
        const dialogWidth = 400;
        const dialogHeight = 260;
        const spacing = 16;
        const margin = 12;
        
        dialog.style.position = 'fixed';
        dialog.style.maxWidth = `${dialogWidth}px`;

        const viewportW = window.innerWidth;
        const viewportH = window.innerHeight;

        const setPos = (leftPx, topPx) => {
            const clampedLeft = Math.max(margin, Math.min(leftPx, viewportW - dialogWidth - margin));
            const clampedTop = Math.max(margin, Math.min(topPx, viewportH - dialogHeight - margin));
            dialog.style.left = `${clampedLeft}px`;
            dialog.style.top = `${clampedTop}px`;
            dialog.style.transform = 'none';
        };

        // Preferred placement
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const candidates = {
            top: { left: centerX - dialogWidth / 2, top: rect.top - dialogHeight - spacing },
            bottom: { left: centerX - dialogWidth / 2, top: rect.bottom + spacing },
            left: { left: rect.left - dialogWidth - spacing, top: centerY - dialogHeight / 2 },
            right: { left: rect.right + spacing, top: centerY - dialogHeight / 2 }
        };

        const scorePlacement = (p) => {
            // Higher score is better; penalize off-screen
            const offLeft = Math.max(0, margin - p.left);
            const offTop = Math.max(0, margin - p.top);
            const offRight = Math.max(0, (p.left + dialogWidth + margin) - viewportW);
            const offBottom = Math.max(0, (p.top + dialogHeight + margin) - viewportH);
            const offPenalty = offLeft + offTop + offRight + offBottom;
            return -offPenalty;
        };

        const preferred = candidates[position] || candidates.bottom;
        const fallbacks = ['bottom', 'top', 'right', 'left']
            .filter((p) => p !== position)
            .map((p) => ({ key: p, val: candidates[p] }));

        let best = { key: position, val: preferred, score: scorePlacement(preferred) };
        for (const fb of fallbacks) {
            const score = scorePlacement(fb.val);
            if (score > best.score) {
                best = { key: fb.key, val: fb.val, score };
            }
        }

        setPos(best.val.left, best.val.top);
    }
    
    // Handle step-specific actions
    handleStepAction(action) {
        switch (action) {
            case 'waitForModal':
                // Wait for user to click new task button
                this.waitForModalOpen();
                break;
            case 'waitForTaskCreation':
                // Wait for user to create a task
                this.waitForTaskCreation();
                break;
            case 'waitForWorkflowView':
                // Wait for user to switch to workflow view
                this.waitForViewSwitch();
                break;
        }
    }
    
    // Wait for modal to open
    waitForModalOpen() {
        const nextBtn = document.getElementById('tutorialNext');
        nextBtn.disabled = true;
        nextBtn.style.opacity = '0.5';
        nextBtn.textContent = 'Waiting...';
        
        const checkModal = () => {
            const modal = document.getElementById('taskModal');
            const isOpen = !!modal && modal.classList.contains('active');
            if (isOpen) {
                nextBtn.disabled = false;
                nextBtn.style.opacity = '1';
                nextBtn.textContent = 'Next';
                this.nextStep();
            } else {
                setTimeout(checkModal, 100);
            }
        };
        
        checkModal();
    }
    
    // Wait for task creation
    waitForTaskCreation() {
        const nextBtn = document.getElementById('tutorialNext');
        nextBtn.disabled = true;
        nextBtn.style.opacity = '0.5';
        nextBtn.textContent = 'Waiting for task...';

        const modal = document.getElementById('taskModal');
        const saveBtn = document.getElementById('saveTaskBtn');

        // Snapshot tasks at step start
        const initialIds = new Set((this.app.tasks || []).map(t => t?._id).filter(Boolean));
        let saveClicked = false;
        let sawModalOpen = false;

        const onSave = () => {
            saveClicked = true;
            nextBtn.textContent = 'Saving...';
        };

        // Use capture so we see it even if save handler stops propagation
        saveBtn?.addEventListener('click', onSave, true);

        const check = () => {
            const isOpen = !!modal && modal.classList.contains('active');
            if (isOpen) sawModalOpen = true;

            const hasNewTask = (this.app.tasks || []).some(t => t?._id && !initialIds.has(t._id));

            // Advance only after user clicked Save, modal closed, and new task exists
            if (saveClicked && sawModalOpen && !isOpen && hasNewTask) {
                saveBtn?.removeEventListener('click', onSave, true);
                nextBtn.disabled = false;
                nextBtn.style.opacity = '1';
                nextBtn.textContent = 'Next';
                setTimeout(() => this.nextStep(), 300);
                return;
            }

            setTimeout(check, 150);
        };

        check();
    }
    
    // Wait for view switch
    waitForViewSwitch() {
        const nextBtn = document.getElementById('tutorialNext');
        nextBtn.disabled = true;
        nextBtn.style.opacity = '0.5';
        nextBtn.textContent = 'Waiting...';
        
        const checkViewSwitch = () => {
            if (this.app.currentView === 'workflow') {
                nextBtn.disabled = false;
                nextBtn.style.opacity = '1';
                nextBtn.textContent = 'Next';
                this.nextStep();
            } else {
                setTimeout(checkViewSwitch, 100);
            }
        };
        
        checkViewSwitch();
    }
    
    // Go to next step
    nextStep() {
        if (this.currentStep >= this.steps.length - 1) {
            this.complete();
        } else {
            this.showStep(this.currentStep + 1);
        }
    }
    
    // Go to previous step
    previousStep() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }
    
    // Skip tutorial
    skip() {
        const confirmed = confirm('Are you sure you want to skip the tutorial? You can always access help later.');
        if (confirmed) {
            this.complete();
        }
    }
    
    // Complete tutorial
    complete() {
        localStorage.setItem('tutorialCompleted', 'true');
        this.hide();
        
        // Show completion message
        if (this.currentStep === this.steps.length - 1) {
            // User completed the tutorial
            alert('Tutorial completed! You\'re ready to start organizing your tasks. 🎉');
        }
        
        // Reset to board view if in workflow
        if (this.app.currentView === 'workflow') {
            this.app.switchView('board');
        }
    }
    
    // Reset tutorial (for testing or user request)
    reset() {
        localStorage.removeItem('tutorialCompleted');
        localStorage.removeItem('isNewUser');
        this.hide();
        this.currentStep = 0;
    }
}

// Global function to restart tutorial
function restartTutorial() {
    // If tutorial instance exists, restart it
    if (window.tutorial) {
        window.tutorial.reset();
        window.tutorial.start(true);
        return;
    }

    // If app exists and TutorialSystem is loaded, create it on demand
    if (window.app && typeof TutorialSystem !== 'undefined') {
        window.tutorial = new TutorialSystem(window.app);
        window.tutorial.reset();
        window.tutorial.start(true);
        return;
    }

    alert('Tutorial is still loading. Please try again in a moment.');
}

// Ensure global access even in some bundling/caching edge cases
try {
    window.restartTutorial = restartTutorial;
} catch {
    // ignore
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