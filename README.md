# To-Do Kanban Board (Full Stack)

Live site:

- https://mosambiswas.me/To-Do/
- https://biswasmosam.github.io/To-Do/

Backend (health check):

- https://to-do-i8qi.onrender.com/api/health

A modern Kanban board with two modes:

- **Offline mode**: `index.html` + `app.js` (stores tasks in `localStorage`)
- **Account mode**: `login.html` + `board.html` + backend API (stores tasks in MongoDB, supports Google Sign-In)

## Features

- Kanban workflow: Not Started → In Progress → Done
- Task groups + emoji support
- Drag & drop
- Authentication (register/login) + Google Sign-In
- Cloud persistence (MongoDB) for logged-in users
- Responsive UI

## Project Layout

**Frontend**

- `index.html` / `app.js` — offline board (localStorage)
- `login.html` — login/register + Google Sign-In
- `board.html` / `app-backend.js` — authenticated board (API)
- `config.js` — single place to configure the API base URL

**Backend**

- `backend/server.js` — Express API
- `backend/routes/*` — auth + tasks endpoints

## Local Development

### 1) Backend

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

Start the API:

```bash
npm run dev
# or
npm start
```

### 2) Frontend

Serve the folder (recommended):

```bash
python -m http.server 8000
```

- Offline board: `http://localhost:8000/index.html`
- Login + backend board: `http://localhost:8000/login.html`

## Deployment

### Backend (Render)

1. Deploy `backend/` as a Render Web Service
2. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `CORS_ORIGIN=https://biswasmosam.github.io,https://mosambiswas.me`

### Frontend (GitHub Pages / Custom Domain)

Update `config.js` to point production to your backend:

- `https://to-do-i8qi.onrender.com/api`

Then push to `main` so GitHub Pages publishes it.

## API (Quick Reference)

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`

Tasks (JWT required):

- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

## Security Notes

- Never commit real secrets (`.env` is ignored)
- Use a strong `JWT_SECRET`
- Keep MongoDB Network Access restricted in production (avoid `0.0.0.0/0` long-term)
