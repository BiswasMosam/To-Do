# To-Do Kanban Board with Backend

A full-stack Kanban board application with user authentication and cloud database storage.

## Features

- 👤 **User Authentication**: Register and login with username/email
- 📋 **Kanban Board**: Organize tasks across three workflow stages
- ➕ **Add Tasks**: Create tasks with emoji icons and group assignments
- 🏷️ **Task Grouping**: Organize tasks into custom groups
- ✏️ **Edit & Delete**: Modify or remove tasks
- 💾 **Cloud Storage**: All data saved in MongoDB
- 🔐 **Secure**: JWT token-based authentication
- 📱 **Responsive Design**: Works on desktop and mobile

## Architecture

### Frontend

- HTML5, CSS3, Vanilla JavaScript
- Login page (`login.html`)
- Board page (`board.html`)
- Connect via API to backend

### Backend

- **Node.js + Express** server
- **MongoDB** database
- **JWT** authentication
- RESTful API endpoints

## Installation & Setup

### 1. Database (MongoDB Atlas - Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/todo-db`

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/todo-db
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

Start the server:

```bash
npm start
# or
npm run dev  # with auto-reload
```

### 3. Frontend Setup

Update API URL in:

- `login.html` (line with `const API_URL`)
- `app-backend.js` (line with `const API_URL`)

Change from `http://localhost:5000/api` to your backend URL when deployed.

Then serve the frontend files:

```bash
python -m http.server 8000  # or use any static server
# Open http://localhost:8000/login.html
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks (require JWT token)

- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Deployment

### Free Options

**Backend**: Deploy to Railway, Render, or Heroku
**Frontend**: Deploy to GitHub Pages, Netlify, or Vercel
**Database**: Use MongoDB Atlas free tier

### Example: Railway + MongoDB Atlas

1. Push backend to GitHub
2. Connect GitHub repo to Railway
3. Set environment variables in Railway dashboard
4. Get Railway URL for backend
5. Update frontend API_URL to Railway URL
6. Deploy frontend to GitHub Pages

## Live Demo

🔗 Update with your deployed URL

## Technologies

- **Frontend**: HTML5, CSS3, JavaScript ES6
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password**: bcryptjs for hashing

## Security Notes

- Change `JWT_SECRET` in production
- Use HTTPS in production
- Never commit `.env` file
- Use environment variables for sensitive data

## Browser Support

Works in all modern browsers supporting:

- ES6 Classes
- Fetch API
- localStorage
