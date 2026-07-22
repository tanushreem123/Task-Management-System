# Task Management App

Simple full-stack Task Management App with authentication and task CRUD.

## Live Demo

- Frontend: https://task-management-system-blush-five.vercel.app
- Backend API: https://task-management-system-y3u3.onrender.com

The backend runs on Render's free tier and spins down after inactivity, so the first request after a while can take up to ~50s to wake it up.

## Stack

- Backend: Express.js + TypeScript + MongoDB (Mongoose)
- Auth: JWT in HTTP-only cookie
- Frontend: Next.js (App Router) + TypeScript + Tailwind CSS
- API client: Axios

## Features

- Register/Login/Logout
- Protected task APIs
- Create, read, update, delete tasks
- Mark tasks as Completed/Pending
- Filter tasks by status (All, Pending, Completed)
- Responsive UI

## Project Structure

- `backend` - Express API
- `frontend` - Next.js frontend

## Environment Variables

Create these files:

- `backend/.env`
- `frontend/.env.local`

### backend/.env

```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/task_management_system
JWT_SECRET=replace_with_strong_secret
CLIENT_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### frontend/.env.local

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

## Run Locally

### Prerequisites

- Node.js (v18+)
- npm or yarn
- MongoDB (local or Docker)
- Git

### Option 1: Run with Docker (Recommended)

1. **Start MongoDB container:**
   ```bash
   docker-compose up -d
   ```

2. **Setup backend:**
   ```bash
   cd backend
   npm install
   ```

3. **Setup frontend:**
   ```bash
   cd frontend
   npm install
   ```

4. **Create environment files:**

   Create `backend/.env`:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://127.0.0.1:27017/task_management_system
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   CLIENT_ORIGIN=http://localhost:3000
   NODE_ENV=development
   ```

   Create `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001
   ```

5. **Start the applications:**

   In one terminal (backend):
   ```bash
   cd backend
   npm run dev
   ```

   In another terminal (frontend):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the app:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

### Option 2: Run Without Docker

1. **Install MongoDB locally** or ensure your MongoDB is running on `localhost:27017`

2. **Setup backend:**
   ```bash
   cd backend
   npm install
   ```

3. **Setup frontend:**
   ```bash
   cd frontend
   npm install
   ```

4. **Create environment files (same as Option 1)**

5. **Start the applications:**

   Backend:
   ```bash
   cd backend
   npm run dev
   ```

   Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the app:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

### Build for Production

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

### Available Scripts

**Backend:**
- `npm run dev` - Start development server
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

**Frontend:**
- `npm run dev` - Start Next.js dev server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Troubleshooting

- **MongoDB connection error:** Ensure MongoDB is running on port 27017
- **Port already in use:** Change PORT in `backend/.env` or kill the process using the port
- **CORS errors:** Verify `CLIENT_ORIGIN` in backend `.env` matches your frontend URL
- **API not responding:** Check that the backend server is running and `NEXT_PUBLIC_API_URL` in frontend `.env.local` is correct

1. Install dependencies:

```bash
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

2. Start local MongoDB via Docker:

```bash
npm run mongo:up
```

If Docker is not available, use MongoDB Community Server instead (macOS):

```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

The backend URI in `backend/.env` already matches this local setup:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/task_management_system
```

3. Start both backend and frontend:

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5001

To stop local MongoDB:

```bash
npm run mongo:down
```

To stop MongoDB Community service:

```bash
brew services stop mongodb-community@7.0
```

## Deployment

- **Frontend** is deployed on [Vercel](https://vercel.com), root directory `frontend`, framework preset Next.js.
- **Backend** is deployed on [Render](https://render.com) as a Web Service, root directory `backend`.
  - Build command: `npm install --include=dev && npm run build` (Render skips `devDependencies` — which include `typescript` and the `@types/*` packages needed to compile — whenever `NODE_ENV=production` is set, so they must be forced in explicitly).
  - Start command: `npm start`
  - Render is connected via the public repo URL rather than the GitHub App, so pushes to `main` do **not** auto-deploy the backend — trigger "Deploy latest commit" manually from the Render dashboard after backend changes.
- **Database** is a shared MongoDB Atlas cluster, with a dedicated `taskmgmt_app` user scoped to the `task_management_system` database.

### Environment variables in production

Same keys as local (`MONGODB_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`, `NODE_ENV` on the backend; `NEXT_PUBLIC_API_URL` on the frontend), with two differences from local dev:

- `CLIENT_ORIGIN` (backend) and `NEXT_PUBLIC_API_URL` (frontend) point at each other's deployed URLs instead of `localhost`.
- The auth cookie's `SameSite` attribute is `None` in production instead of `Lax`, since the frontend (Vercel) and backend (Render) are on different domains — cross-site requests won't carry a `Lax` cookie. See `backend/src/routes/auth.ts`.

## API Endpoints

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

### Tasks (Protected)

- `POST /tasks`
- `GET /tasks`
- `GET /tasks/:id`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`

## Quick Demo Script (2-3 minutes)

1. Register a new user.
2. Add 2-3 tasks.
3. Mark one as Completed.
4. Filter by Completed and Pending.
5. Edit one task.
6. Delete one task.
7. Logout and show redirect to login.
