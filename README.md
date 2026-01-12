# To-Do Kanban Board

A beautiful, interactive Kanban board for managing tasks across three workflow stages: Not Started, In Progress, and Done. Built with vanilla JavaScript.

## Features

- 📋 **Kanban Board**: Organize tasks in three columns (Not Started, In Progress, Done)
- ➕ **Add Tasks**: Create new tasks with optional emoji icons
- 🏷️ **Task Grouping**: Organize tasks into custom groups for better categorization
- ✏️ **Edit Tasks**: Modify task names, emojis, and group assignments
- 🗑️ **Delete Tasks**: Remove individual tasks
- 💾 **Persistent Storage**: All tasks and groups saved in browser localStorage
- 🎨 **Beautiful UI**: Modern dark theme with smooth animations
- 📱 **Responsive Design**: Works perfectly on desktop and mobile
- ⌨️ **Keyboard Shortcuts**: Press Enter to save, Escape to close modals

## How to Use

1. **Open the app**: Visit the live site or open `index.html` in your browser
2. **Create a task**: Click "+ New task" in any column
3. **Add details**: Enter task name, optional emoji, and assign to a group
4. **Save**: Click "Save" or press Enter
5. **Edit**: Click a task card to edit it
6. **Delete**: Click the trash icon on a task card
7. **Move tasks**: Drag tasks between columns (or use edit to change status)
8. **Manage groups**: Use the "+ Group" button in the task modal to create and organize groups

## File Structure

```
├── index.html      # Main HTML markup
├── app.js          # Application logic (ES6 class)
├── styles.css      # Styling and animations
├── app.ts          # TypeScript version (optional)
└── README.md       # This file
```

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Flexbox, Grid, Dark theme with modern colors
- **JavaScript (ES6)**: Object-oriented programming with classes
- **localStorage**: Persistent client-side data storage

## Data Storage

All tasks and groups are saved to the browser's localStorage. This means:

- ✅ Data persists between sessions
- ✅ Each browser/device has its own board
- ℹ️ Clearing browser data will remove tasks

## Browser Compatibility

Works in all modern browsers supporting:

- ES6 Classes
- localStorage API
- CSS Grid & Flexbox

## Live Demo

Visit the app online:
🔗 **[https://biswasmosam.github.io/To-Do/](https://biswasmosam.github.io/To-Do/)**

- CSS3 Flexbox and Gradients

Enjoy managing your tasks! 📝
