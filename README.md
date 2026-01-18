# Live demo → https://mosambiswas.me/To-Do/

# To‑Do — Kanban Board (Offline + Account)

Welcome! This repo is where I’m building and polishing a Trello‑style Kanban To‑Do app while practicing real-world frontend + backend patterns.

It includes two ways to use the app:

- **Offline mode**: fast, zero-login board that saves to `localStorage`
- **Account mode**: login + Google Sign‑In, backed by an API and MongoDB so your tasks persist across devices

Also available:

- GitHub Pages mirror: https://biswasmosam.github.io/To-Do/
- Backend health check: https://to-do-i8qi.onrender.com/api/health

## What you can do

- Manage tasks across a Kanban workflow: **Not Started → In Progress → Done**
- Drag & drop tasks between columns
- Create task groups (with emoji support)
- Use it offline (no backend needed)
- Sign in and sync tasks to the cloud (MongoDB)

## Tech stack

**Frontend**

- HTML + CSS
- Vanilla JavaScript
- Browser Drag & Drop API
- `localStorage` for offline persistence

**Backend**

- Node.js + Express
- MongoDB + Mongoose
- JWT auth
- Google Sign‑In (Google Identity)

**Hosting / Deployment**

- Frontend: GitHub Pages + custom domain
- Backend: Render

## Project layout (quick map)

**Frontend**

- `index.html` + `app.js` — offline board (localStorage)
- `login.html` — login/register + Google Sign‑In
- `board.html` + `app-backend.js` — authenticated board (API + MongoDB)
- `config.js` — API base URL (dev vs prod)

**Backend**

- `backend/server.js` — Express API
- `backend/routes/*` — auth + tasks/workflow endpoints

## Run it locally

### 1) Start the backend API

```bash
cd backend
npm install
```

Create `backend/.env`:

```bash
PORT=5000
MONGODB_URI=mongodb+srv://<db_user>:<db_password>@<cluster-host>/todo-db?retryWrites=true&w=majority
JWT_SECRET=<any-long-random-string>
GOOGLE_CLIENT_ID=<your-google-web-client-id>.apps.googleusercontent.com
NODE_ENV=development
```

Run:

```bash
npm run dev
# or
npm start
```

### 2) Serve the frontend

From the project root (this folder):

```bash
python -m http.server 8000
```

- Offline board: `http://localhost:8000/index.html`
- Login + backend board: `http://localhost:8000/login.html`

## Configuration

`config.js` controls which API base URL the frontend uses (localhost for development, Render in production).

## API (short reference)

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `GET /api/auth/me` (JWT required)

Tasks + workflow (JWT required):

- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `GET /api/workflow`
- `POST /api/workflow`

## Notes

- Secrets live in `backend/.env` (don’t commit real keys)
- MongoDB Network Access should be restricted for production use
